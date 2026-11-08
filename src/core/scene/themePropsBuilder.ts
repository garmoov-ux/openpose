import * as THREE from 'three';
import { SoloThemeId } from '@/types/themeSolo';
import {
  RoomPropInstance,
  getDefaultRoomPropsForTheme,
} from '@/data/themesSolo/roomPropCatalog';
import { buildRoomArchitectureShell, createIndividualPropGroup } from './propMeshFactory';

interface RoomThemePalette {
  floorHex: number;
  wallHex: number;
  trimHex: number;
  accentHex: number;
}

const ROOM_THEME_PALETTES: Record<SoloThemeId, RoomThemePalette> = {
  alley_downtown_street: { floorHex: 0x292524, wallHex: 0x451a03, trimHex: 0x1c1917, accentHex: 0xf59e0b },
  backstage_fitting_lounge: { floorHex: 0x3b1d32, wallHex: 0x2a1224, trimHex: 0xfbbf24, accentHex: 0xf43f5e },
  extreme_high_tension_special: { floorHex: 0x1f122b, wallHex: 0x140b1c, trimHex: 0xe11d48, accentHex: 0xf43f5e },
  glasshouse_sunroom_lounge: { floorHex: 0x1e3a42, wallHex: 0x162d36, trimHex: 0x94a3b8, accentHex: 0x38bdf8 },
  gothic_rococo_salon: { floorHex: 0x271c3d, wallHex: 0x1d1430, trimHex: 0xfbbf24, accentHex: 0xa855f7 },
  house_indoor_room: { floorHex: 0x4a3528, wallHex: 0x33241b, trimHex: 0x78350f, accentHex: 0xfb923c },
  infinity_pool_yacht: { floorHex: 0x163e5c, wallHex: 0x0f2c42, trimHex: 0xe2e8f0, accentHex: 0x06b6d4 },
  luxury_hotel_penthouse: { floorHex: 0x1e2538, wallHex: 0x151b29, trimHex: 0xfbbf24, accentHex: 0x818cf8 },
  maldives_beach_villa: { floorHex: 0x5c4028, wallHex: 0x3d2b1a, trimHex: 0xd97706, accentHex: 0x34d399 },
  onsen_ryokan_spa: { floorHex: 0x473628, wallHex: 0x2e231a, trimHex: 0x9a5b25, accentHex: 0x2dd4bf },
  pilates_mirror_studio: { floorHex: 0x3b3129, wallHex: 0x272a30, trimHex: 0xcbd5e1, accentHex: 0x38bdf8 },
  private_ceo_office: { floorHex: 0x261c16, wallHex: 0x1b2432, trimHex: 0x78350f, accentHex: 0x60a5fa },
  private_jet_cabin: { floorHex: 0x382d24, wallHex: 0x261f19, trimHex: 0xfbbf24, accentHex: 0xfde68a },
  private_stretch_limousine: { floorHex: 0x241533, wallHex: 0x170d21, trimHex: 0xc084fc, accentHex: 0xe879f9 },
  vip_aroma_oil_spa: { floorHex: 0x382027, wallHex: 0x29151b, trimHex: 0xd97706, accentHex: 0xfb7185 },
  vip_gym_sauna_suite: { floorHex: 0x452c1e, wallHex: 0x2d1e14, trimHex: 0xb45309, accentHex: 0x38bdf8 },
};

export function disposeThemePropsGroup(group: THREE.Group): void {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
  group.clear();
}

// 사각 룸 박스(Room Box: 바닥 + 뒷벽 + 좌/우 측벽 + 몰딩) 및 개별 선택·이동 가능한 가구·소품 생성
export function rebuildThemePropsGroup(
  group: THREE.Group,
  themeId: SoloThemeId,
  envIndex: number,
  _lightIndex = 0,
  roomProps?: RoomPropInstance[]
): Map<string, THREE.Group> {
  disposeThemePropsGroup(group);

  const palette = ROOM_THEME_PALETTES[themeId] || ROOM_THEME_PALETTES.house_indoor_room;
  const hueShift = ((envIndex % 7) - 3) * 0.025;
  const shift = (hex: number) => new THREE.Color(hex).offsetHSL(hueShift, 0, 0).getHex();

  // 1. 사각 방(Room Box) 건축 구조물 생성
  const roomShell = new THREE.Group();
  roomShell.name = 'RoomArchitectureShell';
  buildRoomArchitectureShell(
    roomShell,
    shift(palette.floorHex),
    shift(palette.wallHex),
    shift(palette.trimHex),
    palette.accentHex
  );
  group.add(roomShell);

  // 2. 방 내부 개별 가구·소품 인스턴스 배치 (클릭 및 기즈모 이동·회전 가능)
  const instances =
    roomProps && roomProps.length > 0
      ? roomProps
      : getDefaultRoomPropsForTheme(themeId, envIndex);

  const propGroupMap = new Map<string, THREE.Group>();

  for (const inst of instances) {
    if (!inst.visible) continue;
    const propObj = createIndividualPropGroup(inst.propId, shift);
    propObj.name = `Prop_${inst.uid}`;
    propObj.position.set(inst.position[0], inst.position[1], inst.position[2]);
    propObj.rotation.y = inst.rotationY;
    propObj.scale.setScalar(inst.scale || 1.0);
    propObj.userData = {
      isSceneProp: true,
      propUid: inst.uid,
      propId: inst.propId,
    };

    propObj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData.isSceneProp = true;
        child.userData.propUid = inst.uid;
        child.userData.propGroup = propObj;
      }
    });

    group.add(propObj);
    propGroupMap.set(inst.uid, propObj);
  }

  return propGroupMap;
}

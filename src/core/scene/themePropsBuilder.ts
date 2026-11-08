import * as THREE from 'three';
import { SoloThemeId } from '@/types/themeSolo';
import { RoomPropInstance } from '@/data/themesSolo/roomPropCatalog';
import { createIndividualPropGroup } from './propMeshFactory';
import { createExtraRoomPropGroup } from './extraRoomPropFactory';
import { mat, box, cyl, sphere } from './themeFurniturePrimitives';

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

// 추가된 성인·스페셜 기구 6종(새들 머신, 러브 스윙, 스팽킹 벤치, 웻지 쿠션, 플로어 마운트 딜도, 프리즘 미러) 전용 메쉬 생성
function createSpecialAdultPropGroup(
  propId: string,
  colorShift: (hex: number) => number
): THREE.Group | null {
  const g = new THREE.Group();
  const mainMat = mat(colorShift(0xe11d48), 0.32, 0.25);
  const darkMat = mat(colorShift(0x18181b), 0.35, 0.3);
  const chromeMat = mat(0xe2e8f0, 0.16, 0.9);
  const goldMat = mat(0xfbbf24, 0.22, 0.85);
  const glassMat = mat(colorShift(0x06b6d4), 0.1, 0.85, colorShift(0x38bdf8), 0.3, 0.72);

  switch (propId) {
    case 'sybian_saddle': {
      // 전동 새들 라이딩 머신: 팔각 하우징 베이스 + 새들 쿠션 + 중앙 어태치먼트 + 전면 핸들바
      cyl(g, 0.32, 0.36, 0.32, 0, 0.16, 0, darkMat);
      box(g, 0.38, 0.12, 0.48, 0, 0.36, 0, mainMat);
      cyl(g, 0.026, 0.03, 0.16, 0, 0.48, 0.02, mainMat);
      sphere(g, 0.028, 0, 0.56, 0.02, goldMat);
      cyl(g, 0.016, 0.016, 0.46, 0, 0.44, 0.24, chromeMat, 0.35, 0, 0);
      break;
    }
    case 'love_swing': {
      // 천장 서스펜션 러브 스윙: 상단 프레임 + 4줄 크롬 체인 + 벨벳 시트 & 등받이/발걸이 슬링
      box(g, 1.35, 0.05, 1.15, 0, 2.24, 0, chromeMat);
      [[-0.36, -0.15], [0.36, -0.15], [-0.28, 0.22], [0.28, 0.22]].forEach(([cx, cz]) =>
        cyl(g, 0.01, 0.01, 1.45, cx, 1.5, cz, chromeMat)
      );
      box(g, 0.72, 0.09, 0.38, 0, 0.78, -0.05, mainMat);
      box(g, 0.68, 0.28, 0.07, 0, 0.96, -0.22, mainMat, -0.25, 0, 0);
      box(g, 0.16, 0.04, 0.24, -0.28, 0.52, 0.22, mainMat);
      box(g, 0.16, 0.04, 0.24, 0.28, 0.52, 0.22, mainMat);
      break;
    }
    case 'spanking_bench': {
      // 각도 조절 스팽킹 & 본디지 패디드 호스 벤치
      box(g, 0.52, 0.18, 0.92, 0, 0.68, -0.12, mainMat, 0.22, 0, 0);
      box(g, 0.48, 0.14, 0.52, 0, 0.58, 0.42, darkMat, -0.38, 0, 0);
      [[-0.22, -0.45], [0.22, -0.45], [-0.22, 0.45], [0.22, 0.45]].forEach(([lx, lz]) =>
        cyl(g, 0.028, 0.028, 0.64, lx, 0.32, lz, chromeMat)
      );
      break;
    }
    case 'wedge_cushion': {
      // 트라이앵글 체위 보조 골반 웻지 쿠션
      box(g, 0.68, 0.26, 0.58, 0, 0.15, 0, mainMat, 0.36, 0, 0);
      cyl(g, 0.11, 0.11, 0.66, 0, 0.28, -0.18, goldMat, 0, 0, Math.PI / 2);
      break;
    }
    case 'floor_dildo_mount': {
      // 플로어 석션 마운트 딜도 스탠드
      cyl(g, 0.18, 0.2, 0.03, 0, 0.015, 0, chromeMat);
      cyl(g, 0.08, 0.1, 0.04, 0, 0.04, 0, darkMat);
      cyl(g, 0.025, 0.03, 0.24, 0, 0.17, 0, mainMat);
      sphere(g, 0.027, 0, 0.29, 0, mainMat);
      break;
    }
    case 'acrylic_partition': {
      // 프리즘 아크릴 미러 폴딩 파티션
      box(g, 0.65, 1.92, 0.04, -0.32, 0.96, 0, glassMat, 0, 0.28, 0);
      box(g, 0.65, 1.92, 0.04, 0.32, 0.96, 0, glassMat, 0, -0.28, 0);
      box(g, 1.32, 0.05, 0.24, 0, 0.025, 0, goldMat);
      break;
    }
    default:
      return null;
  }
  return g;
}

export function rebuildThemePropsGroup(
  group: THREE.Group,
  _themeId: SoloThemeId,
  _envIndex: number,
  _lightIndex = 0,
  roomProps?: RoomPropInstance[]
): Map<string, THREE.Group> {
  disposeThemePropsGroup(group);

  const shift = (hex: number) => hex;

  // 테마 룸 벽체(RoomArchitectureShell)는 생성하지 않고, 사용자가 명시적으로 추가한 가구·소품만 배치
  const instances = roomProps ?? [];

  const propGroupMap = new Map<string, THREE.Group>();

  for (const inst of instances) {
    if (!inst.visible) continue;
    const customHex = inst.customColorHex;
    const propShift = customHex !== undefined ? () => customHex : shift;

    const propObj =
      createSpecialAdultPropGroup(inst.propId, propShift) ||
      createExtraRoomPropGroup(inst.propId, propShift) ||
      createIndividualPropGroup(inst.propId, propShift);

    // 커스텀 색상이 지정된 경우 첫 번째 대표 메쉬의 색상도 확실하게 오버라이드
    if (customHex !== undefined) {
      let tintedCount = 0;
      propObj.traverse((child) => {
        const m = child as THREE.Mesh;
        if (m.isMesh && m.material && tintedCount < 2) {
          const stdMat = (m.material as THREE.MeshStandardMaterial).clone();
          stdMat.color.setHex(customHex);
          m.material = stdMat;
          tintedCount++;
        }
      });
    }

    propObj.name = `Prop_${inst.uid}`;
    propObj.position.set(inst.position[0], inst.position[1], inst.position[2]);
    propObj.rotation.set(inst.rotationX || 0, inst.rotationY || 0, inst.rotationZ || 0);
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

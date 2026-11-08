import * as THREE from 'three';
import { SoloThemeId } from '@/types/themeSolo';
import { RoomPropInstance } from '@/data/themesSolo/roomPropCatalog';
import { rebuildThemePropsGroup } from './themePropsBuilder';

export interface StudioLights {
  ambient: THREE.AmbientLight;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  stageFloor: THREE.Mesh;
  stageRing: THREE.Mesh;
  themePropsGroup: THREE.Group;
}

const NEUTRAL_STUDIO_BG_HEX = 0x18181b;
const NEUTRAL_STUDIO_FLOOR_HEX = 0x222226;

export function createStudioLightsAndStage(scene: THREE.Scene): StudioLights {
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(2.5, 4.0, 3.0);
  keyLight.castShadow = true;

  const fillLight = new THREE.DirectionalLight(0x90caf9, 0.65);
  fillLight.position.set(-2.5, 2.0, -1.0);

  const rimLight = new THREE.DirectionalLight(0xe2e8f0, 0.55);
  rimLight.position.set(0, 3.0, -3.0);

  // 깔끔한 다크 뉴트럴 스튜디오 바닥 (방 벽체 및 테마 색조 없음)
  const floorGeom = new THREE.BoxGeometry(4.4, 0.02, 3.8);
  const floorMat = new THREE.MeshStandardMaterial({
    color: NEUTRAL_STUDIO_FLOOR_HEX,
    roughness: 0.45,
    metalness: 0.15,
  });
  const stageFloor = new THREE.Mesh(floorGeom, floorMat);
  stageFloor.position.set(0, -0.02, -0.25);
  stageFloor.receiveShadow = true;
  stageFloor.visible = false;

  const ringGeom = new THREE.PlaneGeometry(4.42, 0.04);
  ringGeom.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3f3f46,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
  });
  const stageRing = new THREE.Mesh(ringGeom, ringMat);
  stageRing.position.set(0, 0.002, 1.64);
  stageRing.visible = false;

  const themePropsGroup = new THREE.Group();
  themePropsGroup.name = 'ThemePropsGroup';

  scene.add(ambient, keyLight, fillLight, rimLight, stageFloor, stageRing, themePropsGroup);

  return { ambient, keyLight, fillLight, rimLight, stageFloor, stageRing, themePropsGroup };
}

export function applyStudioThemeEnvironment(
  scene: THREE.Scene,
  lights: StudioLights,
  themeId: SoloThemeId,
  envIndex: number,
  lightIndex: number,
  isShadingMode: boolean,
  roomProps?: RoomPropInstance[]
): number {
  rebuildThemePropsGroup(lights.themePropsGroup, themeId, envIndex, lightIndex, roomProps);

  // 테마 배경/바닥 색조를 적용하지 않고 중립 다크 스튜디오 환경 유지
  lights.stageFloor.visible = false;
  lights.stageRing.visible = false;

  if (isShadingMode) {
    scene.background = new THREE.Color(NEUTRAL_STUDIO_BG_HEX);
  }

  return NEUTRAL_STUDIO_BG_HEX;
}

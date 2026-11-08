import * as THREE from 'three';
import { SoloThemeId } from '@/types/themeSolo';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
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

interface ThemePalette {
  bgHex: number;
  floorHex: number;
  ringHex: number;
  keyHex: number;
  fillHex: number;
  rimHex: number;
  floorRoughness: number;
  floorMetalness: number;
}

const THEME_PALETTES: Record<SoloThemeId, ThemePalette> = {
  alley_downtown_street: {
    bgHex: 0x1c1917,
    floorHex: 0x292524,
    ringHex: 0xf59e0b,
    keyHex: 0xfde68a,
    fillHex: 0x38bdf8,
    rimHex: 0xf97316,
    floorRoughness: 0.7,
    floorMetalness: 0.15,
  },
  backstage_fitting_lounge: {
    bgHex: 0x231420,
    floorHex: 0x361c30,
    ringHex: 0xf43f5e,
    keyHex: 0xffe4e6,
    fillHex: 0xf472b6,
    rimHex: 0xfb7185,
    floorRoughness: 0.35,
    floorMetalness: 0.25,
  },
  extreme_high_tension_special: {
    bgHex: 0x1e1024,
    floorHex: 0x2e1233,
    ringHex: 0xe11d48,
    keyHex: 0xffcdd2,
    fillHex: 0xc084fc,
    rimHex: 0xff1744,
    floorRoughness: 0.25,
    floorMetalness: 0.45,
  },
  glasshouse_sunroom_lounge: {
    bgHex: 0x13262f,
    floorHex: 0x1e3a42,
    ringHex: 0x38bdf8,
    keyHex: 0xffffff,
    fillHex: 0x7dd3fc,
    rimHex: 0x6ee7b7,
    floorRoughness: 0.3,
    floorMetalness: 0.2,
  },
  gothic_rococo_salon: {
    bgHex: 0x191229,
    floorHex: 0x271c3d,
    ringHex: 0xa855f7,
    keyHex: 0xfef3c7,
    fillHex: 0xa78bfa,
    rimHex: 0xc084fc,
    floorRoughness: 0.4,
    floorMetalness: 0.3,
  },
  house_indoor_room: {
    bgHex: 0x241c18,
    floorHex: 0x382b24,
    ringHex: 0xfb923c,
    keyHex: 0xffedd5,
    fillHex: 0xfdba74,
    rimHex: 0xf59e0b,
    floorRoughness: 0.6,
    floorMetalness: 0.1,
  },
  infinity_pool_yacht: {
    bgHex: 0x0c2233,
    floorHex: 0x11334d,
    ringHex: 0x06b6d4,
    keyHex: 0xffffff,
    fillHex: 0x22d3ee,
    rimHex: 0x38bdf8,
    floorRoughness: 0.15,
    floorMetalness: 0.55,
  },
  luxury_hotel_penthouse: {
    bgHex: 0x141826,
    floorHex: 0x1f263b,
    ringHex: 0x818cf8,
    keyHex: 0xf8fafc,
    fillHex: 0x818cf8,
    rimHex: 0xfbbf24,
    floorRoughness: 0.2,
    floorMetalness: 0.4,
  },
  maldives_beach_villa: {
    bgHex: 0x0f2926,
    floorHex: 0x183d38,
    ringHex: 0x34d399,
    keyHex: 0xfef9c3,
    fillHex: 0x2dd4bf,
    rimHex: 0x38bdf8,
    floorRoughness: 0.45,
    floorMetalness: 0.2,
  },
  onsen_ryokan_spa: {
    bgHex: 0x142424,
    floorHex: 0x213838,
    ringHex: 0x2dd4bf,
    keyHex: 0xffedd5,
    fillHex: 0x5eead4,
    rimHex: 0xfb923c,
    floorRoughness: 0.3,
    floorMetalness: 0.3,
  },
  pilates_mirror_studio: {
    bgHex: 0x202227,
    floorHex: 0x2d3138,
    ringHex: 0x38bdf8,
    keyHex: 0xffffff,
    fillHex: 0xe2e8f0,
    rimHex: 0x93c5fd,
    floorRoughness: 0.2,
    floorMetalness: 0.35,
  },
  private_ceo_office: {
    bgHex: 0x141a24,
    floorHex: 0x1e293b,
    ringHex: 0x60a5fa,
    keyHex: 0xf1f5f9,
    fillHex: 0x60a5fa,
    rimHex: 0xfbbf24,
    floorRoughness: 0.25,
    floorMetalness: 0.35,
  },
  private_jet_cabin: {
    bgHex: 0x211b15,
    floorHex: 0x332920,
    ringHex: 0xfbbf24,
    keyHex: 0xfef3c7,
    fillHex: 0xfde68a,
    rimHex: 0x60a5fa,
    floorRoughness: 0.4,
    floorMetalness: 0.25,
  },
  private_stretch_limousine: {
    bgHex: 0x1d1229,
    floorHex: 0x2c1a40,
    ringHex: 0xe879f9,
    keyHex: 0xf5d0fe,
    fillHex: 0x38bdf8,
    rimHex: 0xf43f5e,
    floorRoughness: 0.2,
    floorMetalness: 0.5,
  },
  vip_aroma_oil_spa: {
    bgHex: 0x241519,
    floorHex: 0x361f26,
    ringHex: 0xfb7185,
    keyHex: 0xffe4e6,
    fillHex: 0xfda4af,
    rimHex: 0xfbbf24,
    floorRoughness: 0.35,
    floorMetalness: 0.2,
  },
  vip_gym_sauna_suite: {
    bgHex: 0x151e2b,
    floorHex: 0x1f2d40,
    ringHex: 0x38bdf8,
    keyHex: 0xf8fafc,
    fillHex: 0x38bdf8,
    rimHex: 0xf97316,
    floorRoughness: 0.35,
    floorMetalness: 0.3,
  },
};

export function createStudioLightsAndStage(scene: THREE.Scene): StudioLights {
  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
  keyLight.position.set(2.5, 4.0, 3.0);
  keyLight.castShadow = true;

  const fillLight = new THREE.DirectionalLight(0x90caf9, 0.65);
  fillLight.position.set(-2.5, 2.0, -1.0);

  const rimLight = new THREE.DirectionalLight(0xffcc80, 0.55);
  rimLight.position.set(0, 3.0, -3.0);

  // 테마 분위기를 시각적으로 보여주는 원형 스튜디오 플랫폼
  const floorGeom = new THREE.CylinderGeometry(1.35, 1.45, 0.018, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.4,
    metalness: 0.2,
  });
  const stageFloor = new THREE.Mesh(floorGeom, floorMat);
  stageFloor.position.set(0, -0.009, 0);
  stageFloor.receiveShadow = true;

  const ringGeom = new THREE.RingGeometry(1.32, 1.36, 48);
  ringGeom.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
  });
  const stageRing = new THREE.Mesh(ringGeom, ringMat);
  stageRing.position.set(0, 0.002, 0);

  const themePropsGroup = new THREE.Group();
  themePropsGroup.name = 'ThemePropsGroup';
  rebuildThemePropsGroup(themePropsGroup, 'alley_downtown_street', 0);

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
  extraSceneProps: string[] = []
): number {
  const base = THEME_PALETTES[themeId] || THEME_PALETTES.alley_downtown_street;
  const themeData = THEMES_DATA[themeId] || THEMES_DATA.alley_downtown_street;
  const lightText = themeData.lightings[lightIndex] || '';

  rebuildThemePropsGroup(lights.themePropsGroup, themeId, envIndex, lightIndex, extraSceneProps);

  // 세부 장소(envIndex)에 따른 색조 미세 변화
  const envColorShift = ((envIndex % 5) - 2) * 0.03;
  const bgColor = new THREE.Color(base.bgHex).offsetHSL(envColorShift, 0, 0);
  const floorColor = new THREE.Color(base.floorHex).offsetHSL(envColorShift, 0, 0.02);

  // 시간대 조명(lightIndex)에 따른 조명 색상 및 방향 변화
  let keyColor = new THREE.Color(base.keyHex);
  let fillColor = new THREE.Color(base.fillHex);
  let rimColor = new THREE.Color(base.rimHex);
  let keyIntensity = 1.45;
  let fillIntensity = 0.68;
  let rimIntensity = 0.6;

  if (/golden hour|sunset|warm/i.test(lightText)) {
    keyColor = new THREE.Color(0xffb74d);
    rimColor = new THREE.Color(0xff7043);
    keyIntensity = 1.65;
  } else if (/neon|magenta|cyan|club/i.test(lightText)) {
    keyColor = new THREE.Color(0xf472b6);
    fillColor = new THREE.Color(0x22d3ee);
    rimColor = new THREE.Color(0xc084fc);
    fillIntensity = 0.95;
    rimIntensity = 0.9;
  } else if (/morning|daylight|sunlit|bright/i.test(lightText)) {
    keyColor = new THREE.Color(0xffffff);
    fillColor = new THREE.Color(0xbae6fd);
    keyIntensity = 1.6;
  } else if (/night|moon|moody|candle/i.test(lightText)) {
    bgColor.multiplyScalar(0.75);
    keyColor = new THREE.Color(0xfde68a);
    fillColor = new THREE.Color(0x6366f1);
    keyIntensity = 1.25;
  }

  const angleOffset = (lightIndex % 6) * 0.45;
  lights.keyLight.position.set(
    2.5 * Math.cos(angleOffset) - 1.0 * Math.sin(angleOffset),
    3.8,
    3.0 * Math.cos(angleOffset)
  );

  lights.keyLight.color.copy(keyColor);
  lights.keyLight.intensity = keyIntensity;
  lights.fillLight.color.copy(fillColor);
  lights.fillLight.intensity = fillIntensity;
  lights.rimLight.color.copy(rimColor);
  lights.rimLight.intensity = rimIntensity;

  const floorMat = lights.stageFloor.material as THREE.MeshStandardMaterial;
  floorMat.color.copy(floorColor);
  floorMat.roughness = base.floorRoughness;
  floorMat.metalness = base.floorMetalness;
  floorMat.needsUpdate = true;

  const ringMat = lights.stageRing.material as THREE.MeshBasicMaterial;
  ringMat.color.setHex(base.ringHex);
  ringMat.needsUpdate = true;

  if (isShadingMode) {
    scene.background = bgColor;
  }

  return bgColor.getHex();
}

import * as THREE from 'three';
import { SoloThemeId } from '@/types/themeSolo';

function makeMat(color: number, roughness = 0.45, metalness = 0.2, emissive = 0x000000, emissiveIntensity = 0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive,
    emissiveIntensity,
  });
}

function addBox(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

function addCyl(
  group: THREE.Group,
  rt: number,
  rb: number,
  h: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  rotZ = 0
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 24), mat);
  m.position.set(x, y, z);
  if (rotZ !== 0) m.rotation.z = rotZ;
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

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

// 16대 테마별 입체 3D 배경 사물(가구·건축 요소·소품) 생성
export function rebuildThemePropsGroup(
  group: THREE.Group,
  themeId: SoloThemeId,
  envIndex: number
): void {
  disposeThemePropsGroup(group);

  const hueShift = ((envIndex % 5) - 2) * 0.04;
  const shiftColor = (hex: number) => new THREE.Color(hex).offsetHSL(hueShift, 0, 0).getHex();

  switch (themeId) {
    case 'alley_downtown_street': {
      const brickMat = makeMat(shiftColor(0x5c2d24), 0.8, 0.1);
      const ironMat = makeMat(0x27272a, 0.35, 0.8);
      const lampMat = makeMat(0xfef08a, 0.2, 0.1, 0xf59e0b, 1.4);
      const neonMat = makeMat(0x38bdf8, 0.2, 0.2, 0x0284c7, 1.2);
      // 뒷면 벽돌 담장 및 가로등 기둥, 스트리트 벤치
      addBox(group, 1.9, 1.85, 0.12, -0.25, 0.925, -0.82, brickMat);
      addBox(group, 1.94, 0.08, 0.16, -0.25, 1.86, -0.82, ironMat);
      addCyl(group, 0.035, 0.05, 2.05, 0.82, 1.025, -0.65, ironMat);
      addBox(group, 0.35, 0.04, 0.04, 0.68, 1.98, -0.65, ironMat);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), lampMat);
      bulb.position.set(0.55, 1.9, -0.65);
      group.add(bulb);
      addBox(group, 0.75, 0.28, 0.04, -0.35, 1.45, -0.74, neonMat);
      addBox(group, 0.95, 0.42, 0.38, 0, 0.21, -0.28, ironMat);
      break;
    }

    case 'backstage_fitting_lounge': {
      const frameMat = makeMat(shiftColor(0xf43f5e), 0.3, 0.5);
      const mirrorMat = makeMat(0xe2e8f0, 0.08, 0.92);
      const velvetMat = makeMat(shiftColor(0xbe123c), 0.65, 0.1);
      const bulbMat = makeMat(0xfffbeb, 0.2, 0.1, 0xfde68a, 1.2);
      // 대형 조명 거울 & 벨벳 스툴 의자 & 행거 랙
      addBox(group, 1.15, 1.75, 0.06, -0.45, 0.92, -0.75, frameMat);
      addBox(group, 0.98, 1.58, 0.07, -0.45, 0.92, -0.74, mirrorMat);
      for (let i = 0; i < 4; i++) {
        const y = 0.35 + i * 0.38;
        addCyl(group, 0.035, 0.035, 0.04, -0.98, y, -0.7, bulbMat);
        addCyl(group, 0.035, 0.035, 0.04, 0.08, y, -0.7, bulbMat);
      }
      addCyl(group, 0.32, 0.28, 0.44, 0, 0.22, -0.22, velvetMat);
      addCyl(group, 0.025, 0.025, 1.65, 0.78, 0.825, -0.65, mirrorMat);
      break;
    }

    case 'gothic_rococo_salon':
    case 'luxury_hotel_penthouse': {
      const sofaMat = makeMat(shiftColor(themeId === 'gothic_rococo_salon' ? 0x581c87 : 0x312e81), 0.55, 0.15);
      const goldMat = makeMat(0xfbbf24, 0.25, 0.85);
      const marbleMat = makeMat(0xe2e8f0, 0.25, 0.3);
      // 럭셔리 벨벳 카우치 소파 & 대리석 기둥 2개 & 사이드 테이블
      addBox(group, 1.45, 0.42, 0.55, 0, 0.21, -0.32, sofaMat);
      addBox(group, 1.45, 0.52, 0.14, 0, 0.64, -0.54, sofaMat);
      addCyl(group, 0.12, 0.12, 1.38, 0, 0.44, -0.14, goldMat, Math.PI / 2);
      addCyl(group, 0.11, 0.13, 1.95, -0.92, 0.975, -0.78, marbleMat);
      addCyl(group, 0.11, 0.13, 1.95, 0.92, 0.975, -0.78, marbleMat);
      addCyl(group, 0.24, 0.04, 0.55, 0.85, 0.275, -0.25, goldMat);
      break;
    }

    case 'house_indoor_room':
    case 'vip_aroma_oil_spa': {
      const woodMat = makeMat(shiftColor(0x573b26), 0.6, 0.15);
      const bedMat = makeMat(0xf8fafc, 0.7, 0.05);
      const bolsterMat = makeMat(shiftColor(0xe11d48), 0.5, 0.1);
      const lampMat = makeMat(0xffedd5, 0.2, 0.1, 0xf97316, 1.1);
      // 침대/스파 매트리스 & 헤드보드 & 볼스터 원통 쿠션 & 무드 램프
      addBox(group, 1.45, 0.36, 0.92, 0, 0.18, -0.35, bedMat);
      addBox(group, 1.52, 0.95, 0.1, 0, 0.475, -0.82, woodMat);
      addCyl(group, 0.13, 0.13, 0.95, 0, 0.44, -0.2, bolsterMat, Math.PI / 2);
      addBox(group, 0.38, 0.48, 0.38, 0.92, 0.24, -0.68, woodMat);
      addCyl(group, 0.12, 0.16, 0.28, 0.92, 0.66, -0.68, lampMat);
      break;
    }

    case 'infinity_pool_yacht':
    case 'maldives_beach_villa': {
      const woodMat = makeMat(shiftColor(0x78350f), 0.55, 0.15);
      const cushionMat = makeMat(0xf0f9ff, 0.6, 0.1);
      const waterMat = makeMat(0x06b6d4, 0.12, 0.6, 0x0891b2, 0.35);
      const glassMat = makeMat(0xbae6fd, 0.1, 0.8);
      // 선베드 데이베드 & 수면 풀 데크 & 유리 난간/카바나 기둥
      addBox(group, 1.35, 0.34, 0.68, 0, 0.17, -0.28, woodMat);
      addBox(group, 1.28, 0.1, 0.62, 0, 0.38, -0.28, cushionMat);
      addCyl(group, 0.95, 0.95, 0.03, 0, 0.015, -0.55, waterMat);
      addBox(group, 1.85, 0.65, 0.03, 0, 0.325, -0.85, glassMat);
      addCyl(group, 0.045, 0.055, 1.95, -0.88, 0.975, -0.75, woodMat);
      addCyl(group, 0.045, 0.055, 1.95, 0.88, 0.975, -0.75, woodMat);
      break;
    }

    case 'onsen_ryokan_spa': {
      const hinokiMat = makeMat(shiftColor(0x92400e), 0.55, 0.1);
      const waterMat = makeMat(0x2dd4bf, 0.15, 0.4, 0x0d9488, 0.35);
      const rockMat = makeMat(0x44403c, 0.85, 0.1);
      // 히노키 원목 욕조 벤치 & 온천수 & 정원 바위/대나무 파티션
      addBox(group, 1.42, 0.42, 0.72, 0, 0.21, -0.35, hinokiMat);
      addBox(group, 1.24, 0.36, 0.54, 0, 0.22, -0.35, waterMat);
      addBox(group, 1.6, 1.75, 0.06, 0, 0.875, -0.82, hinokiMat);
      const rock1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 1), rockMat);
      rock1.position.set(-0.82, 0.2, -0.45);
      const rock2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), rockMat);
      rock2.position.set(0.82, 0.15, -0.42);
      group.add(rock1, rock2);
      break;
    }

    case 'pilates_mirror_studio':
    case 'vip_gym_sauna_suite': {
      const metalMat = makeMat(0x94a3b8, 0.22, 0.85);
      const matColor = makeMat(shiftColor(0x1e293b), 0.5, 0.2);
      const woodMat = makeMat(0xb45309, 0.45, 0.15);
      // 피트니스 리포머 벤치/운동 박스 & 발레 바(Barre) & 전신 거울 프레임
      addBox(group, 1.32, 0.42, 0.48, 0, 0.21, -0.26, matColor);
      addCyl(group, 0.028, 0.028, 1.75, 0, 0.98, -0.68, woodMat, Math.PI / 2);
      addCyl(group, 0.03, 0.03, 0.98, -0.82, 0.49, -0.68, metalMat);
      addCyl(group, 0.03, 0.03, 0.98, 0.82, 0.49, -0.68, metalMat);
      addBox(group, 1.75, 1.85, 0.04, 0, 0.925, -0.82, metalMat);
      break;
    }

    case 'private_ceo_office': {
      const deskMat = makeMat(shiftColor(0x1e293b), 0.3, 0.4);
      const leatherMat = makeMat(0x0f172a, 0.4, 0.25);
      const accentMat = makeMat(0x60a5fa, 0.2, 0.6, 0x2563eb, 0.5);
      // CEO 오피스 데스크 & 가죽 체어 & 창문 프레임
      addBox(group, 1.48, 0.06, 0.58, 0, 0.72, -0.52, deskMat);
      addBox(group, 0.08, 0.72, 0.52, -0.66, 0.36, -0.52, deskMat);
      addBox(group, 0.08, 0.72, 0.52, 0.66, 0.36, -0.52, deskMat);
      addBox(group, 0.56, 0.44, 0.48, 0, 0.22, -0.18, leatherMat);
      addBox(group, 1.75, 1.85, 0.05, 0, 0.925, -0.86, accentMat);
      break;
    }

    case 'glasshouse_sunroom_lounge':
    case 'private_jet_cabin':
    case 'private_stretch_limousine':
    case 'extreme_high_tension_special':
    default: {
      const seatMat = makeMat(shiftColor(0x334155), 0.4, 0.3);
      const neonMat = makeMat(0x38bdf8, 0.2, 0.5, shiftColor(0xec4899), 0.9);
      const plantMat = makeMat(0x10b981, 0.6, 0.1);
      // 라운지 시트/포디움 벤치 & 아치형 프레임 & 오브젝트
      addBox(group, 1.36, 0.42, 0.52, 0, 0.21, -0.28, seatMat);
      addBox(group, 1.36, 0.48, 0.12, 0, 0.62, -0.48, seatMat);
      addCyl(group, 0.035, 0.035, 1.85, -0.82, 0.925, -0.72, neonMat);
      addCyl(group, 0.035, 0.035, 1.85, 0.82, 0.925, -0.72, neonMat);
      addBox(group, 1.7, 0.06, 0.06, 0, 1.85, -0.72, neonMat);
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), plantMat);
      foliage.position.set(-0.85, 0.58, -0.42);
      addCyl(group, 0.16, 0.12, 0.36, -0.85, 0.18, -0.42, seatMat);
      group.add(foliage);
      break;
    }
  }
}

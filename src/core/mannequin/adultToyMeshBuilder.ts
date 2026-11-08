import * as THREE from 'three';
import { TOY_SPECIAL_ITEMS } from '@/data/themesSolo/accessoriesAndPropsData';

function addPart(
  parent: THREE.Object3D,
  geom: THREE.BufferGeometry,
  mat: THREE.Material,
  pos: [number, number, number],
  rot: [number, number, number] = [0, 0, 0]
): THREE.Mesh {
  const m = new THREE.Mesh(geom, mat);
  m.position.set(pos[0], pos[1], pos[2]);
  m.rotation.set(rot[0], rot[1], rot[2]);
  m.castShadow = true;
  m.receiveShadow = true;
  m.userData = { isBodyAccessory: true, outfitMaterial: mat };
  parent.add(m);
  return m;
}

// 마네킹 본(Hips, Head, RightHand 등)의 월드 스케일에 맞춰 자동 보정되는 3D 성인·스페셜 기구 메쉬 빌더
export function attachAdultToyMeshToBones(
  group: THREE.Object3D,
  bones: Map<string, THREE.Bone>,
  toyItemId: string,
  customColorHex?: number,
  buildShell?: (
    matchFn: (ax: number, y: number, z: number) => boolean,
    mat: THREE.Material,
    offset?: number
  ) => void
): void {
  const opt = TOY_SPECIAL_ITEMS.find((i) => i.id === toyItemId);
  if (!opt || opt.id === 'toy_none') return;

  const mainHex = customColorHex ?? opt.colorHex;
  const secHex = opt.secondaryHex ?? 0xe2e8f0;

  const mainMat = new THREE.MeshStandardMaterial({
    color: mainHex,
    roughness: 0.22,
    metalness: 0.35,
    side: THREE.DoubleSide,
  });
  const secMat = new THREE.MeshStandardMaterial({
    color: secHex,
    roughness: 0.18,
    metalness: 0.78,
    side: THREE.DoubleSide,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: mainHex,
    emissive: new THREE.Color(mainHex),
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });

  // 1. 스킨 쉘 기반 바디 페티시 기구 (니플 클램프 체인 / 전신 레더 하네스 / 스트랩온 하네스)
  if (toyItemId === 'toy_nipple_clamp' && buildShell) {
    buildShell(
      (ax, y, z) =>
        z >= 0.48 &&
        ((ax >= 0.048 && ax <= 0.088 && y >= 0.715 && y <= 0.742) ||
          (ax < 0.088 && y >= 0.695 && y <= 0.715)),
      mainMat,
      1.85
    );
    return;
  }

  if (toyItemId === 'toy_body_harness' && buildShell) {
    buildShell(
      (ax, y) =>
        (ax < 0.14 && ((y >= 0.74 && y <= 0.765) || (y >= 0.61 && y <= 0.635) || (y >= 0.51 && y <= 0.535))) ||
        (ax < 0.024 && y >= 0.51 && y <= 0.82),
      mainMat,
      1.82
    );
    return;
  }

  if (toyItemId === 'toy_strapon_set' && buildShell) {
    buildShell(
      (ax, y) => ax < 0.145 && y >= 0.495 && y <= 0.535,
      secMat,
      1.82
    );
  }

  // 본(Bone)의 월드 스케일을 계산하여 FBX(cm 스케일 0.01)와 프로시저럴(1.0) 모두 동일한 물리 크기로 부착
  const getBoneHolder = (boneName: string): THREE.Group | null => {
    const b = bones.get(boneName);
    if (!b) return null;
    b.updateMatrixWorld(true);
    const wScale = new THREE.Vector3();
    b.getWorldScale(wScale);
    const invScale = wScale.x > 0.0001 ? 1 / wScale.x : 1;
    const holder = new THREE.Group();
    holder.scale.setScalar(invScale);
    holder.userData = { isBodyAccessory: true };
    b.add(holder);
    return holder;
  };

  // 2. 헤드 부착형 (아이마스크 안대 / 볼 개그)
  if (toyItemId === 'toy_lace_blindfold' || toyItemId === 'toy_ball_gag') {
    const headHolder = getBoneHolder('Head') || group;
    if (toyItemId === 'toy_lace_blindfold') {
      addPart(headHolder, new THREE.CylinderGeometry(0.082, 0.082, 0.036, 20, 1, true), mainMat, [0, 0.095, 0.012]);
    } else {
      addPart(headHolder, new THREE.SphereGeometry(0.024, 16, 16), mainMat, [0, 0.042, 0.088]);
      addPart(headHolder, new THREE.CylinderGeometry(0.078, 0.078, 0.014, 20, 1, true), secMat, [0, 0.042, 0.005]);
    }
    return;
  }

  // 3. 오른손 파지형 (승마 크롭 채찍 / 스팽킹 패들)
  if (toyItemId === 'toy_riding_crop' || toyItemId === 'toy_spank_paddle') {
    const handHolder = getBoneHolder('RightHand') || getBoneHolder('RightForeArm') || group;
    if (toyItemId === 'toy_riding_crop') {
      addPart(handHolder, new THREE.CylinderGeometry(0.007, 0.009, 0.46, 12), mainMat, [0, -0.18, 0.04], [0.35, 0, 0]);
      addPart(handHolder, new THREE.BoxGeometry(0.026, 0.075, 0.006), secMat, [0, -0.4, 0.12], [0.35, 0, 0]);
    } else {
      addPart(handHolder, new THREE.CylinderGeometry(0.01, 0.01, 0.14, 12), secMat, [0, -0.06, 0.03], [0.3, 0, 0]);
      addPart(handHolder, new THREE.BoxGeometry(0.095, 0.22, 0.012), mainMat, [0, -0.22, 0.08], [0.3, 0, 0]);
    }
    return;
  }

  // 4. 골반(Hips) 부착형 (여성용/남성용 초강력 자위기구, 완드, 딜도, 스트로커, 플러그, 폭스테일)
  const hipsHolder = getBoneHolder('Hips') || group;

  switch (toyItemId) {
    case 'toy_magic_wand': {
      // 대형 매직 완드: 실리콘 구형 헤드 + 플렉시블 넥 + 컨트롤 바디
      addPart(hipsHolder, new THREE.SphereGeometry(0.034, 18, 18), mainMat, [0, -0.055, 0.105]);
      addPart(hipsHolder, new THREE.CylinderGeometry(0.014, 0.018, 0.04, 14), secMat, [0, -0.085, 0.13], [-0.65, 0, 0]);
      addPart(hipsHolder, new THREE.CylinderGeometry(0.022, 0.02, 0.21, 16), mainMat, [0, -0.165, 0.195], [-0.65, 0, 0]);
      break;
    }
    case 'toy_rabbit_vibe': {
      addPart(hipsHolder, new THREE.CylinderGeometry(0.018, 0.02, 0.18, 16), mainMat, [0, -0.07, 0.11], [-0.45, 0, 0]);
      addPart(hipsHolder, new THREE.SphereGeometry(0.018, 14, 14), mainMat, [0, -0.005, 0.075]);
      addPart(hipsHolder, new THREE.CylinderGeometry(0.008, 0.01, 0.065, 12), secMat, [0, -0.04, 0.135], [-0.2, 0, 0]);
      break;
    }
    case 'toy_remote_egg': {
      addPart(hipsHolder, new THREE.SphereGeometry(0.024, 16, 16), glowMat, [0, -0.06, 0.085]);
      addPart(hipsHolder, new THREE.CylinderGeometry(0.003, 0.003, 0.14, 8), secMat, [0, -0.13, 0.11], [-0.3, 0, 0]);
      break;
    }
    case 'toy_suction_rose': {
      addPart(hipsHolder, new THREE.SphereGeometry(0.03, 16, 16), mainMat, [0, -0.055, 0.105]);
      addPart(hipsHolder, new THREE.TorusGeometry(0.018, 0.007, 10, 18), glowMat, [0, -0.055, 0.125]);
      break;
    }
    case 'toy_glass_wand':
    case 'toy_real_dildo':
    case 'toy_strapon_set': {
      const zOff = toyItemId === 'toy_strapon_set' ? 0.15 : 0.11;
      const rotX = toyItemId === 'toy_strapon_set' ? 1.25 : -0.45;
      addPart(hipsHolder, new THREE.CylinderGeometry(0.02, 0.022, 0.19, 16), mainMat, [0, -0.04, zOff], [rotX, 0, 0]);
      addPart(hipsHolder, new THREE.SphereGeometry(0.021, 16, 16), mainMat, [0, toyItemId === 'toy_strapon_set' ? -0.01 : 0.03, zOff + (toyItemId === 'toy_strapon_set' ? 0.085 : -0.035)]);
      addPart(hipsHolder, new THREE.CylinderGeometry(0.036, 0.038, 0.018, 16), secMat, [0, -0.11, zOff + 0.03], [rotX, 0, 0]);
      break;
    }
    case 'toy_double_dildo': {
      addPart(hipsHolder, new THREE.CylinderGeometry(0.019, 0.019, 0.32, 16), mainMat, [0, -0.075, 0.11], [1.1, 0, 0]);
      break;
    }
    case 'toy_anal_beads': {
      [0, 1, 2, 3].forEach((idx) => {
        addPart(
          hipsHolder,
          new THREE.SphereGeometry(0.014 + idx * 0.003, 14, 14),
          mainMat,
          [0, -0.055 - idx * 0.034, -0.085 - idx * 0.015]
        );
      });
      break;
    }
    case 'toy_jewel_plug': {
      addPart(hipsHolder, new THREE.ConeGeometry(0.024, 0.065, 16), secMat, [0, -0.04, -0.09], [-1.2, 0, 0]);
      addPart(hipsHolder, new THREE.OctahedronGeometry(0.022, 1), glowMat, [0, -0.055, -0.12]);
      break;
    }
    case 'toy_foxtail_plug': {
      addPart(hipsHolder, new THREE.CylinderGeometry(0.016, 0.048, 0.28, 16), mainMat, [0, -0.14, -0.17], [0.55, 0, 0]);
      addPart(hipsHolder, new THREE.SphereGeometry(0.038, 14, 14), secMat, [0, -0.26, -0.24]);
      break;
    }
    case 'toy_male_stroker': {
      // 남성용 전동 오토 스트로커 챔버 컵 + LED 링
      addPart(hipsHolder, new THREE.CylinderGeometry(0.044, 0.038, 0.21, 20), mainMat, [0, -0.03, 0.145], [1.15, 0, 0]);
      addPart(hipsHolder, new THREE.TorusGeometry(0.045, 0.006, 12, 24), glowMat, [0, -0.01, 0.19], [0.42, 0, 0]);
      break;
    }
    case 'toy_male_twin_ring': {
      addPart(hipsHolder, new THREE.TorusGeometry(0.028, 0.008, 12, 20), mainMat, [0, -0.04, 0.115]);
      addPart(hipsHolder, new THREE.SphereGeometry(0.016, 14, 14), glowMat, [0, -0.012, 0.125]);
      break;
    }
    case 'toy_male_prostate': {
      addPart(hipsHolder, new THREE.CylinderGeometry(0.016, 0.018, 0.12, 14), mainMat, [0, -0.075, -0.06], [0.65, 0, 0]);
      addPart(hipsHolder, new THREE.TorusGeometry(0.024, 0.006, 10, 18), secMat, [0, -0.115, -0.03]);
      break;
    }
    default:
      break;
  }
}


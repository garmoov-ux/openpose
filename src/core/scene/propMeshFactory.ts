import * as THREE from 'three';
import { mat, box, cyl, sphere } from './themeFurniturePrimitives';
export function buildRoomArchitectureShell(
  group: THREE.Group,
  floorHex: number,
  wallHex: number,
  trimHex: number,
  accentHex: number
): void {
  const floorMat = mat(floorHex, 0.38, 0.2);
  const wallMat = mat(wallHex, 0.55, 0.12);
  const trimMat = mat(trimHex, 0.32, 0.45);
  const accentMat = mat(accentHex, 0.25, 0.4, accentHex, 0.35);
  // 1. 사각 룸 바닥 (가로 4.4m x 세로 3.8m) + 테두리 프레임
  box(group, 4.4, 0.05, 3.8, 0, -0.025, -0.25, floorMat);
  box(group, 4.44, 0.02, 0.06, 0, 0.005, 1.64, trimMat);
  // 바닥 마루/타일 줄눈 디테일
  const seamMat = mat(trimHex, 0.5, 0.25);
  for (let i = -3; i <= 3; i++) {
    box(group, 0.012, 0.004, 3.76, i * 0.6, 0.002, -0.25, seamMat);
  }
  // 2. 뒷벽 (가로 4.4m x 높이 2.65m, z = -2.12) + 걸레받이 + 웨인스코팅 몰딩 + 상단 크라운 몰딩
  box(group, 4.4, 2.65, 0.08, 0, 1.325, -2.12, wallMat);
  box(group, 4.4, 0.14, 0.1, 0, 0.07, -2.09, trimMat);
  box(group, 4.4, 0.06, 0.11, 0, 0.92, -2.09, trimMat);
  box(group, 4.4, 0.08, 0.12, 0, 2.62, -2.08, trimMat);
  box(group, 4.2, 0.025, 0.04, 0, 2.54, -2.05, accentMat);
  // 뒷벽 웨인스코팅 액자형 패널 3칸
  [-1.35, 0, 1.35].forEach((px) => {
    box(group, 1.1, 1.25, 0.03, px, 1.68, -2.07, trimMat);
    box(group, 1.0, 1.15, 0.035, px, 1.68, -2.065, wallMat);
  });
  // 3. 좌측벽 & 우측벽 (3면 사각 룸 박스 구조: 뒷부분은 2.65m 풀월, 앞쪽은 카메라 시야 개방형 컷어웨이)
  [-2.18, 2.18].forEach((wx) => {
    // 후면 높은 측벽 (z = -2.12 ~ -0.35, 길이 1.8m, 높이 2.65m)
    box(group, 0.08, 2.65, 1.8, wx, 1.325, -1.22, wallMat);
    box(group, 0.11, 0.08, 1.8, wx, 2.62, -1.22, trimMat);
    // 전면 낮은 하프월 (z = -0.35 ~ +1.64, 길이 1.98m, 높이 0.92m)
    box(group, 0.08, 0.92, 1.98, wx, 0.46, 0.65, wallMat);
    box(group, 0.11, 0.06, 3.78, wx, 0.92, -0.24, trimMat);
    box(group, 0.1, 0.14, 3.78, wx, 0.07, -0.24, trimMat);
  });
}
// 개별 배치 및 기즈모 이동·회전이 가능한 45종 3D 가구·소품 메쉬 팩토리
export function createIndividualPropGroup(
  propId: string,
  shift: (hex: number) => number
): THREE.Group {
  const g = new THREE.Group();
  const goldMat = mat(0xfbbf24, 0.22, 0.86);
  const chromeMat = mat(0xe2e8f0, 0.16, 0.9);
  const woodMat = mat(shift(0x451a03), 0.48, 0.14);
  const whiteMat = mat(0xf8fafc, 0.45, 0.08);
  const darkMat = mat(shift(0x18181b), 0.38, 0.25);
  const redVelvet = mat(shift(0xbe123c), 0.48, 0.18);
  const glassMat = mat(0xbae6fd, 0.08, 0.88, 0x38bdf8, 0.25, 0.65);
  const glowMat = mat(0xfef08a, 0.18, 0.1, 0xf59e0b, 1.35);
  switch (propId) {
    case 'king_bed': {
      box(g, 1.68, 0.28, 1.38, 0, 0.14, 0, woodMat);
      box(g, 1.56, 0.22, 1.28, 0, 0.36, 0.02, whiteMat);
      box(g, 1.58, 0.14, 0.72, 0, 0.43, 0.28, redVelvet);
      box(g, 1.72, 1.25, 0.12, 0, 0.64, -0.66, mat(shift(0x312e81), 0.5, 0.2));
      box(g, 0.52, 0.12, 0.28, -0.38, 0.52, -0.42, whiteMat, 0.22, 0, 0);
      box(g, 0.52, 0.12, 0.28, 0.38, 0.52, -0.42, whiteMat, 0.22, 0, 0);
      break;
    }
    case 'canopy_frame': {
      [[-0.84, -0.66], [0.84, -0.66], [-0.84, 0.66], [0.84, 0.66]].forEach(([px, pz]) =>
        cyl(g, 0.032, 0.032, 2.25, px, 1.125, pz, goldMat)
      );
      box(g, 1.72, 0.045, 1.36, 0, 2.24, 0, goldMat);
      break;
    }
    case 'round_bed': {
      cyl(g, 0.92, 0.96, 0.32, 0, 0.16, 0, redVelvet);
      cyl(g, 0.85, 0.85, 0.16, 0, 0.38, 0, whiteMat);
      box(g, 1.45, 1.15, 0.12, 0, 0.6, -0.82, redVelvet);
      break;
    }
    case 'velvet_sofa':
    case 'modern_l_sofa': {
      const sMat = propId === 'velvet_sofa' ? mat(shift(0x581c87), 0.5, 0.18) : mat(shift(0x334155), 0.55, 0.12);
      box(g, 1.62, 0.36, 0.68, 0, 0.2, 0, sMat);
      box(g, 1.62, 0.58, 0.18, 0, 0.64, -0.26, sMat);
      cyl(g, 0.14, 0.14, 0.68, -0.8, 0.45, 0, sMat, Math.PI / 2, 0, 0);
      cyl(g, 0.14, 0.14, 0.68, 0.8, 0.45, 0, sMat, Math.PI / 2, 0, 0);
      box(g, 1.66, 0.05, 0.7, 0, 0.025, 0, goldMat);
      break;
    }
    case 'kitchen_island': {
      box(g, 1.62, 0.88, 0.54, 0, 0.44, 0, darkMat);
      box(g, 1.7, 0.06, 0.62, 0, 0.9, 0, whiteMat);
      box(g, 0.06, 0.9, 0.62, -0.82, 0.45, 0, whiteMat);
      box(g, 0.06, 0.9, 0.62, 0.82, 0.45, 0, whiteMat);
      break;
    }
    case 'ceo_desk': {
      box(g, 1.64, 0.07, 0.68, 0, 0.75, 0, woodMat);
      box(g, 0.42, 0.73, 0.62, -0.58, 0.365, 0, woodMat);
      box(g, 0.42, 0.73, 0.62, 0.58, 0.365, 0, woodMat);
      break;
    }
    case 'limo_seat': {
      box(g, 1.56, 0.38, 0.64, 0, 0.2, 0, darkMat);
      box(g, 1.56, 0.62, 0.16, 0, 0.66, -0.24, darkMat);
      box(g, 0.16, 0.52, 0.64, -0.74, 0.36, 0, darkMat);
      box(g, 0.16, 0.52, 0.64, 0.74, 0.36, 0, darkMat);
      break;
    }
    case 'love_chaise': {
      // S-커브 탄트라 러브체어 조형
      box(g, 1.48, 0.14, 0.54, 0, 0.08, 0, goldMat);
      cyl(g, 0.28, 0.28, 0.52, -0.38, 0.38, 0, redVelvet, Math.PI / 2, 0, 0);
      box(g, 0.68, 0.26, 0.52, 0.12, 0.24, 0, redVelvet, 0, 0, 0.22);
      cyl(g, 0.22, 0.22, 0.52, 0.52, 0.32, 0, redVelvet, Math.PI / 2, 0, 0);
      break;
    }
    case 'silk_bolster': {
      cyl(g, 0.13, 0.13, 0.76, 0, 0.13, 0, redVelvet, 0, 0, Math.PI / 2);
      cyl(g, 0.135, 0.135, 0.04, -0.36, 0.13, 0, goldMat, 0, 0, Math.PI / 2);
      cyl(g, 0.135, 0.135, 0.04, 0.36, 0.13, 0, goldMat, 0, 0, Math.PI / 2);
      break;
    }
    case 'pole_stage': {
      cyl(g, 0.72, 0.78, 0.08, 0, 0.04, 0, darkMat);
      cyl(g, 0.74, 0.74, 0.02, 0, 0.085, 0, goldMat);
      cyl(g, 0.026, 0.026, 2.55, 0, 1.32, 0, chromeMat);
      break;
    }
    case 'neon_arch': {
      const neonPink = mat(0xf43f5e, 0.15, 0.2, 0xff1744, 1.8);
      const neonCyan = mat(0x22d3ee, 0.15, 0.2, 0x06b6d4, 1.6);
      box(g, 0.08, 2.2, 0.08, -0.95, 1.1, 0, neonPink);
      box(g, 0.08, 2.2, 0.08, 0.95, 1.1, 0, neonCyan);
      box(g, 1.98, 0.08, 0.08, 0, 2.2, 0, neonPink);
      break;
    }
    case 'padded_bench': {
      box(g, 1.24, 0.14, 0.46, 0, 0.42, 0, darkMat);
      [[-0.52, -0.18], [0.52, -0.18], [-0.52, 0.18], [0.52, 0.18]].forEach(([lx, lz]) =>
        cyl(g, 0.028, 0.024, 0.4, lx, 0.2, lz, chromeMat)
      );
      [-0.35, 0.35].forEach((sx) => box(g, 0.05, 0.16, 0.48, sx, 0.425, 0, redVelvet));
      break;
    }
    case 'restraint_frame': {
      box(g, 0.06, 2.25, 0.06, -0.78, 1.125, 0, chromeMat);
      box(g, 0.06, 2.25, 0.06, 0.78, 1.125, 0, chromeMat);
      box(g, 1.62, 0.06, 0.06, 0, 2.22, 0, chromeMat);
      box(g, 0.04, 2.1, 0.04, 0, 1.12, 0, goldMat, 0, 0, 0.58);
      box(g, 0.04, 2.1, 0.04, 0, 1.12, 0, goldMat, 0, 0, -0.58);
      break;
    }
    case 'mirror_ceiling_panel': {
      box(g, 1.85, 0.05, 1.45, 0, 0, 0, goldMat);
      box(g, 1.72, 0.06, 1.32, 0, -0.01, 0, chromeMat);
      break;
    }
    case 'velvet_ottoman':
    case 'velvet_stool': {
      const r = propId === 'velvet_ottoman' ? 0.36 : 0.24;
      const h = propId === 'velvet_ottoman' ? 0.38 : 0.44;
      cyl(g, r, r, h, 0, h / 2, 0, redVelvet);
      cyl(g, r + 0.015, r + 0.015, 0.04, 0, 0.02, 0, goldMat);
      break;
    }
    case 'vanity_mirror': {
      box(g, 1.15, 0.06, 0.44, 0, 0.74, 0, whiteMat);
      box(g, 0.06, 0.74, 0.4, -0.52, 0.37, 0, goldMat);
      box(g, 0.06, 0.74, 0.4, 0.52, 0.37, 0, goldMat);
      box(g, 0.92, 0.98, 0.05, 0, 1.26, -0.14, goldMat);
      box(g, 0.82, 0.88, 0.06, 0, 1.26, -0.13, chromeMat);
      for (let i = -2; i <= 2; i++) {
        sphere(g, 0.03, i * 0.18, 1.72, -0.1, glowMat);
      }
      break;
    }
    case 'triptych_mirror': {
      box(g, 0.86, 1.88, 0.05, 0, 0.94, 0, goldMat);
      box(g, 0.78, 1.78, 0.06, 0, 0.94, 0.01, chromeMat);
      box(g, 0.56, 1.82, 0.05, -0.68, 0.91, 0.16, goldMat, 0, 0.42, 0);
      box(g, 0.56, 1.82, 0.05, 0.68, 0.91, 0.16, goldMat, 0, -0.42, 0);
      break;
    }
    case 'standing_mirror': {
      box(g, 0.68, 1.78, 0.05, 0, 0.89, 0, goldMat);
      box(g, 0.58, 1.68, 0.06, 0, 0.89, 0.01, chromeMat);
      break;
    }
    case 'wardrobe_closet':
    case 'bookshelf_wall': {
      box(g, 1.18, 2.15, 0.42, 0, 1.075, 0, woodMat);
      for (let r = 0; r < 4; r++) {
        box(g, 1.1, 0.04, 0.38, 0, 0.42 + r * 0.48, 0.02, goldMat);
      }
      break;
    }
    case 'clothing_rack': {
      cyl(g, 0.02, 0.02, 1.65, -0.46, 0.825, 0, goldMat);
      cyl(g, 0.02, 0.02, 1.65, 0.46, 0.825, 0, goldMat);
      cyl(g, 0.02, 0.02, 0.94, 0, 1.64, 0, goldMat, 0, 0, Math.PI / 2);
      box(g, 0.96, 0.04, 0.36, 0, 0.02, 0, goldMat);
      box(g, 0.24, 0.88, 0.08, -0.18, 1.12, 0, redVelvet);
      box(g, 0.24, 0.82, 0.08, 0.18, 1.15, 0, whiteMat);
      break;
    }
    case 'bar_stool': {
      cyl(g, 0.19, 0.19, 0.08, 0, 0.64, 0, darkMat);
      cyl(g, 0.028, 0.028, 0.62, 0, 0.31, 0, chromeMat);
      cyl(g, 0.2, 0.22, 0.025, 0, 0.015, 0, chromeMat);
      break;
    }
    case 'leather_chair': {
      box(g, 0.58, 0.1, 0.54, 0, 0.44, 0, darkMat);
      box(g, 0.56, 0.68, 0.12, 0, 0.8, -0.22, darkMat);
      cyl(g, 0.035, 0.035, 0.42, 0, 0.21, 0, chromeMat);
      cyl(g, 0.28, 0.28, 0.03, 0, 0.02, 0, chromeMat);
      break;
    }
    case 'cafe_table_set': {
      cyl(g, 0.38, 0.38, 0.04, 0, 0.72, 0, whiteMat);
      cyl(g, 0.035, 0.05, 0.7, 0, 0.35, 0, goldMat);
      cyl(g, 0.24, 0.24, 0.03, 0, 0.015, 0, goldMat);
      break;
    }
    case 'street_bench': {
      box(g, 1.38, 0.07, 0.46, 0, 0.42, 0, woodMat);
      box(g, 1.38, 0.44, 0.07, 0, 0.68, -0.2, woodMat);
      box(g, 0.08, 0.42, 0.44, -0.6, 0.21, 0, darkMat);
      box(g, 0.08, 0.42, 0.44, 0.6, 0.21, 0, darkMat);
      break;
    }
    case 'hinoki_tub':
    case 'jacuzzi_tub': {
      const tMat = propId === 'hinoki_tub' ? mat(0xb45309, 0.5, 0.1) : whiteMat;
      box(g, 1.56, 0.48, 0.12, 0, 0.24, 0.38, tMat);
      box(g, 1.56, 0.48, 0.12, 0, 0.24, -0.38, tMat);
      box(g, 0.12, 0.48, 0.88, -0.72, 0.24, 0, tMat);
      box(g, 0.12, 0.48, 0.88, 0.72, 0.24, 0, tMat);
      box(g, 1.32, 0.04, 0.64, 0, 0.38, 0, glassMat);
      break;
    }
    case 'glass_shower': {
      box(g, 0.92, 2.05, 0.03, 0, 1.025, 0.42, glassMat);
      box(g, 0.03, 2.05, 0.86, 0.46, 1.025, 0, glassMat);
      cyl(g, 0.02, 0.02, 1.95, -0.35, 0.975, -0.35, chromeMat);
      cyl(g, 0.15, 0.15, 0.025, -0.35, 1.96, -0.1, chromeMat);
      break;
    }
    case 'massage_bed':
    case 'sunbed_lounger': {
      box(g, 1.58, 0.26, 0.68, 0, 0.18, 0, woodMat);
      box(g, 1.5, 0.12, 0.62, 0, 0.36, 0, whiteMat);
      if (propId === 'sunbed_lounger') {
        box(g, 0.54, 0.12, 0.62, -0.52, 0.52, 0, whiteMat, 0, 0, -0.42);
      }
      break;
    }
    case 'pilates_reformer': {
      box(g, 1.56, 0.28, 0.6, 0, 0.16, 0, woodMat);
      box(g, 1.2, 0.08, 0.52, 0.06, 0.34, 0, darkMat);
      cyl(g, 0.022, 0.022, 0.58, -0.66, 0.48, 0, chromeMat, Math.PI / 2, 0, 0);
      break;
    }
    case 'ballet_barre': {
      box(g, 2.2, 1.95, 0.04, 0, 0.975, -0.12, chromeMat);
      cyl(g, 0.025, 0.025, 2.1, 0, 1.02, 0, woodMat, 0, 0, Math.PI / 2);
      cyl(g, 0.025, 0.025, 2.1, 0, 0.76, 0, woodMat, 0, 0, Math.PI / 2);
      break;
    }
    case 'wall_window_frame':
    case 'shoji_screen': {
      const paneMat = propId === 'shoji_screen' ? glowMat : glassMat;
      box(g, 2.2, 1.85, 0.06, 0, 1.15, 0, woodMat);
      box(g, 0.96, 1.68, 0.07, -0.52, 1.15, 0.01, paneMat);
      box(g, 0.96, 1.68, 0.07, 0.52, 1.15, 0.01, paneMat);
      break;
    }
    case 'plush_rug': {
      box(g, 2.35, 0.016, 1.75, 0, 0.008, 0, redVelvet);
      box(g, 2.42, 0.012, 1.82, 0, 0.006, 0, goldMat);
      break;
    }
    case 'nightstand_lamp': {
      box(g, 0.44, 0.48, 0.38, 0, 0.24, 0, woodMat);
      cyl(g, 0.04, 0.06, 0.22, 0, 0.58, 0, goldMat);
      cyl(g, 0.12, 0.16, 0.2, 0, 0.74, 0, glowMat);
      break;
    }
    case 'floor_lamp':
    case 'street_lamp': {
      cyl(g, 0.16, 0.18, 0.04, 0, 0.02, 0, goldMat);
      cyl(g, 0.024, 0.028, 1.78, 0, 0.9, 0, goldMat);
      sphere(g, 0.15, 0, 1.82, 0, glowMat);
      break;
    }
    case 'ring_light': {
      cyl(g, 0.02, 0.02, 1.48, 0, 0.74, 0, chromeMat);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 12, 28), glowMat);
      ring.position.set(0, 1.56, 0);
      g.add(ring);
      break;
    }
    case 'tropical_plant':
      cyl(g, 0.18, 0.14, 0.38, 0, 0.19, 0, whiteMat);
      sphere(g, 0.32, 0, 0.62, 0, mat(0x059669, 0.5, 0.1), 1.2, 1.1, 1.2);
      break;
    case 'champagne_set':
      cyl(g, 0.13, 0.09, 0.26, 0, 0.38, 0, chromeMat);
      cyl(g, 0.03, 0.03, 0.26, 0, 0.13, 0, chromeMat);
      cyl(g, 0.032, 0.038, 0.32, 0, 0.54, 0, mat(0x065f46, 0.2, 0.5));
      cyl(g, 0.025, 0.02, 0.18, 0.16, 0.09, 0.05, glassMat);
      break;
    case 'whiskey_decanter':
      cyl(g, 0.22, 0.22, 0.42, 0, 0.21, 0, woodMat);
      box(g, 0.09, 0.2, 0.09, -0.04, 0.52, 0, glassMat);
      cyl(g, 0.035, 0.032, 0.09, 0.07, 0.46, 0.04, glowMat);
      break;
    case 'perfume_cosmetics':
      box(g, 0.28, 0.025, 0.18, 0, 0.015, 0, goldMat);
      box(g, 0.06, 0.13, 0.05, -0.06, 0.08, 0, glassMat);
      cyl(g, 0.018, 0.018, 0.09, 0.06, 0.06, 0.02, redVelvet);
      break;
    case 'aroma_candles':
      cyl(g, 0.05, 0.05, 0.2, -0.06, 0.1, 0, glowMat);
      cyl(g, 0.042, 0.042, 0.14, 0.05, 0.07, 0.04, glowMat);
      break;
    case 'rose_vase':
      cyl(g, 0.06, 0.04, 0.26, 0, 0.13, 0, glassMat);
      sphere(g, 0.1, 0, 0.32, 0, redVelvet);
      break;
    default:
      cyl(g, 0.13, 0.11, 0.18, -0.08, 0.09, 0, woodMat);
      box(g, 0.24, 0.08, 0.18, 0.14, 0.04, 0, whiteMat);
      break;
  }
  return g;
}

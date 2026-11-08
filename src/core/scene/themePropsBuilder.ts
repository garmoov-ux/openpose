import * as THREE from 'three';
import { SoloThemeId } from '@/types/themeSolo';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import { translateEnvironmentItem } from '@/data/themesSolo/environmentTranslator';
import {
  mat,
  box,
  cyl,
  sphere,
  buildStreetCafeStage,
  buildVanityOrFittingStage,
  buildBedroomOrClosetStage,
} from './themeFurniturePrimitives';

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

// 16대 테마 파일 및 380개 세부 장소(envIndex) 텍스트를 분석하여 입체 3D 가구·건축 세트 생성
export function rebuildThemePropsGroup(
  group: THREE.Group,
  themeId: SoloThemeId,
  envIndex: number,
  lightIndex = 0,
  extraSceneProps: string[] = []
): void {
  disposeThemePropsGroup(group);

  const theme = THEMES_DATA[themeId];
  const envText = theme?.environments[envIndex] || theme?.environments[0] || '';
  const lightText = theme?.lightings[lightIndex] || theme?.lightings[0] || '';
  const info = translateEnvironmentItem(envText, envIndex, themeId);

  const hueShift = ((envIndex % 7) - 3) * 0.032;
  const shift = (hex: number) => new THREE.Color(hex).offsetHSL(hueShift, 0, 0).getHex();

  switch (info.furnitureKind) {
    case 'cafe_bench_table':
      buildStreetCafeStage(group, shift, 'cafe');
      break;
    case 'storefront_window':
      buildStreetCafeStage(group, shift, 'storefront');
      break;
    case 'spiral_stairs_steps':
      buildStreetCafeStage(group, shift, 'stairs');
      break;
    case 'street_railing_lamp':
      buildStreetCafeStage(group, shift, 'street');
      break;

    case 'vanity_bulb_mirror':
      buildVanityOrFittingStage(group, shift, false);
      break;
    case 'triptych_mirror_pedestal':
      buildVanityOrFittingStage(group, shift, true);
      break;

    case 'wardrobe_closet_bed':
      buildBedroomOrClosetStage(group, shift, 'closet');
      break;
    case 'round_mirror_bed':
      buildBedroomOrClosetStage(group, shift, 'round');
      break;
    case 'canopy_king_bed':
      buildBedroomOrClosetStage(group, shift, 'canopy');
      break;

    case 'kitchen_island_bar':
    case 'rooftop_terrace_bar': {
      const marbleMat = mat(0xf1f5f9, 0.22, 0.25);
      const baseMat = mat(shift(0x1e293b), 0.35, 0.45);
      const chromeMat = mat(0xcbd5e1, 0.18, 0.88);
      const glowMat = mat(0xfef08a, 0.2, 0.1, 0xf59e0b, 1.3);
      // 워터폴 대리석 아일랜드/바 카운터 + 바스툴 2개 + 펜던트 조명 2개 + 백월 선반
      box(group, 1.56, 0.88, 0.48, 0, 0.44, -0.48, baseMat);
      box(group, 1.64, 0.06, 0.56, 0, 0.9, -0.48, marbleMat);
      box(group, 0.06, 0.9, 0.56, -0.8, 0.45, -0.48, marbleMat);
      box(group, 0.06, 0.9, 0.56, 0.8, 0.45, -0.48, marbleMat);
      [-0.42, 0.42].forEach((sx) => {
        cyl(group, 0.18, 0.18, 0.07, sx, 0.62, -0.08, baseMat);
        cyl(group, 0.025, 0.025, 0.62, sx, 0.31, -0.08, chromeMat);
        cyl(group, 0.16, 0.18, 0.02, sx, 0.01, -0.08, chromeMat);
        sphere(group, 0.09, sx, 1.82, -0.48, glowMat);
      });
      box(group, 2.1, 1.92, 0.08, 0, 0.96, -0.92, mat(shift(0x0f172a), 0.5, 0.3));
      break;
    }

    case 'glass_shower_booth': {
      const tileMat = mat(shift(0x334155), 0.3, 0.2);
      const glassMat = mat(0xe0f2fe, 0.08, 0.9, 0x000000, 0, 0.38);
      const chromeMat = mat(0xe2e8f0, 0.15, 0.92);
      // 타일 백월 + 통유리 샤워부스 파티션 + 레인폴 샤워기 + 세면대 카운터
      box(group, 2.0, 1.95, 0.08, 0, 0.975, -0.88, tileMat);
      box(group, 0.95, 1.9, 0.03, -0.48, 0.95, -0.32, glassMat);
      box(group, 0.03, 1.9, 0.56, 0.0, 0.95, -0.58, glassMat);
      cyl(group, 0.018, 0.018, 1.75, -0.48, 0.875, -0.82, chromeMat);
      cyl(group, 0.14, 0.14, 0.02, -0.48, 1.76, -0.62, chromeMat);
      box(group, 0.78, 0.78, 0.44, 0.56, 0.39, -0.62, mat(0xf8fafc, 0.25, 0.2));
      break;
    }

    case 'hinoki_onsen_bath':
    case 'tatami_shoji_room':
    case 'bathtub_jacuzzi': {
      const isHinoki = info.furnitureKind !== 'bathtub_jacuzzi';
      const tubMat = mat(shift(isHinoki ? 0x9a5b25 : 0xf1f5f9), 0.45, 0.12);
      const waterMat = mat(0x2dd4bf, 0.12, 0.45, 0x0d9488, 0.45, 0.88);
      const woodDark = mat(0x451a03, 0.65, 0.1);
      const shojiGlow = mat(0xfef3c7, 0.4, 0.05, 0xf59e0b, 0.45);
      // 쇼지 격자 병풍 배경 + 입체 욕조 테두리 4면 + 온천수 수면 + 히노끼 나무통·스툴·정원석
      box(group, 2.1, 1.9, 0.06, 0, 0.95, -0.9, woodDark);
      box(group, 0.88, 1.68, 0.07, -0.48, 0.95, -0.89, shojiGlow);
      box(group, 0.88, 1.68, 0.07, 0.48, 0.95, -0.89, shojiGlow);
      box(group, 1.52, 0.44, 0.12, 0, 0.22, -0.06, tubMat);
      box(group, 1.52, 0.44, 0.12, 0, 0.22, -0.74, tubMat);
      box(group, 0.12, 0.44, 0.8, -0.7, 0.22, -0.4, tubMat);
      box(group, 0.12, 0.44, 0.8, 0.7, 0.22, -0.4, tubMat);
      box(group, 1.28, 0.04, 0.56, 0, 0.36, -0.4, waterMat);
      cyl(group, 0.12, 0.1, 0.16, 0.54, 0.52, -0.06, tubMat);
      sphere(group, 0.22, -0.92, 0.16, -0.42, mat(0x44403c, 0.85, 0.1), 1.2, 0.75, 1.0);
      break;
    }

    case 'velvet_sofa_salon': {
      const sofaMat = mat(shift(themeId === 'gothic_rococo_salon' ? 0x581c87 : 0x1e1b4b), 0.55, 0.15);
      const goldMat = mat(0xfbbf24, 0.22, 0.88);
      const marbleMat = mat(0xe2e8f0, 0.25, 0.25);
      // 체스터필드 벨벳 소파 (좌판 + 등받이 + 롤 팔걸이 2개 + 쿠션) + 대리석 기둥 2개 + 골드 콘솔
      box(group, 1.48, 0.34, 0.58, 0, 0.19, -0.34, sofaMat);
      box(group, 1.48, 0.56, 0.16, 0, 0.62, -0.56, sofaMat);
      cyl(group, 0.14, 0.14, 0.58, -0.74, 0.44, -0.34, sofaMat, Math.PI / 2, 0, 0);
      cyl(group, 0.14, 0.14, 0.58, 0.74, 0.44, -0.34, sofaMat, Math.PI / 2, 0, 0);
      box(group, 1.52, 0.06, 0.6, 0, 0.03, -0.34, goldMat);
      [-0.98, 0.98].forEach((px) => {
        cyl(group, 0.11, 0.13, 1.92, px, 0.96, -0.82, marbleMat);
        box(group, 0.32, 0.12, 0.32, px, 0.06, -0.82, goldMat);
        box(group, 0.32, 0.12, 0.32, px, 1.92, -0.82, goldMat);
      });
      cyl(group, 0.22, 0.22, 0.04, 0.92, 0.56, -0.22, marbleMat);
      cyl(group, 0.03, 0.14, 0.54, 0.92, 0.27, -0.22, goldMat);
      break;
    }

    case 'sunbed_pool_deck': {
      const teakMat = mat(shift(0x78350f), 0.55, 0.12);
      const padMat = mat(0xf8fafc, 0.6, 0.08);
      const waterMat = mat(0x06b6d4, 0.1, 0.6, 0x0891b2, 0.45, 0.88);
      const leafMat = mat(0x059669, 0.55, 0.1);
      // 티크 선베드 + 각도 조절 등받이 + 인피니티 풀 수면 + 카바나 퍼걸러 프레임 + 열대 화분
      box(group, 1.44, 0.22, 0.68, 0, 0.14, -0.3, teakMat);
      box(group, 1.36, 0.1, 0.62, 0, 0.3, -0.3, padMat);
      box(group, 0.52, 0.1, 0.62, -0.52, 0.48, -0.3, padMat, 0, 0, -0.45);
      box(group, 2.3, 0.03, 0.85, 0, 0.015, -0.78, waterMat);
      [-0.96, 0.96].forEach((px) => cyl(group, 0.04, 0.045, 1.95, px, 0.975, -0.82, teakMat));
      box(group, 2.02, 0.06, 0.08, 0, 1.94, -0.82, teakMat);
      cyl(group, 0.16, 0.12, 0.34, -0.92, 0.17, -0.32, teakMat);
      sphere(group, 0.26, -0.92, 0.54, -0.32, leafMat, 1.2, 0.9, 1.1);
      break;
    }

    case 'pilates_reformer':
    case 'ballet_barre_mirror':
    case 'cadillac_trapeze':
    case 'gym_weight_rack':
    case 'sauna_cedar_bench':
    case 'spa_massage_bed': {
      const woodMat = mat(shift(0xb45309), 0.45, 0.12);
      const chromeMat = mat(0xcbd5e1, 0.15, 0.9);
      const padMat = mat(info.furnitureKind === 'gym_weight_rack' ? 0x18181b : 0xf8fafc, 0.5, 0.15);
      const mirrorMat = mat(0xe2e8f0, 0.06, 0.92);
      // 전면 거울 프레임 + 2단 우드 발레 바 + 리포머 캐리지(숄더블록·풋바·캐딜락 상부 프레임)
      box(group, 2.05, 1.92, 0.05, 0, 0.96, -0.88, mirrorMat);
      cyl(group, 0.024, 0.024, 1.95, 0, 1.02, -0.76, woodMat, 0, 0, Math.PI / 2);
      cyl(group, 0.024, 0.024, 1.95, 0, 0.78, -0.76, woodMat, 0, 0, Math.PI / 2);
      box(group, 1.48, 0.28, 0.58, 0, 0.16, -0.32, woodMat);
      box(group, 1.18, 0.08, 0.5, 0.08, 0.34, -0.32, padMat);
      box(group, 0.1, 0.16, 0.12, 0.52, 0.44, -0.2, padMat);
      box(group, 0.1, 0.16, 0.12, 0.52, 0.44, -0.44, padMat);
      cyl(group, 0.02, 0.02, 0.56, -0.62, 0.46, -0.32, chromeMat, Math.PI / 2, 0, 0);
      if (info.furnitureKind === 'cadillac_trapeze') {
        [[-0.68, -0.58], [0.68, -0.58], [-0.68, -0.06], [0.68, -0.06]].forEach(([px, pz]) =>
          cyl(group, 0.022, 0.022, 1.85, px, 0.925, pz, chromeMat)
        );
        box(group, 1.4, 0.035, 0.54, 0, 1.84, -0.32, chromeMat);
      }
      break;
    }

    case 'ceo_desk_chair':
    case 'library_bookshelves': {
      const walnutMat = mat(shift(0x3f2314), 0.38, 0.2);
      const leatherMat = mat(0x0f172a, 0.4, 0.25);
      const glassMat = mat(0x38bdf8, 0.15, 0.7, 0x1d4ed8, 0.35);
      // CEO 데스크 + 양측 서랍통 + 가죽 중역 의자 + 스카이라인 창호 또는 대형 서재 책장
      box(group, 1.56, 0.07, 0.62, 0, 0.74, -0.42, walnutMat);
      box(group, 0.38, 0.72, 0.58, -0.56, 0.36, -0.42, walnutMat);
      box(group, 0.38, 0.72, 0.58, 0.56, 0.36, -0.42, walnutMat);
      box(group, 0.52, 0.1, 0.48, 0, 0.44, -0.08, leatherMat);
      box(group, 0.5, 0.62, 0.1, 0, 0.78, -0.28, leatherMat);
      box(group, 2.1, 1.95, 0.08, 0, 0.975, -0.9, info.furnitureKind === 'library_bookshelves' ? walnutMat : glassMat);
      for (let r = 0; r < 4; r++) {
        box(group, 2.05, 0.04, 0.18, 0, 0.42 + r * 0.42, -0.84, walnutMat);
      }
      break;
    }

    case 'jet_oval_recliner':
    case 'limo_jseat_bar':
    case 'elevator_stair_special':
    default: {
      const isJet = info.furnitureKind === 'jet_oval_recliner';
      const leatherMat = mat(shift(isJet ? 0xf1f5f9 : 0x18181b), 0.38, 0.2);
      const wallMat = mat(isJet ? 0x334155 : 0x09090b, 0.4, 0.45);
      const winGlow = mat(0xfef08a, 0.15, 0.3, isJet ? 0x38bdf8 : 0xec4899, 1.2);
      // 전용기/리무진 캐빈 월 + 오벌 창문 3개(또는 네온 스트립) + VIP 리클라이너 시트 + 콘솔 테이블
      box(group, 2.15, 1.92, 0.08, 0, 0.96, -0.88, wallMat);
      [-0.62, 0, 0.62].forEach((wx) => {
        cyl(group, 0.18, 0.18, 0.04, wx, 1.28, -0.83, winGlow, Math.PI / 2, 0, 0);
      });
      box(group, 1.42, 0.36, 0.56, 0, 0.2, -0.32, leatherMat);
      box(group, 1.42, 0.58, 0.14, 0, 0.64, -0.54, leatherMat);
      box(group, 0.14, 0.48, 0.56, -0.68, 0.34, -0.32, leatherMat);
      box(group, 0.14, 0.48, 0.56, 0.68, 0.34, -0.32, leatherMat);
      break;
    }
  }

  // 와일드카드 조명 문구 내 세부 소품 자동 배치 + 사용자 선택 추가 3D 소품 배치
  appendExtraSceneProps(group, lightText, extraSceneProps);
}

function appendExtraSceneProps(
  group: THREE.Group,
  lightText: string,
  extraProps: string[]
): void {
  const has = (id: string, regex: RegExp) => extraProps.includes(id) || regex.test(lightText);
  const goldMat = mat(0xfbbf24, 0.2, 0.85);
  const silverMat = mat(0xe2e8f0, 0.18, 0.9);
  const glassMat = mat(0xbae6fd, 0.1, 0.85, 0x38bdf8, 0.25, 0.78);
  const redMat = mat(0xe11d48, 0.45, 0.2);
  const glowMat = mat(0xfef08a, 0.2, 0.1, 0xf97316, 1.5);

  if (has('champagne_set', /champagne|ice bucket|flute/i)) {
    cyl(group, 0.11, 0.08, 0.22, 0.82, 0.11, -0.05, silverMat);
    cyl(group, 0.025, 0.03, 0.28, 0.82, 0.26, -0.05, mat(0x065f46, 0.2, 0.5));
    cyl(group, 0.022, 0.018, 0.16, 0.68, 0.08, -0.02, glassMat);
  }
  if (has('perfume_cosmetics', /perfume|lipstick|jewelry box/i)) {
    box(group, 0.22, 0.02, 0.14, -0.78, 0.01, -0.05, goldMat);
    box(group, 0.05, 0.11, 0.04, -0.82, 0.065, -0.05, glassMat);
    cyl(group, 0.014, 0.014, 0.08, -0.73, 0.05, -0.04, redMat);
  }
  if (has('aroma_candles', /candle|diffuser|oil warmer/i)) {
    cyl(group, 0.04, 0.04, 0.16, -0.62, 0.08, 0.08, glowMat);
    cyl(group, 0.035, 0.035, 0.11, -0.52, 0.055, 0.12, glowMat);
  }
  if (has('velvet_stool', /stool|ottoman/i)) {
    cyl(group, 0.25, 0.25, 0.36, -0.68, 0.18, -0.18, redMat);
    cyl(group, 0.26, 0.26, 0.03, -0.68, 0.015, -0.18, goldMat);
  }
  if (has('standing_mirror', /standing mirror|floor mirror/i)) {
    box(group, 0.62, 1.68, 0.04, 0.96, 0.84, -0.35, goldMat, 0, -0.35, 0);
    box(group, 0.54, 1.6, 0.05, 0.95, 0.84, -0.34, silverMat, 0, -0.35, 0);
  }
  if (has('silk_bolster', /bolster|throw pillow/i)) {
    cyl(group, 0.11, 0.11, 0.68, 0, 0.11, -0.18, redMat, 0, 0, Math.PI / 2);
  }
  if (has('rose_vase', /rose|flower|bouquet/i)) {
    cyl(group, 0.05, 0.035, 0.22, 0.72, 0.11, 0.08, glassMat);
    sphere(group, 0.075, 0.72, 0.26, 0.08, redMat);
  }
  if (has('ring_light', /ring-light|camera flash/i)) {
    cyl(group, 0.015, 0.015, 1.45, -0.95, 0.725, 0.15, silverMat);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 12, 28), glowMat);
    ring.position.set(-0.95, 1.52, 0.15);
    ring.rotation.y = 0.45;
    group.add(ring);
  }
  if (has('coffee_bag', /coffee|tote bag|cross-body bag|purse/i)) {
    cyl(group, 0.035, 0.026, 0.12, 0.56, 0.06, 0.12, mat(0xfef3c7, 0.4, 0.1));
    box(group, 0.18, 0.14, 0.07, 0.68, 0.07, 0.1, mat(0x451a03, 0.5, 0.2));
  }
  if (has('whiskey_decanter', /whiskey|decanter|carafe/i)) {
    box(group, 0.08, 0.18, 0.08, -0.58, 0.09, -0.08, glassMat);
    cyl(group, 0.03, 0.028, 0.08, -0.48, 0.04, -0.06, glowMat);
  }
  if (has('hinoki_bucket', /hinoki bucket|sauna bucket|towel/i)) {
    cyl(group, 0.11, 0.095, 0.15, -0.64, 0.075, 0.05, mat(0xb45309, 0.55, 0.1));
    box(group, 0.24, 0.06, 0.16, -0.42, 0.03, 0.08, mat(0xf8fafc, 0.7, 0.05));
  }
  if (extraProps.includes('pole_stage')) {
    cyl(group, 0.024, 0.024, 2.2, 0.28, 1.1, -0.12, silverMat);
    cyl(group, 0.68, 0.72, 0.06, 0, 0.03, -0.1, mat(0x18181b, 0.3, 0.6));
  }
}

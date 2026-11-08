import { PosePreset } from '@/types';
import { makeCouplePreset } from './couplePoseBuilder';

export const COUPLE_EXTREME_AND_SPECIAL_PRESETS: PosePreset[] = [
  // =========================================================================
  // B-6. 고난이도 아크로바틱 · 익스트림 리프트 (couple_acrobatic: 10종, 51~60)
  // =========================================================================
  makeCouplePreset('couple-acro-full-nelson-stand', '51. 스탠딩 풀넬슨 에키벤 리프트', 'couple_acrobatic',
    '기립 상태에서 남성이 여성의 양 허벅지 아래로 팔을 넣어 높게 들어 올리는 고난도 풀넬슨 리프트',
    { hipPos: [0, 1.24, 0], hips: [-18, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [18, 0, 0], lArm: [-52, 20, -36], lFore: [0, -72, -30], rArm: [-52, -20, 36], rFore: [0, 72, 30], lThigh: [-118, -34, 34], lKnee: 64, rThigh: [-118, 34, -34], rKnee: 64 },
    { hips: [-10, 0, 0], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [-10, 0, 0], lArm: [-68, 24, -32], lFore: [0, -84, -34], rArm: [-68, -24, 32], rFore: [0, 84, 34], lThigh: [-16, -14, 14], lKnee: 24, rThigh: [-16, 14, -14], rKnee: 24 }, [0, 0, 0.22], Math.PI
  ),
  makeCouplePreset('couple-acro-reverse-lift-suspend', '52. 후면 에키벤 서스펜션 리프트', 'couple_acrobatic',
    '남성이 정면을 향한 여성을 뒤에서 안아 올리고 여성이 양다리를 크게 벌려 공중에 매달리는 후면 리프트',
    { hipPos: [0, 1.2, 0], hips: [14, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-18, 10, 0], lArm: [24, -18, -42], lFore: [0, -64, -26], rArm: [24, 18, 42], rFore: [0, 64, 26], lThigh: [-104, -36, 36], lKnee: 78, rThigh: [-104, 36, -36], rKnee: 78 },
    { hips: [-8, 0, 0], spine: [-6, 0, 0], spine1: [-6, 0, 0], head: [8, 0, 0], lArm: [-58, 22, -36], lFore: [0, -78, -32], rArm: [-58, -22, 36], rFore: [0, 78, 32], lThigh: [-18, -14, 14], lKnee: 26, rThigh: [-18, 14, -14], rKnee: 26 }, [0, 0, -0.22], 0
  ),
  makeCouplePreset('couple-acro-standing-high-split', '53. 스탠딩 수직 180도 하이 스플릿', 'couple_acrobatic',
    '여성이 한 발로 서서 반대쪽 다리를 남성의 어깨 너머 수직 180도로 뻗어 올리는 발레 스플릿 체위',
    { hips: [-6, -12, 8], spine: [-10, 8, -4], spine1: [-10, 6, 0], head: [-8, -10, 0], lArm: [-58, 18, -36], lFore: [0, -64, -26], rArm: [-44, -16, 42], rFore: [0, 56, 22], lThigh: [-138, -18, 18], lKnee: 6, rThigh: [8, 6, -6], rKnee: 6 },
    { hips: [-4, 8, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, 8, 0], lArm: [-52, 20, -38], lFore: [0, -68, -28], rArm: [-36, -18, 44], rFore: [0, 60, 24], lThigh: [-12, -10, 10], lKnee: 18, rThigh: [-8, 10, -10], rKnee: 12 }, [0.02, 0, 0.24], Math.PI
  ),
  makeCouplePreset('couple-acro-wheelbarrow-stand', '54. 아크로바틱 핸드스탠드 휠배로우', 'couple_acrobatic',
    '여성이 바닥에 양손을 짚고 물구나무 아치를 만들며 남성이 기립 상태에서 여성의 양 허벅지를 잡아 지지하는 체위',
    { hips: [68, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-32, 0, 0], lArm: [-88, 8, -28], lFore: [0, -10, -6], rArm: [-88, -8, 28], rFore: [0, 10, 6], lThigh: [-18, -24, 24], lKnee: 24, rThigh: [-18, 24, -24], rKnee: 24 },
    { hips: [8, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-44, 18, -42], lFore: [0, -62, -26], rArm: [-44, -18, 42], rFore: [0, 62, 26], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 }, [0, 0, -0.34], 0
  ),
  makeCouplePreset('couple-acro-backbend-bridge-entry', '55. 풀 백벤드 아치 브릿지 도킹', 'couple_acrobatic',
    '여성이 손과 발로 바닥을 짚고 완전한 무지개 아치(브릿지)를 만들고 남성이 무릎을 꿇고 진입하는 고난도 체위',
    { hips: [-46, 0, 0], spine: [-34, 0, 0], spine1: [-32, 0, 0], head: [-36, 0, 0], lArm: [-136, 12, -24], lFore: [0, -18, -8], rArm: [-136, -12, 24], rFore: [0, 18, 8], lThigh: [-48, -22, 22], lKnee: 96, rThigh: [-48, 22, -22], rKnee: 96 },
    { hips: [18, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [16, 0, 0], lArm: [-38, 16, -42], lFore: [0, -56, -24], rArm: [-38, -16, 42], rFore: [0, 56, 24], lThigh: [-26, -16, 16], lKnee: 108, rThigh: [-26, 16, -16], rKnee: 108 }, [0, 0, 0.28], Math.PI
  ),
  makeCouplePreset('couple-acro-inverted-piledriver', '56. 역립 파일드라이버 폴딩 프레스', 'couple_acrobatic',
    '여성이 어깨와 목을 바닥에 대고 골반을 수직으로 높이 들어 다리를 남성의 허리 뒤로 넘기는 익스트림 폴딩 체위',
    { hips: [-86, 0, 0], spine: [28, 0, 0], spine1: [26, 0, 0], head: [28, 0, 0], lArm: [24, -16, -48], lFore: [0, -48, -20], rArm: [24, 16, 48], rFore: [0, 48, 20], lThigh: [-112, -24, 24], lKnee: 28, rThigh: [-112, 24, -24], rKnee: 28 },
    { hips: [24, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [22, 0, 0], lArm: [-48, 18, -38], lFore: [0, -54, -22], rArm: [-48, -18, 38], rFore: [0, 54, 22], lThigh: [-38, -18, 18], lKnee: 84, rThigh: [-38, 18, -18], rKnee: 84 }, [0, 0, -0.06], Math.PI
  ),
  makeCouplePreset('couple-acro-side-hip-carry', '57. 사이드 골반 캐리 크로스 리프트', 'couple_acrobatic',
    '남성이 여성을 옆구리와 골반 높이에 비스듬히 안아 올리고 다리를 교차해 밀착하는 사이드 리프트',
    { hipPos: [0, 1.14, 0], hips: [-10, 24, -12], spine: [-8, -14, 8], spine1: [-8, -10, 0], head: [-6, -18, 0], lArm: [-62, 22, -34], lFore: [0, -72, -30], rArm: [-44, -16, 42], rFore: [0, 58, 24], lThigh: [-92, -24, 24], lKnee: 88, rThigh: [-78, 28, -28], rKnee: 94 },
    { hips: [-6, -12, 0], spine: [-4, 8, 0], spine1: [-4, 6, 0], head: [8, 12, 0], lArm: [-48, 20, -40], lFore: [0, -74, -30], rArm: [-52, -20, 40], rFore: [0, 74, 30], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 }, [0.06, 0, 0.22], Math.PI
  ),
  makeCouplePreset('couple-acro-kneeling-cradle-suspend', '58. 닐링 공중 크래들 딥홀드', 'couple_acrobatic',
    '남성이 무릎을 꿇은 채 여성의 둔부와 등을 공중에 받쳐 들고 여성이 상체를 활처럼 젖히는 체위',
    { hipPos: [0, 1.04, 0], hips: [-28, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-26, 0, 0], lArm: [-56, 20, -36], lFore: [0, -68, -28], rArm: [-56, -20, 36], rFore: [0, 68, 28], lThigh: [-88, -28, 28], lKnee: 98, rThigh: [-88, 28, -28], rKnee: 98 },
    { hips: [-10, 0, 0], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [10, 0, 0], lArm: [-46, 18, -40], lFore: [0, -70, -28], rArm: [-46, -18, 40], rFore: [0, 70, 28], lThigh: [-28, -16, 16], lKnee: 112, rThigh: [-28, 16, -16], rKnee: 112 }, [0, 0, 0.22], Math.PI
  ),
  makeCouplePreset('couple-acro-reverse-plank-bridge', '59. 리버스 플랭크 온탑 브릿지', 'couple_acrobatic',
    '누운 남성 위에서 여성이 발과 손으로 버티며 역플랭크 브릿지 라인을 형성하는 고난도 온탑 체위',
    { hips: [-24, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-22, 0, 0], lArm: [42, -14, -40], lFore: [0, -18, -8], rArm: [42, 14, 40], rFore: [0, 18, 8], lThigh: [-52, -26, 26], lKnee: 94, rThigh: [-52, 26, -26], rKnee: 94 },
    { hips: [-62, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [22, 0, 0], lArm: [-36, 16, -44], lFore: [0, -56, -24], rArm: [-36, -16, 44], rFore: [0, 56, 24], lThigh: [-22, -14, 14], lKnee: 32, rThigh: [-22, 14, -14], rKnee: 32 }, [0, 0, -0.34], 0
  ),
  makeCouplePreset('couple-acro-amazon-cradle-lock', '60. 아마존 크래들 레그업 프레스', 'couple_acrobatic',
    '남성이 등을 대고 눕고 다리를 높게 올린 상태에서 여성이 위에서 스쿼트 자세로 감싸 안는 아마존 체위',
    { hips: [28, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [14, 0, 0], lArm: [-48, 18, -38], lFore: [0, -58, -24], rArm: [-48, -18, 38], rFore: [0, 58, 24], lThigh: [-94, -28, 28], lKnee: 112, rThigh: [-94, 28, -28], rKnee: 112 },
    { hips: [-64, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [24, 0, 0], lArm: [-44, 18, -40], lFore: [0, -64, -26], rArm: [-44, -18, 40], rFore: [0, 64, 26], lThigh: [-108, -24, 24], lKnee: 76, rThigh: [-108, 24, -24], rKnee: 76 }, [0, 0, -0.14], Math.PI
  ),

  // =========================================================================
  // B-7. 탄트라 · 딥폴딩 · 초밀착 (couple_tantra_deep: 10종, 61~70)
  // =========================================================================
  makeCouplePreset('couple-tantra-ankles-to-ears', '61. 앵클 투 이어 극한 딥폴딩 프레스', 'couple_tantra_deep',
    '누운 여성의 양 발목이 귀 옆까지 닿도록 허벅지를 완전히 접고 남성이 상체로 깊게 누르는 딥폴딩 체위',
    { hips: [-62, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [22, 0, 0], lArm: [-44, 16, -42], lFore: [0, -58, -24], rArm: [-44, -16, 42], rFore: [0, 58, 24], lThigh: [-134, -24, 24], lKnee: 12, rThigh: [-134, 24, -24], rKnee: 12 },
    { hips: [36, 0, 0], spine: [16, 0, 0], spine1: [14, 0, 0], head: [18, 0, 0], lArm: [-54, 16, -38], lFore: [0, -48, -20], rArm: [-54, -16, 38], rFore: [0, 48, 20], lThigh: [-28, -16, 16], lKnee: 106, rThigh: [-28, 16, -16], rKnee: 106 }, [0, 0, -0.08], Math.PI
  ),
  makeCouplePreset('couple-tantra-bound-lotus-knot', '62. 탄트라 바운드 로터스 매듭 교차', 'couple_tantra_deep',
    '좌식 상태에서 남녀가 서로의 다리를 허리 뒤로 2중 교차해 빈틈없이 밀착하는 탄트라 연꽃 체위',
    { hips: [6, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [-12, 8, 0], lArm: [-56, 20, -36], lFore: [0, -72, -30], rArm: [-56, -20, 36], rFore: [0, 72, 30], lThigh: [-84, -34, 34], lKnee: 108, rThigh: [-84, 34, -34], rKnee: 108 },
    { hips: [-10, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, -8, 0], lArm: [-42, 22, -40], lFore: [0, -70, -28], rArm: [-42, -22, 40], rFore: [0, 70, 28], lThigh: [-74, -30, 30], lKnee: 102, rThigh: [-74, 30, -30], rKnee: 102 }, [0, 0, -0.02], Math.PI
  ),
  makeCouplePreset('couple-tantra-butterfly-edge-press', '63. 버터플라이 엣지 와이드 프레스', 'couple_tantra_deep',
    '침대 가장자리에 누운 여성의 양다리를 나비 날개처럼 벌려 올리고 남성이 서서 상체를 숙여 밀착하는 체위',
    { hips: [-54, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [18, 0, 0], lArm: [18, -16, -48], lFore: [0, -36, -14], rArm: [18, 16, 48], rFore: [0, 36, 14], lThigh: [-98, -38, 38], lKnee: 74, rThigh: [-98, 38, -38], rKnee: 74 },
    { hips: [22, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [16, 0, 0], lArm: [-48, 18, -38], lFore: [0, -52, -22], rArm: [-48, -18, 38], rFore: [0, 52, 22], lThigh: [-18, -14, 14], lKnee: 24, rThigh: [-18, 14, -14], rKnee: 24 }, [0, 0, -0.06], Math.PI
  ),
  makeCouplePreset('couple-tantra-reverse- frog-squat', '64. 리버스 프로그 M-스쿼트 바운스', 'couple_tantra_deep',
    '누운 남성 위로 여성이 등지고 돌아앉아 깊은 개구리 스쿼트(M자) 다리로 골반을 낮추는 리버스 체위',
    { hips: [26, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-14, 8, 0], lArm: [20, -14, -44], lFore: [0, -48, -20], rArm: [20, 14, 44], rFore: [0, 48, 20], lThigh: [-104, -36, 36], lKnee: 122, rThigh: [-104, 36, -36], rKnee: 122 },
    { hips: [-58, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [22, 0, 0], lArm: [-36, 16, -44], lFore: [0, -56, -24], rArm: [-36, -16, 44], rFore: [0, 56, 24], lThigh: [-24, -16, 16], lKnee: 32, rThigh: [-24, 16, -16], rKnee: 32 }, [0, 0, -0.34], 0
  ),
  makeCouplePreset('couple-tantra-pretzel-side-lock', '65. 프레즐 사이드 크로스 딥락', 'couple_tantra_deep',
    '측면으로 누운 여성의 한쪽 다리를 남성이 허리 위로 감아 올리고 straddle 형태로 깊게 밀착하는 프레즐 체위',
    { hips: [-24, 28, -18], spine: [-12, -14, 8], spine1: [-10, -10, 0], head: [12, -16, 0], lArm: [-38, 16, -44], lFore: [0, -54, -22], rArm: [16, 14, 48], rFore: [0, 44, 18], lThigh: [-102, -28, 28], lKnee: 68, rThigh: [-24, 14, -14], rKnee: 32 },
    { hips: [18, -12, 0], spine: [8, 6, 0], spine1: [8, 0, 0], head: [14, 8, 0], lArm: [-44, 18, -40], lFore: [0, -58, -24], rArm: [-38, -16, 42], rFore: [0, 54, 22], lThigh: [-32, -18, 18], lKnee: 104, rThigh: [-28, 18, -18], rKnee: 108 }, [0.04, 0, -0.14], Math.PI * 0.85
  ),
  makeCouplePreset('couple-tantra-cobra-prone-straddle', '66. 프론 스플릿 와이드 레그락', 'couple_tantra_deep',
    '여성이 다리를 120도로 넓게 벌리고 엎드린 상태에서 남성이 무릎으로 감싸며 상체를 밀착하는 체위',
    { hips: [56, 0, 0], spine: [-26, 0, 0], spine1: [-24, 0, 0], head: [-28, 12, 0], lArm: [-62, 16, -34], lFore: [0, -64, -26], rArm: [-62, -16, 34], rFore: [0, 64, 26], lThigh: [-24, -36, 36], lKnee: 34, rThigh: [-24, 36, -36], rKnee: 34 },
    { hips: [38, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [16, -8, 0], lArm: [-52, 14, -38], lFore: [0, -40, -16], rArm: [-52, -14, 38], rFore: [0, 40, 16], lThigh: [-24, -18, 18], lKnee: 88, rThigh: [-24, 18, -18], rKnee: 88 }, [0, 0, -0.34], 0
  ),
  makeCouplePreset('couple-tantra-swan-arch-top', '67. 스완 백아치 닐링 라이딩', 'couple_tantra_deep',
    '온탑 자세에서 여성이 양팔을 등 뒤로 깍지 끼듯 뻗고 가슴과 목을 백조처럼 젖히는 스완 아치 체위',
    { hips: [-14, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-28, 0, 0], lArm: [34, -18, -36], lFore: [0, -32, -14], rArm: [34, 18, 36], rFore: [0, 32, 14], lThigh: [-46, -28, 28], lKnee: 118, rThigh: [-46, 28, -28], rKnee: 118 },
    { hips: [-58, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-38, 16, -42], lFore: [0, -58, -24], rArm: [-38, -16, 42], rFore: [0, 58, 24], lThigh: [-22, -14, 14], lKnee: 28, rThigh: [-22, 14, -14], rKnee: 28 }, [0, 0, -0.18], Math.PI
  ),
  makeCouplePreset('couple-tantra-cross-ankle-lock', '68. 베드 대면 크로스 앵클 하이락', 'couple_tantra_deep',
    '누운 여성이 양 발목을 남성의 목 뒤에서 X자로 교차해 잠그고 골반을 높이 끌어올리는 체위',
    { hips: [-56, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-48, 18, -38], lFore: [0, -64, -26], rArm: [-48, -18, 38], rFore: [0, 64, 26], lThigh: [-108, -14, 18], lKnee: 46, rThigh: [-108, 14, -18], rKnee: 46 },
    { hips: [32, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [16, 0, 0], lArm: [-52, 16, -38], lFore: [0, -46, -20], rArm: [-52, -16, 38], rFore: [0, 46, 20], lThigh: [-26, -16, 16], lKnee: 104, rThigh: [-26, 16, -16], rKnee: 104 }, [0, 0, -0.08], Math.PI
  ),
  makeCouplePreset('couple-tantra-kneeling-wheel-arch', '69. 더블 닐링 백벤드 아치 폴백', 'couple_tantra_deep',
    '무릎을 꿇은 여성이 상체를 뒤로 완전히 젖혀 남성의 어깨에 머리를 기대고 골반을 앞으로 밀어내는 체위',
    { hips: [-18, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-28, 10, 0], lArm: [24, -16, -42], lFore: [0, -56, -24], rArm: [24, 16, 42], rFore: [0, 56, 24], lThigh: [-24, -20, 20], lKnee: 116, rThigh: [-24, 20, -20], rKnee: 116 },
    { hips: [6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-42, 20, -40], lFore: [0, -68, -28], rArm: [-42, -20, 40], rFore: [0, 68, 28], lThigh: [-24, -18, 18], lKnee: 112, rThigh: [-24, 18, -18], rKnee: 112 }, [0, 0, -0.32], 0
  ),
  makeCouplePreset('couple-tantra-split-straddle-press', '70. 180도 와이드 스플릿 온탑 라이딩', 'couple_tantra_deep',
    '누운 남성 위에서 여성이 양다리를 좌우 일자 스플릿으로 곧게 뻗고 상체를 세우는 발레리나 온탑 체위',
    { hips: [8, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [6, 0, 0], lArm: [14, -16, -48], lFore: [0, -36, -14], rArm: [14, 16, 48], rFore: [0, 36, 14], lThigh: [-78, -52, 52], lKnee: 8, rThigh: [-78, 52, -52], rKnee: 8 },
    { hips: [-58, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-36, 16, -44], lFore: [0, -56, -24], rArm: [-36, -16, 44], rFore: [0, 56, 24], lThigh: [-20, -14, 14], lKnee: 26, rThigh: [-20, 14, -14], rKnee: 26 }, [0, 0, -0.18], Math.PI
  ),

  // =========================================================================
  // B-8. 구속 · 서브미션 · BDSM · 롤플레이 (couple_bondage_rp: 10종, 71~80)
  // =========================================================================
  makeCouplePreset('couple-bdsm-backbound-kneel-rear', '71. 뒷손 결박(백바운드) 닐링 후면', 'couple_bondage_rp',
    '여성이 양손을 등 뒤로 모으고 무릎을 꿇은 채 상체를 숙이며 남성이 뒤에서 어깨와 목줄을 잡고 밀착하는 구도',
    { hips: [54, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-26, 12, 0], lArm: [38, 24, -22], lFore: [0, -78, -32], rArm: [38, -24, 22], rFore: [0, 78, 32], lThigh: [-24, -18, 18], lKnee: 108, rThigh: [-24, 18, -18], rKnee: 108 },
    { hips: [14, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-44, 16, -40], lFore: [0, -56, -24], rArm: [-44, -16, 40], rFore: [0, 56, 24], lThigh: [-24, -16, 16], lKnee: 108, rThigh: [-24, 16, -16], rKnee: 108 }, [0, 0, -0.36], 0
  ),
  makeCouplePreset('couple-bdsm-xframe-standing-rear', '72. X-프레임 양팔 상단 구속 후면', 'couple_bondage_rp',
    '여성이 양팔을 머리 위 X-프레임에 높이 벌려 올린 기립 상태에서 남성이 후면으로 밀착하는 구속 구도',
    { hips: [28, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-18, 12, 0], lArm: [-138, -24, -28], lFore: [0, -18, -8], rArm: [-138, 24, 28], rFore: [0, 18, 8], lThigh: [-14, -18, 18], lKnee: 20, rThigh: [-14, 18, -18], rKnee: 20 },
    { hips: [10, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-38, 18, -42], lFore: [0, -64, -26], rArm: [-38, -18, 42], rFore: [0, 64, 26], lThigh: [-12, -12, 12], lKnee: 18, rThigh: [-12, 12, -12], rKnee: 18 }, [0, 0, -0.26], 0
  ),
  makeCouplePreset('couple-bdsm-spanking-bench-arch', '73. 본디지 패디드 벤치 오버 아치', 'couple_bondage_rp',
    '패디드 벤치 위에 여성이 상체를 걸치고 골반을 높이 치켜들며 남성이 뒤에서 제압하는 스팽킹·본디지 체위',
    { hips: [62, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-24, 14, 0], lArm: [-68, 16, -32], lFore: [0, -54, -22], rArm: [-68, -16, 32], rFore: [0, 54, 22], lThigh: [-16, -20, 20], lKnee: 36, rThigh: [-16, 20, -20], rKnee: 36 },
    { hips: [12, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [16, -10, 0], lArm: [-42, 16, -40], lFore: [0, -58, -24], rArm: [-42, -16, 40], rFore: [0, 58, 24], lThigh: [-14, -14, 14], lKnee: 20, rThigh: [-14, 14, -14], rKnee: 20 }, [0, 0, -0.32], 0
  ),
  makeCouplePreset('couple-bdsm-collar-leash-kneel', '74. 마스터 기립 & 서브미시브 닐링 리쉬', 'couple_bondage_rp',
    '남성이 당당하게 서서 목줄(리쉬)을 잡고 여성이 그 앞에서 뒷짐을 진 채 무릎을 꿇고 올려다보는 서브미션 구도',
    { hips: [18, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-28, 0, 0], lArm: [34, 22, -24], lFore: [0, -74, -30], rArm: [34, -22, 24], rFore: [0, 74, 30], lThigh: [-28, -22, 22], lKnee: 118, rThigh: [-28, 22, -22], rKnee: 118 },
    { hips: [-4, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [22, 0, 0], lArm: [-28, 14, -46], lFore: [0, -54, -22], rArm: [-12, -10, 56], rFore: [0, 32, 14], lThigh: [-6, -10, 10], lKnee: 10, rThigh: [4, 10, -10], rKnee: 8 }, [0, 0, 0.34], Math.PI
  ),
  makeCouplePreset('couple-bdsm-overhead-wrist-tie-bed', '75. 베드 양손 머리위 결박 대면 오픈', 'couple_bondage_rp',
    '침대 헤드보드에 양손이 머리 위로 결박된 여성이 다리를 넓게 벌리고 남성이 위에서 지배하는 구도',
    { hips: [-54, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [16, 10, 0], lArm: [-142, 18, -24], lFore: [0, -34, -14], rArm: [-142, -18, 24], rFore: [0, 34, 14], lThigh: [-84, -34, 34], lKnee: 92, rThigh: [-84, 34, -34], rKnee: 92 },
    { hips: [32, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [16, 0, 0], lArm: [-52, 16, -38], lFore: [0, -44, -18], rArm: [-52, -16, 38], rFore: [0, 44, 18], lThigh: [-26, -16, 16], lKnee: 102, rThigh: [-26, 16, -16], rKnee: 102 }, [0, 0, -0.08], Math.PI
  ),
  makeCouplePreset('couple-bdsm-queen-foot-worship', '76. 퀸 시팅 & 닐링 풋워십 서브미션', 'couple_bondage_rp',
    '여성이 의자에 앉아 다리를 꼬고 하이힐 발끝을 내밀며 남성이 바닥에 무릎을 꿇고 경배하는 펨돔 구도',
    { hips: [-10, -8, 4], spine: [6, 6, 0], spine1: [8, 4, 0], head: [14, -6, 0], lArm: [-22, 12, -50], lFore: [0, -46, -20], rArm: [-26, -14, 48], rFore: [0, 58, 24], lThigh: [-84, 10, -8], lKnee: 64, rThigh: [-72, -10, 8], rKnee: 86 },
    { hips: [38, 0, 0], spine: [18, 0, 0], spine1: [16, 0, 0], head: [-14, 0, 0], lArm: [-56, 16, -36], lFore: [0, -52, -22], rArm: [-56, -16, 36], rFore: [0, 52, 22], lThigh: [-28, -16, 16], lKnee: 112, rThigh: [-28, 16, -16], rKnee: 112 }, [0, 0, 0.44], Math.PI
  ),
  makeCouplePreset('couple-bdsm-femdom-face-straddle', '77. 펨돔 리클라인 체스트 스트래들', 'couple_bondage_rp',
    '양손이 위로 올라간 채 누운 남성의 가슴과 상체 위로 여성이 당당하게 올라앉아 내려다보는 펨돔 온탑',
    { hips: [12, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [18, 0, 0], lArm: [-14, 14, -48], lFore: [0, -56, -24], rArm: [-14, -14, 48], rFore: [0, 56, 24], lThigh: [-52, -30, 30], lKnee: 116, rThigh: [-52, 30, -30], rKnee: 116 },
    { hips: [-64, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [24, 0, 0], lArm: [-138, 18, -26], lFore: [0, -36, -14], rArm: [-138, -18, 26], rFore: [0, 36, 14], lThigh: [-18, -14, 14], lKnee: 24, rThigh: [-18, 14, -14], rKnee: 24 }, [0, 0, -0.14], Math.PI
  ),
  makeCouplePreset('couple-bdsm-hogtie-prone-arch', '78. 백바운드 프론 딥아치 홀드', 'couple_bondage_rp',
    '엎드린 여성의 양팔을 등 뒤로 결박하여 가슴을 젖혀 올리고 남성이 후면에서 무릎으로 고정하는 구도',
    { hips: [48, 0, 0], spine: [-28, 0, 0], spine1: [-26, 0, 0], head: [-28, 12, 0], lArm: [42, 22, -24], lFore: [0, -76, -32], rArm: [42, -22, 24], rFore: [0, 76, 32], lThigh: [-16, -20, 20], lKnee: 42, rThigh: [-16, 20, -20], rKnee: 42 },
    { hips: [24, 0, 0], spine: [8, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-44, 16, -40], lFore: [0, -58, -24], rArm: [-44, -16, 40], rFore: [0, 58, 24], lThigh: [-24, -18, 18], lKnee: 96, rThigh: [-24, 18, -18], rKnee: 96 }, [0, 0, -0.34], 0
  ),
  makeCouplePreset('couple-bdsm-spreader-bar-kneel', '79. 와이드 스프레더 닐링 백홀드', 'couple_bondage_rp',
    '무릎을 넓게 벌려 고정된 여성이 상체를 세우고 남성이 뒤에서 목과 가슴을 감싸 조이는 구속 체위',
    { hips: [16, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-20, 14, 0], lArm: [28, 20, -28], lFore: [0, -68, -28], rArm: [28, -20, 28], rFore: [0, 68, 28], lThigh: [-32, -36, 36], lKnee: 114, rThigh: [-32, 36, -36], rKnee: 114 },
    { hips: [8, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [14, -10, 0], lArm: [-46, 20, -38], lFore: [0, -72, -30], rArm: [-36, -18, 44], rFore: [0, 64, 26], lThigh: [-24, -18, 18], lKnee: 110, rThigh: [-24, 18, -18], rKnee: 110 }, [0, 0, -0.34], 0
  ),
  makeCouplePreset('couple-bdsm-peg-strapon-rear', '80. 롤리버설 스트랩온 후면 도미네이션', 'couple_bondage_rp',
    '남성이 무릎과 손을 짚고 숙인 자세를 취하고 여성이 후면에서 허리를 잡고 리드하는 롤리버설(페깅) 구도',
    { hips: [10, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [12, 0, 0], lArm: [-38, 16, -42], lFore: [0, -56, -24], rArm: [-38, -16, 42], rFore: [0, 56, 24], lThigh: [-22, -16, 16], lKnee: 106, rThigh: [-22, 16, -16], rKnee: 106 },
    { hips: [52, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-20, 10, 0], lArm: [-58, 12, -36], lFore: [0, -32, -14], rArm: [-58, -12, 36], rFore: [0, 32, 14], lThigh: [-24, -18, 18], lKnee: 106, rThigh: [-24, 18, -18], rKnee: 106 }, [0, 0, 0.36], 0
  ),

  // =========================================================================
  // B-9. 특수 가구 · 러브스윙 · 폴댄스 · 오피스 (couple_furniture_special: 10종, 81~90)
  // =========================================================================
  makeCouplePreset('couple-furn-love-swing-push', '81. 천장 러브스윙 서스펜션 푸시', 'couple_furniture_special',
    '천장 러브스윙 해먹에 앉아 공중에 뜬 여성이 양다리를 벌려 올리고 남성이 서서 스윙을 잡고 밀착하는 체위',
    { hipPos: [0, 1.16, 0], hips: [-38, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [14, 0, 0], lArm: [-48, 22, -36], lFore: [0, -52, -22], rArm: [-48, -22, 36], rFore: [0, 52, 22], lThigh: [-88, -34, 34], lKnee: 64, rThigh: [-88, 34, -34], rKnee: 64 },
    { hips: [8, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, 0, 0], lArm: [-44, 18, -40], lFore: [0, -58, -24], rArm: [-44, -18, 40], rFore: [0, 58, 24], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 }, [0, 0, 0.24], Math.PI
  ),
  makeCouplePreset('couple-furn-pole-climb-wrap', '82. 폴댄스 스테이지 클라임 랩', 'couple_furniture_special',
    '크롬 폴 기둥을 한 손으로 잡고 몸을 아치로 젖힌 여성과 뒤에서 허벅지를 받쳐 올리는 남성의 스테이지 체위',
    { hipPos: [0, 1.08, 0], hips: [14, -10, 6], spine: [-18, 8, -4], spine1: [-16, 6, 0], head: [-16, 14, 0], lArm: [-136, 14, -24], lFore: [0, -28, -12], rArm: [-32, 16, 46], rFore: [0, 56, 24], lThigh: [-82, -26, 26], lKnee: 88, rThigh: [-18, 12, -12], rKnee: 24 },
    { hips: [-6, 6, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, -8, 0], lArm: [-46, 20, -40], lFore: [0, -68, -28], rArm: [-46, -20, 40], rFore: [0, 68, 28], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 }, [0, 0, -0.24], 0
  ),
  makeCouplePreset('couple-furn-sybian-assist-behind', '83. 전동 새들 라이딩 & 후면 어시스트', 'couple_furniture_special',
    '전동 새들 라이딩 머신 위에 올라타 허리를 아치로 젖힌 여성과 뒤에서 가슴과 목을 감싸 안는 남성의 구도',
    { hips: [16, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-22, 12, 0], lArm: [-36, 14, -44], lFore: [0, -54, -22], rArm: [-36, -14, 44], rFore: [0, 54, 22], lThigh: [-48, -32, 32], lKnee: 114, rThigh: [-48, 32, -32], rKnee: 114 },
    { hips: [8, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-42, 20, -40], lFore: [0, -68, -28], rArm: [-42, -20, 40], rFore: [0, 68, 28], lThigh: [-24, -18, 18], lKnee: 108, rThigh: [-24, 18, -18], rKnee: 108 }, [0, 0, -0.32], 0
  ),
  makeCouplePreset('couple-furn-ceo-desk-recline', '84. CEO 데스크 엣지 리클라인 프레스', 'couple_furniture_special',
    '데스크 책상 가장자리에 걸터앉아 상체를 뒤로 젖힌 여성과 다리 사이로 서서 밀착하는 오피스 체위',
    { hipPos: [0, 1.06, 0], hips: [-34, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [14, 0, 0], lArm: [24, -14, -44], lFore: [0, -28, -12], rArm: [24, 14, 44], rFore: [0, 28, 12], lThigh: [-84, -30, 30], lKnee: 76, rThigh: [-84, 30, -30], rKnee: 76 },
    { hips: [10, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [14, 0, 0], lArm: [-44, 18, -40], lFore: [0, -56, -24], rArm: [-44, -18, 40], rFore: [0, 56, 24], lThigh: [-14, -12, 12], lKnee: 18, rThigh: [-14, 12, -12], rKnee: 18 }, [0, 0, 0.24], Math.PI
  ),
  makeCouplePreset('couple-furn-tantra-chaise-deep', '85. S-커브 탄트라 러브체어 딥아치', 'couple_furniture_special',
    '탄트라 러브체어의 S자 곡선에 허리를 대고 아치를 만든 여성과 곡선 상단에서 무릎 꿇고 밀착하는 체위',
    { hips: [-38, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-18, 0, 0], lArm: [22, -16, -46], lFore: [0, -38, -16], rArm: [22, 16, 46], rFore: [0, 38, 16], lThigh: [-88, -28, 28], lKnee: 84, rThigh: [-88, 28, -28], rKnee: 84 },
    { hips: [26, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [16, 0, 0], lArm: [-48, 16, -38], lFore: [0, -52, -22], rArm: [-48, -16, 38], rFore: [0, 52, 22], lThigh: [-28, -16, 16], lKnee: 104, rThigh: [-28, 16, -16], rKnee: 104 }, [0, 0, -0.08], Math.PI
  ),
  makeCouplePreset('couple-furn-vanity-mirror-bend', '86. 조명 화장대 미러 페이스다운 후면', 'couple_furniture_special',
    '화장대 테이블을 짚고 거울을 바라보며 골반을 높게 뺀 여성과 후면에서 기립 밀착하는 백스테이지 체위',
    { hips: [44, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 6, 0], lArm: [-48, 12, -40], lFore: [0, -34, -14], rArm: [-48, -12, 40], rFore: [0, 34, 14], lThigh: [-14, -16, 16], lKnee: 22, rThigh: [-14, 16, -16], rKnee: 22 },
    { hips: [10, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -6, 0], lArm: [-38, 18, -42], lFore: [0, -62, -26], rArm: [-38, -18, 42], rFore: [0, 62, 26], lThigh: [-12, -12, 12], lKnee: 18, rThigh: [-12, 12, -12], rKnee: 18 }, [0, 0, -0.28], 0
  ),
  makeCouplePreset('couple-furn-limo-seat-reverse', '87. VIP 리무진 시트 리버스 랩바운스', 'couple_furniture_special',
    '리무진 가죽 시트에 기대앉은 남성 위로 여성이 정면을 향해 무릎을 세우고 앉는 리버스 랩시팅',
    { hips: [20, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-10, 8, 0], lArm: [18, -14, -46], lFore: [0, -48, -20], rArm: [18, 14, 46], rFore: [0, 48, 20], lThigh: [-88, -30, 30], lKnee: 98, rThigh: [-88, 30, -30], rKnee: 98 },
    { hips: [-22, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [14, 0, 0], lArm: [-28, 18, -46], lFore: [0, -56, -24], rArm: [-28, -18, 46], rFore: [0, 56, 24], lThigh: [-78, -20, 20], lKnee: 88, rThigh: [-78, 20, -20], rKnee: 88 }, [0, 0, -0.14], 0
  ),
  makeCouplePreset('couple-furn-jacuzzi-edge-sit', '88. 자쿠지 욕조 엣지 워터 스트래들', 'couple_furniture_special',
    '욕조 가장자리에 걸터앉은 남성과 양다리로 허리를 감싸 안고 상체를 밀착한 스파 배스 체위',
    { hips: [10, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [-12, 8, 0], lArm: [-54, 20, -36], lFore: [0, -68, -28], rArm: [-54, -20, 36], rFore: [0, 68, 28], lThigh: [-84, -30, 30], lKnee: 102, rThigh: [-84, 30, -30], rKnee: 102 },
    { hips: [-14, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [12, -8, 0], lArm: [-38, 20, -42], lFore: [0, -64, -26], rArm: [-38, -20, 42], rFore: [0, 64, 26], lThigh: [-82, -20, 20], lKnee: 88, rThigh: [-82, 20, -20], rKnee: 88 }, [0, 0, 0.08], Math.PI
  ),
  makeCouplePreset('couple-furn-pilates-reformer-split', '89. 필라테스 리포머 캐리지 런지 도킹', 'couple_furniture_special',
    '리포머 기구 위에 한쪽 무릎을 올리고 런지 스트레칭을 한 여성과 후면에서 밀착하는 스튜디오 체위',
    { hips: [24, -8, 4], spine: [-18, 6, 0], spine1: [-16, 4, 0], head: [-16, 12, 0], lArm: [-44, 14, -40], lFore: [0, -38, -16], rArm: [-44, -14, 40], rFore: [0, 38, 16], lThigh: [-76, -16, 16], lKnee: 86, rThigh: [14, 12, -12], rKnee: 16 },
    { hips: [10, 6, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-38, 18, -42], lFore: [0, -62, -26], rArm: [-38, -18, 42], rFore: [0, 62, 26], lThigh: [-16, -12, 12], lKnee: 22, rThigh: [-10, 12, -12], rKnee: 14 }, [0, 0, -0.26], 0
  ),
  makeCouplePreset('couple-furn-kitchen-counter-arch', '90. 아일랜드 바 카운터 딥백아치', 'couple_furniture_special',
    '아일랜드 식탁 위에 등을 대고 누워 골반을 카운터 끝에 걸친 여성과 기립 밀착하는 다이닝 체위',
    { hipPos: [0, 1.08, 0], hips: [-46, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [16, 0, 0], lArm: [-124, 18, -28], lFore: [0, -36, -14], rArm: [-124, -18, 28], rFore: [0, 36, 14], lThigh: [-94, -32, 32], lKnee: 82, rThigh: [-94, 32, -32], rKnee: 82 },
    { hips: [12, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [14, 0, 0], lArm: [-46, 18, -40], lFore: [0, -58, -24], rArm: [-46, -18, 40], rFore: [0, 58, 24], lThigh: [-14, -12, 12], lKnee: 18, rThigh: [-14, 12, -12], rKnee: 18 }, [0, 0, 0.24], Math.PI
  ),

  // =========================================================================
  // B-10. 전희 · 69 · 바디워십 · 스페셜 플레이 (couple_oral_foreplay: 10종, 91~100)
  // =========================================================================
  makeCouplePreset('couple-special-top-69-straddle', '91. 베드 온탑 69 크로스 아치', 'couple_oral_foreplay',
    '누운 남성 위로 여성이 역방향(180도 교차)으로 엎드려 서로 교차 밀착하는 온탑 69 체위',
    { hips: [48, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-22, 0, 0], lArm: [-58, 16, -36], lFore: [0, -48, -20], rArm: [-58, -16, 36], rFore: [0, 48, 20], lThigh: [-28, -26, 26], lKnee: 108, rThigh: [-28, 26, -26], rKnee: 108 },
    { hips: [-62, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [22, 0, 0], lArm: [-38, 18, -42], lFore: [0, -58, -24], rArm: [-38, -18, 42], rFore: [0, 58, 24], lThigh: [-24, -18, 18], lKnee: 36, rThigh: [-24, 18, -18], rKnee: 36 }, [0, 0, 0.12], 0
  ),
  makeCouplePreset('couple-special-side-69-scissors', '92. 사이드 라잉 69 시저스 밀착', 'couple_oral_foreplay',
    '남녀가 옆으로 누워 상하 교차 방향으로 서로의 허리와 허벅지를 감싸 안는 사이드 69 체위',
    { hips: [10, 0, 74], spine: [6, 0, 4], spine1: [6, 0, 0], head: [12, -14, 0], lArm: [-38, 16, -42], lFore: [0, -56, -24], rArm: [-28, -14, 48], rFore: [0, 52, 22], lThigh: [-48, -18, 18], lKnee: 68, rThigh: [-24, 14, -14], rKnee: 42 },
    { hips: [10, 0, -74], spine: [6, 0, -4], spine1: [6, 0, 0], head: [12, 14, 0], lArm: [-28, 14, -48], lFore: [0, -52, -22], rArm: [-38, -16, 42], rFore: [0, 56, 24], lThigh: [-24, -14, 14], lKnee: 42, rThigh: [-48, 18, -18], rKnee: 68 }, [0.18, 0, 0.14], Math.PI
  ),
  makeCouplePreset('couple-special-standing-kneel-front', '93. 스탠딩 & 닐링 프론트 포플레이', 'couple_oral_foreplay',
    '기립한 남성 앞에 여성이 무릎을 꿇고 앉아 상체를 아치로 세우며 허벅지를 감싸는 전희 구도',
    { hips: [22, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-24, 0, 0], lArm: [-44, 18, -40], lFore: [0, -54, -22], rArm: [-44, -18, 40], rFore: [0, 54, 22], lThigh: [-28, -22, 22], lKnee: 116, rThigh: [-28, 22, -22], rKnee: 116 },
    { hips: [-6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [22, 0, 0], lArm: [-24, 14, -48], lFore: [0, -44, -18], rArm: [-24, -14, 48], rFore: [0, 44, 18], lThigh: [-8, -12, 12], lKnee: 12, rThigh: [-8, 12, -12], rKnee: 12 }, [0, 0, 0.28], Math.PI
  ),
  makeCouplePreset('couple-special-recline-kneel-between', '94. 리클라인 와이드 & 닐링 케어', 'couple_oral_foreplay',
    '침대에 기대어 양다리를 넓게 벌린 여성과 다리 사이에 무릎을 꿇고 상체를 숙여 밀착하는 남성의 전희 구도',
    { hips: [-48, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [18, 0, 0], lArm: [20, -16, -46], lFore: [0, -36, -14], rArm: [20, 16, 46], rFore: [0, 36, 14], lThigh: [-82, -36, 36], lKnee: 88, rThigh: [-82, 36, -36], rKnee: 88 },
    { hips: [44, 0, 0], spine: [18, 0, 0], spine1: [16, 0, 0], head: [-16, 0, 0], lArm: [-52, 18, -38], lFore: [0, -48, -20], rArm: [-52, -18, 38], rFore: [0, 48, 20], lThigh: [-28, -18, 18], lKnee: 110, rThigh: [-28, 18, -18], rKnee: 110 }, [0, 0, 0.24], Math.PI
  ),
  makeCouplePreset('couple-special-chair-sit-kneel-care', '95. 암체어 착석 & 닐링 레그 프롭', 'couple_oral_foreplay',
    '의자에 앉아 한쪽 다리를 높게 걸친 여성과 바닥에 무릎을 꿇고 골반에 밀착하는 남성의 라운지 전희 구도',
    { hips: [-14, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [14, 0, 0], lArm: [18, -14, -46], lFore: [0, -42, -18], rArm: [18, 14, 46], rFore: [0, 42, 18], lThigh: [-94, -32, 32], lKnee: 78, rThigh: [-78, 28, -28], rKnee: 88 },
    { hips: [36, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [-14, 0, 0], lArm: [-48, 18, -38], lFore: [0, -52, -22], rArm: [-48, -18, 38], rFore: [0, 52, 22], lThigh: [-28, -16, 16], lKnee: 112, rThigh: [-28, 16, -16], rKnee: 112 }, [0, 0, 0.34], Math.PI
  ),
  makeCouplePreset('couple-special-cat-arch-rim-care', '96. 딥 캣아치 & 후면 닐링 케어', 'couple_oral_foreplay',
    '가슴을 바닥에 붙이고 둔부를 높게 세운 여성의 후면에서 남성이 무릎을 꿇고 골반을 감싸는 전희 구도',
    { hips: [66, 0, 0], spine: [-28, 0, 0], spine1: [-26, 0, 0], head: [-30, 12, 0], lArm: [-70, 14, -32], lFore: [0, -64, -26], rArm: [-70, -14, 32], rFore: [0, 64, 26], lThigh: [-18, -20, 20], lKnee: 104, rThigh: [-18, 20, -20], rKnee: 104 },
    { hips: [42, 0, 0], spine: [16, 0, 0], spine1: [14, 0, 0], head: [-18, 0, 0], lArm: [-52, 18, -38], lFore: [0, -54, -22], rArm: [-52, -18, 38], rFore: [0, 54, 22], lThigh: [-28, -18, 18], lKnee: 112, rThigh: [-28, 18, -18], rKnee: 112 }, [0, 0, -0.44], 0
  ),
  makeCouplePreset('couple-special-toy-assist-behind', '97. 후면 백허그 & 셀프 토이 어시스트', 'couple_oral_foreplay',
    '남성이 뒤에서 여성의 상체를 감싸 안고 여성이 다리를 넓게 벌린 채 손으로 기구를 컨트롤하는 듀오 플레이',
    { hips: [-16, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [-14, 14, 0], lArm: [-42, 18, -40], lFore: [0, -68, -28], rArm: [-28, -24, 32], rFore: [0, 64, 26], lThigh: [-76, -34, 34], lKnee: 92, rThigh: [-76, 34, -34], rKnee: 92 },
    { hips: [-18, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [14, -10, 0], lArm: [-44, 20, -40], lFore: [0, -68, -28], rArm: [-44, -20, 40], rFore: [0, 68, 28], lThigh: [-68, -28, 28], lKnee: 88, rThigh: [-68, 28, -28], rKnee: 88 }, [0, 0, -0.18], 0
  ),
  makeCouplePreset('couple-special-standing-neck-kiss-touch', '98. 기립 백아치 넥키스 & 딥터치', 'couple_oral_foreplay',
    '기립 상태에서 남성이 뒤에서 목덜미에 입을 맞추며 한 손으로 골반을 감싸는 고밀도 전희 구도',
    { hips: [14, -8, 4], spine: [-16, 6, 0], spine1: [-14, 4, 0], head: [-20, 22, -8], lArm: [-48, 18, -38], lFore: [0, -68, -28], rArm: [14, 14, 48], rFore: [0, 52, 22], lThigh: [-16, -16, 16], lKnee: 24, rThigh: [-6, 12, -12], rKnee: 10 },
    { hips: [4, 6, 0], spine: [8, 0, 0], spine1: [10, 0, 0], head: [16, -14, 0], lArm: [-46, 20, -40], lFore: [0, -72, -30], rArm: [-28, -24, 36], rFore: [0, 64, 26], lThigh: [-10, -10, 10], lKnee: 14, rThigh: [-10, 10, -10], rKnee: 14 }, [0.02, 0, -0.22], 0
  ),
  makeCouplePreset('couple-special-chest-slide-arch', '99. 베드 온탑 체스트 슬라이드 티징', 'couple_oral_foreplay',
    '누운 남성 위에서 여성이 상체를 낮추어 가슴을 밀착시키고 골반을 높게 세우는 티징 아치 구도',
    { hips: [38, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-18, 0, 0], lArm: [-54, 14, -38], lFore: [0, -44, -18], rArm: [-54, -14, 38], rFore: [0, 44, 18], lThigh: [-32, -26, 26], lKnee: 112, rThigh: [-32, 26, -26], rKnee: 112 },
    { hips: [-60, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-36, 16, -44], lFore: [0, -58, -24], rArm: [-36, -16, 44], rFore: [0, 58, 24], lThigh: [-20, -14, 14], lKnee: 28, rThigh: [-20, 14, -14], rKnee: 28 }, [0, 0, -0.16], Math.PI
  ),
  makeCouplePreset('couple-special-afterglow-spoon-cradle', '100. 딥 스푼 클로즈 크래들 홀드', 'couple_oral_foreplay',
    '측면에서 남성이 여성의 전신을 깊게 감싸 안고 다리를 겹쳐 밀착하는 딥 스푼 크래들 구도',
    { hips: [12, 0, 68], spine: [-8, 0, 6], spine1: [-8, 0, 4], head: [-8, 16, 0], lArm: [-32, 14, -44], lFore: [0, -62, -26], rArm: [-18, -10, 52], rFore: [0, 48, 20], lThigh: [-62, -16, 16], lKnee: 84, rThigh: [-34, 10, -10], rKnee: 52 },
    { hips: [8, 0, 68], spine: [6, 0, 4], spine1: [6, 0, 4], head: [12, -10, 0], lArm: [-42, 18, -40], lFore: [0, -68, -28], rArm: [-38, -18, 42], rFore: [0, 66, 28], lThigh: [-54, -14, 14], lKnee: 76, rThigh: [-32, 10, -10], rKnee: 48 }, [-0.08, 0, -0.2], 0
  ),
];

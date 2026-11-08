import { PosePreset } from '@/types';
import { makeCouplePreset } from './couplePoseBuilder';

// 신규 30종 추가 커플 체위 (101번 ~ 130번: 소파·코너·볼스터·익스트림 파워리프트)
export const COUPLE_LOUNGE_AND_PASSION_PRESETS: PosePreset[] = [
  // B-11. 소파 · 코너 · 딥트위스트 (couple_lounge_corner: 10종, 101~110)
  makeCouplePreset('couple-lounge-101-corner-deep-hug', '101. 소파 코너 대면 딥랩 허그', 'couple_lounge_corner',
    '소파 코너에 기대앉은 남성의 품으로 여성이 깊게 파고들어 양다리를 허리에 감는 코너 밀착 체위',
    { hips: [12, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [12, 0, 0], lArm: [-58, 22, -34], lFore: [0, -72, -28], rArm: [-58, -22, 34], rFore: [0, 72, 28], lThigh: [-84, -32, 32], lKnee: 104, rThigh: [-84, 32, -32], rKnee: 104 },
    { hips: [-18, 0, 0], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [10, 0, 0], lArm: [-36, 20, -42], lFore: [0, -64, -26], rArm: [-36, -20, 42], rFore: [0, 64, 26], lThigh: [-76, -20, 20], lKnee: 86, rThigh: [-76, 20, -20], rKnee: 86 },
    [0, 0, 0.2], Math.PI, [0, 0.24, 0]
  ),
  makeCouplePreset('couple-lounge-102-armrest-leghook', '102. 소파 팔걸이 원레그훅 대면', 'couple_lounge_corner',
    '소파에 기대어 한쪽 다리를 팔걸이 위로 높게 걸친 여성과 앞에서 무릎 꿇고 진입하는 라운지 체위',
    { hips: [-34, 8, -6], spine: [-14, -6, 4], spine1: [-10, -4, 0], head: [16, 8, 0], lArm: [18, -14, -46], lFore: [0, -40, -16], rArm: [-32, 16, 44], rFore: [0, 56, 24], lThigh: [-104, -34, 34], lKnee: 64, rThigh: [-68, 20, -20], rKnee: 84 },
    { hips: [24, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, 0, 0], lArm: [-46, 18, -38], lFore: [0, -54, -22], rArm: [-46, -18, 38], rFore: [0, 54, 22], lThigh: [-28, -16, 16], lKnee: 104, rThigh: [-28, 16, -16], rKnee: 104 },
    [0, 0, 0.3], Math.PI, [0, 0.14, 0]
  ),
  makeCouplePreset('couple-lounge-103-recliner-backarch', '103. 리클라이너 리버스 하이 백아치', 'couple_lounge_corner',
    '리클라이너에 누운 남성 위로 여성이 역방향으로 앉아 상체를 뒤로 깊게 젖히는 하이아치 체위',
    { hips: [-14, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-24, 0, 0], lArm: [24, -14, -44], lFore: [0, -34, -14], rArm: [24, 14, 44], rFore: [0, 34, 14], lThigh: [-72, -30, 30], lKnee: 98, rThigh: [-72, 30, -30], rKnee: 98 },
    { hips: [-34, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [16, 0, 0], lArm: [-32, 18, -44], lFore: [0, -58, -24], rArm: [-32, -18, 44], rFore: [0, 58, 24], lThigh: [-64, -20, 20], lKnee: 78, rThigh: [-64, 20, -20], rKnee: 78 },
    [0, 0, -0.14], 0, [0, 0.2, 0]
  ),
  makeCouplePreset('couple-lounge-104-couch-backrest-drape', '104. 소파 등받이 오버더백 도기', 'couple_lounge_corner',
    '여성이 소파 등받이 너머로 상체를 숙이고 무릎을 시트에 꿇은 상태에서 남성이 뒤에서 서서 밀착하는 체위',
    { hips: [52, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-22, 10, 0], lArm: [-58, 14, -36], lFore: [0, -44, -18], rArm: [-58, -14, 36], rFore: [0, 44, 18], lThigh: [-24, -18, 18], lKnee: 106, rThigh: [-24, 18, -18], rKnee: 106 },
    { hips: [10, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, 0, 0], lArm: [-38, 18, -42], lFore: [0, -58, -24], rArm: [-38, -18, 42], rFore: [0, 58, 24], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 },
    [0, 0, -0.3], 0, [0, 0.34, 0]
  ),
  makeCouplePreset('couple-lounge-105-daybed-twist-straddle', '105. 데이베드 사이드 트위스트 라이딩', 'couple_lounge_corner',
    '데이베드에 누운 남성 위에서 여성이 골반과 상체를 45도 비틀어 측면 실루엣을 살리는 트위스트 온탑',
    { hips: [14, 28, -6], spine: [-16, -18, 6], spine1: [-14, -14, 0], head: [-8, -16, 0], lArm: [-36, 16, -42], lFore: [0, -52, -22], rArm: [18, 14, 46], rFore: [0, 42, 18], lThigh: [-52, -28, 28], lKnee: 112, rThigh: [-44, 24, -24], rKnee: 114 },
    { hips: [-58, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-34, 16, -44], lFore: [0, -56, -24], rArm: [-34, -16, 44], rFore: [0, 56, 24], lThigh: [-22, -14, 14], lKnee: 28, rThigh: [-22, 14, -14], rKnee: 28 },
    [0, 0, 0.12], Math.PI, [0, 0.14, 0]
  ),
  makeCouplePreset('couple-lounge-106-ottoman-bridge-press', '106. 라운드 오토만 골반 브릿지 프레스', 'couple_lounge_corner',
    '오토만 위에 등과 어깨를 기대고 골반을 띄운 여성에게 남성이 무릎을 꿇고 정면으로 밀착하는 체위',
    { hips: [-38, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [16, 0, 0], lArm: [20, -14, -46], lFore: [0, -36, -14], rArm: [20, 14, 46], rFore: [0, 36, 14], lThigh: [-84, -30, 30], lKnee: 88, rThigh: [-84, 30, -30], rKnee: 88 },
    { hips: [24, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, 0, 0], lArm: [-46, 16, -38], lFore: [0, -52, -22], rArm: [-46, -16, 38], rFore: [0, 52, 22], lThigh: [-26, -16, 16], lKnee: 104, rThigh: [-26, 16, -16], rKnee: 104 },
    [0, 0, 0.28], Math.PI, [0, 0.16, 0]
  ),
  makeCouplePreset('couple-lounge-107-window-sill-arch', '107. 통유리 창가 하이아치 스탠딩', 'couple_lounge_corner',
    '창가 프레임에 양손을 높게 짚고 허리를 S자로 휜 여성과 뒤에서 허벅지를 밀착하는 스탠딩 구도',
    { hips: [34, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-20, 14, 0], lArm: [-78, 14, -32], lFore: [0, -28, -12], rArm: [-78, -14, 32], rFore: [0, 28, 12], lThigh: [-14, -16, 16], lKnee: 22, rThigh: [-6, 14, -14], rKnee: 12 },
    { hips: [10, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-40, 18, -42], lFore: [0, -62, -26], rArm: [-40, -18, 42], rFore: [0, 62, 26], lThigh: [-14, -12, 12], lKnee: 18, rThigh: [-14, 12, -12], rKnee: 18 },
    [0, 0, -0.26], 0
  ),
  makeCouplePreset('couple-lounge-108-cross-leg-lap-kiss', '108. 라운지 체어 사이드 랩키스', 'couple_lounge_corner',
    '의자에 앉은 남성의 무릎 위에 여성이 옆으로 걸터앉아 목을 감싸고 입을 맞추는 로맨틱 라운지 체위',
    { hips: [-6, 36, -8], spine: [-10, -22, 6], spine1: [-8, -18, 0], head: [8, -22, 0], lArm: [-54, 20, -36], lFore: [0, -68, -28], rArm: [-28, -14, 46], rFore: [0, 52, 22], lThigh: [-78, -18, 18], lKnee: 86, rThigh: [-72, 14, -14], rKnee: 82 },
    { hips: [-10, -10, 0], spine: [6, 8, 0], spine1: [6, 6, 0], head: [10, 14, 0], lArm: [-36, 18, -42], lFore: [0, -60, -24], rArm: [-38, -18, 42], rFore: [0, 64, 26], lThigh: [-80, -16, 16], lKnee: 86, rThigh: [-80, 16, -16], rKnee: 86 },
    [0.06, 0, -0.12], 0, [-0.04, 0.24, 0]
  ),
  makeCouplePreset('couple-lounge-109-sofa-kneel-face-embrace', '109. 소파 시트 더블 닐링 대면 밀착', 'couple_lounge_corner',
    '소파 위에서 남녀가 마주 무릎을 꿇고 허리와 등 라인을 깊게 끌어안는 대면 닐링 체위',
    { hips: [12, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [-14, 8, 0], lArm: [-56, 20, -36], lFore: [0, -68, -28], rArm: [-56, -20, 36], rFore: [0, 68, 28], lThigh: [-28, -22, 22], lKnee: 112, rThigh: [-28, 22, -22], rKnee: 112 },
    { hips: [-6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-38, 20, -42], lFore: [0, -66, -28], rArm: [-38, -20, 42], rFore: [0, 66, 28], lThigh: [-24, -18, 18], lKnee: 110, rThigh: [-24, 18, -18], rKnee: 110 },
    [0, 0, 0.24], Math.PI
  ),
  makeCouplePreset('couple-lounge-110-table-edge-oneleg-up', '110. 다이닝 테이블 원레그업 스탠딩', 'couple_lounge_corner',
    '테이블에 엉덩이를 기대고 한쪽 다리를 남성의 어깨 위로 높이 올린 다이닝 라운지 체위',
    { hips: [-18, -8, 6], spine: [-12, 6, 0], spine1: [-10, 4, 0], head: [10, -8, 0], lArm: [-48, 18, -38], lFore: [0, -58, -24], rArm: [18, 14, 46], rFore: [0, 38, 16], lThigh: [-118, -22, 22], lKnee: 18, rThigh: [-64, 18, -18], rKnee: 78 },
    { hips: [8, 6, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [14, 6, 0], lArm: [-44, 18, -40], lFore: [0, -60, -24], rArm: [-36, -18, 44], rFore: [0, 56, 24], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-10, 12, -12], rKnee: 14 },
    [0, 0, 0.28], Math.PI, [0, 0.34, 0]
  ),

  // B-12. 볼스터 · 웻지 쿠션 · 하이앵글 (couple_cushion_arch: 10종, 111~120)
  makeCouplePreset('couple-cushion-111-bolster-hip-lift', '111. 볼스터 쿠션 골반 업 대면 프레스', 'couple_cushion_arch',
    '원통 볼스터 쿠션을 허리 아래에 받쳐 골반을 높게 띄운 여성과 위에서 깊게 밀착하는 체위',
    { hips: [-64, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [22, 0, 0], lArm: [-46, 18, -38], lFore: [0, -62, -26], rArm: [-46, -18, 38], rFore: [0, 62, 26], lThigh: [-94, -32, 32], lKnee: 78, rThigh: [-94, 32, -32], rKnee: 78 },
    { hips: [34, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [16, 0, 0], lArm: [-52, 16, -38], lFore: [0, -46, -20], rArm: [-52, -16, 38], rFore: [0, 46, 20], lThigh: [-26, -16, 16], lKnee: 102, rThigh: [-26, 16, -16], rKnee: 102 },
    [0, 0, 0.3], Math.PI, [0, 0.1, 0]
  ),
  makeCouplePreset('couple-cushion-112-wedge-deep-cat-arch', '112. 웻지 쿠션 하이앵글 캣아치', 'couple_cushion_arch',
    '삼각 웻지 쿠션 위에 가슴을 대고 골반을 극대화해 세운 여성과 후면에서 밀착하는 하이앵글 체위',
    { hips: [66, 0, 0], spine: [-28, 0, 0], spine1: [-26, 0, 0], head: [-30, 14, 0], lArm: [-66, 14, -32], lFore: [0, -62, -26], rArm: [-66, -14, 32], rFore: [0, 62, 26], lThigh: [-18, -22, 22], lKnee: 104, rThigh: [-18, 22, -22], rKnee: 104 },
    { hips: [16, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-40, 16, -42], lFore: [0, -54, -22], rArm: [-40, -16, 42], rFore: [0, 54, 22], lThigh: [-24, -16, 16], lKnee: 108, rThigh: [-24, 16, -16], rKnee: 108 },
    [0, 0, -0.34], 0, [0, 0.08, 0]
  ),
  makeCouplePreset('couple-cushion-113-double-pillow-prone', '113. 더블 필로우 프론 엘리베이션', 'couple_cushion_arch',
    '배 아래에 쿠션을 겹쳐 깔아 둔부를 높인 엎드린 여성과 위에서 무릎으로 감싸는 프론 체위',
    { hips: [54, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 16, 0], lArm: [-62, 16, -34], lFore: [0, -68, -28], rArm: [-62, -16, 34], rFore: [0, 68, 28], lThigh: [-12, -18, 18], lKnee: 26, rThigh: [-12, 18, -18], rKnee: 26 },
    { hips: [36, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [16, -8, 0], lArm: [-52, 14, -38], lFore: [0, -40, -16], rArm: [-52, -14, 38], rFore: [0, 40, 16], lThigh: [-22, -18, 18], lKnee: 84, rThigh: [-22, 18, -18], rKnee: 84 },
    [0, 0.08, -0.3], 0
  ),
  makeCouplePreset('couple-cushion-114-bolster-straddle-hug', '114. 볼스터 스트래들 후면 백허그', 'couple_cushion_arch',
    '볼스터 쿠션 위에 다리를 벌려 앉은 여성을 남성이 뒤에서 무릎 꿇고 감싸 안는 구도',
    { hips: [18, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-16, 12, 0], lArm: [18, -14, -46], lFore: [0, -52, -22], rArm: [18, 14, 46], rFore: [0, 52, 22], lThigh: [-44, -30, 30], lKnee: 114, rThigh: [-44, 30, -30], rKnee: 114 },
    { hips: [8, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [14, -10, 0], lArm: [-42, 20, -40], lFore: [0, -68, -28], rArm: [-42, -20, 40], rFore: [0, 68, 28], lThigh: [-26, -18, 18], lKnee: 110, rThigh: [-26, 18, -18], rKnee: 110 },
    [0, 0, -0.28], 0, [0, 0.08, 0]
  ),
  makeCouplePreset('couple-cushion-115-wedge-recline-high-v', '115. 웻지 리클라인 하이 V-스플릿', 'couple_cushion_arch',
    '웻지 쿠션에 등을 기대고 양다리를 V자로 높게 벌려 올린 여성과 정면에서 잡아 지지하는 남성',
    { hips: [-52, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [18, 0, 0], lArm: [18, -14, -46], lFore: [0, -36, -14], rArm: [18, 14, 46], rFore: [0, 36, 14], lThigh: [-112, -34, 34], lKnee: 10, rThigh: [-112, 34, -34], rKnee: 10 },
    { hips: [18, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, 0, 0], lArm: [-46, 18, -40], lFore: [0, -56, -24], rArm: [-46, -18, 40], rFore: [0, 56, 24], lThigh: [-26, -16, 16], lKnee: 106, rThigh: [-26, 16, -16], rKnee: 106 },
    [0, 0, 0.34], Math.PI
  ),
  makeCouplePreset('couple-cushion-116-cushion-kneel-swan', '116. 쿠션 서포트 닐링 스완 아치', 'couple_cushion_arch',
    '쿠션 위에 무릎을 꿇은 여성이 상체를 백조처럼 젖히고 남성이 뒤에서 허리를 받쳐주는 체위',
    { hips: [-12, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 8, 0], lArm: [28, -16, -40], lFore: [0, -44, -18], rArm: [28, 16, 40], rFore: [0, 44, 18], lThigh: [-28, -22, 22], lKnee: 114, rThigh: [-28, 22, -22], rKnee: 114 },
    { hips: [8, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [12, -8, 0], lArm: [-40, 20, -40], lFore: [0, -66, -28], rArm: [-40, -20, 40], rFore: [0, 66, 28], lThigh: [-24, -18, 18], lKnee: 110, rThigh: [-24, 18, -18], rKnee: 110 },
    [0, 0, -0.28], 0
  ),
  makeCouplePreset('couple-cushion-117-bolster-side-lift', '117. 볼스터 사이드 라잉 레그리프트', 'couple_cushion_arch',
    '볼스터 쿠션을 안고 옆으로 누운 여성의 위쪽 다리를 남성이 뒤에서 높게 들어 올리는 측면 체위',
    { hips: [-14, 12, -60], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [-6, 14, 0], lArm: [-42, 16, -40], lFore: [0, -62, -26], rArm: [14, 12, 48], rFore: [0, 46, 20], lThigh: [-94, -30, 30], lKnee: 48, rThigh: [-42, 10, -10], rKnee: 56 },
    { hips: [-12, 8, -58], spine: [8, 0, 0], spine1: [6, 0, 0], head: [10, 8, 0], lArm: [-44, 18, -40], lFore: [0, -64, -26], rArm: [-28, -14, 46], rFore: [0, 54, 22], lThigh: [-54, -14, 14], lKnee: 68, rThigh: [-44, 10, -10], rKnee: 60 },
    [0, 0, -0.26], 0
  ),
  makeCouplePreset('couple-cushion-118-wedge-bridge-lock', '118. 웻지 브릿지 앵클락 온탑', 'couple_cushion_arch',
    '웻지 쿠션 위에서 골반을 들어 브릿지를 만든 여성과 무릎 꿇고 진입하는 남성의 밀착 구도',
    { hips: [-44, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [20, 0, 0], lArm: [18, -16, -44], lFore: [0, -48, -20], rArm: [18, 16, 44], rFore: [0, 48, 20], lThigh: [-64, -26, 26], lKnee: 98, rThigh: [-64, 26, -26], rKnee: 98 },
    { hips: [22, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [14, 0, 0], lArm: [-42, 16, -40], lFore: [0, -54, -22], rArm: [-42, -16, 40], rFore: [0, 54, 22], lThigh: [-26, -16, 16], lKnee: 106, rThigh: [-26, 16, -16], rKnee: 106 },
    [0, 0, 0.28], Math.PI
  ),
  makeCouplePreset('couple-cushion-119-pillow-edge-fold', '119. 필로우 엣지 딥 폴딩 프레스', 'couple_cushion_arch',
    '쿠션 위에 엉덩이를 바짝 올리고 양 무릎을 가슴 쪽으로 깊게 접은 대면 딥폴딩 체위',
    { hips: [-58, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [20, 0, 0], lArm: [-48, 18, -38], lFore: [0, -64, -26], rArm: [-48, -18, 38], rFore: [0, 64, 26], lThigh: [-122, -26, 26], lKnee: 74, rThigh: [-122, 26, -26], rKnee: 74 },
    { hips: [34, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [16, 0, 0], lArm: [-52, 16, -38], lFore: [0, -48, -20], rArm: [-52, -16, 38], rFore: [0, 48, 20], lThigh: [-26, -16, 16], lKnee: 104, rThigh: [-26, 16, -16], rKnee: 104 },
    [0, 0, 0.3], Math.PI, [0, 0.08, 0]
  ),
  makeCouplePreset('couple-cushion-120-bolster-69-bridge', '120. 볼스터 서포트 69 하이브릿지', 'couple_cushion_arch',
    '볼스터 쿠션을 베고 누운 남성 위로 여성이 역방향 브릿지 아치를 형성하는 하이앵글 69 체위',
    { hips: [44, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-20, 0, 0], lArm: [-56, 16, -36], lFore: [0, -44, -18], rArm: [-56, -16, 36], rFore: [0, 44, 18], lThigh: [-32, -26, 26], lKnee: 106, rThigh: [-32, 26, -26], rKnee: 106 },
    { hips: [-60, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [22, 0, 0], lArm: [-38, 18, -42], lFore: [0, -58, -24], rArm: [-38, -18, 42], rFore: [0, 58, 24], lThigh: [-22, -16, 16], lKnee: 32, rThigh: [-22, 16, -16], rKnee: 32 },
    [0, 0, 0.24], 0, [0, 0.14, 0]
  ),

  // B-13. 익스트림 · 파워리프트 · 다이내믹 (couple_dynamic_passion: 10종, 121~130)
  makeCouplePreset('couple-dyn-121-wall-pin-high-hook', '121. 월 피닝 원레그 하이훅 키스', 'couple_dynamic_passion',
    '벽면에 등을 기댄 여성의 한쪽 다리를 남성이 허리 위로 높게 걸어 올리고 깊게 키스하는 체위',
    { hips: [-10, -8, 6], spine: [-12, 6, 0], spine1: [-10, 4, 0], head: [-12, -6, 0], lArm: [-58, 20, -36], lFore: [0, -68, -28], rArm: [-44, -16, 42], rFore: [0, 58, 24], lThigh: [-104, -24, 24], lKnee: 68, rThigh: [4, 8, -8], rKnee: 8 },
    { hips: [8, 6, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [14, 6, 0], lArm: [-46, 18, -40], lFore: [0, -64, -26], rArm: [-54, -20, 38], rFore: [0, 68, 28], lThigh: [-14, -10, 10], lKnee: 18, rThigh: [-8, 10, -10], rKnee: 12 },
    [0, 0, 0.28], Math.PI
  ),
  makeCouplePreset('couple-dyn-122-standing-backbend-cradle', '122. 스탠딩 백벤드 서스펜션 크래들', 'couple_dynamic_passion',
    '남성이 기립 상태에서 여성을 안아 올리고 여성이 허리와 목을 뒤로 활처럼 젖히는 파워 리프트',
    { hips: [-26, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-28, 0, 0], lArm: [-52, 20, -36], lFore: [0, -64, -26], rArm: [-52, -20, 36], rFore: [0, 64, 26], lThigh: [-84, -28, 28], lKnee: 96, rThigh: [-84, 28, -28], rKnee: 96 },
    { hips: [-10, 0, 0], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [-6, 0, 0], lArm: [-48, 18, -40], lFore: [0, -74, -30], rArm: [-48, -18, 40], rFore: [0, 74, 30], lThigh: [-16, -12, 12], lKnee: 22, rThigh: [-16, 12, -12], rKnee: 22 },
    [0, 0, 0.26], Math.PI, [0, 0.4, 0]
  ),
  makeCouplePreset('couple-dyn-123-kneeling-waist-lift', '123. 닐링 웨이스트 파워 리프트', 'couple_dynamic_passion',
    '무릎을 꿇은 남성이 마주 앉은 여성의 골반을 공중으로 들어 올리고 밀착하는 닐링 리프트',
    { hips: [10, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [-10, 0, 0], lArm: [-56, 20, -36], lFore: [0, -68, -28], rArm: [-56, -20, 36], rFore: [0, 68, 28], lThigh: [-82, -30, 30], lKnee: 104, rThigh: [-82, 30, -30], rKnee: 104 },
    { hips: [-8, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [10, 0, 0], lArm: [-44, 18, -40], lFore: [0, -68, -28], rArm: [-44, -18, 40], rFore: [0, 68, 28], lThigh: [-26, -18, 18], lKnee: 110, rThigh: [-26, 18, -18], rKnee: 110 },
    [0, 0, 0.24], Math.PI, [0, 0.22, 0]
  ),
  makeCouplePreset('couple-dyn-124-standing-deep-squat-bounce', '124. 기립 서포트 딥 M-스쿼트 바운스', 'couple_dynamic_passion',
    '남성이 다리를 벌리고 서서 뒤에서 여성의 겨드랑이와 가슴을 잡아 지탱하며 여성이 깊은 M-스쿼트를 취하는 체위',
    { hips: [22, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-14, 10, 0], lArm: [-32, 16, -42], lFore: [0, -58, -24], rArm: [-32, -16, 42], rFore: [0, 58, 24], lThigh: [-98, -34, 34], lKnee: 114, rThigh: [-98, 34, -34], rKnee: 114 },
    { hips: [6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -8, 0], lArm: [-42, 18, -40], lFore: [0, -64, -26], rArm: [-42, -18, 40], rFore: [0, 64, 26], lThigh: [-24, -16, 16], lKnee: 34, rThigh: [-24, 16, -16], rKnee: 34 },
    [0, 0, -0.24], 0, [0, 0.2, 0]
  ),
  makeCouplePreset('couple-dyn-125-onearm-wall-press', '125. 원암 월 프레스 후면 하이아치', 'couple_dynamic_passion',
    '벽을 짚고 선 여성의 뒤에서 남성이 한 손으로 어깨를 누르고 다른 손으로 골반을 당기는 후면 구도',
    { hips: [38, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-20, 18, 0], lArm: [-64, 14, -34], lFore: [0, -38, -16], rArm: [-64, -14, 34], rFore: [0, 38, 16], lThigh: [-16, -16, 16], lKnee: 24, rThigh: [-8, 14, -14], rKnee: 12 },
    { hips: [10, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -10, 0], lArm: [-52, 16, -38], lFore: [0, -48, -20], rArm: [-34, -18, 44], rFore: [0, 58, 24], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-12, 12, -12], rKnee: 18 },
    [0, 0, -0.26], 0
  ),
  makeCouplePreset('couple-dyn-126-floor-scissors-twist', '126. 플로어 시저스 딥 트위스트 락', 'couple_dynamic_passion',
    '바닥에서 서로의 허벅지를 깊게 교차해 잠그고 상체를 세워 마주 보는 다이나믹 시저스 체위',
    { hips: [-32, 16, -10], spine: [-8, -10, 4], spine1: [-6, -8, 0], head: [10, 10, 0], lArm: [18, -14, -46], lFore: [0, -38, -16], rArm: [-32, 16, 44], rFore: [0, 54, 22], lThigh: [-84, -26, 26], lKnee: 72, rThigh: [-36, 16, -16], rKnee: 36 },
    { hips: [-28, -16, 10], spine: [-6, 10, 0], spine1: [-4, 8, 0], head: [12, -10, 0], lArm: [-34, 16, -44], lFore: [0, -56, -24], rArm: [16, 14, 46], rFore: [0, 40, 16], lThigh: [-78, -24, 24], lKnee: 74, rThigh: [-40, 16, -16], rKnee: 38 },
    [0.22, 0, 0.2], Math.PI * 0.8
  ),
  makeCouplePreset('couple-dyn-127-kneeling-highleg-shoulder', '127. 닐링 원레그 숄더락 프레스', 'couple_dynamic_passion',
    '누운 여성의 한쪽 다리를 남성이 어깨에 걸치고 반대쪽 다리는 바닥에 벌려 깊게 진입하는 비대칭 프레스',
    { hips: [-52, -8, 6], spine: [-12, 6, 0], spine1: [-10, 4, 0], head: [18, -8, 0], lArm: [-44, 16, -40], lFore: [0, -58, -24], rArm: [18, 14, 46], rFore: [0, 38, 16], lThigh: [-118, -18, 18], lKnee: 16, rThigh: [-64, 28, -28], rKnee: 78 },
    { hips: [28, 6, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, 0, 0], lArm: [-48, 16, -38], lFore: [0, -52, -22], rArm: [-42, -16, 40], rFore: [0, 52, 22], lThigh: [-26, -16, 16], lKnee: 104, rThigh: [-26, 16, -16], rKnee: 104 },
    [0, 0, 0.3], Math.PI
  ),
  makeCouplePreset('couple-dyn-128-standing-backhug-leglift', '128. 스탠딩 백허그 원레그 하이리프트', 'couple_dynamic_passion',
    '기립 백허그 상태에서 남성이 여성의 한쪽 다리를 허리 높이까지 들어 올려 측면을 여는 체위',
    { hips: [14, -10, 8], spine: [-14, 8, -4], spine1: [-12, 6, 0], head: [-12, 18, 0], lArm: [-42, 16, -42], lFore: [0, -62, -26], rArm: [14, 14, 48], rFore: [0, 52, 22], lThigh: [-94, -26, 26], lKnee: 76, rThigh: [6, 8, -8], rKnee: 8 },
    { hips: [-4, 6, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -10, 0], lArm: [-48, 20, -40], lFore: [0, -68, -28], rArm: [-36, -18, 44], rFore: [0, 60, 24], lThigh: [-12, -10, 10], lKnee: 16, rThigh: [-8, 10, -10], rKnee: 12 },
    [0.02, 0, -0.24], 0
  ),
  makeCouplePreset('couple-dyn-129-reverse-cowgirl-leanback', '129. 리버스 온탑 레이백 체스트 터치', 'couple_dynamic_passion',
    '리버스 온탑에서 여성이 상체를 뒤로 완전히 눕혀 남성의 가슴에 등을 밀착하고 양다리를 벌리는 체위',
    { hips: [-16, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-18, 10, 0], lArm: [20, -16, -44], lFore: [0, -52, -22], rArm: [20, 16, 44], rFore: [0, 52, 22], lThigh: [-68, -32, 32], lKnee: 96, rThigh: [-68, 32, -32], rKnee: 96 },
    { hips: [-48, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [18, -8, 0], lArm: [-38, 18, -42], lFore: [0, -64, -26], rArm: [-38, -18, 42], rFore: [0, 64, 26], lThigh: [-28, -18, 18], lKnee: 42, rThigh: [-28, 18, -18], rKnee: 42 },
    [0, 0, -0.08], 0, [0, 0.14, 0]
  ),
  makeCouplePreset('couple-dyn-130-passion-climax-embrace', '130. 다이내믹 딥 클로즈 피날레 포옹', 'couple_dynamic_passion',
    '대면 닐링 온탑에서 서로의 목과 허리를 강하게 끌어안고 골반을 빈틈없이 밀착하는 피날레 체위',
    { hips: [18, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [-16, 8, 0], lArm: [-62, 22, -34], lFore: [0, -74, -30], rArm: [-62, -22, 34], rFore: [0, 74, 30], lThigh: [-52, -30, 30], lKnee: 116, rThigh: [-52, 30, -30], rKnee: 116 },
    { hips: [-38, 0, 0], spine: [8, 0, 0], spine1: [10, 0, 0], head: [16, -8, 0], lArm: [-44, 20, -40], lFore: [0, -70, -28], rArm: [-44, -20, 40], rFore: [0, 70, 28], lThigh: [-32, -18, 18], lKnee: 48, rThigh: [-32, 18, -18], rKnee: 48 },
    [0, 0, 0.14], Math.PI, [0, 0.14, 0]
  ),
];


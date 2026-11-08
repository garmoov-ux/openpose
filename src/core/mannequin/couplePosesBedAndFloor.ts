import { PosePreset } from '@/types';
import { makeCouplePreset } from './couplePoseBuilder';

export const COUPLE_BED_AND_FLOOR_PRESETS: PosePreset[] = [
  // =========================================================================
  // B-3. 침대 · 매트리스 대면 · 온탑 · 레그락 (couple_bed_front: 10종)
  // =========================================================================
  makeCouplePreset(
    'couple-bed-missionary-cradle', '21. 베드 대면 리클라인 크래들', 'couple_bed_front',
    '침대 위에 여성이 등을 대고 눕고 남성이 위에서 상체를 세워 마주 보며 밀착하는 대면 기본 체위',
    { hipPos: [0, 0.42, -0.35], hips: [-56, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [18, 0, 0], lArm: [-42, 16, -42], lFore: [0, -58, -24], rArm: [-42, -16, 42], rFore: [0, 58, 24], lThigh: [-74, -28, 28], lKnee: 84, rThigh: [-74, 28, -28], rKnee: 84 },
    { hipPos: [0, 0.56, -0.15], hips: [34, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, 0, 0], lArm: [-52, 14, -38], lFore: [0, -32, -14], rArm: [-52, -14, 38], rFore: [0, 32, 14], lThigh: [-28, -16, 16], lKnee: 98, rThigh: [-28, 16, -16], rKnee: 98 },
    [0, 0, -0.08], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-leg-lock-wrap', '22. 베드 대면 양다리 레그락', 'couple_bed_front',
    '침대에 누운 여성이 양다리로 남성의 허리를 단단히 감싸 안는 대면 레그락 체위',
    { hipPos: [0, 0.42, -0.35], hips: [-52, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-52, 18, -36], lFore: [0, -66, -28], rArm: [-52, -18, 36], rFore: [0, 66, 28], lThigh: [-88, -26, 26], lKnee: 92, rThigh: [-88, 26, -26], rKnee: 92 },
    { hipPos: [0, 0.54, -0.18], hips: [38, 0, 0], spine: [14, 0, 0], spine1: [12, 0, 0], head: [16, 0, 0], lArm: [-56, 16, -36], lFore: [0, -44, -18], rArm: [-56, -16, 36], rFore: [0, 44, 18], lThigh: [-24, -14, 14], lKnee: 102, rThigh: [-24, 14, -14], rKnee: 102 },
    [0, 0, -0.1], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-v-leg-high', '23. 베드 대면 V-레그 하이 리프트', 'couple_bed_front',
    '누운 여성이 양다리를 V자로 높게 뻗어 올리고 남성이 무릎을 꿇은 채 양다리를 잡아 지지하는 체위',
    { hipPos: [0, 0.44, -0.35], hips: [-48, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [18, 0, 0], lArm: [18, -14, -48], lFore: [0, -34, -14], rArm: [18, 14, 48], rFore: [0, 34, 14], lThigh: [-106, -28, 28], lKnee: 12, rThigh: [-106, 28, -28], rKnee: 12 },
    { hipPos: [0, 0.58, -0.08], hips: [14, 0, 0], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [12, 0, 0], lArm: [-44, 16, -40], lFore: [0, -54, -22], rArm: [-44, -16, 40], rFore: [0, 54, 22], lThigh: [-26, -16, 16], lKnee: 108, rThigh: [-26, 16, -16], rKnee: 108 },
    [0, 0, -0.04], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-shoulder-leg-press', '24. 베드 양발 어깨 프레스 딥폴드', 'couple_bed_front',
    '여성의 양다리를 남성의 어깨 위에 걸치고 상체를 깊게 숙여 밀착하는 딥 폴딩 체위',
    { hipPos: [0, 0.46, -0.34], hips: [-44, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [16, 0, 0], lArm: [14, -16, -46], lFore: [0, -40, -16], rArm: [14, 16, 46], rFore: [0, 40, 16], lThigh: [-116, -18, 18], lKnee: 18, rThigh: [-116, 18, -18], rKnee: 18 },
    { hipPos: [0, 0.56, -0.14], hips: [28, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, 0, 0], lArm: [-48, 16, -38], lFore: [0, -52, -22], rArm: [-48, -16, 38], rFore: [0, 52, 22], lThigh: [-28, -16, 16], lKnee: 104, rThigh: [-28, 16, -16], rKnee: 104 },
    [0, 0, -0.08], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-kneel-upright-top', '25. 베드 업라이트 닐링 온탑', 'couple_bed_front',
    '침대에 누운 남성 위로 여성이 무릎을 꿇고 앉아 상체를 곧게 세운 업라이트 온탑 체위',
    { hipPos: [0, 0.58, -0.24], hips: [10, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [6, 0, 0], lArm: [14, -14, -46], lFore: [0, -48, -20], rArm: [14, 14, 46], rFore: [0, 48, 20], lThigh: [-38, -26, 26], lKnee: 116, rThigh: [-38, 26, -26], rKnee: 116 },
    { hipPos: [0, 0.42, -0.34], hips: [-58, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [22, 0, 0], lArm: [-28, 16, -46], lFore: [0, -48, -20], rArm: [-28, -16, 46], rFore: [0, 48, 20], lThigh: [-18, -14, 14], lKnee: 24, rThigh: [-18, 14, -14], rKnee: 24 },
    [0, 0, -0.18], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-high-arch-ride', '26. 베드 온탑 하이 백아치 라이딩', 'couple_bed_front',
    '온탑 스트래들 상태에서 여성이 양손을 뒤로 짚고 허리와 가슴을 활처럼 젖힌 하이아치 체위',
    { hipPos: [0, 0.58, -0.24], hips: [-10, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 0, 0], lArm: [28, -12, -44], lFore: [0, -24, -10], rArm: [28, 12, 44], rFore: [0, 24, 10], lThigh: [-44, -28, 28], lKnee: 118, rThigh: [-44, 28, -28], rKnee: 118 },
    { hipPos: [0, 0.42, -0.34], hips: [-56, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-36, 16, -44], lFore: [0, -56, -24], rArm: [-36, -16, 44], rFore: [0, 56, 24], lThigh: [-22, -14, 14], lKnee: 28, rThigh: [-22, 14, -14], rKnee: 28 },
    [0, 0, -0.18], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-forward-lean-ride', '27. 베드 온탑 포워드 체스트 밀착', 'couple_bed_front',
    '온탑 자세에서 여성이 상체를 앞으로 깊게 숙여 남성의 가슴에 밀착하는 포워드 라이딩 체위',
    { hipPos: [0, 0.56, -0.22], hips: [34, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [10, 0, 0], lArm: [-54, 16, -38], lFore: [0, -46, -20], rArm: [-54, -16, 38], rFore: [0, 46, 20], lThigh: [-48, -26, 26], lKnee: 114, rThigh: [-48, 26, -26], rKnee: 114 },
    { hipPos: [0, 0.42, -0.34], hips: [-56, 0, 0], spine: [-10, 0, 0], spine1: [-6, 0, 0], head: [18, 0, 0], lArm: [-42, 18, -40], lFore: [0, -64, -26], rArm: [-42, -18, 40], rFore: [0, 64, 26], lThigh: [-20, -14, 14], lKnee: 26, rThigh: [-20, 14, -14], rKnee: 26 },
    [0, 0, -0.18], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-squat-top-straddle', '28. 베드 온탑 M-스쿼트 스트래들', 'couple_bed_front',
    '누운 남성 위에서 여성이 발바닥을 짚고 깊은 M자 스쿼트 자세로 올라앉은 체위',
    { hipPos: [0, 0.6, -0.24], hips: [22, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [8, 0, 0], lArm: [-32, 14, -44], lFore: [0, -52, -22], rArm: [-32, -14, 44], rFore: [0, 52, 22], lThigh: [-98, -32, 32], lKnee: 116, rThigh: [-98, 32, -32], rKnee: 116 },
    { hipPos: [0, 0.42, -0.34], hips: [-56, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0], lArm: [-34, 16, -44], lFore: [0, -54, -22], rArm: [-34, -16, 44], rFore: [0, 54, 22], lThigh: [-24, -16, 16], lKnee: 32, rThigh: [-24, 16, -16], rKnee: 32 },
    [0, 0, -0.18], Math.PI
  ),
  makeCouplePreset(
    'couple-bed-reverse-top-ride', '29. 베드 리버스 온탑 돌아앉기', 'couple_bed_front',
    '누운 남성 위로 여성이 정면을 바라보며 돌아앉아 허리와 골반 라인을 강조하는 리버스 온탑',
    { hipPos: [0, 0.58, -0.22], hips: [18, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-10, 0, 0], lArm: [18, -14, -46], lFore: [0, -38, -16], rArm: [18, 14, 46], rFore: [0, 38, 16], lThigh: [-46, -28, 28], lKnee: 114, rThigh: [-46, 28, -28], rKnee: 114 },
    { hipPos: [0, 0.42, -0.36], hips: [-54, 0, 0], spine: [-14, 0, 0], spine1: [-10, 0, 0], head: [22, 0, 0], lArm: [-34, 16, -44], lFore: [0, -56, -24], rArm: [-34, -16, 44], rFore: [0, 56, 24], lThigh: [-26, -16, 16], lKnee: 36, rThigh: [-26, 16, -16], rKnee: 36 },
    [0, 0, -0.36], 0
  ),
  makeCouplePreset(
    'couple-bed-lotus-embrace', '30. 베드 좌식 연꽃 밀착 포옹', 'couple_bed_front',
    '침대 위에 마주 앉아 서로의 허리와 다리를 교차해 깊게 감싸 안는 좌식 연꽃 체위',
    { hipPos: [0, 0.5, -0.18], hips: [8, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [-10, 6, 0], lArm: [-52, 18, -38], lFore: [0, -68, -28], rArm: [-52, -18, 38], rFore: [0, 68, 28], lThigh: [-76, -30, 30], lKnee: 98, rThigh: [-76, 30, -30], rKnee: 98 },
    { hipPos: [0, 0.46, -0.32], hips: [-12, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [10, -6, 0], lArm: [-38, 20, -42], lFore: [0, -66, -28], rArm: [-38, -20, 42], rFore: [0, 66, 28], lThigh: [-68, -26, 26], lKnee: 92, rThigh: [-68, 26, -26], rKnee: 92 },
    [0, 0, -0.04], Math.PI
  ),

  // =========================================================================
  // B-4. 침대 · 볼스터 후면 · 캣아치 · 프론 (couple_bed_rear: 10종)
  // =========================================================================
  makeCouplePreset(
    'couple-bed-rear-kneel-arch', '31. 베드 후면 닐링 캣아치', 'couple_bed_rear',
    '여성이 침대 위에서 무릎과 손을 짚고 허리를 아치로 낮추며 남성이 후면에서 무릎 꿇고 밀착하는 체위',
    { hipPos: [0, 0.56, -0.16], hips: [48, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 8, 0], lArm: [-56, 10, -36], lFore: [0, -28, -12], rArm: [-56, -10, 36], rFore: [0, 28, 12], lThigh: [-24, -18, 18], lKnee: 106, rThigh: [-24, 18, -18], rKnee: 106 },
    { hipPos: [0, 0.58, -0.38], hips: [12, 0, 0], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [12, 0, 0], lArm: [-36, 16, -44], lFore: [0, -56, -24], rArm: [-36, -16, 44], rFore: [0, 56, 24], lThigh: [-22, -16, 16], lKnee: 108, rThigh: [-22, 16, -16], rKnee: 108 },
    [0, 0, -0.38], 0
  ),
  makeCouplePreset(
    'couple-bed-deep-shoulder-arch', '32. 베드 후면 숄더다운 딥아치', 'couple_bed_rear',
    '여성이 가슴과 어깨를 침대에 낮게 붙이고 골반만 높게 세운 딥 캣아치 후면 체위',
    { hipPos: [0, 0.54, -0.14], hips: [64, 0, 0], spine: [-28, 0, 0], spine1: [-26, 0, 0], head: [-32, 12, 0], lArm: [-68, 14, -32], lFore: [0, -64, -26], rArm: [-68, -14, 32], rFore: [0, 64, 26], lThigh: [-18, -18, 18], lKnee: 104, rThigh: [-18, 18, -18], rKnee: 104 },
    { hipPos: [0, 0.58, -0.36], hips: [16, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-40, 16, -42], lFore: [0, -52, -22], rArm: [-40, -16, 42], rFore: [0, 52, 22], lThigh: [-24, -16, 16], lKnee: 108, rThigh: [-24, 16, -16], rKnee: 108 },
    [0, 0, -0.36], 0
  ),
  makeCouplePreset(
    'couple-bed-upright-rear-kneel', '33. 베드 후면 더블 업라이트 닐링', 'couple_bed_rear',
    '남녀 모두 무릎을 꿇고 상체를 세워 후면에서 가슴과 허리를 밀착시키는 업라이트 닐링 구도',
    { hipPos: [0, 0.58, -0.16], hips: [14, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [-14, 14, 0], lArm: [16, -14, -46], lFore: [0, -52, -22], rArm: [16, 14, 46], rFore: [0, 52, 22], lThigh: [-26, -18, 18], lKnee: 112, rThigh: [-26, 18, -18], rKnee: 112 },
    { hipPos: [0, 0.58, -0.36], hips: [8, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [12, -10, 0], lArm: [-38, 20, -42], lFore: [0, -66, -28], rArm: [-38, -20, 42], rFore: [0, 66, 28], lThigh: [-24, -16, 16], lKnee: 110, rThigh: [-24, 16, -16], rKnee: 110 },
    [0, 0, -0.36], 0
  ),
  makeCouplePreset(
    'couple-bed-bolster-prone', '34. 베드 볼스터 프론 플랫 밀착', 'couple_bed_rear',
    '여성이 볼스터 쿠션 위에 골반을 대고 엎드리며 남성이 위에서 전신을 포개어 밀착하는 프론 체위',
    { hipPos: [0, 0.44, -0.18], hips: [58, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-28, 14, 0], lArm: [-64, 16, -34], lFore: [0, -68, -28], rArm: [-64, -16, 34], rFore: [0, 68, 28], lThigh: [-10, -14, 14], lKnee: 22, rThigh: [-10, 14, -14], rKnee: 22 },
    { hipPos: [0, 0.52, -0.36], hips: [44, 0, 0], spine: [8, 0, 0], spine1: [6, 0, 0], head: [14, -8, 0], lArm: [-54, 14, -38], lFore: [0, -38, -16], rArm: [-54, -14, 38], rFore: [0, 38, 16], lThigh: [-18, -16, 16], lKnee: 64, rThigh: [-18, 16, -16], rKnee: 64 },
    [0, 0, -0.36], 0
  ),
  makeCouplePreset(
    'couple-bed-prone-cobra-arch', '35. 베드 프론 코브라 상체 아치', 'couple_bed_rear',
    '엎드린 상태에서 팔을 짚어 상체를 코브라처럼 세우고 후면에서 밀착하는 아치 체위',
    { hipPos: [0, 0.46, -0.16], hips: [42, 0, 0], spine: [-26, 0, 0], spine1: [-24, 0, 0], head: [-20, 10, 0], lArm: [-46, 12, -40], lFore: [0, -24, -10], rArm: [-46, -12, 40], rFore: [0, 24, 10], lThigh: [-12, -16, 16], lKnee: 28, rThigh: [-12, 16, -16], rKnee: 28 },
    { hipPos: [0, 0.56, -0.38], hips: [22, 0, 0], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [12, 0, 0], lArm: [-36, 16, -44], lFore: [0, -54, -22], rArm: [-36, -16, 44], rFore: [0, 54, 22], lThigh: [-24, -16, 16], lKnee: 96, rThigh: [-24, 16, -16], rKnee: 96 },
    [0, 0, -0.38], 0
  ),
  makeCouplePreset(
    'couple-bed-edge-standing-rear', '36. 베드 엣지 기립-닐링 후면', 'couple_bed_rear',
    '여성이 침대 가장자리에 무릎을 꿇고 엎드리며 남성이 침대 끝에 서서 밀착하는 베드 엣지 체위',
    { hipPos: [0, 0.62, -0.12], hips: [50, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 10, 0], lArm: [-54, 12, -38], lFore: [0, -34, -14], rArm: [-54, -12, 38], rFore: [0, 34, 14], lThigh: [-24, -16, 16], lKnee: 104, rThigh: [-24, 16, -16], rKnee: 104 },
    { hipPos: [0, 0.9, 0], hips: [8, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [12, 0, 0], lArm: [-34, 18, -44], lFore: [0, -56, -24], rArm: [-34, -18, 44], rFore: [0, 56, 24], lThigh: [-12, -12, 12], lKnee: 18, rThigh: [-12, 12, -12], rKnee: 18 },
    [0, 0, -0.28], 0
  ),
  makeCouplePreset(
    'couple-bed-edge-bent-rear', '37. 베드 엣지 벤트오버 후면 아치', 'couple_bed_rear',
    '여성이 서서 침대 매트리스 위에 상체를 숙여 기대고 남성이 후면에서 밀착하는 엣지 구도',
    { hipPos: [0, 0.86, 0.04], hips: [56, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-22, 12, 0], lArm: [-52, 12, -38], lFore: [0, -42, -18], rArm: [-52, -12, 38], rFore: [0, 42, 18], lThigh: [-14, -14, 14], lKnee: 20, rThigh: [-14, 14, -14], rKnee: 20 },
    { hipPos: [0, 0.9, 0], hips: [10, 0, 0], spine: [8, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-36, 18, -44], lFore: [0, -58, -24], rArm: [-36, -18, 44], rFore: [0, 58, 24], lThigh: [-16, -12, 12], lKnee: 22, rThigh: [-16, 12, -12], rKnee: 22 },
    [0, 0, -0.16], 0
  ),
  makeCouplePreset(
    'couple-bed-one-leg-up-rear', '38. 베드 원레그업 3/4 후면 아치', 'couple_bed_rear',
    '후면 닐링 아치에서 한쪽 발을 세워 골반 측면 실루엣을 강조하는 3/4 후면 체위',
    { hipPos: [0, 0.56, -0.16], hips: [44, -8, 6], spine: [-20, 6, 0], spine1: [-18, 4, 0], head: [-20, 16, 0], lArm: [-52, 12, -38], lFore: [0, -32, -14], rArm: [-52, -12, 38], rFore: [0, 32, 14], lThigh: [-78, -22, 22], lKnee: 86, rThigh: [-24, 16, -16], rKnee: 108 },
    { hipPos: [0, 0.58, -0.38], hips: [12, 0, 0], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [12, 0, 0], lArm: [-38, 16, -44], lFore: [0, -56, -24], rArm: [-38, -16, 44], rFore: [0, 56, 24], lThigh: [-22, -16, 16], lKnee: 108, rThigh: [-22, 16, -16], rKnee: 108 },
    [0, 0, -0.38], 0
  ),
  makeCouplePreset(
    'couple-bed-headboard-grip-rear', '39. 헤드보드 홀드 후면 딥아치', 'couple_bed_rear',
    '여성이 침대 헤드보드를 양손으로 잡고 허리를 깊게 아치로 젖힌 후면 밀착 체위',
    { hipPos: [0, 0.6, -0.18], hips: [32, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-18, 0, 0], lArm: [-72, 14, -32], lFore: [0, -36, -15], rArm: [-72, -14, 32], rFore: [0, 36, 15], lThigh: [-28, -18, 18], lKnee: 108, rThigh: [-28, 18, -18], rKnee: 108 },
    { hipPos: [0, 0.58, -0.38], hips: [10, 0, 0], spine: [4, 0, 0], spine1: [6, 0, 0], head: [10, 0, 0], lArm: [-36, 18, -44], lFore: [0, -58, -24], rArm: [-36, -18, 44], rFore: [0, 58, 24], lThigh: [-24, -16, 16], lKnee: 108, rThigh: [-24, 16, -16], rKnee: 108 },
    [0, 0, -0.38], 0
  ),
  makeCouplePreset(
    'couple-bed-backward-pull-arch', '40. 후면 숄더 풀 백아치 밀착', 'couple_bed_rear',
    '후면 닐링 상태에서 여성이 상체를 뒤로 끌어당겨 남성의 가슴에 등을 밀착시키는 하이아치 구도',
    { hipPos: [0, 0.58, -0.2], hips: [18, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-22, 10, 0], lArm: [20, -14, -46], lFore: [0, -54, -22], rArm: [20, 14, 46], rFore: [0, 54, 22], lThigh: [-32, -20, 20], lKnee: 112, rThigh: [-32, 20, -20], rKnee: 112 },
    { hipPos: [0, 0.58, -0.38], hips: [6, 0, 0], spine: [-4, 0, 0], spine1: [4, 0, 0], head: [12, -8, 0], lArm: [-40, 20, -42], lFore: [0, -68, -28], rArm: [-40, -20, 42], rFore: [0, 68, 28], lThigh: [-24, -16, 16], lKnee: 110, rThigh: [-24, 16, -16], rKnee: 110 },
    [0, 0, -0.38], 0
  ),

  // =========================================================================
  // B-5. 측면 · 스푼 · 욕조 · 플로어 · 특수 (couple_side_floor: 10종)
  // =========================================================================
  makeCouplePreset(
    'couple-side-spoon-curl', '41. 측면 스푼 밀착 컬링', 'couple_side_floor',
    '침대나 데이베드에 나란히 옆으로 누워 후면에서 감싸 안는 측면 스푼 체위',
    { hipPos: [0, 0.38, -0.18], hips: [-18, 12, -62], spine: [8, 0, 0], spine1: [6, 0, 0], head: [8, 12, 0], lArm: [-32, 14, -44], lFore: [0, -58, -24], rArm: [-18, -12, 48], rFore: [0, 48, 20], lThigh: [-64, -18, 18], lKnee: 76, rThigh: [-52, 10, -10], rKnee: 68 },
    { hipPos: [0, 0.38, -0.36], hips: [-16, 10, -62], spine: [10, 0, 0], spine1: [8, 0, 0], head: [10, 8, 0], lArm: [-38, 18, -42], lFore: [0, -64, -26], rArm: [-24, -14, 46], rFore: [0, 52, 22], lThigh: [-58, -14, 14], lKnee: 72, rThigh: [-48, 10, -10], rKnee: 64 },
    [0, 0, -0.36], 0
  ),
  makeCouplePreset(
    'couple-side-leg-lift-spoon', '42. 측면 어퍼레그 리프트 스푼', 'couple_side_floor',
    '측면 스푼 밀착 상태에서 위쪽 다리를 높게 들어 골반을 여는 측면 리프트 체위',
    { hipPos: [0, 0.38, -0.18], hips: [-16, 10, -58], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [-8, 14, 0], lArm: [-36, 14, -44], lFore: [0, -58, -24], rArm: [12, 12, 48], rFore: [0, 44, 18], lThigh: [-88, -28, 28], lKnee: 56, rThigh: [-44, 10, -10], rKnee: 58 },
    { hipPos: [0, 0.38, -0.36], hips: [-14, 8, -58], spine: [8, 0, 0], spine1: [6, 0, 0], head: [10, 8, 0], lArm: [-42, 18, -42], lFore: [0, -64, -26], rArm: [-28, -14, 46], rFore: [0, 52, 22], lThigh: [-56, -14, 14], lKnee: 70, rThigh: [-46, 10, -10], rKnee: 62 },
    [0, 0, -0.36], 0
  ),
  makeCouplePreset(
    'couple-scissor-cross-lounge', '43. 시저 크로스 레그 라운지', 'couple_side_floor',
    '비스듬히 누워 서로의 다리를 가위처럼 교차시켜 골반을 맞닿게 하는 시저 구도',
    { hipPos: [-0.08, 0.42, -0.18], hips: [-38, 18, -14], spine: [-10, -8, 4], spine1: [-8, -6, 0], head: [12, 12, 0], lArm: [16, -12, -46], lFore: [0, -36, -15], rArm: [-28, 14, 46], rFore: [0, 52, 22], lThigh: [-76, -24, 24], lKnee: 64, rThigh: [-38, 18, -18], rKnee: 32 },
    { hipPos: [0.14, 0.44, -0.12], hips: [-34, -18, 12], spine: [-6, 8, 0], spine1: [-4, 6, 0], head: [14, -12, 0], lArm: [-32, 16, -44], lFore: [0, -54, -22], rArm: [14, 12, 48], rFore: [0, 38, 16], lThigh: [-72, -22, 22], lKnee: 68, rThigh: [-42, 16, -16], rKnee: 36 },
    [0.18, 0, -0.04], Math.PI * 0.75
  ),
  makeCouplePreset(
    'couple-side-face-to-face', '44. 측면 대면 레그랩 밀착', 'couple_side_floor',
    '침대에 옆으로 마주 누워 다리와 팔을 서로 감싸 안는 측면 대면 구도',
    { hipPos: [0, 0.38, -0.16], hips: [-14, 8, -58], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [-6, 0, 0], lArm: [-48, 18, -38], lFore: [0, -64, -26], rArm: [-34, -14, 44], rFore: [0, 52, 22], lThigh: [-78, -24, 24], lKnee: 82, rThigh: [-48, 10, -10], rKnee: 62 },
    { hipPos: [0, 0.38, -0.16], hips: [-14, -8, 58], spine: [6, 0, 0], spine1: [6, 0, 0], head: [8, 0, 0], lArm: [-38, 18, -42], lFore: [0, -60, -24], rArm: [-46, -18, 40], rFore: [0, 64, 26], lThigh: [-52, -12, 12], lKnee: 64, rThigh: [-74, 22, -22], rKnee: 78 },
    [0, 0, 0.08], Math.PI
  ),
  makeCouplePreset(
    'couple-floor-deep-squat-hold', '45. 플로어 딥 M-스쿼트 후면 서포트', 'couple_side_floor',
    '바닥이나 매트 위에서 여성이 깊은 M-스쿼트 자세를 취하고 남성이 뒤에서 앉아 받쳐주는 구도',
    { hipPos: [0, 0.48, -0.08], hips: [20, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [-10, 0, 0], lArm: [14, -14, -46], lFore: [0, -48, -20], rArm: [14, 14, 46], rFore: [0, 48, 20], lThigh: [-102, -32, 32], lKnee: 118, rThigh: [-102, 32, -32], rKnee: 118 },
    { hipPos: [0, 0.42, -0.26], hips: [-16, 0, 0], spine: [-8, 0, 0], spine1: [-4, 0, 0], head: [10, 0, 0], lArm: [-34, 18, -44], lFore: [0, -60, -24], rArm: [-34, -18, 44], rFore: [0, 60, 24], lThigh: [-76, -24, 24], lKnee: 92, rThigh: [-76, 24, -24], rKnee: 92 },
    [0, 0, -0.22], 0
  ),
  makeCouplePreset(
    'couple-floor-bridge-arch', '46. 플로어 백브릿지 아치 온탑', 'couple_side_floor',
    '여성이 손과 발을 짚어 골반을 들어 올린 브릿지 아치 자세에서 남성이 무릎 꿇고 밀착하는 체위',
    { hipPos: [0, 0.54, -0.2], hips: [-38, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 0, 0], lArm: [34, -12, -42], lFore: [0, -18, -8], rArm: [34, 12, 42], rFore: [0, 18, 8], lThigh: [-58, -24, 24], lKnee: 94, rThigh: [-58, 24, -24], rKnee: 94 },
    { hipPos: [0, 0.56, -0.06], hips: [18, 0, 0], spine: [6, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-40, 16, -42], lFore: [0, -52, -22], rArm: [-40, -16, 42], rFore: [0, 52, 22], lThigh: [-26, -16, 16], lKnee: 108, rThigh: [-26, 16, -16], rKnee: 108 },
    [0, 0, 0.02], Math.PI
  ),
  makeCouplePreset(
    'couple-shower-glass-press', '47. 샤워부스 통유리 스탠딩 프레스', 'couple_side_floor',
    '샤워부스 유리벽에 양손을 짚은 여성과 후면에서 밀착하는 스탠딩 아치 구도',
    { hipPos: [0, 0.92, -0.08], hips: [24, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-16, 14, 0], lArm: [-68, 14, -34], lFore: [0, -42, -18], rArm: [-68, -14, 34], rFore: [0, 42, 18], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [6, 8, -8], rKnee: 8 },
    { hipPos: [0, 0.94, 0], hips: [8, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [12, -8, 0], lArm: [-40, 18, -42], lFore: [0, -62, -26], rArm: [-40, -18, 42], rFore: [0, 62, 26], lThigh: [-10, -10, 10], lKnee: 14, rThigh: [-8, 10, -10], rKnee: 12 },
    [0, 0, -0.26], 0
  ),
  makeCouplePreset(
    'couple-tub-jacuzzi-recline', '48. 욕조·자쿠지 백워드 랩 리클라인', 'couple_side_floor',
    '히노끼 욕조나 자쿠지 안에서 남성의 품에 등을 기대고 다리를 벌려 앉은 수중 라운지 체위',
    { hipPos: [0, 0.44, -0.38], hips: [-24, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [-12, 10, 0], lArm: [16, -16, -46], lFore: [0, -44, -18], rArm: [16, 16, 46], rFore: [0, 44, 18], lThigh: [-74, -28, 28], lKnee: 84, rThigh: [-74, 28, -28], rKnee: 84 },
    { hipPos: [0, 0.42, -0.54], hips: [-28, 0, 0], spine: [-10, 0, 0], spine1: [-6, 0, 0], head: [12, -8, 0], lArm: [-34, 20, -42], lFore: [0, -64, -26], rArm: [-34, -20, 42], rFore: [0, 64, 26], lThigh: [-68, -22, 22], lKnee: 76, rThigh: [-68, 22, -22], rKnee: 76 },
    [0, 0, -0.52], 0
  ),
  makeCouplePreset(
    'couple-island-counter-sit', '49. 아일랜드·데스크 엣지 시팅 밀착', 'couple_side_floor',
    '아일랜드 식탁이나 CEO 데스크 가장자리에 여성이 걸터앉아 다리를 벌리고 남성이 사이에 서서 밀착하는 구도',
    { hipPos: [0, 0.78, -0.32], hips: [-12, 0, 0], spine: [-14, 0, 0], spine1: [-12, 0, 0], head: [10, 0, 0], lArm: [-52, 18, -38], lFore: [0, -62, -26], rArm: [16, 14, 46], rFore: [0, 38, 16], lThigh: [-78, -28, 28], lKnee: 82, rThigh: [-78, 28, -28], rKnee: 82 },
    { hipPos: [0, 0.92, -0.06], hips: [6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, 0, 0], lArm: [-38, 18, -42], lFore: [0, -58, -24], rArm: [-38, -18, 42], rFore: [0, 58, 24], lThigh: [-10, -10, 10], lKnee: 14, rThigh: [-10, 10, -10], rKnee: 14 },
    [0, 0, -0.04], Math.PI
  ),
  makeCouplePreset(
    'couple-pole-duo-sync', '50. 폴 스테이지 듀오 트위스트 밀착', 'couple_side_floor',
    '크롬 폴 기둥을 중심으로 남녀가 몸을 감싸며 S라인 아치로 밀착하는 폴 스테이지 구도',
    { hipPos: [0.06, 0.94, -0.12], hips: [14, 18, -8], spine: [-16, -10, 6], spine1: [-14, -8, 0], head: [-10, 16, 0], lArm: [-84, 12, -28], lFore: [0, -32, -14], rArm: [-24, 16, 48], rFore: [0, 56, 24], lThigh: [-64, -20, 20], lKnee: 74, rThigh: [6, 6, -6], rKnee: 8 },
    { hipPos: [-0.08, 0.93, -0.28], hips: [6, -12, 0], spine: [8, 8, 0], spine1: [8, 6, 0], head: [12, -12, 0], lArm: [-36, 20, -42], lFore: [0, -62, -26], rArm: [-68, -14, 34], rFore: [0, 44, 18], lThigh: [-12, -10, 10], lKnee: 16, rThigh: [-8, 10, -10], rKnee: 12 },
    [-0.08, 0, -0.28], 0
  ),
];

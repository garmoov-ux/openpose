import { PosePreset } from '@/types';
import { makeCouplePreset, COUPLE_SUBGROUPS } from './couplePoseBuilder';
import { SOLO_GLAMOUR_SELF_PLAY_PRESETS } from './soloGlamourSelfPlayPoses';
import { COUPLE_BED_AND_FLOOR_PRESETS } from './couplePosesBedAndFloor';
import { COUPLE_EXTREME_AND_SPECIAL_PRESETS } from './couplePosesExtremeAndSpecial';

export { COUPLE_SUBGROUPS };

export const GLAMOUR_AND_COUPLE_PRESETS: PosePreset[] = [
  ...SOLO_GLAMOUR_SELF_PLAY_PRESETS,

  // =========================================================================
  // B-1. 커플 기립 · 벽면 · 리프트 밀착 (couple_standing: 10종, 01~10)
  // =========================================================================
  makeCouplePreset(
    'couple-back-hug', '01. 후면 백허그 밀착', 'couple_standing',
    '남성이 여성의 뒤에서 허리와 골반을 감싸 안고 여성이 등 라인을 아치로 기대는 백허그 구도',
    { hips: [8, 8, -5], spine: [-10, -5, 4], spine1: [-10, -5, 0], head: [-5, 16, -4], lArm: [-18, -14, -48], lFore: [0, -55, -24], rArm: [-14, 12, 52], rFore: [0, 48, 20], lThigh: [-8, -6, 6], lKnee: 14, rThigh: [5, 5, -5], rKnee: 4 },
    { hips: [-4, 5, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [12, -10, 0], lArm: [-36, 20, -44], lFore: [0, -68, -28], rArm: [-36, -20, 44], rFore: [0, 68, 28], lThigh: [-6, -8, 8], lKnee: 10, rThigh: [-4, 8, -8], rKnee: 8 },
    [0.02, 0, -0.22], 0
  ),
  makeCouplePreset(
    'couple-face-embrace', '02. 대면 웨이스트 홀드', 'couple_standing',
    '남녀가 정면으로 마주 서서 서로의 허리와 목을 감싸 안고 상체를 밀착한 대면 구도',
    { hips: [10, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [-14, 6, 0], lArm: [-55, 18, -38], lFore: [0, -62, -25], rArm: [-55, -18, 38], rFore: [0, 62, 25], lThigh: [-10, -6, 6], lKnee: 16, rThigh: [4, 6, -6], rKnee: 6 },
    { hips: [-6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [14, -6, 0], lArm: [-34, 22, -45], lFore: [0, -65, -26], rArm: [-34, -22, 45], rFore: [0, 65, 26], lThigh: [-6, -8, 8], lKnee: 10, rThigh: [-6, 8, -8], rKnee: 10 },
    [0, 0, 0.26], Math.PI
  ),
  makeCouplePreset(
    'couple-wall-pin', '03. 벽면 대면 핀 밀착', 'couple_standing',
    '여성이 뒷벽에 등을 기대고 남성이 앞에서 양팔과 골반을 밀착시키는 벽면 구도',
    { hipPos: [0, 0.94, -0.12], hips: [-8, 0, 0], spine: [-10, 0, 0], spine1: [-12, 0, 0], head: [-12, 10, 0], lArm: [12, -20, -35], lFore: [0, -45, -18], rArm: [12, 20, 35], rFore: [0, 45, 18], lThigh: [-18, -14, 14], lKnee: 24, rThigh: [-6, 10, -10], rKnee: 10 },
    { hipPos: [0, 0.95, 0], hips: [8, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, -8, 0], lArm: [-68, 12, -32], lFore: [0, -35, -14], rArm: [-68, -12, 32], rFore: [0, 35, 14], lThigh: [-14, -10, 10], lKnee: 18, rThigh: [6, 8, -8], rKnee: 8 },
    [0, 0, 0.16], Math.PI
  ),
  makeCouplePreset(
    'couple-single-leg-wrap', '04. 기립 원레그 랩 리프트', 'couple_standing',
    '대면 기립 상태에서 여성이 한쪽 다리를 높게 들어 남성의 골반과 허리를 감싸는 밀착 구도',
    { hips: [6, -8, 8], spine: [-10, 6, -4], spine1: [-10, 4, 0], head: [-10, -8, 0], lArm: [-58, 20, -36], lFore: [0, -68, -28], rArm: [-42, -16, 44], rFore: [0, 56, 22], lThigh: [-88, -22, 24], lKnee: 82, rThigh: [4, 6, -6], rKnee: 6 },
    { hips: [-6, 6, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, 8, 0], lArm: [-32, 18, -46], lFore: [0, -62, -24], rArm: [-48, -22, 40], rFore: [0, 74, 30], lThigh: [-10, -10, 10], lKnee: 14, rThigh: [-6, 10, -10], rKnee: 10 },
    [0.02, 0, 0.24], Math.PI
  ),
  makeCouplePreset(
    'couple-full-leg-wrap-lift', '05. 기립 양다리 랩 스탠딩 리프트', 'couple_standing',
    '남성이 여성을 들어 올리고 여성이 양다리로 남성의 허리를 감싸 안는 스탠딩 리프트 체위',
    { hipPos: [0, 1.18, 0.04], hips: [-14, 0, 0], spine: [-8, 0, 0], spine1: [-10, 0, 0], head: [-8, 0, 0], lArm: [-62, 22, -34], lFore: [0, -76, -32], rArm: [-62, -22, 34], rFore: [0, 76, 32], lThigh: [-84, -28, 28], lKnee: 98, rThigh: [-84, 28, -28], rKnee: 98 },
    { hipPos: [0, 0.93, 0], hips: [-8, 0, 0], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [-6, 0, 0], lArm: [-44, 18, -42], lFore: [0, -72, -30], rArm: [-44, -18, 42], rFore: [0, 72, 30], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 },
    [0, 0, 0.24], Math.PI
  ),
  makeCouplePreset(
    'couple-neck-arch-behind', '06. 후면 넥홀드 백아치', 'couple_standing',
    '후면에서 남성이 여성의 목선과 허리를 감싸고 여성이 머리를 뒤로 젖히며 골반을 밀착하는 구도',
    { hips: [18, 0, 0], spine: [-16, 0, 0], spine1: [-16, 0, 0], head: [-22, 12, 0], lArm: [16, -14, -48], lFore: [0, -58, -24], rArm: [16, 14, 48], rFore: [0, 58, 24], lThigh: [-12, -10, 10], lKnee: 18, rThigh: [-12, 10, -10], rKnee: 18 },
    { hips: [6, 0, 0], spine: [8, 0, 0], spine1: [10, 0, 0], head: [14, -10, 0], lArm: [-46, 20, -40], lFore: [0, -70, -28], rArm: [-32, -18, 46], rFore: [0, 62, 26], lThigh: [-10, -10, 10], lKnee: 14, rThigh: [-10, 10, -10], rKnee: 14 },
    [0, 0, -0.22], 0
  ),
  makeCouplePreset(
    'couple-tango-dip', '07. 드라마틱 백워드 딥 홀드', 'couple_standing',
    '남성이 여성의 허리를 받쳐 깊게 뒤로 젖히는 드라마틱 딥 구도',
    { hipPos: [0, 0.84, 0], hips: [-28, 12, -8], spine: [-18, -6, 4], spine1: [-16, -4, 0], head: [-14, 14, 0], lArm: [-52, 20, -36], lFore: [0, -48, -20], rArm: [16, 14, 46], rFore: [0, 32, 14], lThigh: [-36, -10, 10], lKnee: 46, rThigh: [14, 6, -6], rKnee: 10 },
    { hipPos: [0, 0.9, 0], hips: [14, -8, 4], spine: [12, 6, 0], spine1: [10, 4, 0], head: [16, -10, 0], lArm: [-42, 24, -42], lFore: [0, -64, -26], rArm: [-34, -18, 46], rFore: [0, 56, 24], lThigh: [-24, -12, 12], lKnee: 32, rThigh: [8, 8, -8], rKnee: 12 },
    [0.06, 0, 0.24], Math.PI
  ),
  makeCouplePreset(
    'couple-mirror-press', '08. 후면 벤트오버 스탠딩 아치', 'couple_standing',
    '여성이 상체를 앞으로 숙이고 골반을 높게 치켜들며 남성이 후면에서 밀착하는 스탠딩 아치',
    { hipPos: [0, 0.88, 0.08], hips: [52, 0, 0], spine: [-22, 0, 0], spine1: [-20, 0, 0], head: [-24, 10, 0], lArm: [-48, 10, -40], lFore: [0, -36, -15], rArm: [-48, -10, 40], rFore: [0, 36, 15], lThigh: [-16, -14, 14], lKnee: 24, rThigh: [-16, 14, -14], rKnee: 24 },
    { hipPos: [0, 0.91, 0], hips: [10, 0, 0], spine: [8, 0, 0], spine1: [6, 0, 0], head: [14, 0, 0], lArm: [-36, 18, -44], lFore: [0, -56, -24], rArm: [-36, -18, 44], rFore: [0, 56, 24], lThigh: [-18, -12, 12], lKnee: 26, rThigh: [-18, 12, -12], rKnee: 26 },
    [0, 0, -0.18], 0
  ),
  makeCouplePreset(
    'couple-standing-rear-leg-lift', '09. 후면 원레그 리프트 아치', 'couple_standing',
    '후면 밀착 상태에서 남성이 여성의 한쪽 허벅지를 들어 올려 골반 각도를 여는 구도',
    { hipPos: [0, 0.9, 0.04], hips: [28, -8, 6], spine: [-16, 6, 0], spine1: [-14, 4, 0], head: [-16, 18, 0], lArm: [-32, 12, -48], lFore: [0, -48, -20], rArm: [14, 16, 48], rFore: [0, 52, 22], lThigh: [-76, -22, 22], lKnee: 74, rThigh: [-8, 8, -8], rKnee: 14 },
    { hipPos: [0, 0.92, 0], hips: [6, 0, 0], spine: [8, 0, 0], spine1: [8, 0, 0], head: [12, -8, 0], lArm: [-44, 20, -42], lFore: [0, -68, -28], rArm: [-34, -18, 46], rFore: [0, 58, 24], lThigh: [-14, -10, 10], lKnee: 20, rThigh: [-10, 10, -10], rKnee: 16 },
    [0, 0, -0.2], 0
  ),
  makeCouplePreset(
    'couple-standing-carry-arch', '10. 대면 하이 크래들 리프트', 'couple_standing',
    '남성이 여성을 안아 올리고 여성이 상체를 뒤로 깊게 아치형으로 젖히는 하이 텐션 리프트',
    { hipPos: [0, 1.18, 0.02], hips: [-22, 0, 0], spine: [-18, 0, 0], spine1: [-18, 0, 0], head: [-20, 0, 0], lArm: [-54, 18, -36], lFore: [0, -64, -26], rArm: [-54, -18, 36], rFore: [0, 64, 26], lThigh: [-82, -26, 26], lKnee: 96, rThigh: [-82, 26, -26], rKnee: 96 },
    { hipPos: [0, 0.92, 0], hips: [-10, 0, 0], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [-8, 0, 0], lArm: [-46, 18, -42], lFore: [0, -74, -30], rArm: [-46, -18, 42], rFore: [0, 74, 30], lThigh: [-16, -12, 12], lKnee: 22, rThigh: [-16, 12, -12], rKnee: 22 },
    [0, 0, 0.24], Math.PI
  ),

  // =========================================================================
  // B-2. 의자 · 소파 · 러브체어 착석 · 스트래들 (couple_chair: 10종, 11~20)
  // =========================================================================
  makeCouplePreset(
    'couple-lap-straddle-face', '11. 의자 대면 마주앉기 스트래들', 'couple_chair',
    '남성이 의자에 앉고 여성이 마주 보고 무릎 위에 올라앉아 허벅지를 벌린 대면 랩 스트래들',
    { hipPos: [0, 0.64, -0.1], hips: [8, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [8, 0, 0], lArm: [-48, 18, -38], lFore: [0, -62, -26], rArm: [-48, -18, 38], rFore: [0, 62, 26], lThigh: [-72, -28, 28], lKnee: 96, rThigh: [-72, 28, -28], rKnee: 96 },
    { hipPos: [0, 0.52, -0.26], hips: [-10, 0, 0], spine: [-6, 0, 0], spine1: [-4, 0, 0], head: [-8, 0, 0], lArm: [-28, 16, -46], lFore: [0, -56, -22], rArm: [-28, -16, 46], rFore: [0, 56, 22], lThigh: [-82, -16, 16], lKnee: 86, rThigh: [-82, 16, -16], rKnee: 86 },
    [0, 0, 0.04], Math.PI
  ),
  makeCouplePreset(
    'couple-deep-lap-arch', '12. 의자 대면 딥 랩시팅 백아치', 'couple_chair',
    '의자 대면 스트래들 상태에서 여성이 상체를 뒤로 깊게 젖히며 가슴과 허리 아치를 강조하는 체위',
    { hipPos: [0, 0.65, -0.08], hips: [-12, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-22, 0, 0], lArm: [18, -14, -44], lFore: [0, -42, -18], rArm: [18, 14, 44], rFore: [0, 42, 18], lThigh: [-74, -30, 30], lKnee: 102, rThigh: [-74, 30, -30], rKnee: 102 },
    { hipPos: [0, 0.52, -0.26], hips: [-6, 0, 0], spine: [6, 0, 0], spine1: [8, 0, 0], head: [6, 0, 0], lArm: [-36, 18, -42], lFore: [0, -64, -26], rArm: [-36, -18, 42], rFore: [0, 64, 26], lThigh: [-82, -16, 16], lKnee: 86, rThigh: [-82, 16, -16], rKnee: 86 },
    [0, 0, 0.04], Math.PI
  ),
  makeCouplePreset(
    'couple-reverse-lap-straddle', '13. 의자 역방향 돌아앉기 스트래들', 'couple_chair',
    '남성이 의자에 앉고 여성이 정면을 향해 돌아앉아 등을 남성의 가슴에 밀착시키는 리버스 스트래들',
    { hipPos: [0, 0.62, -0.14], hips: [14, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [-12, 10, 0], lArm: [14, -14, -48], lFore: [0, -48, -20], rArm: [14, 14, 48], rFore: [0, 48, 20], lThigh: [-78, -28, 28], lKnee: 92, rThigh: [-78, 28, -28], rKnee: 92 },
    { hipPos: [0, 0.52, -0.28], hips: [-8, 0, 0], spine: [-4, 0, 0], spine1: [4, 0, 0], head: [10, -8, 0], lArm: [-34, 18, -44], lFore: [0, -64, -26], rArm: [-34, -18, 44], rFore: [0, 64, 26], lThigh: [-82, -18, 18], lKnee: 86, rThigh: [-82, 18, -18], rKnee: 86 },
    [0, 0, -0.14], 0
  ),
  makeCouplePreset(
    'couple-reverse-squat-chair', '14. 의자 역방향 M-스쿼트 라이딩', 'couple_chair',
    '의자에 앉은 남성 위에서 여성이 다리를 넓게 벌리고 깊은 M-스쿼트 자세로 올라앉은 구도',
    { hipPos: [0, 0.64, -0.12], hips: [24, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-14, 0, 0], lArm: [-24, 12, -46], lFore: [0, -52, -22], rArm: [-24, -12, 46], rFore: [0, 52, 22], lThigh: [-96, -32, 32], lKnee: 112, rThigh: [-96, 32, -32], rKnee: 112 },
    { hipPos: [0, 0.52, -0.28], hips: [-10, 0, 0], spine: [-6, 0, 0], spine1: [4, 0, 0], head: [8, 0, 0], lArm: [-32, 18, -44], lFore: [0, -60, -24], rArm: [-32, -18, 44], rFore: [0, 60, 24], lThigh: [-82, -18, 18], lKnee: 86, rThigh: [-82, 18, -18], rKnee: 86 },
    [0, 0, -0.16], 0
  ),
  makeCouplePreset(
    'couple-sofa-recline-top', '15. 소파 리클라이닝 온탑 스트래들', 'couple_chair',
    '소파에 깊게 기대어 앉은 남성 위로 여성이 무릎을 꿇고 상체를 숙여 밀착하는 소파 온탑 구도',
    { hipPos: [0, 0.58, -0.12], hips: [22, 0, 0], spine: [10, 0, 0], spine1: [8, 0, 0], head: [12, 0, 0], lArm: [-56, 16, -38], lFore: [0, -48, -20], rArm: [-56, -16, 38], rFore: [0, 48, 20], lThigh: [-52, -26, 26], lKnee: 112, rThigh: [-52, 26, -26], rKnee: 112 },
    { hipPos: [0, 0.48, -0.28], hips: [-24, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [14, 0, 0], lArm: [-28, 18, -46], lFore: [0, -54, -22], rArm: [-28, -18, 46], rFore: [0, 54, 22], lThigh: [-68, -20, 20], lKnee: 76, rThigh: [-68, 20, -20], rKnee: 76 },
    [0, 0, 0.02], Math.PI
  ),
  makeCouplePreset(
    'couple-sofa-lounge', '16. 소파 사이드 크래들 밀착', 'couple_chair',
    '소파에 나란히 밀착 착석하여 여성이 남성의 무릎과 가슴 쪽으로 다리와 상체를 기대는 구도',
    { hipPos: [-0.08, 0.54, -0.18], hips: [-10, 14, -4], spine: [-6, -8, 3], spine1: [-6, -5, 0], head: [6, 16, 0], lArm: [12, -10, -48], lFore: [0, -42, -18], rArm: [-24, 16, 44], rFore: [0, 58, 24], lThigh: [-72, -16, 14], lKnee: 82, rThigh: [-64, 10, -10], rKnee: 76 },
    { hipPos: [0.18, 0.54, -0.22], hips: [-12, -12, 0], spine: [4, 6, 0], spine1: [6, 5, 0], head: [8, -14, 0], lArm: [-32, 20, -44], lFore: [0, -56, -24], rArm: [-18, -10, 54], rFore: [0, 38, 16], lThigh: [-76, -12, 12], lKnee: 84, rThigh: [-76, 14, -14], rKnee: 84 },
    [0.24, 0, -0.04], 0
  ),
  makeCouplePreset(
    'couple-armchair-high-leg', '17. 암체어 하이레그 숄더 프레스', 'couple_chair',
    '여성이 의자에 깊게 기대어 양다리를 남성의 어깨 위로 높게 올리고 남성이 앞에서 밀착하는 구도',
    { hipPos: [0, 0.5, -0.22], hips: [-28, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [14, 0, 0], lArm: [16, -14, -46], lFore: [0, -38, -16], rArm: [16, 14, 46], rFore: [0, 38, 16], lThigh: [-108, -22, 22], lKnee: 24, rThigh: [-108, 22, -22], rKnee: 24 },
    { hipPos: [0, 0.78, 0.08], hips: [14, 0, 0], spine: [12, 0, 0], spine1: [10, 0, 0], head: [14, 0, 0], lArm: [-42, 18, -42], lFore: [0, -56, -24], rArm: [-42, -18, 42], rFore: [0, 56, 24], lThigh: [-38, -16, 16], lKnee: 48, rThigh: [-38, 16, -16], rKnee: 48 },
    [0, 0, 0.14], Math.PI
  ),
  makeCouplePreset(
    'couple-chair-kneel-over', '18. 의자 등받이 후면 닐링 아치', 'couple_chair',
    '여성이 의자 시트 위에 무릎을 꿇고 등받이를 잡으며 남성이 뒤에서 서서 밀착하는 구도',
    { hipPos: [0, 0.66, -0.14], hips: [36, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-18, 10, 0], lArm: [-52, 12, -38], lFore: [0, -42, -18], rArm: [-52, -12, 38], rFore: [0, 42, 18], lThigh: [-24, -16, 16], lKnee: 108, rThigh: [-24, 16, -16], rKnee: 108 },
    { hipPos: [0, 0.9, 0], hips: [8, 0, 0], spine: [8, 0, 0], spine1: [6, 0, 0], head: [12, 0, 0], lArm: [-36, 18, -44], lFore: [0, -58, -24], rArm: [-36, -18, 44], rFore: [0, 58, 24], lThigh: [-14, -12, 12], lKnee: 20, rThigh: [-14, 12, -12], rKnee: 20 },
    [0, 0, -0.28], 0
  ),
  makeCouplePreset(
    'couple-chaise-deep-recline', '19. 러브체어 S-커브 후면 리클라인', 'couple_chair',
    'S-커브 러브체어 곡선에 맞춰 남녀가 나란히 뒤로 깊게 누우며 밀착하는 구도',
    { hipPos: [0, 0.48, -0.12], hips: [-26, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [-10, 12, 0], lArm: [18, -16, -44], lFore: [0, -48, -20], rArm: [18, 16, 44], rFore: [0, 48, 20], lThigh: [-72, -26, 26], lKnee: 84, rThigh: [-72, 26, -26], rKnee: 84 },
    { hipPos: [0, 0.44, -0.28], hips: [-28, 0, 0], spine: [-10, 0, 0], spine1: [-6, 0, 0], head: [12, -10, 0], lArm: [-32, 20, -42], lFore: [0, -62, -26], rArm: [-32, -20, 42], rFore: [0, 62, 26], lThigh: [-68, -20, 20], lKnee: 78, rThigh: [-68, 20, -20], rKnee: 78 },
    [0, 0, -0.16], 0
  ),
  makeCouplePreset(
    'couple-bench-side-straddle', '20. 벤치 사이드 트위스트 스트래들', 'couple_chair',
    '벤치에 앉은 남성의 한쪽 허벅지 위로 여성이 측면으로 걸터앉아 상체를 마주 돌린 구도',
    { hipPos: [-0.08, 0.58, -0.14], hips: [6, 24, -4], spine: [-10, -16, 4], spine1: [-8, -14, 0], head: [6, -18, 0], lArm: [-44, 18, -40], lFore: [0, -58, -24], rArm: [-22, -12, 48], rFore: [0, 46, 20], lThigh: [-76, -22, 22], lKnee: 88, rThigh: [-68, 18, -18], rKnee: 82 },
    { hipPos: [0, 0.52, -0.22], hips: [-8, -10, 0], spine: [4, 8, 0], spine1: [6, 8, 0], head: [8, 14, 0], lArm: [-30, 18, -44], lFore: [0, -54, -22], rArm: [-34, -18, 42], rFore: [0, 60, 24], lThigh: [-80, -14, 14], lKnee: 86, rThigh: [-80, 14, -14], rKnee: 86 },
    [0.06, 0, -0.1], 0
  ),

  ...COUPLE_BED_AND_FLOOR_PRESETS,
  ...COUPLE_EXTREME_AND_SPECIAL_PRESETS,
];

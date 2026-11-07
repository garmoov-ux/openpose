import { PoseKeyframe } from '@/types';
import { q } from './poseMath';

// 포즈 051 ~ 075: 초근접 0.5m V-스플릿, 딥 M-스쿼트, 프로그 스트래들, 3/4 캣아치 (25종)
export const ULTRA_CLOSE_POSES_A: Record<number, PoseKeyframe> = {
  // 51. V-스플릿 인 에어 리클라이닝, 한손 가슴 한손 허벅지
  51: {
    Hips: { rotation: q(-45, 0, 0), position: [0, 0.35, 0] },
    Spine: { rotation: q(20, 0, 0) },
    LeftUpLeg: { rotation: q(-40, 45, -50) },
    LeftLeg: { rotation: q(10, 0, 0) },
    RightUpLeg: { rotation: q(-40, -45, 50) },
    RightLeg: { rotation: q(10, 0, 0) },
    LeftArm: { rotation: q(25, 0, -25) },
    LeftForeArm: { rotation: q(0, 0, -80) },
    RightArm: { rotation: q(20, 0, 30) },
  },
  // 52. 굽힌 양 무릎 어깨 쪽으로 끌어당김, 양손 허벅지 뒤
  52: {
    Hips: { rotation: q(-50, 0, 0), position: [0, 0.30, 0] },
    Spine: { rotation: q(25, 0, 0) },
    LeftUpLeg: { rotation: q(-115, 35, -35) },
    LeftLeg: { rotation: q(130, 0, 0) },
    RightUpLeg: { rotation: q(-115, -35, 35) },
    RightLeg: { rotation: q(130, 0, 0) },
    LeftArm: { rotation: q(25, 0, -35) },
    RightArm: { rotation: q(25, 0, 35) },
  },
  // 53. 침대 모서리 오른다리 공중 높이 들기, 왼무릎 사이드 오픈
  53: {
    Hips: { rotation: q(-30, 10, 0), position: [0, 0.40, 0] },
    LeftUpLeg: { rotation: q(-60, 45, -45) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-75, -25, 30) },
    RightLeg: { rotation: q(20, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
  },
  // 54. 쿠션 위 양다리 울트라 와이드 전개, 힙 업
  54: {
    Hips: { rotation: q(-40, 0, 0), position: [0, 0.40, 0] },
    Spine: { rotation: q(-10, 0, 0) },
    LeftUpLeg: { rotation: q(-30, 50, -50) },
    LeftLeg: { rotation: q(15, 0, 0) },
    RightUpLeg: { rotation: q(-30, -50, 50) },
    RightLeg: { rotation: q(15, 0, 0) },
    LeftArm: { rotation: q(20, 0, -30) },
    RightArm: { rotation: q(0, 0, 40) },
  },
  // 55. 45도 앵글 무릎 폴드백 딥 M-셰이프
  55: {
    Hips: { rotation: q(-40, 0, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-100, 45, -45) },
    LeftLeg: { rotation: q(120, 0, 0) },
    RightUpLeg: { rotation: q(-100, -45, 45) },
    RightLeg: { rotation: q(120, 0, 0) },
    LeftArm: { rotation: q(15, 0, -45) },
    RightArm: { rotation: q(25, 0, 25) },
  },
  // 56. 볼스터 위 왼다리 헤드보드 하이 레그, 오른다리 와이드
  56: {
    Hips: { rotation: q(-35, -15, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-85, 25, -25) },
    LeftLeg: { rotation: q(30, 0, 0) },
    RightUpLeg: { rotation: q(-50, -45, 45) },
    RightLeg: { rotation: q(75, 0, 0) },
  },
  // 57. 팔꿈치 지지 하프 리클라이닝, 양다리 V-셰이프 리프트
  57: {
    Hips: { rotation: q(-45, 0, 0), position: [0, 0.35, 0] },
    LeftArm: { rotation: q(-25, 0, -30) },
    RightArm: { rotation: q(-25, 0, 30) },
    LeftUpLeg: { rotation: q(-45, 40, -45) },
    LeftLeg: { rotation: q(25, 0, 0) },
    RightUpLeg: { rotation: q(-45, -40, 45) },
    RightLeg: { rotation: q(25, 0, 0) },
  },
  // 58. 양 무릎 벌리고 허리 아치 오프, 골반 전방 푸시
  58: {
    Hips: { rotation: q(-30, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-15, 0, 0) },
    LeftUpLeg: { rotation: q(-80, 40, -40) },
    LeftLeg: { rotation: q(100, 0, 0) },
    RightUpLeg: { rotation: q(-80, -40, 40) },
    RightLeg: { rotation: q(100, 0, 0) },
    LeftArm: { rotation: q(15, 0, -30) },
    RightArm: { rotation: q(15, 0, 30) },
  },
  // 59. 한쪽 무릎 가슴으로 당기고 다른 다리 전방 확장
  59: {
    Hips: { rotation: q(-35, 10, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-105, 25, -25) },
    LeftLeg: { rotation: q(120, 0, 0) },
    RightUpLeg: { rotation: q(-45, -35, 35) },
    RightLeg: { rotation: q(40, 0, 0) },
    RightArm: { rotation: q(20, 0, 20) },
  },
  // 60. 양 대퇴부 미드 하이트 리프트, 양손 안쪽 지지
  60: {
    Hips: { rotation: q(-40, 0, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-60, 40, -45) },
    LeftLeg: { rotation: q(50, 0, 0) },
    RightUpLeg: { rotation: q(-60, -40, 45) },
    RightLeg: { rotation: q(50, 0, 0) },
    LeftArm: { rotation: q(25, 0, -25) },
    RightArm: { rotation: q(25, 0, 25) },
  },
  // 61. 딥 와이드 M-스쿼트, 골반 전방 돌출
  61: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-100, 45, -45) },
    LeftLeg: { rotation: q(125, 0, 0) },
    RightUpLeg: { rotation: q(-100, -45, 45) },
    RightLeg: { rotation: q(125, 0, 0) },
    LeftArm: { rotation: q(25, 0, -20) },
    LeftForeArm: { rotation: q(0, 0, -75) },
    RightArm: { rotation: q(25, 0, 20) },
  },
  // 62. 프로그 스트래들 닐링, 호버 로우 골반 틸트
  62: {
    Hips: { rotation: q(5, 0, 0), position: [0, 0.30, 0] },
    LeftUpLeg: { rotation: q(10, 50, -45) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(10, -50, 45) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
    RightArm: { rotation: q(20, 0, 25) },
  },
  // 63. 매트리스 위 딥 스쿼트, 상체 한손 뒤로 기대기
  63: {
    Hips: { rotation: q(-15, 0, 0), position: [0, 0.40, 0] },
    LeftUpLeg: { rotation: q(-90, 45, -45) },
    LeftLeg: { rotation: q(115, 0, 0) },
    RightUpLeg: { rotation: q(-90, -45, 45) },
    RightLeg: { rotation: q(115, 0, 0) },
    RightArm: { rotation: q(-30, 0, 35) },
    LeftArm: { rotation: q(15, 0, -25) },
  },
  // 64. 한쪽 뒤꿈치 든 와이드 딥 스쿼트
  64: {
    Hips: { rotation: q(10, 10, 0), position: [0, 0.38, 0] },
    LeftUpLeg: { rotation: q(-95, 40, -40) },
    LeftLeg: { rotation: q(120, 0, 0) },
    RightUpLeg: { rotation: q(-90, -45, 45) },
    RightLeg: { rotation: q(110, 0, 0) },
    RightFoot: { rotation: q(30, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
    RightArm: { rotation: q(10, 0, 40) },
  },
  // 65. 모서리 발바닥 와이드 플랜트 M-셰이프, 양 손바닥 뒤
  65: {
    Hips: { rotation: q(-20, 0, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-85, 45, -45) },
    LeftLeg: { rotation: q(100, 0, 0) },
    RightUpLeg: { rotation: q(-85, -45, 45) },
    RightLeg: { rotation: q(100, 0, 0) },
    LeftArm: { rotation: q(-35, 0, -35) },
    RightArm: { rotation: q(-35, 0, 35) },
  },
  // 66. 와이드 닐링 요추 아치 골반 전방 푸시
  66: {
    Hips: { rotation: q(-25, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-20, 0, 0) },
    LeftUpLeg: { rotation: q(15, 35, -30) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(15, -35, 30) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
    RightArm: { rotation: q(10, 0, 45) },
  },
  // 67. 헤드보드 등 지지 스쿼트
  67: {
    Hips: { rotation: q(0, 0, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-90, 40, -40) },
    LeftLeg: { rotation: q(110, 0, 0) },
    RightUpLeg: { rotation: q(-90, -40, 40) },
    RightLeg: { rotation: q(110, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
    RightArm: { rotation: q(20, 0, 25) },
  },
  // 68. 150도 와이드 V-스플릿
  68: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-15, 60, -60) },
    LeftLeg: { rotation: q(10, 0, 0) },
    RightUpLeg: { rotation: q(-15, -60, 60) },
    RightLeg: { rotation: q(10, 0, 0) },
    LeftArm: { rotation: q(25, 0, -20) },
    RightArm: { rotation: q(25, 0, 20) },
  },
  // 69. 로우 크라우치 전완 무릎 사이 배치
  69: {
    Hips: { rotation: q(25, 0, 0), position: [0, 0.35, 0] },
    Spine: { rotation: q(15, 0, 0) },
    LeftUpLeg: { rotation: q(-100, 40, -40) },
    LeftLeg: { rotation: q(120, 0, 0) },
    RightUpLeg: { rotation: q(-100, -40, 40) },
    RightLeg: { rotation: q(120, 0, 0) },
    LeftArm: { rotation: q(35, 0, -15) },
    RightArm: { rotation: q(35, 0, 15) },
  },
  // 70. 펠빅 런지 (한쪽 무릎 꿇고 다른 발 쿠션 위)
  70: {
    Hips: { rotation: q(0, 15, 0), position: [0, 0.50, 0] },
    LeftUpLeg: { rotation: q(5, 10, -15) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(-70, -35, 35) },
    RightLeg: { rotation: q(95, 0, 0) },
  },
  // 71. 전완 닐링 딥 캣아치 3/4 턴
  71: {
    Hips: { rotation: q(-15, 45, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(20, -35, 0) },
    Neck: { rotation: q(0, -15, 0) },
    LeftUpLeg: { rotation: q(15, 25, -20) },
    LeftLeg: { rotation: q(-115, 0, 0) },
    RightUpLeg: { rotation: q(-10, -25, 20) },
    RightLeg: { rotation: q(-115, 0, 0) },
    LeftArm: { rotation: q(45, 0, -25) },
    RightArm: { rotation: q(45, 0, 25) },
  },
  // 72. 잭나이프 힙업 아치 3/4 앵글
  72: {
    Hips: { rotation: q(-25, 40, 0), position: [0, 0.60, 0] },
    Spine: { rotation: q(25, -30, 0) },
    LeftUpLeg: { rotation: q(20, 30, -20) },
    LeftLeg: { rotation: q(-110, 0, 0) },
    RightUpLeg: { rotation: q(0, -30, 20) },
    RightLeg: { rotation: q(-110, 0, 0) },
  },
  // 73. 올포스 (All-fours) 3/4 리어힙 턴
  73: {
    Hips: { rotation: q(-20, 45, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(15, -35, 0) },
    LeftUpLeg: { rotation: q(0, 30, -25) },
    LeftLeg: { rotation: q(-90, 0, 0) },
    RightUpLeg: { rotation: q(0, -30, 25) },
    RightLeg: { rotation: q(-90, 0, 0) },
    LeftArm: { rotation: q(60, 0, -20) },
    RightArm: { rotation: q(60, 0, 20) },
  },
  // 74. 가구 암레스트 위 상체 숙임 3/4 턴
  74: {
    Hips: { rotation: q(20, 40, 0), position: [0, 0.70, 0] },
    Spine: { rotation: q(25, -30, 0) },
    LeftUpLeg: { rotation: q(-20, 25, -20) },
    RightUpLeg: { rotation: q(-20, -25, 20) },
    RightArm: { rotation: q(-20, 0, 30) },
  },
  // 75. 3/4 리어힙 트위스트 닐링
  75: {
    Hips: { rotation: q(0, 50, 0), position: [0, 0.50, 0] },
    Spine: { rotation: q(0, -40, 0) },
    LeftUpLeg: { rotation: q(5, 30, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(5, -30, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
  },
};

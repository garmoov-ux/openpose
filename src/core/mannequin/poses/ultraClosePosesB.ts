import { PoseKeyframe } from '@/types';
import { q } from './poseMath';

// 포즈 076 ~ 100: 볼스터 라이딩, 보우아치, 하이 레그프롭 (25종)
export const ULTRA_CLOSE_POSES_B: Record<number, PoseKeyframe> = {
  // 76. 쿠션 위 팔꿈치 지지 딥 S-커브 아치
  76: {
    Hips: { rotation: q(-25, 30, 0), position: [0, 0.50, 0] },
    Spine: { rotation: q(-15, -20, 0) },
    LeftUpLeg: { rotation: q(10, 35, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(10, -35, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(35, 0, -20) },
    RightArm: { rotation: q(35, 0, 20) },
  },
  // 77. 프론 라잉 (복부 엎드림) 한쪽 무릎 외측 리프트
  77: {
    Hips: { rotation: q(0, 35, 10), position: [0, 0.25, 0] },
    Spine: { rotation: q(-15, -20, 0) },
    LeftUpLeg: { rotation: q(0, 10, -5) },
    RightUpLeg: { rotation: q(-60, -45, 45) },
    RightLeg: { rotation: q(90, 0, 0) },
    LeftArm: { rotation: q(30, 0, -25) },
    RightArm: { rotation: q(10, 0, 35) },
  },
  // 78. 한쪽 팔 베고 닐링 힙업 3/4 앵글
  78: {
    Hips: { rotation: q(-20, 45, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(20, -35, 0) },
    LeftUpLeg: { rotation: q(10, 30, -20) },
    LeftLeg: { rotation: q(-115, 0, 0) },
    RightUpLeg: { rotation: q(10, -30, 20) },
    RightLeg: { rotation: q(-115, 0, 0) },
    RightArm: { rotation: q(-15, 0, 40) },
  },
  // 79. 높은 단상 양손 지지, 힙/다리 후방 푸시 3/4
  79: {
    Hips: { rotation: q(25, 35, 0), position: [0, 0.75, 0] },
    Spine: { rotation: q(20, -25, 0) },
    LeftUpLeg: { rotation: q(-15, 25, -20) },
    RightUpLeg: { rotation: q(-15, -25, 20) },
    LeftArm: { rotation: q(45, 0, -20) },
    RightArm: { rotation: q(45, 0, 20) },
  },
  // 80. 한쪽 무릎 꿇고 다른 다리 후방 확장 딥 아치
  80: {
    Hips: { rotation: q(-20, 25, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-15, -15, 0) },
    LeftUpLeg: { rotation: q(10, 25, -20) },
    LeftLeg: { rotation: q(-115, 0, 0) },
    RightUpLeg: { rotation: q(25, -15, 10) },
    RightLeg: { rotation: q(15, 0, 0) },
  },
  // 81. 두꺼운 볼스터 쿠션 단단히 스트래들
  81: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-40, 50, -45) },
    LeftLeg: { rotation: q(90, 0, 0) },
    RightUpLeg: { rotation: q(-40, -50, 45) },
    RightLeg: { rotation: q(90, 0, 0) },
    LeftArm: { rotation: q(20, 0, -20) },
    RightArm: { rotation: q(25, 0, 25) },
  },
  // 82. 와이드 닐링 드라마틱 보우-아치
  82: {
    Hips: { rotation: q(-35, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-25, 0, 0) },
    LeftUpLeg: { rotation: q(15, 35, -30) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(15, -35, 30) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(-30, 0, -35) },
    RightArm: { rotation: q(15, 0, 25) },
  },
  // 83. 암레스트 패드 위 무릎 벌려 탑승
  83: {
    Hips: { rotation: q(10, 0, 0), position: [0, 0.65, 0] },
    LeftUpLeg: { rotation: q(-30, 45, -40) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-30, -45, 40) },
    RightLeg: { rotation: q(80, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
    RightArm: { rotation: q(20, 0, 25) },
  },
  // 84. 침대/소파 모서리 척추 아치 전방 푸시
  84: {
    Hips: { rotation: q(-20, 0, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(-15, 0, 0) },
    LeftUpLeg: { rotation: q(-60, 45, -40) },
    LeftLeg: { rotation: q(85, 0, 0) },
    RightUpLeg: { rotation: q(-60, -45, 40) },
    RightLeg: { rotation: q(85, 0, 0) },
    LeftArm: { rotation: q(25, 0, -25) },
  },
  // 85. 벨벳 쿠션 스트래들 한손 골반
  85: {
    Hips: { rotation: q(10, 5, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-45, 45, -40) },
    LeftLeg: { rotation: q(85, 0, 0) },
    RightUpLeg: { rotation: q(-45, -45, 40) },
    RightLeg: { rotation: q(85, 0, 0) },
    RightArm: { rotation: q(15, 0, 40) },
  },
  // 86. 모서리 와이드 스트래들 양손 힙 뒤 지지
  86: {
    Hips: { rotation: q(-20, 0, 0), position: [0, 0.55, 0] },
    LeftUpLeg: { rotation: q(-70, 40, -40) },
    LeftLeg: { rotation: q(85, 0, 0) },
    RightUpLeg: { rotation: q(-70, -40, 40) },
    RightLeg: { rotation: q(85, 0, 0) },
    LeftArm: { rotation: q(-30, 0, -30) },
    RightArm: { rotation: q(-30, 0, 30) },
  },
  // 87. 플러시 플로어 볼스터 라이딩
  87: {
    Hips: { rotation: q(15, 10, 0), position: [0, 0.40, 0] },
    LeftUpLeg: { rotation: q(-35, 45, -45) },
    LeftLeg: { rotation: q(95, 0, 0) },
    RightUpLeg: { rotation: q(-35, -45, 45) },
    RightLeg: { rotation: q(95, 0, 0) },
    LeftArm: { rotation: q(20, 0, -20) },
  },
  // 88. 와이드 닐링 직립 한손 복부 슬라이드
  88: {
    Hips: { rotation: q(0, 0, 0), position: [0, 0.50, 0] },
    LeftUpLeg: { rotation: q(0, 35, -30) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(0, -35, 30) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
    RightArm: { rotation: q(10, 0, 50) },
  },
  // 89. 라운지 체어 등받이 스트래들
  89: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.60, 0] },
    LeftUpLeg: { rotation: q(-50, 50, -45) },
    LeftLeg: { rotation: q(75, 0, 0) },
    RightUpLeg: { rotation: q(-50, -50, 45) },
    RightLeg: { rotation: q(75, 0, 0) },
    LeftArm: { rotation: q(40, 0, -20) },
    RightArm: { rotation: q(40, 0, 20) },
  },
  // 90. 쿠션 닐링 한손 바닥 지지 가슴 곡선
  90: {
    Hips: { rotation: q(-15, 15, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(5, 30, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(5, -30, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
    RightArm: { rotation: q(-25, 0, 35) },
    LeftArm: { rotation: q(25, 0, -20) },
  },
  // 91. 소파 등받이 위 오른다리 하이 레그 리프트
  91: {
    Hips: { rotation: q(-15, 15, 0), position: [0, 0.55, 0] },
    LeftUpLeg: { rotation: q(-60, 30, -30) },
    LeftLeg: { rotation: q(75, 0, 0) },
    RightUpLeg: { rotation: q(-105, -35, 35) },
    RightLeg: { rotation: q(60, 0, 0) },
    RightArm: { rotation: q(20, 0, 30) },
  },
  // 92. 기립 왼다리 테이블/카운터 위 허리 높이 올림
  92: {
    Hips: { rotation: q(0, -15, 0), position: [0, 0.95, 0] },
    LeftUpLeg: { rotation: q(-90, 25, -20) },
    LeftLeg: { rotation: q(20, 0, 0) },
    RightUpLeg: { rotation: q(0, 0, -5) },
    LeftArm: { rotation: q(20, 0, -25) },
  },
  // 93. 벽에 등 기대고 오른 무릎 높게 사이드 리프트
  93: {
    Hips: { rotation: q(-5, 10, 0), position: [0, 0.95, 0] },
    LeftUpLeg: { rotation: q(0, 5, 0) },
    RightUpLeg: { rotation: q(-100, -35, 45) },
    RightLeg: { rotation: q(110, 0, 0) },
    RightArm: { rotation: q(25, 0, 30) },
  },
  // 94. 하이 카운터 모서리 한쪽 다리 암레스트 후킹
  94: {
    Hips: { rotation: q(0, 10, 0), position: [0, 0.85, 0] },
    LeftUpLeg: { rotation: q(-80, 30, -25) },
    LeftLeg: { rotation: q(70, 0, 0) },
    RightUpLeg: { rotation: q(-30, -35, 35) },
    RightLeg: { rotation: q(40, 0, 0) },
  },
  // 95. 비스듬히 앉아 외측 무릎 손으로 지지 와이드
  95: {
    Hips: { rotation: q(-20, 15, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-70, 30, -30) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-75, -45, 45) },
    RightLeg: { rotation: q(95, 0, 0) },
    RightArm: { rotation: q(25, 0, 35) },
  },
  // 96. 데스크 모서리 발뒤꿈치 후킹 와이드
  96: {
    Hips: { rotation: q(-10, 10, 0), position: [0, 0.85, 0] },
    LeftUpLeg: { rotation: q(0, 15, -10) },
    RightUpLeg: { rotation: q(-75, -35, 35) },
    RightLeg: { rotation: q(85, 0, 0) },
  },
  // 97. 쿠션 기대기 한쪽 발 암레스트 다른 무릎 바닥
  97: {
    Hips: { rotation: q(-25, 10, 0), position: [0, 0.40, 0] },
    LeftUpLeg: { rotation: q(-50, 45, -45) },
    LeftLeg: { rotation: q(90, 0, 0) },
    RightUpLeg: { rotation: q(-90, -30, 30) },
    RightLeg: { rotation: q(75, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
  },
  // 98. 반기립 한쪽 무릎 침대 위 다른 다리 사이드 스텝
  98: {
    Hips: { rotation: q(0, 15, 0), position: [0, 0.75, 0] },
    LeftUpLeg: { rotation: q(-40, 25, -20) },
    LeftLeg: { rotation: q(75, 0, 0) },
    RightUpLeg: { rotation: q(-10, -40, 35) },
    RightLeg: { rotation: q(25, 0, 0) },
  },
  // 99. 화장대 스툴 위 양다리 카운터 모서리 리프트
  99: {
    Hips: { rotation: q(-25, 0, 0), position: [0, 0.55, 0] },
    LeftUpLeg: { rotation: q(-85, 35, -35) },
    LeftLeg: { rotation: q(70, 0, 0) },
    RightUpLeg: { rotation: q(-85, -35, 35) },
    RightLeg: { rotation: q(70, 0, 0) },
    LeftArm: { rotation: q(20, 0, -20) },
    RightArm: { rotation: q(20, 0, 20) },
  },
  // 100. 볼스터 위 왼다리 높게 올리고 오른 허벅지 와이드 오픈
  100: {
    Hips: { rotation: q(-30, -10, 0), position: [0, 0.40, 0] },
    LeftUpLeg: { rotation: q(-95, 30, -30) },
    LeftLeg: { rotation: q(70, 0, 0) },
    RightUpLeg: { rotation: q(-60, -45, 45) },
    RightLeg: { rotation: q(85, 0, 0) },
    LeftArm: { rotation: q(20, 0, -25) },
  },
};

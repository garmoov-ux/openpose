import { PoseKeyframe } from '@/types';
import { q } from './poseMath';

// 포즈 026 ~ 050: 리클라이닝, 사이드 라잉, 체어 스트래들, 모서리 포즈 (25종)
export const CLOSE_LOUNGE_POSES: Record<number, PoseKeyframe> = {
  // 26. 45도 쿠션 인클라인 리클라이닝, 오른다리 미드 하이트
  26: {
    Hips: { rotation: q(-35, 10, 0), position: [0, 0.40, 0] },
    Spine: { rotation: q(15, 0, 0) },
    Head: { rotation: q(15, 0, 0) },
    LeftUpLeg: { rotation: q(-60, 25, -25) },
    LeftLeg: { rotation: q(75, 0, 0) },
    RightUpLeg: { rotation: q(-40, -40, 45) },
    RightLeg: { rotation: q(45, 0, 0) },
    LeftArm: { rotation: q(0, 0, -40) },
    RightArm: { rotation: q(0, 0, 40) },
  },
  // 27. 우측 팔꿈치 지지 라운징, 톱 레그 볼스터 위
  27: {
    Hips: { rotation: q(-15, 30, -20), position: [0, 0.35, 0] },
    Spine: { rotation: q(10, -20, 15) },
    RightArm: { rotation: q(25, 0, 40) },
    RightForeArm: { rotation: q(0, 0, 85) },
    LeftArm: { rotation: q(15, 0, -45) },
    LeftUpLeg: { rotation: q(-50, 40, -35) },
    LeftLeg: { rotation: q(70, 0, 0) },
    RightUpLeg: { rotation: q(-20, 0, -10) },
    RightLeg: { rotation: q(40, 0, 0) },
  },
  // 28. 사이드 라잉 한쪽 전완 지지, 굽힌 무릎 벌림
  28: {
    Hips: { rotation: q(0, 45, -15), position: [0, 0.30, 0] },
    Spine: { rotation: q(0, -30, 10) },
    LeftUpLeg: { rotation: q(-70, 35, -45) },
    LeftLeg: { rotation: q(90, 0, 0) },
    RightUpLeg: { rotation: q(-40, 0, -20) },
    RightLeg: { rotation: q(80, 0, 0) },
    RightArm: { rotation: q(20, 0, 35) },
    RightForeArm: { rotation: q(0, 0, 85) },
  },
  // 29. 3/4 사이드 라잉, 상체 정면 턴, 톱 레그 쿠션
  29: {
    Hips: { rotation: q(-10, 40, 0), position: [0, 0.30, 0] },
    Spine: { rotation: q(10, -35, 0) },
    Neck: { rotation: q(0, -10, 0) },
    LeftUpLeg: { rotation: q(-55, 30, -40) },
    LeftLeg: { rotation: q(70, 0, 0) },
    RightUpLeg: { rotation: q(-15, 0, -10) },
    RightLeg: { rotation: q(30, 0, 0) },
  },
  // 30. 양 전완 지지 45도 리클라이닝, 양 무릎 벌림
  30: {
    Hips: { rotation: q(-40, 0, 0), position: [0, 0.35, 0] },
    Spine: { rotation: q(15, 0, 0) },
    LeftUpLeg: { rotation: q(-75, 35, -35) },
    LeftLeg: { rotation: q(95, 0, 0) },
    RightUpLeg: { rotation: q(-75, -35, 35) },
    RightLeg: { rotation: q(95, 0, 0) },
    LeftArm: { rotation: q(-30, 0, -30) },
    LeftForeArm: { rotation: q(0, 0, -75) },
    RightArm: { rotation: q(-30, 0, 30) },
    RightForeArm: { rotation: q(0, 0, 75) },
  },
  // 31. 쿠션 위 무릎 세워 양옆 드롭
  31: {
    Hips: { rotation: q(-30, 0, 0), position: [0, 0.38, 0] },
    LeftUpLeg: { rotation: q(-80, 45, -45) },
    LeftLeg: { rotation: q(110, 0, 0) },
    RightUpLeg: { rotation: q(-80, -45, 45) },
    RightLeg: { rotation: q(110, 0, 0) },
    LeftArm: { rotation: q(5, 0, -35) },
    RightArm: { rotation: q(5, 0, 35) },
  },
  // 32. 반 리클라이닝 한쪽 팔꿈치 지지, 외측 무릎 지지
  32: {
    Hips: { rotation: q(-25, 20, -10), position: [0, 0.35, 0] },
    RightArm: { rotation: q(-15, 0, 35) },
    RightForeArm: { rotation: q(0, 0, 70) },
    LeftArm: { rotation: q(15, 0, -40) },
    LeftUpLeg: { rotation: q(-70, 35, -35) },
    LeftLeg: { rotation: q(85, 0, 0) },
    RightUpLeg: { rotation: q(-60, -25, 25) },
    RightLeg: { rotation: q(80, 0, 0) },
  },
  // 33. 모서리 하이 쿠션 백서포트, 무릎 벌림
  33: {
    Hips: { rotation: q(-25, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(20, 0, 0) },
    Head: { rotation: q(15, 0, 0) },
    LeftUpLeg: { rotation: q(-70, 30, -30) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-70, -30, 30) },
    RightLeg: { rotation: q(80, 0, 0) },
  },
  // 34. 한쪽 다리 힙 밑으로 접고 다른 다리 전방 확장
  34: {
    Hips: { rotation: q(-5, 15, 0), position: [0, 0.40, 0] },
    LeftUpLeg: { rotation: q(10, 35, -30) },
    LeftLeg: { rotation: q(-125, 0, 0) },
    RightUpLeg: { rotation: q(-65, -25, 30) },
    RightLeg: { rotation: q(45, 0, 0) },
    LeftArm: { rotation: q(15, 0, -35) },
    RightArm: { rotation: q(15, 0, 35) },
  },
  // 35. 양팔 어깨 옆 벌리고 쿠션 리클라이닝
  35: {
    Hips: { rotation: q(-35, 0, 0), position: [0, 0.35, 0] },
    LeftArm: { rotation: q(20, 0, -65) },
    LeftForeArm: { rotation: q(0, 0, -50) },
    RightArm: { rotation: q(20, 0, 65) },
    RightForeArm: { rotation: q(0, 0, 50) },
    LeftUpLeg: { rotation: q(-75, 35, -35) },
    LeftLeg: { rotation: q(95, 0, 0) },
    RightUpLeg: { rotation: q(-75, -35, 35) },
    RightLeg: { rotation: q(95, 0, 0) },
  },
  // 36. 표면 모서리 M자 시팅, 양 손바닥 뒤로 지지
  36: {
    Hips: { rotation: q(-15, 0, 0), position: [0, 0.55, 0] },
    LeftUpLeg: { rotation: q(-80, 40, -40) },
    LeftLeg: { rotation: q(100, 0, 0) },
    RightUpLeg: { rotation: q(-80, -40, 40) },
    RightLeg: { rotation: q(100, 0, 0) },
    LeftArm: { rotation: q(-30, 0, -35) },
    RightArm: { rotation: q(-30, 0, 35) },
  },
  // 37. 와이드 닐링, 골반 전방 프레스, 양손 허리
  37: {
    Hips: { rotation: q(-10, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-10, 0, 0) },
    LeftUpLeg: { rotation: q(5, 30, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(5, -30, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(10, 0, -55) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(10, 0, 55) },
    RightForeArm: { rotation: q(0, 0, 85) },
  },
  // 38. 단상 위 전완 얹고 상체 숙임, 다리 와이드 오픈
  38: {
    Hips: { rotation: q(25, 0, 0), position: [0, 0.65, 0] },
    Spine: { rotation: q(25, 0, 0) },
    Head: { rotation: q(-40, 0, 0) },
    LeftUpLeg: { rotation: q(-30, 35, -35) },
    LeftLeg: { rotation: q(40, 0, 0) },
    RightUpLeg: { rotation: q(-30, -35, 35) },
    RightLeg: { rotation: q(40, 0, 0) },
    LeftArm: { rotation: q(55, 0, -20) },
    LeftForeArm: { rotation: q(0, 0, -80) },
    RightArm: { rotation: q(55, 0, 20) },
    RightForeArm: { rotation: q(0, 0, 80) },
  },
  // 39. 의자 반대로 걸터앉기 (체어 스트래들)
  39: {
    Hips: { rotation: q(10, 0, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(10, 0, 0) },
    LeftUpLeg: { rotation: q(-60, 45, -45) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-60, -45, 45) },
    RightLeg: { rotation: q(80, 0, 0) },
    LeftArm: { rotation: q(45, 0, -25) },
    LeftForeArm: { rotation: q(0, 0, -70) },
    RightArm: { rotation: q(45, 0, 25) },
    RightForeArm: { rotation: q(0, 0, 70) },
  },
  // 40. 높은 단상 위 왼발 올리고 오른다리 오픈
  40: {
    Hips: { rotation: q(-5, 10, 0), position: [0, 0.65, 0] },
    LeftUpLeg: { rotation: q(-85, 35, -30) },
    LeftLeg: { rotation: q(115, 0, 0) },
    RightUpLeg: { rotation: q(-40, -40, 35) },
    RightLeg: { rotation: q(45, 0, 0) },
  },
  // 41. 와이드 닐링 백워드 보우 아치
  41: {
    Hips: { rotation: q(-25, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-20, 0, 0) },
    LeftUpLeg: { rotation: q(10, 30, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(10, -30, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
    RightArm: { rotation: q(-35, 0, 35) },
    LeftArm: { rotation: q(10, 0, -35) },
  },
  // 42. 3/4 힙 턴 닐링, 상체 정면
  42: {
    Hips: { rotation: q(0, 35, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(0, -30, 0) },
    LeftUpLeg: { rotation: q(5, 35, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(5, -35, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
  },
  // 43. 볼스터 쿠션 스트래들
  43: {
    Hips: { rotation: q(10, 0, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-45, 45, -45) },
    LeftLeg: { rotation: q(85, 0, 0) },
    RightUpLeg: { rotation: q(-45, -45, 45) },
    RightLeg: { rotation: q(85, 0, 0) },
    LeftArm: { rotation: q(20, 0, -30) },
    RightArm: { rotation: q(20, 0, 30) },
  },
  // 44. 모서리 앞쪽 시팅, 손 무릎
  44: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.55, 0] },
    LeftUpLeg: { rotation: q(-70, 35, -35) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-70, -35, 35) },
    RightLeg: { rotation: q(80, 0, 0) },
    LeftArm: { rotation: q(25, 0, -20) },
    RightArm: { rotation: q(25, 0, 20) },
  },
  // 45. 엑스트라 와이드 닐링, 손 무릎 사이 바닥 지지
  45: {
    Hips: { rotation: q(20, 0, 0), position: [0, 0.40, 0] },
    Spine: { rotation: q(15, 0, 0) },
    Head: { rotation: q(-25, 0, 0) },
    LeftUpLeg: { rotation: q(0, 45, -35) },
    LeftLeg: { rotation: q(-125, 0, 0) },
    RightUpLeg: { rotation: q(0, -45, 35) },
    RightLeg: { rotation: q(-125, 0, 0) },
    LeftArm: { rotation: q(30, 0, -15) },
    RightArm: { rotation: q(30, 0, 15) },
  },
  // 46. 암레스트 시팅, 한쪽 발 쿠션 위
  46: {
    Hips: { rotation: q(0, 15, 0), position: [0, 0.70, 0] },
    LeftUpLeg: { rotation: q(-80, 30, -25) },
    LeftLeg: { rotation: q(95, 0, 0) },
    RightUpLeg: { rotation: q(-50, -35, 35) },
    RightLeg: { rotation: q(60, 0, 0) },
  },
  // 47. 양 무릎 벌리고 손 힙 사이 지지
  47: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-80, 35, -35) },
    LeftLeg: { rotation: q(90, 0, 0) },
    RightUpLeg: { rotation: q(-80, -35, 35) },
    RightLeg: { rotation: q(90, 0, 0) },
    LeftArm: { rotation: q(25, 0, -15) },
    RightArm: { rotation: q(25, 0, 15) },
  },
  // 48. 와이드 닐링 직립, 손 허리
  48: {
    Hips: { rotation: q(0, 0, 0), position: [0, 0.50, 0] },
    LeftUpLeg: { rotation: q(0, 30, -25) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(0, -30, 25) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(10, 0, -50) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(10, 0, 50) },
    RightForeArm: { rotation: q(0, 0, 85) },
  },
  // 49. 플로어 쿠션 시팅, 등 가구 베이스 지지
  49: {
    Hips: { rotation: q(-15, 0, 0), position: [0, 0.35, 0] },
    LeftUpLeg: { rotation: q(-85, 35, -35) },
    LeftLeg: { rotation: q(100, 0, 0) },
    RightUpLeg: { rotation: q(-85, -35, 35) },
    RightLeg: { rotation: q(100, 0, 0) },
  },
  // 50. 로우 와이드니 크라우치 밸런스
  50: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.38, 0] },
    LeftUpLeg: { rotation: q(-95, 40, -40) },
    LeftLeg: { rotation: q(120, 0, 0) },
    RightUpLeg: { rotation: q(-95, -40, 40) },
    RightLeg: { rotation: q(120, 0, 0) },
    LeftArm: { rotation: q(20, 0, -20) },
    RightArm: { rotation: q(20, 0, 20) },
  },
};

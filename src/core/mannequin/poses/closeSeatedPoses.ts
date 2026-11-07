import { PoseKeyframe } from '@/types';
import { q } from './poseMath';

// 포즈 001 ~ 025: 좌식, M자 스쿼트, 무릎 꿇기, 기립 콘트라포스토 (25종)
export const CLOSE_SEATED_POSES: Record<number, PoseKeyframe> = {
  // 1. M자 앉기, 상체 약간 앞으로 숙임, 정강이에 손
  1: {
    Hips: { rotation: q(10, 0, 0), position: [0, 0.50, 0] },
    Spine: { rotation: q(15, 0, 0) },
    LeftUpLeg: { rotation: q(-80, 30, -35) },
    LeftLeg: { rotation: q(105, 0, 0) },
    RightUpLeg: { rotation: q(-80, -30, 35) },
    RightLeg: { rotation: q(105, 0, 0) },
    LeftArm: { rotation: q(30, 0, -25) },
    LeftForeArm: { rotation: q(0, 0, -45) },
    RightArm: { rotation: q(30, 0, 25) },
    RightForeArm: { rotation: q(0, 0, 45) },
  },
  // 2. 무릎 꿇고 와이드 스트래들, 골반 전진, 왼손 골반 오른손 허벅지
  2: {
    Hips: { rotation: q(-5, 0, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(0, 25, -20) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(0, -25, 20) },
    RightLeg: { rotation: q(-120, 0, 0) },
    LeftArm: { rotation: q(10, 10, -50) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(15, -5, 30) },
    RightForeArm: { rotation: q(0, 0, 20) },
  },
  // 3. 모서리 앉기, 다리 벌림, 상체 뒤로 기댐, 양손 뒤로 짚기
  3: {
    Hips: { rotation: q(-15, 0, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(-10, 0, 0) },
    LeftUpLeg: { rotation: q(-70, 25, -30) },
    LeftLeg: { rotation: q(80, 0, 0) },
    RightUpLeg: { rotation: q(-70, -25, 30) },
    RightLeg: { rotation: q(80, 0, 0) },
    LeftArm: { rotation: q(-25, 0, -35) },
    LeftForeArm: { rotation: q(0, 0, -20) },
    RightArm: { rotation: q(-25, 0, 35) },
    RightForeArm: { rotation: q(0, 0, 20) },
  },
  // 4. 로우 와이드니 스쿼트, 상체 직립, 양손 무릎
  4: {
    Hips: { rotation: q(10, 0, 0), position: [0, 0.40, 0] },
    Spine: { rotation: q(5, 0, 0) },
    LeftUpLeg: { rotation: q(-95, 35, -40) },
    LeftLeg: { rotation: q(120, 0, 0) },
    RightUpLeg: { rotation: q(-95, -35, 40) },
    RightLeg: { rotation: q(120, 0, 0) },
    LeftArm: { rotation: q(25, 0, -20) },
    LeftForeArm: { rotation: q(0, 0, -30) },
    RightArm: { rotation: q(25, 0, 20) },
    RightForeArm: { rotation: q(0, 0, 30) },
  },
  // 5. 무릎 세워 양옆으로 벌리고 앉기, 상체 전진, 전완 대퇴부 지지
  5: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.35, 0] },
    Spine: { rotation: q(20, 0, 0) },
    LeftUpLeg: { rotation: q(-100, 30, -35) },
    LeftLeg: { rotation: q(115, 0, 0) },
    RightUpLeg: { rotation: q(-100, -30, 35) },
    RightLeg: { rotation: q(115, 0, 0) },
    LeftArm: { rotation: q(35, 0, -15) },
    LeftForeArm: { rotation: q(0, 0, -60) },
    RightArm: { rotation: q(35, 0, 15) },
    RightForeArm: { rotation: q(0, 0, 60) },
  },
  // 6. 한쪽 무릎 꿇고 다른 다리 90도 외측 런지, 양손 허리
  6: {
    Hips: { rotation: q(0, 10, 0), position: [0, 0.50, 0] },
    LeftUpLeg: { rotation: q(0, 10, -10) },
    LeftLeg: { rotation: q(-115, 0, 0) },
    RightUpLeg: { rotation: q(-60, -45, 45) },
    RightLeg: { rotation: q(90, 0, 0) },
    LeftArm: { rotation: q(10, 0, -50) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(10, 0, 50) },
    RightForeArm: { rotation: q(0, 0, 85) },
  },
  // 7. 쿠션에 기대어 앉기, 무릎 세워 벌림, 정면 응시
  7: {
    Hips: { rotation: q(-25, 0, 0), position: [0, 0.40, 0] },
    Spine: { rotation: q(10, 0, 0) },
    Head: { rotation: q(15, 0, 0) },
    LeftUpLeg: { rotation: q(-85, 30, -30) },
    LeftLeg: { rotation: q(100, 0, 0) },
    RightUpLeg: { rotation: q(-85, -30, 30) },
    RightLeg: { rotation: q(100, 0, 0) },
    LeftArm: { rotation: q(0, 0, -40) },
    RightArm: { rotation: q(0, 0, 40) },
  },
  // 8. 한쪽 무릎 굽히고 반대 다리 측면으로 쭉 뻗기
  8: {
    Hips: { rotation: q(5, 5, 0), position: [0, 0.45, 0] },
    LeftUpLeg: { rotation: q(-75, 20, -25) },
    LeftLeg: { rotation: q(95, 0, 0) },
    RightUpLeg: { rotation: q(-20, -40, 50) },
    RightLeg: { rotation: q(15, 0, 0) },
    LeftArm: { rotation: q(20, 0, -30) },
    RightArm: { rotation: q(20, 0, 30) },
  },
  // 9. 무릎 꿇고 힙을 뒤로 낮추며 가슴 아치
  9: {
    Hips: { rotation: q(15, 0, 0), position: [0, 0.40, 0] },
    Spine: { rotation: q(-15, 0, 0) },
    LeftUpLeg: { rotation: q(10, 25, -20) },
    LeftLeg: { rotation: q(-130, 0, 0) },
    RightUpLeg: { rotation: q(10, -25, 20) },
    RightLeg: { rotation: q(-130, 0, 0) },
    LeftArm: { rotation: q(-15, 0, -30) },
    RightArm: { rotation: q(-15, 0, 30) },
  },
  // 10. 모서리에 걸터앉아 다리 카메라 방향으로 벌려 내리기
  10: {
    Hips: { rotation: q(5, 0, 0), position: [0, 0.60, 0] },
    Spine: { rotation: q(10, 0, 0) },
    LeftUpLeg: { rotation: q(-65, 25, -30) },
    LeftLeg: { rotation: q(55, 0, 0) },
    RightUpLeg: { rotation: q(-65, -25, 30) },
    RightLeg: { rotation: q(55, 0, 0) },
    LeftArm: { rotation: q(15, 0, -35) },
    RightArm: { rotation: q(15, 0, 35) },
  },
  // 11. 쿠션 위 3/4 힙 아치 턴, 골반 높게 들고 정면 응시
  11: {
    Hips: { rotation: q(-20, 35, 0), position: [0, 0.55, 0] },
    Spine: { rotation: q(15, -25, 0) },
    Neck: { rotation: q(5, -15, 0) },
    LeftUpLeg: { rotation: q(20, 20, -15) },
    LeftLeg: { rotation: q(-110, 0, 0) },
    RightUpLeg: { rotation: q(-10, -30, 25) },
    RightLeg: { rotation: q(-115, 0, 0) },
    LeftArm: { rotation: q(45, 0, -25) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(45, 0, 25) },
    RightForeArm: { rotation: q(0, 0, 85) },
  },
  // 12. 양 무릎 굽혀 벌리고 뒤로 양손 짚기
  12: {
    Hips: { rotation: q(-20, 0, 0), position: [0, 0.45, 0] },
    Spine: { rotation: q(-10, 0, 0) },
    LeftUpLeg: { rotation: q(-80, 35, -35) },
    LeftLeg: { rotation: q(95, 0, 0) },
    RightUpLeg: { rotation: q(-80, -35, 35) },
    RightLeg: { rotation: q(95, 0, 0) },
    LeftArm: { rotation: q(-35, 0, -40) },
    RightArm: { rotation: q(-35, 0, 40) },
  },
  // 13. 모서리 양옆으로 다리 벌려 걸터앉기, 양손 골반
  13: {
    Hips: { rotation: q(0, 0, 0), position: [0, 0.60, 0] },
    LeftUpLeg: { rotation: q(-50, 45, -40) },
    LeftLeg: { rotation: q(60, 0, 0) },
    RightUpLeg: { rotation: q(-50, -45, 40) },
    RightLeg: { rotation: q(60, 0, 0) },
    LeftArm: { rotation: q(10, 0, -55) },
    LeftForeArm: { rotation: q(0, 0, -80) },
    RightArm: { rotation: q(10, 0, 55) },
    RightForeArm: { rotation: q(0, 0, 80) },
  },
  // 14. 한쪽 무릎 바깥 스텝 오픈, 상체 정면
  14: {
    Hips: { rotation: q(0, 15, 0), position: [0, 0.50, 0] },
    LeftUpLeg: { rotation: q(5, 10, -15) },
    LeftLeg: { rotation: q(-120, 0, 0) },
    RightUpLeg: { rotation: q(-40, -40, 35) },
    RightLeg: { rotation: q(80, 0, 0) },
    LeftArm: { rotation: q(5, 0, -35) },
    RightArm: { rotation: q(5, 0, 35) },
  },
  // 15. 좌식 양다리 와이드 V-스트래들
  15: {
    Hips: { rotation: q(10, 0, 0), position: [0, 0.35, 0] },
    Spine: { rotation: q(10, 0, 0) },
    LeftUpLeg: { rotation: q(-25, 50, -50) },
    LeftLeg: { rotation: q(10, 0, 0) },
    RightUpLeg: { rotation: q(-25, -50, 50) },
    RightLeg: { rotation: q(10, 0, 0) },
    LeftArm: { rotation: q(25, 0, -20) },
    RightArm: { rotation: q(25, 0, 20) },
  },
  // 16. 기립 한쪽 발 쿠션에 올리기 (와이드 오픈)
  16: {
    Hips: { rotation: q(5, 10, 0), position: [0, 0.95, 0] },
    LeftUpLeg: { rotation: q(0, 0, 3) },
    LeftLeg: { rotation: q(0, 0, 0) },
    RightUpLeg: { rotation: q(-55, -25, 30) },
    RightLeg: { rotation: q(85, 0, 0) },
    LeftArm: { rotation: q(10, 0, -55) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(15, 0, 25) },
  },
  // 17. S-커브 콘트라포스토 와이드 스탠스
  17: {
    Hips: { rotation: q(5, 15, -8), position: [0, 0.93, 0] },
    Spine: { rotation: q(0, -10, 5) },
    LeftUpLeg: { rotation: q(5, 10, -15) },
    RightUpLeg: { rotation: q(-15, -15, 20) },
    RightLeg: { rotation: q(20, 0, 0) },
    LeftArm: { rotation: q(15, 0, -35) },
    RightArm: { rotation: q(15, 0, 35) },
  },
  // 18. 벽/난간에 힙 기대어 서기, 양손 뒤로
  18: {
    Hips: { rotation: q(-10, 0, 0), position: [0, 0.92, 0] },
    LeftUpLeg: { rotation: q(10, 15, -10) },
    RightUpLeg: { rotation: q(10, -15, 10) },
    LeftArm: { rotation: q(-25, 0, -30) },
    RightArm: { rotation: q(-25, 0, 30) },
  },
  // 19. 스툴에 왼발 올린 기립 자세
  19: {
    Hips: { rotation: q(5, -10, 0), position: [0, 0.95, 0] },
    LeftUpLeg: { rotation: q(-60, 25, -30) },
    LeftLeg: { rotation: q(85, 0, 0) },
    RightUpLeg: { rotation: q(0, 0, -5) },
    LeftArm: { rotation: q(15, 0, -30) },
    RightArm: { rotation: q(10, 0, 50) },
    RightForeArm: { rotation: q(0, 0, 80) },
  },
  // 20. 상체 앞으로 숙여 허벅지에 손 짚기
  20: {
    Hips: { rotation: q(25, 0, 0), position: [0, 0.88, 0] },
    Spine: { rotation: q(20, 0, 0) },
    Head: { rotation: q(-35, 0, 0) },
    LeftUpLeg: { rotation: q(-15, 20, -15) },
    RightUpLeg: { rotation: q(-15, -20, 15) },
    LeftArm: { rotation: q(35, 0, -25) },
    RightArm: { rotation: q(35, 0, 25) },
  },
  // 21. 체중 좌측 이동, 우측 무릎 살짝 굽힘
  21: {
    Hips: { rotation: q(0, 10, -5), position: [0, 0.94, 0] },
    LeftUpLeg: { rotation: q(0, 5, 0) },
    RightUpLeg: { rotation: q(-15, -15, 15) },
    RightLeg: { rotation: q(25, 0, 0) },
    LeftArm: { rotation: q(10, 0, -55) },
    LeftForeArm: { rotation: q(0, 0, -85) },
    RightArm: { rotation: q(10, 0, 35) },
  },
  // 22. 반쯤 걸터앉아 오른다리 쿠션 위
  22: {
    Hips: { rotation: q(-5, 10, 0), position: [0, 0.75, 0] },
    LeftUpLeg: { rotation: q(-30, 15, -10) },
    LeftLeg: { rotation: q(35, 0, 0) },
    RightUpLeg: { rotation: q(-70, -25, 30) },
    RightLeg: { rotation: q(90, 0, 0) },
    LeftArm: { rotation: q(10, 0, -50) },
    LeftForeArm: { rotation: q(0, 0, -80) },
    RightArm: { rotation: q(15, 0, 30) },
  },
  // 23. 정면 기립 와이드 스탠스, 양손 골반 뒤
  23: {
    Hips: { rotation: q(0, 0, 0), position: [0, 0.95, 0] },
    LeftUpLeg: { rotation: q(0, 15, -15) },
    RightUpLeg: { rotation: q(0, -15, 15) },
    LeftArm: { rotation: q(-20, 0, -35) },
    RightArm: { rotation: q(-20, 0, 35) },
  },
  // 24. 측면 힙 기대기, 바깥쪽 무릎 쿠션 위
  24: {
    Hips: { rotation: q(0, 20, 5), position: [0, 0.90, 0] },
    LeftUpLeg: { rotation: q(0, 10, -5) },
    RightUpLeg: { rotation: q(-50, -35, 35) },
    RightLeg: { rotation: q(80, 0, 0) },
    LeftArm: { rotation: q(15, 0, -35) },
    RightArm: { rotation: q(10, 0, 50) },
    RightForeArm: { rotation: q(0, 0, 85) },
  },
  // 25. 전면 거울 앞 와이드 스탠스
  25: {
    Hips: { rotation: q(0, 0, 0), position: [0, 0.95, 0] },
    LeftUpLeg: { rotation: q(0, 15, -10) },
    RightUpLeg: { rotation: q(0, -15, 10) },
    LeftArm: { rotation: q(5, 0, -30) },
    RightArm: { rotation: q(5, 0, 30) },
  },
};

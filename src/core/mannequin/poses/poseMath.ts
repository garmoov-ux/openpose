import * as THREE from 'three';
import { PoseKeyframe } from '@/types';

// 오일러 각도(Degree)를 쿼터니언 [x, y, z, w]으로 변환하는 순수 함수
export function q(xDeg: number, yDeg: number, zDeg: number): [number, number, number, number] {
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(xDeg),
    THREE.MathUtils.degToRad(yDeg),
    THREE.MathUtils.degToRad(zDeg)
  );
  const quat = new THREE.Quaternion().setFromEuler(euler);
  return [quat.x, quat.y, quat.z, quat.w];
}

// 기본 베이스 키프레임 생성 헬퍼
export function createBaseKeyframe(hipPos: [number, number, number] = [0, 0.95, 0]): PoseKeyframe {
  return {
    Hips: { rotation: q(0, 0, 0), position: hipPos },
    Spine: { rotation: q(0, 0, 0) },
    Spine1: { rotation: q(0, 0, 0) },
    Neck: { rotation: q(0, 0, 0) },
    Head: { rotation: q(0, 0, 0) },
    LeftArm: { rotation: q(0, 0, -40) },
    LeftForeArm: { rotation: q(0, 0, -10) },
    RightArm: { rotation: q(0, 0, 40) },
    RightForeArm: { rotation: q(0, 0, 10) },
    LeftUpLeg: { rotation: q(0, 0, 0) },
    LeftLeg: { rotation: q(0, 0, 0) },
    RightUpLeg: { rotation: q(0, 0, 0) },
    RightLeg: { rotation: q(0, 0, 0) },
  };
}

import * as THREE from 'three';
import { PosePreset } from '@/types';

// 오일러각(degree) -> 쿼터니언 변환 헬퍼
function q(xDeg: number, yDeg: number, zDeg: number): [number, number, number, number] {
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(xDeg),
    THREE.MathUtils.degToRad(yDeg),
    THREE.MathUtils.degToRad(zDeg)
  );
  const quat = new THREE.Quaternion().setFromEuler(euler);
  return [quat.x, quat.y, quat.z, quat.w];
}

export const POSE_PRESETS: PosePreset[] = [
  {
    id: 'default-stand',
    title: '자연스러운 서기',
    category: 'standing',
    description: '어깨 너비로 편안하게 서 있는 기본 체형 자세',
    pose: {
      Hips: { rotation: q(0, 0, 0), position: [0, 0.95, 0] },
      LeftArm: { rotation: q(0, 0, -65) },
      RightArm: { rotation: q(0, 0, 65) },
      LeftForeArm: { rotation: q(0, 0, -10) },
      RightForeArm: { rotation: q(0, 0, 10) },
      LeftUpLeg: { rotation: q(0, 0, 3) },
      RightUpLeg: { rotation: q(0, 0, -3) },
    },
  },
  {
    id: 't-pose',
    title: '표준 T-포즈',
    category: 'standing',
    description: '양팔을 수평으로 곧게 뻗은 3D 릭 표준 자세',
    pose: {
      Hips: { rotation: q(0, 0, 0), position: [0, 0.95, 0] },
      LeftArm: { rotation: q(0, 0, 0) },
      RightArm: { rotation: q(0, 0, 0) },
      LeftForeArm: { rotation: q(0, 0, 0) },
      RightForeArm: { rotation: q(0, 0, 0) },
      LeftUpLeg: { rotation: q(0, 0, 0) },
      RightUpLeg: { rotation: q(0, 0, 0) },
    },
  },
  {
    id: 'walking',
    title: '보행 (Walking)',
    category: 'action',
    description: '앞뒤로 팔다리가 교차하며 걷는 다이내믹 포즈',
    pose: {
      Hips: { rotation: q(5, 5, 0), position: [0, 0.93, 0] },
      LeftArm: { rotation: q(-25, 0, -50) },
      RightArm: { rotation: q(30, 0, 50) },
      LeftForeArm: { rotation: q(0, 0, -30) },
      RightForeArm: { rotation: q(0, 0, 20) },
      LeftUpLeg: { rotation: q(25, 0, 0) },
      LeftLeg: { rotation: q(-20, 0, 0) },
      RightUpLeg: { rotation: q(-20, 0, 0) },
      RightLeg: { rotation: q(15, 0, 0) },
    },
  },
  {
    id: 'running',
    title: '전력 질주 (Sprint)',
    category: 'action',
    description: '상체를 숙이고 강하게 도약하는 달리기 포즈',
    pose: {
      Hips: { rotation: q(20, 10, 0), position: [0, 0.88, 0] },
      Spine: { rotation: q(15, 0, 0) },
      LeftArm: { rotation: q(-55, 0, -45) },
      LeftForeArm: { rotation: q(0, 0, -75) },
      RightArm: { rotation: q(50, 0, 45) },
      RightForeArm: { rotation: q(0, 0, 80) },
      LeftUpLeg: { rotation: q(55, 0, 5) },
      LeftLeg: { rotation: q(-70, 0, 0) },
      RightUpLeg: { rotation: q(-40, 0, -5) },
      RightLeg: { rotation: q(25, 0, 0) },
    },
  },
  {
    id: 'sitting',
    title: '의자에 앉기',
    category: 'sitting',
    description: '무릎을 90도로 구부려 단정히 앉은 자세',
    pose: {
      Hips: { rotation: q(0, 0, 0), position: [0, 0.55, 0] },
      LeftUpLeg: { rotation: q(-90, 0, 0) },
      LeftLeg: { rotation: q(90, 0, 0) },
      RightUpLeg: { rotation: q(-90, 0, 0) },
      RightLeg: { rotation: q(90, 0, 0) },
      LeftArm: { rotation: q(0, 0, -40) },
      LeftForeArm: { rotation: q(0, 0, -30) },
      RightArm: { rotation: q(0, 0, 40) },
      RightForeArm: { rotation: q(0, 0, 30) },
    },
  },
  {
    id: 'fighting-guard',
    title: '격투 가드 포즈',
    category: 'action',
    description: '턱을 당기고 양손을 올려 안면을 보호하는 복싱 자세',
    pose: {
      Hips: { rotation: q(10, 25, 0), position: [0, 0.90, 0] },
      Neck: { rotation: q(5, -20, 0) },
      LeftArm: { rotation: q(40, 10, -40) },
      LeftForeArm: { rotation: q(0, 0, -90) },
      RightArm: { rotation: q(45, -10, 35) },
      RightForeArm: { rotation: q(0, 0, 95) },
      LeftUpLeg: { rotation: q(20, 10, 0) },
      LeftLeg: { rotation: q(-15, 0, 0) },
      RightUpLeg: { rotation: q(-25, -10, 0) },
      RightLeg: { rotation: q(20, 0, 0) },
    },
  },
];

export function applyPosePreset(bones: Map<string, THREE.Bone>, preset: PosePreset): void {
  Object.entries(preset.pose).forEach(([boneName, data]) => {
    const bone = bones.get(boneName);
    if (!bone) return;

    bone.quaternion.set(data.rotation[0], data.rotation[1], data.rotation[2], data.rotation[3]);
    if (data.position) {
      bone.position.set(data.position[0], data.position[1], data.position[2]);
    }
    bone.updateMatrixWorld(true);
  });
}

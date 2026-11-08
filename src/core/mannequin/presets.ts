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
      LeftArm: { rotation: q(0, 0, -68) },
      RightArm: { rotation: q(0, 0, 68) },
      LeftForeArm: { rotation: q(0, 0, -8) },
      RightForeArm: { rotation: q(0, 0, 8) },
      LeftUpLeg: { rotation: q(0, 0, 2) },
      RightUpLeg: { rotation: q(0, 0, -2) },
    },
  },
  {
    id: 't-pose',
    title: '표준 T-포즈',
    category: 'standing',
    description: '양팔을 수평으로 곧게 뻗은 3D 골격 표준 자세',
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
    title: '자연스러운 보행',
    category: 'action',
    description: '앞뒤로 팔다리가 교차하며 걷는 역동적인 자세',
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
    title: '전력 질주',
    category: 'action',
    description: '상체를 숙이고 강하게 도약하는 달리기 자세',
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
    title: '단정히 앉기',
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
    title: '격투 가드 자세',
    category: 'action',
    description: '턱을 당기고 양손을 올려 안면을 보호하는 격투 자세',
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

// 모든 본을 초기 바인드 포즈(Rest Pose)로 복원
export function resetBonesToRestPose(bones: Map<string, THREE.Bone>): void {
  bones.forEach((bone) => {
    const localRest: THREE.Quaternion | undefined = bone.userData.localRestQuat;
    const restPos: THREE.Vector3 | undefined = bone.userData.restPos;
    if (localRest) {
      bone.quaternion.copy(localRest);
    } else {
      bone.quaternion.set(0, 0, 0, 1);
    }
    if (restPos) {
      bone.position.copy(restPos);
    }
  });
}

// 기저 변환(Basis-Change Retargeting)을 통해 어떤 리그에도 정확히 포즈 적용
export function applyPosePreset(bones: Map<string, THREE.Bone>, preset: PosePreset): void {
  // 1. 먼저 모든 관절을 초기 바인드 상태로 초기화하여 이전 포즈 잔상 제거
  resetBonesToRestPose(bones);

  const poseQuat = new THREE.Quaternion();
  const deltaLocal = new THREE.Quaternion();

  // 2. 포즈 키프레임 적용
  Object.entries(preset.pose).forEach(([boneName, data]) => {
    const bone = bones.get(boneName);
    if (!bone) return;

    poseQuat.set(data.rotation[0], data.rotation[1], data.rotation[2], data.rotation[3]);

    const localRest: THREE.Quaternion | undefined = bone.userData.localRestQuat;
    const worldRest: THREE.Quaternion | undefined = bone.userData.worldRestQuat;

    if (localRest && worldRest) {
      // Q_final = Q_localRest * (Q_worldRest^-1 * Q_pose * Q_worldRest)
      deltaLocal.copy(worldRest).invert().multiply(poseQuat).multiply(worldRest);
      bone.quaternion.copy(localRest).multiply(deltaLocal);
    } else {
      bone.quaternion.copy(poseQuat);
    }

    if (data.position && boneName === 'Hips') {
      const restPos: THREE.Vector3 | undefined = bone.userData.restPos;
      if (restPos && restPos.y > 0) {
        const scale = restPos.y / 0.95;
        bone.position.set(
          restPos.x + data.position[0] * scale,
          data.position[1] * scale,
          restPos.z + data.position[2] * scale
        );
      } else {
        bone.position.set(data.position[0], data.position[1], data.position[2]);
      }
    }
  });

  const root = bones.get('Hips');
  if (root) {
    root.updateMatrixWorld(true);
  }
}

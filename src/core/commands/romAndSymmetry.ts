import * as THREE from 'three';
import { Quat } from '@/types/sceneDocument';
import { normalizeQuat } from '@/utils/securityUtils';

export interface JointRomLimit {
  minDeg: [number, number, number];
  maxDeg: [number, number, number];
}

// 1차 단계 핵심 관절 가동 범위(ROM) 정의 (단위: degree, rest 기준 로컬 오일러 근사)
export const JOINT_ROM_LIMITS: Record<string, JointRomLimit> = {
  Neck: { minDeg: [-55, -75, -45], maxDeg: [55, 75, 45] },
  Head: { minDeg: [-50, -80, -45], maxDeg: [60, 80, 45] },
  LeftForeArm: { minDeg: [-150, -150, -150], maxDeg: [150, 150, 150] },
  RightForeArm: { minDeg: [-150, -150, -150], maxDeg: [150, 150, 150] },
  LeftHand: { minDeg: [-85, -85, -85], maxDeg: [85, 85, 85] },
  RightHand: { minDeg: [-85, -85, -85], maxDeg: [85, 85, 85] },
  LeftLeg: { minDeg: [-10, -45, -45], maxDeg: [155, 45, 45] },
  RightLeg: { minDeg: [-10, -45, -45], maxDeg: [155, 45, 45] },
};

const SYMMETRY_BONE_MAP: Record<string, string> = {
  LeftShoulder: 'RightShoulder',
  RightShoulder: 'LeftShoulder',
  LeftArm: 'RightArm',
  RightArm: 'LeftArm',
  LeftForeArm: 'RightForeArm',
  RightForeArm: 'LeftForeArm',
  LeftHand: 'RightHand',
  RightHand: 'LeftHand',
  LeftUpLeg: 'RightUpLeg',
  RightUpLeg: 'LeftUpLeg',
  LeftLeg: 'RightLeg',
  RightLeg: 'LeftLeg',
  LeftFoot: 'RightFoot',
  RightFoot: 'LeftFoot',
};

export function getSymmetricBoneName(boneId: string): string | null {
  return SYMMETRY_BONE_MAP[boneId] || null;
}

// YZ 평면 기준 좌우 반전 쿼터니언 변환: [x, -y, -z, w]
export function mirrorQuaternionLeftRight(q: Quat): Quat {
  const norm = normalizeQuat([q[0], -q[1], -q[2], q[3]]);
  return norm || [0, 0, 0, 1];
}

export function clampQuaternionToRom(
  boneId: string,
  q: Quat
): { rotation: Quat; clamped: boolean } {
  const limit = JOINT_ROM_LIMITS[boneId];
  const norm = normalizeQuat(q);
  if (!norm) return { rotation: [0, 0, 0, 1], clamped: true };
  if (!limit) return { rotation: norm, clamped: false };

  const threeQuat = new THREE.Quaternion(norm[0], norm[1], norm[2], norm[3]);
  const euler = new THREE.Euler().setFromQuaternion(threeQuat, 'XYZ');
  const degX = THREE.MathUtils.radToDeg(euler.x);
  const degY = THREE.MathUtils.radToDeg(euler.y);
  const degZ = THREE.MathUtils.radToDeg(euler.z);

  const cX = THREE.MathUtils.clamp(degX, limit.minDeg[0], limit.maxDeg[0]);
  const cY = THREE.MathUtils.clamp(degY, limit.minDeg[1], limit.maxDeg[1]);
  const cZ = THREE.MathUtils.clamp(degZ, limit.minDeg[2], limit.maxDeg[2]);

  const clamped =
    Math.abs(cX - degX) > 0.05 ||
    Math.abs(cY - degY) > 0.05 ||
    Math.abs(cZ - degZ) > 0.05;

  if (!clamped) return { rotation: norm, clamped: false };

  euler.set(
    THREE.MathUtils.degToRad(cX),
    THREE.MathUtils.degToRad(cY),
    THREE.MathUtils.degToRad(cZ),
    'XYZ'
  );
  threeQuat.setFromEuler(euler).normalize();
  return {
    rotation: [threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w],
    clamped: true,
  };
}


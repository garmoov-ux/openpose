import * as THREE from 'three';
import { PosePreset } from '@/types';
import { q, sanitizePoseKeyframe } from './poses/poseMath';

export const POSE_PRESETS: PosePreset[] = [
  {
    id: 'default-stand',
    title: '자연스러운 서기',
    category: 'standing',
    description: '어깨 너비로 편안하게 서 있는 기본 체형 자세',
    pose: {
      Hips: { rotation: q(0, 0, 0), position: [0, 0.95, 0] },
      Spine: { rotation: q(0, 0, 0) },
      Spine1: { rotation: q(0, 0, 0) },
      Neck: { rotation: q(0, 0, 0) },
      Head: { rotation: q(0, 0, 0) },
      LeftArm: { rotation: q(-4, 0, -66) },
      RightArm: { rotation: q(-4, 0, 66) },
      LeftForeArm: { rotation: q(0, -14, -8) },
      RightForeArm: { rotation: q(0, 14, 8) },
      LeftUpLeg: { rotation: q(0, -4, 3) },
      LeftLeg: { rotation: q(2, 0, 0) },
      RightUpLeg: { rotation: q(0, 4, -3) },
      RightLeg: { rotation: q(2, 0, 0) },
    },
  },
  {
    id: 't-pose',
    title: '표준 T-포즈',
    category: 'standing',
    description: '양팔을 수평으로 곧게 뻗은 3D 골격 표준 자세',
    pose: {
      Hips: { rotation: q(0, 0, 0), position: [0, 0.95, 0] },
      Spine: { rotation: q(0, 0, 0) },
      Spine1: { rotation: q(0, 0, 0) },
      Neck: { rotation: q(0, 0, 0) },
      Head: { rotation: q(0, 0, 0) },
      LeftArm: { rotation: q(0, 0, 0) },
      RightArm: { rotation: q(0, 0, 0) },
      LeftForeArm: { rotation: q(0, 0, 0) },
      RightForeArm: { rotation: q(0, 0, 0) },
      LeftUpLeg: { rotation: q(0, 0, 0) },
      LeftLeg: { rotation: q(0, 0, 0) },
      RightUpLeg: { rotation: q(0, 0, 0) },
      RightLeg: { rotation: q(0, 0, 0) },
    },
  },
  {
    id: 'walking',
    title: '자연스러운 보행',
    category: 'action',
    description: '앞뒤로 팔다리가 교차하며 걷는 역동적인 자세',
    pose: {
      Hips: { rotation: q(4, -6, 0), position: [0, 0.93, 0] },
      Spine: { rotation: q(4, 6, 0) },
      LeftArm: { rotation: q(22, 0, -64) },
      RightArm: { rotation: q(-26, 0, 64) },
      LeftForeArm: { rotation: q(0, -25, -10) },
      RightForeArm: { rotation: q(0, 35, 10) },
      LeftUpLeg: { rotation: q(-28, -3, 3) },
      LeftLeg: { rotation: q(18, 0, 0) },
      RightUpLeg: { rotation: q(22, 3, -3) },
      RightLeg: { rotation: q(28, 0, 0) },
    },
  },
  {
    id: 'running',
    title: '전력 질주',
    category: 'action',
    description: '상체를 숙이고 강하게 도약하는 달리기 자세',
    pose: {
      Hips: { rotation: q(18, -10, 0), position: [0, 0.88, 0] },
      Spine: { rotation: q(12, 10, 0) },
      Head: { rotation: q(-15, 0, 0) },
      LeftArm: { rotation: q(42, 0, -58) },
      LeftForeArm: { rotation: q(0, -80, -20) },
      RightArm: { rotation: q(-48, 0, 58) },
      RightForeArm: { rotation: q(0, 85, 20) },
      LeftUpLeg: { rotation: q(-62, -4, 5) },
      LeftLeg: { rotation: q(65, 0, 0) },
      RightUpLeg: { rotation: q(38, 4, -5) },
      RightLeg: { rotation: q(75, 0, 0) },
    },
  },
  {
    id: 'sitting',
    title: '단정히 앉기',
    category: 'sitting',
    description: '무릎을 90도로 구부려 단정히 앉은 자세',
    pose: {
      Hips: { rotation: q(0, 0, 0), position: [0, 0.54, 0] },
      Spine: { rotation: q(4, 0, 0) },
      LeftUpLeg: { rotation: q(-88, -6, 8) },
      LeftLeg: { rotation: q(88, 0, 0) },
      RightUpLeg: { rotation: q(-88, 6, -8) },
      RightLeg: { rotation: q(88, 0, 0) },
      LeftArm: { rotation: q(-18, 0, -62) },
      LeftForeArm: { rotation: q(0, -45, -15) },
      RightArm: { rotation: q(-18, 0, 62) },
      RightForeArm: { rotation: q(0, 45, 15) },
    },
  },
  {
    id: 'fighting-guard',
    title: '격투 가드 자세',
    category: 'action',
    description: '턱을 당기고 양손을 올려 안면을 보호하는 격투 자세',
    pose: {
      Hips: { rotation: q(8, 24, 0), position: [0, 0.89, 0] },
      Spine: { rotation: q(8, -10, 0) },
      Neck: { rotation: q(6, -14, 0) },
      LeftArm: { rotation: q(-48, 0, -52) },
      LeftForeArm: { rotation: q(0, -95, -35) },
      RightArm: { rotation: q(-42, 0, 52) },
      RightForeArm: { rotation: q(0, 100, 35) },
      LeftUpLeg: { rotation: q(-24, -12, 14) },
      LeftLeg: { rotation: q(28, 0, 0) },
      RightUpLeg: { rotation: q(16, 12, -14) },
      RightLeg: { rotation: q(24, 0, 0) },
    },
  },
  {
    id: 'confident-hip',
    title: '당당한 모델 포즈',
    category: 'standing',
    description: '한 손을 허리에 얹고 체중을 살짝 실은 당당한 기립 자세',
    pose: {
      Hips: { rotation: q(0, 8, -4), position: [0, 0.94, 0] },
      Spine: { rotation: q(-3, -5, 4) },
      Neck: { rotation: q(2, 6, 0) },
      LeftArm: { rotation: q(-8, 0, -48) },
      LeftForeArm: { rotation: q(0, -68, -32) },
      RightArm: { rotation: q(-4, 0, 68) },
      RightForeArm: { rotation: q(0, 12, 6) },
      LeftUpLeg: { rotation: q(-4, -6, 4) },
      LeftLeg: { rotation: q(4, 0, 0) },
      RightUpLeg: { rotation: q(6, 8, -8) },
      RightLeg: { rotation: q(14, 0, 0) },
    },
  },
  {
    id: 'wave-hello',
    title: '밝게 손 흔들기',
    category: 'standing',
    description: '한 손을 높이 들어 반갑게 인사하는 밝고 경쾌한 자세',
    pose: {
      Hips: { rotation: q(0, -5, 2), position: [0, 0.95, 0] },
      Spine: { rotation: q(-3, 5, -3) },
      Head: { rotation: q(-4, 5, 4) },
      LeftArm: { rotation: q(-6, 0, -64) },
      LeftForeArm: { rotation: q(0, -18, -10) },
      RightArm: { rotation: q(-24, 0, -28) },
      RightForeArm: { rotation: q(0, 62, 48) },
      LeftUpLeg: { rotation: q(-3, -4, 4) },
      LeftLeg: { rotation: q(4, 0, 0) },
      RightUpLeg: { rotation: q(3, 4, -4) },
      RightLeg: { rotation: q(6, 0, 0) },
    },
  },
  {
    id: 'dynamic-jump',
    title: '역동적 점프',
    category: 'action',
    description: '양팔을 들어 올리며 경쾌하게 공중으로 도약하는 자세',
    pose: {
      Hips: { rotation: q(-8, 6, 0), position: [0, 1.06, 0] },
      Spine: { rotation: q(-10, -4, 0) },
      Head: { rotation: q(-12, 0, 0) },
      LeftArm: { rotation: q(-28, 0, 32) },
      LeftForeArm: { rotation: q(0, -25, 10) },
      RightArm: { rotation: q(-28, 0, -32) },
      RightForeArm: { rotation: q(0, 25, -10) },
      LeftUpLeg: { rotation: q(-45, -8, 8) },
      LeftLeg: { rotation: q(68, 0, 0) },
      RightUpLeg: { rotation: q(18, 8, -8) },
      RightLeg: { rotation: q(52, 0, 0) },
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

const SUPPORT_BONES = [
  'Hips',
  'LeftUpLeg',
  'LeftLeg',
  'LeftFoot',
  'RightUpLeg',
  'RightLeg',
  'RightFoot',
  'Spine',
  'Head',
];

// 포즈 적용 후 마네킹의 최저 관절점이 바닥(y=0) 아래로 파묻히거나 공중에 뜨지 않도록 자동 접지 보정
function autoGroundMannequin(bones: Map<string, THREE.Bone>): void {
  const hips = bones.get('Hips');
  if (!hips) return;

  hips.updateMatrixWorld(true);

  const worldPos = new THREE.Vector3();
  let minSupportY = Infinity;
  let lowestBoneName = 'LeftFoot';

  for (const name of SUPPORT_BONES) {
    const b = bones.get(name);
    if (!b) continue;
    b.getWorldPosition(worldPos);
    if (worldPos.y < minSupportY) {
      minSupportY = worldPos.y;
      lowestBoneName = name;
    }
  }

  if (!Number.isFinite(minSupportY)) return;

  // 발목(Foot)이 최저점일 때는 발바닥 두께(약 0.08m), 무릎/골반이 최저점일 때는 반경(약 0.055m) 확보
  const clearance = lowestBoneName.includes('Foot') ? 0.082 : 0.055;
  const targetWorldDeltaY = clearance - minSupportY;

  // 부모 본(Armature)의 회전(-90도 X 등)에 영향받지 않도록 월드 좌표계에서 수직(Y) 위치만 보정하고 X, Z는 원점(0) 고정
  const hipsWorldPos = new THREE.Vector3();
  hips.getWorldPosition(hipsWorldPos);
  hipsWorldPos.x = 0;
  hipsWorldPos.y += targetWorldDeltaY;
  hipsWorldPos.z = 0;

  if (hips.parent) {
    hips.parent.updateMatrixWorld(true);
    hips.parent.worldToLocal(hipsWorldPos);
  }
  hips.position.copy(hipsWorldPos);
  hips.updateMatrixWorld(true);
}

// 기저 변환(Basis-Change Retargeting)을 통해 어떤 리그에도 정확히 포즈 적용
export function applyPosePreset(bones: Map<string, THREE.Bone>, preset: PosePreset): void {
  // 1. 먼저 모든 관절을 초기 바인드 상태로 초기화하여 이전 포즈 잔상 제거
  resetBonesToRestPose(bones);

  const isTPose = preset.id === 't-pose';
  const isStandardPreset = POSE_PRESETS.some((p) => p.id === preset.id);
  const poseMap = isTPose || isStandardPreset
    ? preset.pose
    : sanitizePoseKeyframe(preset.pose, false);

  const poseQuat = new THREE.Quaternion();
  const deltaLocal = new THREE.Quaternion();

  // 2. 포즈 키프레임 회전 적용 (위치는 autoGroundMannequin에서 월드 좌표 기준으로 정확히 접지)
  Object.entries(poseMap).forEach(([boneName, data]) => {
    const bone = bones.get(boneName);
    if (!bone || !data) return;

    poseQuat.set(data.rotation[0], data.rotation[1], data.rotation[2], data.rotation[3]);

    const localRest: THREE.Quaternion | undefined = bone.userData.localRestQuat;
    const worldRest: THREE.Quaternion | undefined = bone.userData.worldRestQuat;

    if (localRest && worldRest) {
      deltaLocal.copy(worldRest).invert().multiply(poseQuat).multiply(worldRest);
      bone.quaternion.copy(localRest).multiply(deltaLocal);
    } else {
      bone.quaternion.copy(poseQuat);
    }
  });

  // 3. 바닥 자동 접지 및 원점(X=0, Z=0) 정렬 보정
  autoGroundMannequin(bones);
}

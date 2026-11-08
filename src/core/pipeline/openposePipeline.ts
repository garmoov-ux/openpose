import * as THREE from 'three';
import { OpenPoseExportData } from '@/types';
import { BodyFormat } from '@/types/sceneDocument';

export interface LimbDef {
  from: string;
  to: string;
  color: string;
}

export interface ScreenJointPoint {
  x: number;
  y: number;
  visible: boolean;
  confidence?: number;
}

// COCO 18 공식 키포인트 순서 (18개 관절 = 54개 float)
export const COCO_18_KEYPOINT_ORDER = [
  'Nose',
  'Neck',
  'RightArm',     // RShoulder
  'RightForeArm', // RElbow
  'RightHand',    // RWrist
  'LeftArm',      // LShoulder
  'LeftForeArm',  // LElbow
  'LeftHand',     // LWrist
  'RightUpLeg',   // RHip
  'RightLeg',     // RKnee
  'RightFoot',    // RAnkle
  'LeftUpLeg',    // LHip
  'LeftLeg',      // LKnee
  'LeftFoot',     // LAnkle
  'REye',
  'LEye',
  'REar',
  'LEar',
] as const;

// BODY_25 공식 키포인트 순서 (25개 관절 = 75개 float)
export const BODY_25_KEYPOINT_ORDER = [
  'Nose',
  'Neck',
  'RightArm',     // RShoulder
  'RightForeArm', // RElbow
  'RightHand',    // RWrist
  'LeftArm',      // LShoulder
  'LeftForeArm',  // LElbow
  'LeftHand',     // LWrist
  'Hips',         // MidHip
  'RightUpLeg',   // RHip
  'RightLeg',     // RKnee
  'RightFoot',    // RAnkle
  'LeftUpLeg',    // LHip
  'LeftLeg',      // LKnee
  'LeftFoot',     // LAnkle
  'REye',
  'LEye',
  'REar',
  'LEar',
  'LBigToe',
  'LSmallToe',
  'LHeel',
  'RBigToe',
  'RSmallToe',
  'RHeel',
] as const;

// OpenPose COCO 표준 컬러 림 정의 (Nose/Head 호환)
export const COCO_LIMBS: LimbDef[] = [
  { from: 'Nose', to: 'Neck', color: 'rgb(255, 0, 0)' },
  { from: 'Neck', to: 'RightArm', color: 'rgb(255, 85, 0)' },
  { from: 'RightArm', to: 'RightForeArm', color: 'rgb(255, 170, 0)' },
  { from: 'RightForeArm', to: 'RightHand', color: 'rgb(255, 255, 0)' },
  { from: 'Neck', to: 'LeftArm', color: 'rgb(170, 255, 0)' },
  { from: 'LeftArm', to: 'LeftForeArm', color: 'rgb(85, 255, 0)' },
  { from: 'LeftForeArm', to: 'LeftHand', color: 'rgb(0, 255, 0)' },
  { from: 'Neck', to: 'RightUpLeg', color: 'rgb(0, 255, 85)' },
  { from: 'RightUpLeg', to: 'RightLeg', color: 'rgb(0, 255, 170)' },
  { from: 'RightLeg', to: 'RightFoot', color: 'rgb(0, 255, 255)' },
  { from: 'Neck', to: 'LeftUpLeg', color: 'rgb(0, 170, 255)' },
  { from: 'LeftUpLeg', to: 'LeftLeg', color: 'rgb(0, 85, 255)' },
  { from: 'LeftLeg', to: 'LeftFoot', color: 'rgb(0, 0, 255)' },
];

export const JOINT_COLORS: Record<string, string> = {
  Nose: 'rgb(255, 0, 0)',
  Head: 'rgb(255, 0, 0)',
  Neck: 'rgb(255, 85, 0)',
  RightArm: 'rgb(255, 170, 0)',
  RightForeArm: 'rgb(255, 255, 0)',
  RightHand: 'rgb(170, 255, 0)',
  LeftArm: 'rgb(85, 255, 0)',
  LeftForeArm: 'rgb(0, 255, 0)',
  LeftHand: 'rgb(0, 255, 85)',
  RightUpLeg: 'rgb(0, 255, 170)',
  RightLeg: 'rgb(0, 255, 255)',
  RightFoot: 'rgb(0, 170, 255)',
  LeftUpLeg: 'rgb(0, 85, 255)',
  LeftLeg: 'rgb(0, 0, 255)',
  LeftFoot: 'rgb(255, 0, 255)',
};

// Head 본 로컬 좌표계에서 해부학적 코(Nose) 위치 앵커 오프셋 (미터 단위)
const HEAD_TO_NOSE_LOCAL_OFFSET = new THREE.Vector3(0, 0.055, 0.095);

function projectWorldPointToScreen(
  worldPos: THREE.Vector3,
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number
): ScreenJointPoint {
  if (
    !Number.isFinite(worldPos.x) ||
    !Number.isFinite(worldPos.y) ||
    !Number.isFinite(worldPos.z)
  ) {
    return { x: 0, y: 0, visible: false, confidence: 0 };
  }

  // 1. 카메라 공간 깊이(Z) 및 near/far 범위 검사
  const viewPos = worldPos.clone().applyMatrix4(camera.matrixWorldInverse);
  const depth = -viewPos.z;
  const near = (camera as THREE.PerspectiveCamera).near ?? 0.1;
  const far = (camera as THREE.PerspectiveCamera).far ?? 50;

  if (!Number.isFinite(depth) || depth < near || depth > far) {
    return { x: 0, y: 0, visible: false, confidence: 0 };
  }

  // 2. NDC 투영 및 [-1, 1] 경계 검사
  const ndc = worldPos.clone().project(camera);
  if (
    !Number.isFinite(ndc.x) ||
    !Number.isFinite(ndc.y) ||
    !Number.isFinite(ndc.z) ||
    ndc.x < -1 ||
    ndc.x > 1 ||
    ndc.y < -1 ||
    ndc.y > 1 ||
    ndc.z < -1 ||
    ndc.z > 1
  ) {
    return { x: 0, y: 0, visible: false, confidence: 0 };
  }

  const x = ((ndc.x + 1) * canvasWidth) / 2;
  const y = ((-ndc.y + 1) * canvasHeight) / 2;

  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < 0 ||
    x > canvasWidth ||
    y < 0 ||
    y > canvasHeight
  ) {
    return { x: 0, y: 0, visible: false, confidence: 0 };
  }

  return { x, y, visible: true, confidence: 1.0 };
}

export function getJointScreenPositions(
  bones: Map<string, THREE.Bone>,
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number
): Map<string, ScreenJointPoint> {
  const result = new Map<string, ScreenJointPoint>();
  const worldPos = new THREE.Vector3();
  const worldQuat = new THREE.Quaternion();

  camera.updateMatrixWorld();
  if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }

  bones.forEach((bone, name) => {
    bone.getWorldPosition(worldPos);
    const pt = projectWorldPointToScreen(worldPos, camera, canvasWidth, canvasHeight);
    result.set(name, pt);

    // Head 본에서 코(Nose) 해부학적 앵커 위치 계산
    if (name === 'Head' && !bones.has('Nose')) {
      bone.getWorldPosition(worldPos);
      bone.getWorldQuaternion(worldQuat);
      const noseOffset = HEAD_TO_NOSE_LOCAL_OFFSET.clone().applyQuaternion(worldQuat);
      worldPos.add(noseOffset);
      result.set('Nose', projectWorldPointToScreen(worldPos, camera, canvasWidth, canvasHeight));
    }
  });

  // 눈/귀/발끝 앵커가 없는 모델은 명시적으로 미지원(confidence 0) 기록
  const optionalAnchors = [
    'REye', 'LEye', 'REar', 'LEar',
    'LBigToe', 'LSmallToe', 'LHeel', 'RBigToe', 'RSmallToe', 'RHeel',
  ];
  for (const anchor of optionalAnchors) {
    if (!result.has(anchor)) {
      result.set(anchor, { x: 0, y: 0, visible: false, confidence: 0 });
    }
  }

  return result;
}

function resolveJointPoint(
  positions: Map<string, ScreenJointPoint>,
  key: string
): ScreenJointPoint | undefined {
  if (key === 'Nose') {
    return positions.get('Nose') ?? positions.get('Head');
  }
  return positions.get(key);
}

export function drawOpenPoseSkeleton(
  ctx: CanvasRenderingContext2D,
  positionsOrList:
    | Map<string, ScreenJointPoint>
    | Array<Map<string, ScreenJointPoint>>,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const actorMaps = Array.isArray(positionsOrList) ? positionsOrList : [positionsOrList];
  const scale = width / 512;
  const lineWidth = Math.max(3, Math.round(4.5 * scale));
  const jointRadius = Math.max(3, Math.round(4.5 * scale));

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;

  for (const positions of actorMaps) {
    // 1. 관절 연결선(Limbs) 드로잉
    COCO_LIMBS.forEach((limb) => {
      const p1 = resolveJointPoint(positions, limb.from);
      const p2 = resolveJointPoint(positions, limb.to);
      if (p1 && p2 && p1.visible && p2.visible) {
        ctx.strokeStyle = limb.color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    // 2. 관절 포인트(Joints) 드로잉 (지원되는 유효 관절만 표시)
    const drawKeys = [
      'Nose', 'Neck',
      'RightArm', 'RightForeArm', 'RightHand',
      'LeftArm', 'LeftForeArm', 'LeftHand',
      'RightUpLeg', 'RightLeg', 'RightFoot',
      'LeftUpLeg', 'LeftLeg', 'LeftFoot',
    ];
    for (const key of drawKeys) {
      const pos = resolveJointPoint(positions, key);
      if (!pos || !pos.visible) continue;
      ctx.fillStyle = JOINT_COLORS[key] || 'rgb(255, 255, 255)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, jointRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function exportOpenPoseJson(
  positionsOrList:
    | Map<string, ScreenJointPoint>
    | Array<Map<string, ScreenJointPoint>>,
  width: number,
  height: number,
  bodyFormat: BodyFormat = 'coco18'
): OpenPoseExportData {
  const actorMaps = Array.isArray(positionsOrList) ? positionsOrList : [positionsOrList];
  const keyOrder = bodyFormat === 'body25' ? BODY_25_KEYPOINT_ORDER : COCO_18_KEYPOINT_ORDER;

  const people = actorMaps.map((positions) => {
    const keypoints2d: number[] = [];

    for (const key of keyOrder) {
      const pos = resolveJointPoint(positions, key);
      if (
        pos &&
        pos.visible &&
        Number.isFinite(pos.x) &&
        Number.isFinite(pos.y) &&
        pos.x >= 0 &&
        pos.x <= width &&
        pos.y >= 0 &&
        pos.y <= height
      ) {
        keypoints2d.push(Math.round(pos.x), Math.round(pos.y), 1.0);
      } else {
        keypoints2d.push(0, 0, 0.0);
      }
    }

    return {
      person_id: [-1],
      pose_keypoints_2d: keypoints2d,
      face_keypoints_2d: [],
      hand_left_keypoints_2d: [],
      hand_right_keypoints_2d: [],
    };
  });

  return {
    version: 1.3,
    people,
    canvas_width: width,
    canvas_height: height,
  };
}

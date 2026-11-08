import * as THREE from 'three';
import { OpenPoseExportData } from '@/types';

export interface LimbDef {
  from: string;
  to: string;
  color: string;
}

// OpenPose COCO 표준 컬러 림 정의
export const COCO_LIMBS: LimbDef[] = [
  { from: 'Head', to: 'Neck', color: 'rgb(255, 0, 0)' },
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

export function getJointScreenPositions(
  bones: Map<string, THREE.Bone>,
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number
): Map<string, { x: number; y: number; visible: boolean }> {
  const result = new Map<string, { x: number; y: number; visible: boolean }>();
  const tempVec = new THREE.Vector3();

  bones.forEach((bone, name) => {
    bone.getWorldPosition(tempVec);
    tempVec.project(camera);

    // NDC (-1 ~ 1) -> 픽셀 좌표
    const x = ((tempVec.x + 1) * canvasWidth) / 2;
    const y = ((-tempVec.y + 1) * canvasHeight) / 2;
    const visible = tempVec.z < 1.0; // 카메라 전방 여부

    result.set(name, { x, y, visible });
  });

  return result;
}

export const JOINT_COLORS: Record<string, string> = {
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

export function drawOpenPoseSkeleton(
  ctx: CanvasRenderingContext2D,
  positions: Map<string, { x: number; y: number; visible: boolean }>,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const scale = width / 512;
  const lineWidth = Math.max(3, Math.round(4.5 * scale));
  const jointRadius = Math.max(3, Math.round(4.5 * scale));

  // 1. 관절 연결선(Limbs) 드로잉
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;

  COCO_LIMBS.forEach((limb) => {
    const p1 = positions.get(limb.from);
    const p2 = positions.get(limb.to);
    if (p1 && p2 && p1.visible && p2.visible) {
      ctx.strokeStyle = limb.color;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });

  // 2. 관절 포인트(Joints) 드로잉 - 표준 COCO 키포인트 컬러 매핑
  positions.forEach((pos, name) => {
    if (!pos.visible) return;
    const color = JOINT_COLORS[name] || '#00ff88';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, jointRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function exportOpenPoseJson(
  positions: Map<string, { x: number; y: number; visible: boolean }>,
  width: number,
  height: number
): OpenPoseExportData {
  const keypoints2d: number[] = [];

  const orderedBones = [
    'Head', 'Neck', 'RightArm', 'RightForeArm', 'RightHand',
    'LeftArm', 'LeftForeArm', 'LeftHand', 'RightUpLeg', 'RightLeg',
    'RightFoot', 'LeftUpLeg', 'LeftLeg', 'LeftFoot'
  ];

  orderedBones.forEach((name) => {
    const pos = positions.get(name);
    if (pos && pos.visible) {
      keypoints2d.push(Math.round(pos.x), Math.round(pos.y), 1.0);
    } else {
      keypoints2d.push(0, 0, 0.0);
    }
  });

  return {
    version: 1.3,
    people: [
      {
        person_id: [-1],
        pose_keypoints_2d: keypoints2d,
        face_keypoints_2d: [],
        hand_left_keypoints_2d: [],
        hand_right_keypoints_2d: [],
      },
    ],
    canvas_width: width,
    canvas_height: height,
  };
}


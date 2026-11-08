import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { PoseKeyframe } from '@/types';

interface PosePreviewThumbnailProps {
  postureId: number;
  isSelected?: boolean;
}

interface Point2D {
  x: number;
  y: number;
}

// 2D 스켈레톤 프리뷰 좌표 산출 (초경량 정방향 기하 연산)
function computeSkeleton2D(pose: PoseKeyframe | null): Record<string, Point2D> {
  const points: Record<string, Point2D> = {
    Hips: { x: 50, y: 52 },
    Spine: { x: 50, y: 44 },
    Spine1: { x: 50, y: 35 },
    Neck: { x: 50, y: 27 },
    Head: { x: 50, y: 19 },
    LeftShoulder: { x: 60, y: 34 },
    LeftArm: { x: 67, y: 45 },
    LeftForeArm: { x: 64, y: 57 },
    LeftHand: { x: 59, y: 62 },
    RightShoulder: { x: 40, y: 34 },
    RightArm: { x: 33, y: 45 },
    RightForeArm: { x: 36, y: 57 },
    RightHand: { x: 41, y: 62 },
    LeftUpLeg: { x: 59, y: 54 },
    LeftLeg: { x: 67, y: 70 },
    LeftFoot: { x: 70, y: 86 },
    RightUpLeg: { x: 41, y: 54 },
    RightLeg: { x: 33, y: 70 },
    RightFoot: { x: 30, y: 86 },
  };

  if (!pose) return points;

  // 쿼터니언 회전에 따른 사지 관절 벡터 변위 계산
  const applyBoneRotation = (
    boneName: string,
    parentPos: Point2D,
    defaultVec: [number, number],
    length = 1.0
  ): Point2D => {
    const rot = pose[boneName]?.rotation;
    let dx = defaultVec[0] * length;
    let dy = defaultVec[1] * length;

    if (rot) {
      const q = new THREE.Quaternion(rot[0], rot[1], rot[2], rot[3]);
      const e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
      // 2D 평면 투영 각도 계산
      const cos = Math.cos(e.z - e.x * 0.5);
      const sin = Math.sin(e.z - e.x * 0.5);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      dx = rx;
      dy = ry;
    }

    return {
      x: Math.max(10, Math.min(90, parentPos.x + dx)),
      y: Math.max(10, Math.min(90, parentPos.y + dy)),
    };
  };

  const hips = points.Hips;
  const spine1 = applyBoneRotation('Spine1', hips, [0, -17]);
  const neck = applyBoneRotation('Neck', spine1, [0, -8]);
  const head = applyBoneRotation('Head', neck, [0, -8]);

  points.Spine1 = spine1;
  points.Neck = neck;
  points.Head = head;

  // 팔
  const lShoulder = { x: spine1.x + 9, y: spine1.y };
  const rShoulder = { x: spine1.x - 9, y: spine1.y };
  points.LeftShoulder = lShoulder;
  points.RightShoulder = rShoulder;

  const lArm = applyBoneRotation('LeftArm', lShoulder, [7, 11]);
  const lForeArm = applyBoneRotation('LeftForeArm', lArm, [-3, 12]);
  const lHand = applyBoneRotation('LeftHand', lForeArm, [-5, 6]);

  const rArm = applyBoneRotation('RightArm', rShoulder, [-7, 11]);
  const rForeArm = applyBoneRotation('RightForeArm', rArm, [3, 12]);
  const rHand = applyBoneRotation('RightHand', rForeArm, [5, 6]);

  points.LeftArm = lArm;
  points.LeftForeArm = lForeArm;
  points.LeftHand = lHand;
  points.RightArm = rArm;
  points.RightForeArm = rForeArm;
  points.RightHand = rHand;

  // 다리
  const lUpLeg = { x: hips.x + 8, y: hips.y + 2 };
  const rUpLeg = { x: hips.x - 8, y: hips.y + 2 };
  points.LeftUpLeg = lUpLeg;
  points.RightUpLeg = rUpLeg;

  const lLeg = applyBoneRotation('LeftLeg', lUpLeg, [8, 16]);
  const lFoot = applyBoneRotation('LeftFoot', lLeg, [3, 16]);

  const rLeg = applyBoneRotation('RightLeg', rUpLeg, [-8, 16]);
  const rFoot = applyBoneRotation('RightFoot', rLeg, [-3, 16]);

  points.LeftLeg = lLeg;
  points.LeftFoot = lFoot;
  points.RightLeg = rLeg;
  points.RightFoot = rFoot;

  return points;
}

const LIMB_CONNECTIONS = [
  ['Head', 'Neck'],
  ['Neck', 'Spine1'],
  ['Spine1', 'Hips'],
  ['Spine1', 'LeftShoulder'],
  ['LeftShoulder', 'LeftArm'],
  ['LeftArm', 'LeftForeArm'],
  ['LeftForeArm', 'LeftHand'],
  ['Spine1', 'RightShoulder'],
  ['RightShoulder', 'RightArm'],
  ['RightArm', 'RightForeArm'],
  ['RightForeArm', 'RightHand'],
  ['Hips', 'LeftUpLeg'],
  ['LeftUpLeg', 'LeftLeg'],
  ['LeftLeg', 'LeftFoot'],
  ['Hips', 'RightUpLeg'],
  ['RightUpLeg', 'RightLeg'],
  ['RightLeg', 'RightFoot'],
];

export const PosePreviewThumbnail: React.FC<PosePreviewThumbnailProps> = React.memo(
  ({ postureId, isSelected = false }) => {
    const poseKeyframe = useMemo(() => getSoloThemePoseKeyframe(postureId), [postureId]);
    const skeleton = useMemo(() => computeSkeleton2D(poseKeyframe), [poseKeyframe]);

    const strokeColor = isSelected ? '#38bdf8' : '#94a3b8';
    const jointColor = isSelected ? '#ffffff' : '#64748b';
    const headColor = isSelected ? '#38bdf8' : '#cbd5e1';

    return (
      <div className="relative w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800/80 group-hover:border-zinc-700 transition-colors">
        {/* 미세 그리드 배경 */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:10px_10px] opacity-40" />

        <svg viewBox="0 0 100 100" className="w-full h-full p-2 relative z-10">
          {/* 머리 원형 */}
          <circle
            cx={skeleton.Head.x}
            cy={skeleton.Head.y}
            r="5"
            fill={headColor}
            stroke={isSelected ? '#0284c7' : '#475569'}
            strokeWidth="1.2"
          />

          {/* 본 연결선 */}
          {LIMB_CONNECTIONS.map(([p1Key, p2Key], idx) => {
            const p1 = skeleton[p1Key];
            const p2 = skeleton[p2Key];
            if (!p1 || !p2) return null;
            return (
              <line
                key={idx}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={strokeColor}
                strokeWidth={isSelected ? '2.4' : '1.8'}
                strokeLinecap="round"
              />
            );
          })}

          {/* 주요 관절 조인트 점 */}
          {Object.entries(skeleton).map(([key, pt]) => {
            if (key === 'Head') return null;
            return (
              <circle
                key={key}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? '2.2' : '1.6'}
                fill={jointColor}
              />
            );
          })}
        </svg>
      </div>
    );
  }
);

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { PoseKeyframe } from '@/types';

interface PosePreviewThumbnailProps {
  postureId?: number;
  customPose?: PoseKeyframe;
  isSelected?: boolean;
}

interface Point2D {
  x: number;
  y: number;
}

// 3D 쿼터니언 정방향 운동학(FK)을 통한 정확한 2D 정면/반측면 투영 좌표 산출
function computeAccurateSkeleton2D(pose: PoseKeyframe | null): Record<string, Point2D> {
  const getQuat = (name: string): THREE.Quaternion => {
    const r = pose?.[name]?.rotation;
    return r ? new THREE.Quaternion(r[0], r[1], r[2], r[3]) : new THREE.Quaternion();
  };

  const hipPos3D = new THREE.Vector3(0, pose?.Hips?.position?.[1] ?? 0.58, 0);
  const qHips = getQuat('Hips');
  const qSpine = qHips.clone().multiply(getQuat('Spine'));
  const qSpine1 = qSpine.clone().multiply(getQuat('Spine1'));
  const qNeck = qSpine1.clone().multiply(getQuat('Neck'));
  const qHead = qNeck.clone().multiply(getQuat('Head'));

  const spinePos = hipPos3D.clone().add(new THREE.Vector3(0, 0.14, 0).applyQuaternion(qHips));
  const spine1Pos = spinePos.clone().add(new THREE.Vector3(0, 0.18, 0).applyQuaternion(qSpine));
  const neckPos = spine1Pos.clone().add(new THREE.Vector3(0, 0.18, 0).applyQuaternion(qSpine1));
  const headPos = neckPos.clone().add(new THREE.Vector3(0, 0.14, 0).applyQuaternion(qHead));

  const lShoulderPos = spine1Pos.clone().add(new THREE.Vector3(0.14, 0.12, 0).applyQuaternion(qSpine1));
  const rShoulderPos = spine1Pos.clone().add(new THREE.Vector3(-0.14, 0.12, 0).applyQuaternion(qSpine1));

  const qLArm = qSpine1.clone().multiply(getQuat('LeftArm'));
  const qLFore = qLArm.clone().multiply(getQuat('LeftForeArm'));
  const lElbowPos = lShoulderPos.clone().add(new THREE.Vector3(0.22, 0, 0).applyQuaternion(qLArm));
  const lHandPos = lElbowPos.clone().add(new THREE.Vector3(0.20, 0, 0).applyQuaternion(qLFore));

  const qRArm = qSpine1.clone().multiply(getQuat('RightArm'));
  const qRFore = qRArm.clone().multiply(getQuat('RightForeArm'));
  const rElbowPos = rShoulderPos.clone().add(new THREE.Vector3(-0.22, 0, 0).applyQuaternion(qRArm));
  const rHandPos = rElbowPos.clone().add(new THREE.Vector3(-0.20, 0, 0).applyQuaternion(qRFore));

  const lHipPos = hipPos3D.clone().add(new THREE.Vector3(0.11, -0.04, 0).applyQuaternion(qHips));
  const rHipPos = hipPos3D.clone().add(new THREE.Vector3(-0.11, -0.04, 0).applyQuaternion(qHips));

  const qLUpLeg = qHips.clone().multiply(getQuat('LeftUpLeg'));
  const qLLeg = qLUpLeg.clone().multiply(getQuat('LeftLeg'));
  const lKneePos = lHipPos.clone().add(new THREE.Vector3(0, -0.36, 0).applyQuaternion(qLUpLeg));
  const lFootPos = lKneePos.clone().add(new THREE.Vector3(0, -0.35, 0).applyQuaternion(qLLeg));

  const qRUpLeg = qHips.clone().multiply(getQuat('RightUpLeg'));
  const qRLeg = qRUpLeg.clone().multiply(getQuat('RightLeg'));
  const rKneePos = rHipPos.clone().add(new THREE.Vector3(0, -0.36, 0).applyQuaternion(qRUpLeg));
  const rFootPos = rKneePos.clone().add(new THREE.Vector3(0, -0.35, 0).applyQuaternion(qRLeg));

  const raw3D: Record<string, THREE.Vector3> = {
    Hips: hipPos3D,
    Spine: spinePos,
    Spine1: spine1Pos,
    Neck: neckPos,
    Head: headPos,
    LeftShoulder: lShoulderPos,
    LeftArm: lElbowPos,
    LeftHand: lHandPos,
    RightShoulder: rShoulderPos,
    RightArm: rElbowPos,
    RightHand: rHandPos,
    LeftUpLeg: lHipPos,
    LeftLeg: lKneePos,
    LeftFoot: lFootPos,
    RightUpLeg: rHipPos,
    RightLeg: rKneePos,
    RightFoot: rFootPos,
  };

  // 바운딩 박스 중심 정규화하여 100x100 SVG 안에 항상 알맞게 배치
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  Object.values(raw3D).forEach((v) => {
    const px = v.x + v.z * 0.28; // 약간의 입체 사선 투영으로 앞뒤 굽힘 표현
    const py = v.y - v.z * 0.18;
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  });

  const span = Math.max(maxX - minX, maxY - minY, 0.75);
  const scale = 64 / span;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const result: Record<string, Point2D> = {};
  Object.entries(raw3D).forEach(([k, v]) => {
    const px = v.x + v.z * 0.28;
    const py = v.y - v.z * 0.18;
    result[k] = {
      x: 50 + (px - cx) * scale,
      y: 52 - (py - cy) * scale,
    };
  });

  return result;
}

const LIMB_CONNECTIONS: Array<{ from: string; to: string; color: string; width: number }> = [
  { from: 'Head', to: 'Neck', color: '#f43f5e', width: 2.6 },
  { from: 'Neck', to: 'Spine1', color: '#38bdf8', width: 3.0 },
  { from: 'Spine1', to: 'Spine', color: '#38bdf8', width: 3.0 },
  { from: 'Spine', to: 'Hips', color: '#38bdf8', width: 3.0 },
  { from: 'Neck', to: 'LeftShoulder', color: '#a3e635', width: 2.4 },
  { from: 'LeftShoulder', to: 'LeftArm', color: '#4ade80', width: 2.4 },
  { from: 'LeftArm', to: 'LeftHand', color: '#2dd4bf', width: 2.2 },
  { from: 'Neck', to: 'RightShoulder', color: '#fb923c', width: 2.4 },
  { from: 'RightShoulder', to: 'RightArm', color: '#facc15', width: 2.4 },
  { from: 'RightArm', to: 'RightHand', color: '#fde047', width: 2.2 },
  { from: 'Hips', to: 'LeftUpLeg', color: '#38bdf8', width: 2.6 },
  { from: 'LeftUpLeg', to: 'LeftLeg', color: '#60a5fa', width: 2.6 },
  { from: 'LeftLeg', to: 'LeftFoot', color: '#818cf8', width: 2.4 },
  { from: 'Hips', to: 'RightUpLeg', color: '#34d399', width: 2.6 },
  { from: 'RightUpLeg', to: 'RightLeg', color: '#2dd4bf', width: 2.6 },
  { from: 'RightLeg', to: 'RightFoot', color: '#22d3ee', width: 2.4 },
];

export const PosePreviewThumbnail: React.FC<PosePreviewThumbnailProps> = React.memo(
  ({ postureId, customPose, isSelected = false }) => {
    const poseKeyframe = useMemo(
      () => customPose || (postureId ? getSoloThemePoseKeyframe(postureId) : null),
      [postureId, customPose]
    );
    const skeleton = useMemo(() => computeAccurateSkeleton2D(poseKeyframe), [poseKeyframe]);

    return (
      <div className="relative w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800/80 group-hover:border-zinc-600 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:10px_10px] opacity-45" />

        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 relative z-10">
          {/* 몸통 실루엣 폴리곤 (입체 마네킹 느낌 부여) */}
          <polygon
            points={`${skeleton.LeftShoulder.x},${skeleton.LeftShoulder.y} ${skeleton.RightShoulder.x},${skeleton.RightShoulder.y} ${skeleton.RightUpLeg.x},${skeleton.RightUpLeg.y} ${skeleton.LeftUpLeg.x},${skeleton.LeftUpLeg.y}`}
            fill={isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(148, 163, 184, 0.12)'}
            stroke={isSelected ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.2)'}
            strokeWidth="0.8"
          />

          {/* 본 연결선 (고급 컬러 스켈레톤) */}
          {LIMB_CONNECTIONS.map((limb, idx) => {
            const p1 = skeleton[limb.from];
            const p2 = skeleton[limb.to];
            if (!p1 || !p2) return null;
            return (
              <line
                key={idx}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={limb.color}
                strokeWidth={isSelected ? limb.width + 0.5 : limb.width}
                strokeLinecap="round"
              />
            );
          })}

          {/* 머리 원형 */}
          <circle
            cx={skeleton.Head.x}
            cy={skeleton.Head.y}
            r="6.2"
            fill={isSelected ? '#38bdf8' : '#e2e8f0'}
            stroke="#0f172a"
            strokeWidth="1.2"
          />

          {/* 주요 관절 조인트 점 */}
          {Object.entries(skeleton).map(([key, pt]) => {
            if (key === 'Head') return null;
            return (
              <circle
                key={key}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? '2.2' : '1.8'}
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="0.6"
              />
            );
          })}
        </svg>
      </div>
    );
  }
);

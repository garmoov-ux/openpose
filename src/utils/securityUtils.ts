import { JOINT_DEFINITIONS } from '@/core/mannequin/humanoidRig';

export interface ValidatedBoneData {
  rotation: [number, number, number, number];
  position?: [number, number, number];
}

export interface ValidatedPoseSnapshot {
  name: string;
  timestamp: number;
  bones: Record<string, ValidatedBoneData>;
}

const ALLOWED_BONE_NAMES = new Set(JOINT_DEFINITIONS.map((j) => j.name));
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function validateAndSanitizePoseData(raw: unknown): ValidatedPoseSnapshot | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const obj = raw as Record<string, unknown>;

  const name = typeof obj.name === 'string' && obj.name.trim().length > 0
    ? obj.name.slice(0, 50)
    : 'imported-pose';

  const timestamp = typeof obj.timestamp === 'number' && Number.isFinite(obj.timestamp)
    ? obj.timestamp
    : Date.now();

  if (!obj.bones || typeof obj.bones !== 'object' || Array.isArray(obj.bones)) {
    return null;
  }

  const rawBones = obj.bones as Record<string, unknown>;
  const sanitizedBones: Record<string, ValidatedBoneData> = Object.create(null);

  for (const [key, val] of Object.entries(rawBones)) {
    // 1. 프로토타입 오염 방어
    if (FORBIDDEN_KEYS.has(key)) continue;

    // 2. 허용된 인체 관절명인지 검증
    if (!ALLOWED_BONE_NAMES.has(key)) continue;

    if (!val || typeof val !== 'object' || Array.isArray(val)) continue;
    const boneEntry = val as Record<string, unknown>;

    // 3. 쿼터니언 회전값 4개 숫자 검증
    if (!Array.isArray(boneEntry.rotation) || boneEntry.rotation.length !== 4) continue;
    const rot = boneEntry.rotation;
    const isValidRot = rot.every((n) => typeof n === 'number' && Number.isFinite(n));
    if (!isValidRot) continue;

    const validated: ValidatedBoneData = {
      rotation: [rot[0], rot[1], rot[2], rot[3]],
    };

    // 4. 위치 좌표값 검증 (선택적)
    if (Array.isArray(boneEntry.position) && boneEntry.position.length === 3) {
      const pos = boneEntry.position;
      const isValidPos = pos.every((n) => typeof n === 'number' && Number.isFinite(n));
      if (isValidPos) {
        validated.position = [pos[0], pos[1], pos[2]];
      }
    }

    sanitizedBones[key] = validated;
  }

  if (Object.keys(sanitizedBones).length === 0) {
    return null;
  }

  return {
    name,
    timestamp,
    bones: sanitizedBones,
  };
}

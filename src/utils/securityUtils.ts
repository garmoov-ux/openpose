import { JOINT_DEFINITIONS } from '@/core/mannequin/humanoidRig';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { MannequinModelId } from '@/types';
import {
  ActorPoseTransform,
  Quat,
  SceneActorV1,
  SceneDocumentV1,
  Vec3,
} from '@/types/sceneDocument';

export interface ValidatedBoneData {
  rotation: [number, number, number, number];
  position?: [number, number, number];
}

export interface ValidatedPoseSnapshot {
  name: string;
  timestamp: number;
  bones: Record<string, ValidatedBoneData>;
}

export const ALLOWED_BONE_NAMES = new Set(JOINT_DEFINITIONS.map((j) => j.name));
export const ALLOWED_MODEL_IDS = new Set<MannequinModelId>(MANNEQUIN_MODELS.map((m) => m.id));
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
export const MAX_SCENE_JSON_BYTES = 512 * 1024;
export const MAX_SCENE_ACTORS = 4;

export function isValidVec3(v: unknown): v is Vec3 {
  return (
    Array.isArray(v) &&
    v.length === 3 &&
    v.every((n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 100)
  );
}

export function normalizeQuat(q: unknown): Quat | null {
  if (!Array.isArray(q) || q.length !== 4) return null;
  if (!q.every((n) => typeof n === 'number' && Number.isFinite(n))) return null;
  const [x, y, z, w] = q as number[];
  const len = Math.hypot(x, y, z, w);
  if (len < 1e-6 || !Number.isFinite(len)) return null;
  return [x / len, y / len, z / len, w / len];
}

export function validateAndSanitizePoseData(raw: unknown): ValidatedPoseSnapshot | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const obj = raw as Record<string, unknown>;

  const name =
    typeof obj.name === 'string' && obj.name.trim().length > 0
      ? obj.name.slice(0, 50)
      : 'imported-pose';

  const timestamp =
    typeof obj.timestamp === 'number' && Number.isFinite(obj.timestamp)
      ? obj.timestamp
      : Date.now();

  if (!obj.bones || typeof obj.bones !== 'object' || Array.isArray(obj.bones)) {
    return null;
  }

  const rawBones = obj.bones as Record<string, unknown>;
  const sanitizedBones: Record<string, ValidatedBoneData> = Object.create(null);

  for (const [key, val] of Object.entries(rawBones)) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    if (!ALLOWED_BONE_NAMES.has(key)) continue;
    if (!val || typeof val !== 'object' || Array.isArray(val)) continue;

    const boneEntry = val as Record<string, unknown>;
    const normQ = normalizeQuat(boneEntry.rotation);
    if (!normQ) continue;
    const rawRot = boneEntry.rotation as number[];

    const validated: ValidatedBoneData = {
      rotation: [rawRot[0], rawRot[1], rawRot[2], rawRot[3]],
    };

    if (isValidVec3(boneEntry.position)) {
      validated.position = [boneEntry.position[0], boneEntry.position[1], boneEntry.position[2]];
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

function validateActorV1(raw: unknown): { actor?: SceneActorV1; error?: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: '인물 객체 형식이 올바르지 않습니다.' };
  }
  const obj = raw as Record<string, unknown>;
  const id = typeof obj.id === 'string' && obj.id.trim().length > 0 ? obj.id.trim().slice(0, 32) : null;
  if (!id || FORBIDDEN_KEYS.has(id)) {
    return { error: '유효하지 않은 인물 ID입니다.' };
  }

  const modelId = obj.modelId as MannequinModelId;
  if (!ALLOWED_MODEL_IDS.has(modelId)) {
    return { error: `지원하지 않는 마네킹 모델입니다: ${String(obj.modelId)}` };
  }

  if (!obj.root || typeof obj.root !== 'object' || Array.isArray(obj.root)) {
    return { error: `인물(${id})의 root 변환 정보가 없습니다.` };
  }
  const rootObj = obj.root as Record<string, unknown>;
  if (!isValidVec3(rootObj.position)) {
    return { error: `인물(${id})의 root.position이 유효하지 않습니다.` };
  }
  const rootQuat = normalizeQuat(rootObj.rotation);
  if (!rootQuat) {
    return { error: `인물(${id})의 root.rotation이 유효하지 않습니다.` };
  }
  const scale = typeof rootObj.scale === 'number' && Number.isFinite(rootObj.scale) ? rootObj.scale : 1.0;
  if (scale < 0.2 || scale > 3.0) {
    return { error: `인물(${id})의 크기 배율(${scale})이 허용 범위(0.2~3.0)를 벗어났습니다.` };
  }

  if (!obj.bones || typeof obj.bones !== 'object' || Array.isArray(obj.bones)) {
    return { error: `인물(${id})의 bones 데이터가 없습니다.` };
  }
  const rawBones = obj.bones as Record<string, unknown>;
  const bones: Record<string, ActorPoseTransform> = Object.create(null);

  for (const [boneId, bVal] of Object.entries(rawBones)) {
    if (FORBIDDEN_KEYS.has(boneId)) {
      return { error: '허용되지 않는 키가 포함되어 있습니다.' };
    }
    if (!ALLOWED_BONE_NAMES.has(boneId)) {
      return { error: `허용되지 않는 관절 이름입니다: ${boneId}` };
    }
    if (!bVal || typeof bVal !== 'object' || Array.isArray(bVal)) {
      return { error: `관절(${boneId}) 데이터가 올바르지 않습니다.` };
    }
    const bEntry = bVal as Record<string, unknown>;
    const q = normalizeQuat(bEntry.rotation);
    if (!q) {
      return { error: `관절(${boneId})의 쿼터니언 값이 유효하지 않습니다.` };
    }
    const transform: ActorPoseTransform = { rotation: q };
    if (bEntry.position !== undefined) {
      if (boneId !== 'Hips' || !isValidVec3(bEntry.position)) {
        return { error: `관절(${boneId}) 위치 이동은 Hips에만 허용되며 유한한 Vec3여야 합니다.` };
      }
      transform.position = [bEntry.position[0], bEntry.position[1], bEntry.position[2]];
    }
    bones[boneId] = transform;
  }

  return {
    actor: {
      id,
      name: typeof obj.name === 'string' && obj.name.trim() ? obj.name.trim().slice(0, 40) : id,
      modelId,
      visible: typeof obj.visible === 'boolean' ? obj.visible : true,
      root: {
        position: [rootObj.position[0], rootObj.position[1], rootObj.position[2]],
        rotation: rootQuat,
        scale,
      },
      bones,
    },
  };
}

export function validateSceneDocumentV1(raw: unknown): {
  document?: SceneDocumentV1;
  error?: string;
} {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'JSON 최상위 구조가 객체가 아닙니다.' };
  }
  const obj = raw as Record<string, unknown>;
  if (obj.schemaVersion !== 1) {
    return { error: `지원하지 않는 schemaVersion입니다: ${String(obj.schemaVersion)}` };
  }
  if (obj.units !== 'meter' || obj.coordinateSystem !== 'right-handed-y-up') {
    return { error: '단위계(meter) 또는 좌표계(right-handed-y-up)가 일치하지 않습니다.' };
  }
  if (!Array.isArray(obj.actors) || obj.actors.length === 0 || obj.actors.length > MAX_SCENE_ACTORS) {
    return { error: `actors 배열은 1명 이상 ${MAX_SCENE_ACTORS}명 이하여야 합니다.` };
  }

  const actors: SceneActorV1[] = [];
  const seenIds = new Set<string>();
  for (const rawActor of obj.actors) {
    const res = validateActorV1(rawActor);
    if (!res.actor) return { error: res.error };
    if (seenIds.has(res.actor.id)) {
      return { error: `중복된 인물 ID가 존재합니다: ${res.actor.id}` };
    }
    seenIds.add(res.actor.id);
    actors.push(res.actor);
  }

  const cam = obj.camera as Record<string, unknown> | undefined;
  if (
    !cam ||
    cam.projection !== 'perspective' ||
    !isValidVec3(cam.position) ||
    !isValidVec3(cam.target) ||
    typeof cam.fovDegrees !== 'number' ||
    !Number.isFinite(cam.fovDegrees) ||
    cam.fovDegrees < 10 ||
    cam.fovDegrees > 120
  ) {
    return { error: '카메라 설정(position, target, fovDegrees)이 유효하지 않습니다.' };
  }

  const near = typeof cam.near === 'number' && cam.near > 0.01 ? cam.near : 0.1;
  const far = typeof cam.far === 'number' && cam.far > near ? cam.far : 50;

  const exp = obj.export as Record<string, unknown> | undefined;
  const width = typeof exp?.width === 'number' && exp.width >= 256 && exp.width <= 2048 ? Math.round(exp.width) : 1024;
  const height = typeof exp?.height === 'number' && exp.height >= 256 && exp.height <= 2048 ? Math.round(exp.height) : 1024;
  const bodyFormat = exp?.bodyFormat === 'body25' ? 'body25' : 'coco18';
  const revision = typeof obj.revision === 'number' && Number.isInteger(obj.revision) && obj.revision >= 0 ? obj.revision : 1;

  return {
    document: {
      schemaVersion: 1,
      revision,
      units: 'meter',
      coordinateSystem: 'right-handed-y-up',
      actors,
      camera: {
        projection: 'perspective',
        position: [cam.position[0], cam.position[1], cam.position[2]],
        target: [cam.target[0], cam.target[1], cam.target[2]],
        fovDegrees: cam.fovDegrees,
        near,
        far,
      },
      export: { width, height, bodyFormat },
    },
  };
}

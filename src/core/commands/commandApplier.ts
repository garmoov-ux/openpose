import { POSE_PRESETS } from '@/core/mannequin/presets';
import {
  ActorId,
  ActorPoseTransform,
  CommandBatch,
  CommandBatchResult,
  SceneActorV1,
  SceneCommand,
  SceneDocumentV1,
} from '@/types/sceneDocument';
import {
  ALLOWED_BONE_NAMES,
  ALLOWED_MODEL_IDS,
  isValidVec3,
  MAX_SCENE_ACTORS,
  normalizeQuat,
} from '@/utils/securityUtils';
import {
  clampQuaternionToRom,
  getSymmetricBoneName,
  JOINT_ROM_LIMITS,
  mirrorQuaternionLeftRight,
} from './romAndSymmetry';

export {
  clampQuaternionToRom,
  getSymmetricBoneName,
  JOINT_ROM_LIMITS,
  mirrorQuaternionLeftRight,
};

export function createDefaultSceneDocument(): SceneDocumentV1 {
  const defaultPreset = POSE_PRESETS[0];
  const defaultBones: Record<string, ActorPoseTransform> = {};
  if (defaultPreset?.pose) {
    for (const [boneId, entry] of Object.entries(defaultPreset.pose)) {
      const q = normalizeQuat(entry.rotation) || [0, 0, 0, 1];
      defaultBones[boneId] = { rotation: q };
    }
  }

  return {
    schemaVersion: 1,
    revision: 1,
    units: 'meter',
    coordinateSystem: 'right-handed-y-up',
    actors: [
      {
        id: 'main',
        name: '메인 인물',
        modelId: 'realistic_woman',
        visible: true,
        root: { position: [0, 0, 0], rotation: [0, 0, 0, 1], scale: 1.0 },
        bones: defaultBones,
      },
      {
        id: 'partner',
        name: '파트너 인물',
        modelId: 'realistic_muscular_male',
        visible: false,
        root: { position: [0, 0, -0.28], rotation: [0, 0, 0, 1], scale: 1.0 },
        bones: { ...defaultBones },
      },
    ],
    camera: {
      projection: 'perspective',
      position: [0, 0.92, 3.75],
      target: [0, 0.86, 0],
      fovDegrees: 42,
      near: 0.1,
      far: 50,
    },
    export: { width: 1024, height: 1024, bodyFormat: 'coco18' },
  };
}

export function cloneSceneDocument(doc: SceneDocumentV1): SceneDocumentV1 {
  return {
    schemaVersion: 1,
    revision: doc.revision,
    units: 'meter',
    coordinateSystem: 'right-handed-y-up',
    actors: doc.actors.map((a) => ({
      id: a.id,
      name: a.name,
      modelId: a.modelId,
      visible: a.visible,
      root: {
        position: [...a.root.position] as [number, number, number],
        rotation: [...a.root.rotation] as [number, number, number, number],
        scale: a.root.scale,
      },
      bones: Object.fromEntries(
        Object.entries(a.bones).map(([k, v]) => [
          k,
          {
            rotation: [...v.rotation] as [number, number, number, number],
            ...(v.position ? { position: [...v.position] as [number, number, number] } : {}),
          },
        ])
      ),
    })),
    camera: {
      projection: 'perspective',
      position: [...doc.camera.position] as [number, number, number],
      target: [...doc.camera.target] as [number, number, number],
      fovDegrees: doc.camera.fovDegrees,
      near: doc.camera.near,
      far: doc.camera.far,
    },
    export: { ...doc.export },
  };
}

function applySingleCommand(
  draft: SceneDocumentV1,
  cmd: SceneCommand,
  changedActorIds: Set<ActorId>,
  warnings: string[],
  enforceRom: boolean
): string | null {
  switch (cmd.type) {
    case 'actor.add': {
      if (draft.actors.length >= MAX_SCENE_ACTORS) return `최대 인물 수(${MAX_SCENE_ACTORS}명)를 초과할 수 없습니다.`;
      if (draft.actors.some((a) => a.id === cmd.actor.id)) return `이미 존재하는 인물 ID입니다: ${cmd.actor.id}`;
      if (!ALLOWED_MODEL_IDS.has(cmd.actor.modelId)) return `지원하지 않는 모델 ID입니다: ${cmd.actor.modelId}`;
      const actorCopy: SceneActorV1 = {
        ...cmd.actor,
        root: {
          position: [...cmd.actor.root.position],
          rotation: normalizeQuat(cmd.actor.root.rotation) || [0, 0, 0, 1],
          scale: Math.max(0.2, Math.min(3.0, cmd.actor.root.scale)),
        },
        bones: { ...cmd.actor.bones },
      };
      draft.actors.push(actorCopy);
      changedActorIds.add(actorCopy.id);
      return null;
    }
    case 'actor.remove': {
      if (cmd.actorId === 'main') return '기본 메인 인물(main)은 제거할 수 없습니다.';
      const idx = draft.actors.findIndex((a) => a.id === cmd.actorId);
      if (idx === -1) return `제거할 인물을 찾을 수 없습니다: ${cmd.actorId}`;
      draft.actors.splice(idx, 1);
      changedActorIds.add(cmd.actorId);
      return null;
    }
    case 'actor.visibility.set': {
      const actor = draft.actors.find((a) => a.id === cmd.actorId);
      if (!actor) return `대상 인물을 찾을 수 없습니다: ${cmd.actorId}`;
      actor.visible = Boolean(cmd.visible);
      changedActorIds.add(actor.id);
      return null;
    }
    case 'actor.model.set': {
      const actor = draft.actors.find((a) => a.id === cmd.actorId);
      if (!actor) return `대상 인물을 찾을 수 없습니다: ${cmd.actorId}`;
      if (!ALLOWED_MODEL_IDS.has(cmd.modelId)) return `지원하지 않는 모델 ID입니다: ${cmd.modelId}`;
      actor.modelId = cmd.modelId;
      changedActorIds.add(actor.id);
      return null;
    }
    case 'actor.root.set': {
      const actor = draft.actors.find((a) => a.id === cmd.actorId);
      if (!actor) return `대상 인물을 찾을 수 없습니다: ${cmd.actorId}`;
      if (cmd.position !== undefined) {
        if (!isValidVec3(cmd.position)) return '유효하지 않은 root.position 값입니다.';
        actor.root.position = [...cmd.position];
      }
      if (cmd.rotation !== undefined) {
        const q = normalizeQuat(cmd.rotation);
        if (!q) return '유효하지 않은 root.rotation 쿼터니언입니다.';
        actor.root.rotation = q;
      }
      if (cmd.scale !== undefined) {
        if (typeof cmd.scale !== 'number' || !Number.isFinite(cmd.scale) || cmd.scale < 0.2 || cmd.scale > 3.0) {
          return 'root.scale은 0.2 이상 3.0 이하여야 합니다.';
        }
        actor.root.scale = cmd.scale;
      }
      changedActorIds.add(actor.id);
      return null;
    }
    case 'bone.rotation.set': {
      const actor = draft.actors.find((a) => a.id === cmd.actorId);
      if (!actor) return `대상 인물을 찾을 수 없습니다: ${cmd.actorId}`;
      if (!ALLOWED_BONE_NAMES.has(cmd.boneId)) return `허용되지 않는 관절 이름입니다: ${cmd.boneId}`;
      const norm = normalizeQuat(cmd.rotation);
      if (!norm) return `관절(${cmd.boneId}) 회전 쿼터니언이 유효하지 않습니다.`;

      if (enforceRom) {
        const romRes = clampQuaternionToRom(cmd.boneId, norm);
        if (romRes.clamped) warnings.push(`${actor.id}.${cmd.boneId}: 가동 범위(ROM) 내로 보정되었습니다.`);
        actor.bones[cmd.boneId] = { ...actor.bones[cmd.boneId], rotation: romRes.rotation };
      } else {
        actor.bones[cmd.boneId] = { ...actor.bones[cmd.boneId], rotation: norm };
      }
      changedActorIds.add(actor.id);
      return null;
    }
    case 'pose.apply': {
      const actor = draft.actors.find((a) => a.id === cmd.actorId);
      if (!actor) return `대상 인물을 찾을 수 없습니다: ${cmd.actorId}`;
      const srcPose = cmd.bones || POSE_PRESETS.find((p) => p.id === cmd.presetId)?.pose;
      if (!srcPose) return `존재하지 않는 포즈 프리셋입니다: ${cmd.presetId}`;
      const nextBones: Record<string, ActorPoseTransform> = {};
      for (const [bName, bVal] of Object.entries(srcPose)) {
        if (!ALLOWED_BONE_NAMES.has(bName)) continue;
        const q = normalizeQuat(bVal.rotation);
        if (!q) return `포즈의 관절(${bName}) 쿼터니언이 유효하지 않습니다.`;
        nextBones[bName] = { rotation: q };
      }
      actor.bones = nextBones;
      changedActorIds.add(actor.id);
      return null;
    }
    case 'camera.set': {
      if (cmd.camera.position !== undefined) {
        if (!isValidVec3(cmd.camera.position)) return '유효하지 않은 카메라 position입니다.';
        draft.camera.position = [...cmd.camera.position];
      }
      if (cmd.camera.target !== undefined) {
        if (!isValidVec3(cmd.camera.target)) return '유효하지 않은 카메라 target입니다.';
        draft.camera.target = [...cmd.camera.target];
      }
      if (cmd.camera.fovDegrees !== undefined) {
        if (typeof cmd.camera.fovDegrees !== 'number' || cmd.camera.fovDegrees < 10 || cmd.camera.fovDegrees > 120) {
          return '카메라 FOV는 10~120도 범위여야 합니다.';
        }
        draft.camera.fovDegrees = cmd.camera.fovDegrees;
      }
      return null;
    }
    case 'export.set': {
      if (cmd.exportConfig.width !== undefined) {
        if (cmd.exportConfig.width < 256 || cmd.exportConfig.width > 2048) return '출력 가로 해상도는 256~2048px 범위여야 합니다.';
        draft.export.width = Math.round(cmd.exportConfig.width);
      }
      if (cmd.exportConfig.height !== undefined) {
        if (cmd.exportConfig.height < 256 || cmd.exportConfig.height > 2048) return '출력 세로 해상도는 256~2048px 범위여야 합니다.';
        draft.export.height = Math.round(cmd.exportConfig.height);
      }
      if (cmd.exportConfig.bodyFormat !== undefined) {
        draft.export.bodyFormat = cmd.exportConfig.bodyFormat === 'body25' ? 'body25' : 'coco18';
      }
      return null;
    }
    default:
      return '알 수 없는 명령 타입입니다.';
  }
}

export function applyCommandBatch(
  currentDoc: SceneDocumentV1,
  batch: CommandBatch,
  processedRequestIds: Set<string>,
  options: { enforceRom?: boolean } = {}
): CommandBatchResult {
  const fail = (requestId: string, error: string): CommandBatchResult => ({
    ok: false, requestId, revision: currentDoc.revision, changedActorIds: [], warnings: [], error, document: currentDoc,
  });

  if (!batch || batch.schemaVersion !== 1 || !Array.isArray(batch.commands)) {
    return fail(batch?.requestId || 'invalid', '명령 배치 스키마 버전(schemaVersion: 1) 또는 명령 배열이 유효하지 않습니다.');
  }
  if (!batch.requestId || typeof batch.requestId !== 'string') {
    return fail('missing', 'requestId가 누락되었습니다.');
  }
  if (processedRequestIds.has(batch.requestId)) {
    return {
      ok: true, requestId: batch.requestId, revision: currentDoc.revision,
      changedActorIds: [], warnings: ['중복된 requestId이므로 재적용하지 않았습니다.'], document: currentDoc,
    };
  }
  if (batch.baseRevision !== currentDoc.revision) {
    return fail(batch.requestId, `baseRevision 충돌: 요청(${batch.baseRevision}) != 현재(${currentDoc.revision})`);
  }
  if (batch.commands.length === 0 || batch.commands.length > 100) {
    return fail(batch.requestId, '명령 개수는 1개 이상 100개 이하여야 합니다.');
  }

  const draft = cloneSceneDocument(currentDoc);
  const changedActorIds = new Set<ActorId>();
  const warnings: string[] = [];
  const enforceRom = options.enforceRom ?? true;

  for (const cmd of batch.commands) {
    const err = applySingleCommand(draft, cmd, changedActorIds, warnings, enforceRom);
    if (err) return fail(batch.requestId, err);
  }

  draft.revision = currentDoc.revision + 1;
  processedRequestIds.add(batch.requestId);

  return {
    ok: true,
    requestId: batch.requestId,
    revision: draft.revision,
    changedActorIds: Array.from(changedActorIds),
    warnings,
    document: draft,
  };
}

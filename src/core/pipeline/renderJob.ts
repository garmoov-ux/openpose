import * as THREE from 'three';
import { ActorId, RenderResult, RenderSpec } from '@/types/sceneDocument';
import { dataURLtoBlob } from '@/utils/exportUtils';
import {
  drawOpenPoseSkeleton,
  exportOpenPoseJson,
  getJointScreenPositions,
  ScreenJointPoint,
} from './openposePipeline';

export interface RenderableActorEntry {
  id: ActorId;
  visible: boolean;
  group: THREE.Group;
  bones: Map<string, THREE.Bone>;
}

export interface RenderJobContext {
  camera: THREE.PerspectiveCamera;
  actors: RenderableActorEntry[];
  captureCanvasDataUrl?: (width: number, height: number, renderCam: THREE.PerspectiveCamera) => string;
  depthRange?: { near: number; far: number };
}

export function createRenderCamera(
  baseCamera: THREE.PerspectiveCamera,
  width: number,
  height: number
): THREE.PerspectiveCamera {
  baseCamera.updateMatrixWorld();
  const cloned = baseCamera.clone();
  cloned.aspect = width / Math.max(1, height);
  cloned.updateMatrixWorld();
  cloned.updateProjectionMatrix();
  return cloned;
}

export function projectActorsWithRenderSpec(
  spec: Pick<RenderSpec, 'width' | 'height' | 'actorIds' | 'bodyFormat'>,
  camera: THREE.PerspectiveCamera,
  actors: RenderableActorEntry[]
): {
  renderCam: THREE.PerspectiveCamera;
  actorPositionMaps: Array<Map<string, ScreenJointPoint>>;
  keypoints: ReturnType<typeof exportOpenPoseJson>;
  supportedKeypointCount: number;
} {
  const renderCam = createRenderCamera(camera, spec.width, spec.height);
  const requestedSet = new Set(spec.actorIds);
  const activeActors = actors.filter(
    (a) => a.visible && (requestedSet.size === 0 || requestedSet.has(a.id))
  );

  for (const actor of activeActors) {
    actor.group.updateMatrixWorld(true);
  }

  const actorPositionMaps = activeActors.map((actor) =>
    getJointScreenPositions(actor.bones, renderCam, spec.width, spec.height)
  );

  const keypoints = exportOpenPoseJson(
    actorPositionMaps,
    spec.width,
    spec.height,
    spec.bodyFormat
  );

  // 현재 본 앵커 지원 개수 (Nose + 13 신체 본 = 14개 유효 투영 지원)
  const supportedKeypointCount = 14;

  return {
    renderCam,
    actorPositionMaps,
    keypoints,
    supportedKeypointCount,
  };
}

export function executeRenderJob(
  spec: RenderSpec,
  context: RenderJobContext
): RenderResult {
  const { renderCam, actorPositionMaps, keypoints, supportedKeypointCount } =
    projectActorsWithRenderSpec(spec, context.camera, context.actors);

  let dataUrl = '';

  if (context.captureCanvasDataUrl) {
    dataUrl = context.captureCanvasDataUrl(spec.width, spec.height, renderCam);
  } else if (typeof document !== 'undefined') {
    const offCanvas = Object.assign(document.createElement('canvas'), {
      width: spec.width,
      height: spec.height,
    });
    const ctx = offCanvas.getContext('2d');
    if (ctx) {
      drawOpenPoseSkeleton(ctx, actorPositionMaps, spec.width, spec.height);
      dataUrl = offCanvas.toDataURL('image/png');
    }
  }

  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    // 1x1 투명 PNG 폴백 (헤드리스/단위 테스트 환경 지원)
    dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }

  const png = dataURLtoBlob(dataUrl);

  return {
    png,
    dataUrl,
    keypoints,
    width: spec.width,
    height: spec.height,
    sceneRevision: spec.sceneRevision,
    depthRange: context.depthRange,
    supportedKeypointCount,
  };
}


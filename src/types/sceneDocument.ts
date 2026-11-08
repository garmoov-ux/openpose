import { MannequinModelId, OpenPoseExportData, RenderMode } from './index';

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number]; // [x, y, z, w]
export type ActorId = 'main' | 'partner' | string;
export type BodyFormat = 'coco18' | 'body25';

export interface BoneSelection {
  actorId: ActorId;
  boneId: string;
}

export interface ActorPoseTransform {
  rotation: Quat;
  position?: Vec3;
}

export interface SceneActorV1 {
  id: ActorId;
  name: string;
  modelId: MannequinModelId;
  visible: boolean;
  root: {
    position: Vec3;
    rotation: Quat;
    scale: number;
  };
  bones: Record<string, ActorPoseTransform>;
}

export interface SceneCameraV1 {
  projection: 'perspective';
  position: Vec3;
  target: Vec3;
  fovDegrees: number;
  near: number;
  far: number;
}

export interface SceneExportConfigV1 {
  width: number;
  height: number;
  bodyFormat: BodyFormat;
}

export interface SceneDocumentV1 {
  schemaVersion: 1;
  revision: number;
  units: 'meter';
  coordinateSystem: 'right-handed-y-up';
  actors: SceneActorV1[];
  camera: SceneCameraV1;
  export: SceneExportConfigV1;
}

export type SceneCommand =
  | { type: 'actor.add'; actor: SceneActorV1 }
  | { type: 'actor.remove'; actorId: ActorId }
  | { type: 'actor.visibility.set'; actorId: ActorId; visible: boolean }
  | { type: 'actor.model.set'; actorId: ActorId; modelId: MannequinModelId }
  | { type: 'actor.root.set'; actorId: ActorId; position?: Vec3; rotation?: Quat; scale?: number }
  | { type: 'bone.rotation.set'; actorId: ActorId; boneId: string; rotation: Quat }
  | { type: 'pose.apply'; actorId: ActorId; presetId: string; bones?: Record<string, ActorPoseTransform> }
  | { type: 'camera.set'; camera: Partial<SceneCameraV1> }
  | { type: 'export.set'; exportConfig: Partial<SceneExportConfigV1> };

export interface CommandBatch {
  schemaVersion: 1;
  baseRevision: number;
  requestId: string;
  actorSource?: 'user' | 'ai' | 'preset' | 'file';
  commands: SceneCommand[];
}

export interface CommandBatchResult {
  ok: boolean;
  requestId: string;
  revision: number;
  changedActorIds: ActorId[];
  warnings: string[];
  error?: string;
  document: SceneDocumentV1;
}

export interface RenderSpec {
  sceneRevision: number;
  width: number;
  height: number;
  mode: RenderMode | 'wireframe' | 'lineart';
  actorIds: ActorId[];
  bodyFormat: BodyFormat;
}

export interface RenderResult {
  png: Blob;
  dataUrl: string;
  keypoints?: OpenPoseExportData;
  width: number;
  height: number;
  sceneRevision: number;
  depthRange?: { near: number; far: number };
  supportedKeypointCount: number;
}


import * as THREE from 'three';
import { MannequinModelId, RenderMode } from '@/types';
import {
  ActorPoseTransform,
  BodyFormat,
  Quat,
  RenderResult,
  RenderSpec,
  SceneActorV1,
  SceneDocumentV1,
  Vec3,
} from '@/types/sceneDocument';
import { OutfitCompositionV1 } from '@/types/wardrobe';
import { HumanoidRigResult } from '@/core/mannequin/humanoidRig';
import { composeOutfit } from '@/core/mannequin/wardrobe/composition';
import { setDressedMeshesVisibility } from '@/core/mannequin/wardrobe/garmentRenderer';
import { applyMannequinGroupTransform, renderOffscreenSceneSnapshot } from './modelSwapHelper';
import { computeCameraSpaceDepthBounds } from '@/core/shaders/materials';
import { createRenderCamera, executeRenderJob } from '@/core/pipeline/renderJob';
import { drawOpenPoseSkeleton, getJointScreenPositions } from '@/core/pipeline/openposePipeline';

const TEMP_Q = new THREE.Quaternion();
const TEMP_DELTA = new THREE.Quaternion();

export function extractRestDeltaQuat(bone: THREE.Bone): Quat {
  const localRest: THREE.Quaternion | undefined = bone.userData?.localRestQuat;
  if (localRest) {
    TEMP_DELTA.copy(localRest).invert().multiply(bone.quaternion).normalize();
    return [
      Number(TEMP_DELTA.x.toFixed(5)),
      Number(TEMP_DELTA.y.toFixed(5)),
      Number(TEMP_DELTA.z.toFixed(5)),
      Number(TEMP_DELTA.w.toFixed(5)),
    ];
  }
  TEMP_Q.copy(bone.quaternion).normalize();
  return [
    Number(TEMP_Q.x.toFixed(5)),
    Number(TEMP_Q.y.toFixed(5)),
    Number(TEMP_Q.z.toFixed(5)),
    Number(TEMP_Q.w.toFixed(5)),
  ];
}

export function applyRestDeltaQuat(bone: THREE.Bone, delta: Quat): void {
  TEMP_DELTA.set(delta[0], delta[1], delta[2], delta[3]).normalize();
  const localRest: THREE.Quaternion | undefined = bone.userData?.localRestQuat;
  if (localRest) {
    bone.quaternion.copy(localRest).multiply(TEMP_DELTA).normalize();
  } else {
    bone.quaternion.copy(TEMP_DELTA);
  }
}

export function extractActorBonesMap(
  bones: Map<string, THREE.Bone>
): Record<string, ActorPoseTransform> {
  const result: Record<string, ActorPoseTransform> = {};
  bones.forEach((bone, boneId) => {
    result[boneId] = { rotation: extractRestDeltaQuat(bone) };
  });
  return result;
}

export function applyActorBonesMap(
  bones: Map<string, THREE.Bone>,
  boneMap: Record<string, ActorPoseTransform>
): void {
  bones.forEach((bone, boneId) => {
    const entry = boneMap[boneId];
    if (entry) {
      applyRestDeltaQuat(bone, entry.rotation);
      if (boneId === 'Hips' && entry.position) {
        bone.position.set(entry.position[0], entry.position[1], entry.position[2]);
      }
    } else if (bone.userData?.localRestQuat) {
      bone.quaternion.copy(bone.userData.localRestQuat);
    }
  });
}

export function extractActorV1FromRig(
  id: string,
  name: string,
  modelId: MannequinModelId,
  rig: HumanoidRigResult,
  visible: boolean,
  outfit?: OutfitCompositionV1
): SceneActorV1 {
  const g = rig.group;
  const baseScale: number = g.userData?.baseScale || 1.0;
  const scale = Number((g.scale.x / baseScale).toFixed(3));
  const q = g.quaternion.clone().normalize();

  return {
    id,
    name,
    modelId,
    visible,
    root: {
      position: [
        Number(g.position.x.toFixed(3)),
        Number(g.position.y.toFixed(3)),
        Number(g.position.z.toFixed(3)),
      ],
      rotation: [
        Number(q.x.toFixed(5)),
        Number(q.y.toFixed(5)),
        Number(q.z.toFixed(5)),
        Number(q.w.toFixed(5)),
      ],
      scale: Math.max(0.2, Math.min(3.0, scale || 1.0)),
    },
    bones: extractActorBonesMap(rig.bones),
    ...(outfit ? { outfit } : {}),
  };
}

export function applyActorV1ToRig(actor: SceneActorV1, rig: HumanoidRigResult): void {
  const q = new THREE.Quaternion(
    actor.root.rotation[0],
    actor.root.rotation[1],
    actor.root.rotation[2],
    actor.root.rotation[3]
  ).normalize();
  const euler = new THREE.Euler().setFromQuaternion(q, 'XYZ');
  applyMannequinGroupTransform(
    rig.group,
    actor.root.position,
    [euler.x, euler.y, euler.z],
    actor.root.scale
  );
  applyActorBonesMap(rig.bones, actor.bones);
  rig.group.updateMatrixWorld(true);
}

export function buildSceneDocumentSnapshot(params: {
  revision: number;
  mainRig: HumanoidRigResult;
  mainModelId: MannequinModelId;
  mainOutfit?: OutfitCompositionV1;
  partnerRig: HumanoidRigResult;
  partnerModelId: MannequinModelId;
  partnerOutfit?: OutfitCompositionV1;
  partnerVisible: boolean;
  camera: THREE.PerspectiveCamera;
  target: THREE.Vector3;
  exportWidth: number;
  exportHeight: number;
  bodyFormat: BodyFormat;
}): SceneDocumentV1 {
  const mainActor = extractActorV1FromRig(
    'main',
    '메인 인물',
    params.mainModelId,
    params.mainRig,
    true,
    params.mainOutfit
  );
  const partnerActor = extractActorV1FromRig(
    'partner',
    '파트너 인물',
    params.partnerModelId,
    params.partnerRig,
    params.partnerVisible,
    params.partnerOutfit
  );

  const pos: Vec3 = [
    Number(params.camera.position.x.toFixed(3)),
    Number(params.camera.position.y.toFixed(3)),
    Number(params.camera.position.z.toFixed(3)),
  ];
  const tgt: Vec3 = [
    Number(params.target.x.toFixed(3)),
    Number(params.target.y.toFixed(3)),
    Number(params.target.z.toFixed(3)),
  ];

  return {
    schemaVersion: 1,
    revision: params.revision,
    units: 'meter',
    coordinateSystem: 'right-handed-y-up',
    actors: [mainActor, partnerActor],
    camera: {
      projection: 'perspective',
      position: pos,
      target: tgt,
      fovDegrees: Number(params.camera.fov.toFixed(2)),
      near: params.camera.near,
      far: params.camera.far,
    },
    export: {
      width: params.exportWidth,
      height: params.exportHeight,
      bodyFormat: params.bodyFormat,
    },
  };
}

export function runSceneRenderJob(
  spec: RenderSpec,
  env: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    currentMode: RenderMode;
    mainRig: HumanoidRigResult;
    mainOutfit?: OutfitCompositionV1;
    partnerRig: HumanoidRigResult;
    partnerOutfit?: OutfitCompositionV1;
    partnerVisible: boolean;
    transformHelper: THREE.Object3D;
    skeletonHelper: THREE.Object3D;
    depthMaterial: THREE.ShaderMaterial;
    restoreDots: boolean;
    selectedBoneName: string | null;
  }
): RenderResult {
  const appearanceMode = spec.appearanceMode || 'dressed';
  const actors = [
    { id: 'main', visible: true, group: env.mainRig.group, bones: env.mainRig.bones },
    { id: 'partner', visible: env.partnerVisible, group: env.partnerRig.group, bones: env.partnerRig.bones },
  ];
  const renderCam = createRenderCamera(env.camera, spec.width, spec.height);

  if (appearanceMode === 'body') {
    setDressedMeshesVisibility(env.mainRig.group, false);
    if (env.partnerVisible) setDressedMeshesVisibility(env.partnerRig.group, false);
  }

  let res: RenderResult;
  try {
    const depthRange = computeCameraSpaceDepthBounds(renderCam, [
      env.mainRig.group,
      ...(env.partnerVisible ? [env.partnerRig.group] : []),
    ]);

    res = executeRenderJob(spec, {
      camera: env.camera,
      actors,
      depthRange,
      captureCanvasDataUrl: (w, h, cam) => {
        const offCanvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
        if (env.currentMode === 'openpose' || spec.mode === 'openpose') {
          const maps = actors
            .filter((a) => a.visible && spec.actorIds.includes(a.id))
            .map((a) => getJointScreenPositions(a.bones, cam, w, h));
          drawOpenPoseSkeleton(offCanvas.getContext('2d')!, maps, w, h);
        } else {
          if (env.currentMode === 'depth') {
            env.depthMaterial.uniforms.cameraNear.value = depthRange.near;
            env.depthMaterial.uniforms.cameraFar.value = depthRange.far;
          }
          renderOffscreenSceneSnapshot(
            env.scene,
            cam,
            env.mainRig.group,
            env.transformHelper,
            env.skeletonHelper,
            offCanvas,
            w,
            env.restoreDots,
            env.selectedBoneName,
            h,
            env.renderer,
            env.partnerRig.group
          );
        }
        return offCanvas.toDataURL('image/png');
      },
    });
  } finally {
    if (appearanceMode === 'body') {
      setDressedMeshesVisibility(env.mainRig.group, true);
      if (env.partnerVisible) setDressedMeshesVisibility(env.partnerRig.group, true);
    }
  }

  const promptOnlyItemIds: string[] = [];
  if (env.mainOutfit) {
    promptOnlyItemIds.push(...composeOutfit(env.mainOutfit.itemIds).promptOnlyItemIds);
  }
  if (env.partnerVisible && env.partnerOutfit) {
    promptOnlyItemIds.push(...composeOutfit(env.partnerOutfit.itemIds).promptOnlyItemIds);
  }

  return {
    ...res,
    appearanceMode,
    promptOnlyItemIds: Array.from(new Set(promptOnlyItemIds)),
  };
}

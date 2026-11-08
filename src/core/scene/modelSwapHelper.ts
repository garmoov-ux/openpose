import * as THREE from 'three';
import { PosePreset } from '@/types';
import { HumanoidRigResult } from '@/core/mannequin/humanoidRig';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';

const CORE_BONE_PAIRS: Array<[string, string]> = [
  ['Head', 'Neck'],
  ['Neck', 'Spine1'],
  ['Spine1', 'Spine'],
  ['Spine', 'Hips'],
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

// 월드 기준 상대 회전으로 백업하여 이종 모델 간에도 포즈 100% 호환 보장
export function backupBoneRotations(bones: Map<string, THREE.Bone>): Map<string, THREE.Quaternion> {
  const backup = new Map<string, THREE.Quaternion>();
  const deltaLocal = new THREE.Quaternion();
  const worldPose = new THREE.Quaternion();

  bones.forEach((bone, name) => {
    const localRest: THREE.Quaternion | undefined = bone.userData.localRestQuat;
    const worldRest: THREE.Quaternion | undefined = bone.userData.worldRestQuat;
    if (localRest && worldRest) {
      deltaLocal.copy(localRest).invert().multiply(bone.quaternion);
      worldPose.copy(worldRest).multiply(deltaLocal).multiply(worldRest.clone().invert());
      backup.set(name, worldPose.clone());
    } else {
      backup.set(name, bone.quaternion.clone());
    }
  });
  return backup;
}

export function restoreBoneRotations(
  bones: Map<string, THREE.Bone>,
  backup: Map<string, THREE.Quaternion>
): void {
  const deltaLocal = new THREE.Quaternion();

  backup.forEach((worldPose, name) => {
    const bone = bones.get(name);
    if (!bone) return;
    const localRest: THREE.Quaternion | undefined = bone.userData.localRestQuat;
    const worldRest: THREE.Quaternion | undefined = bone.userData.worldRestQuat;

    if (localRest && worldRest) {
      deltaLocal.copy(worldRest).invert().multiply(worldPose).multiply(worldRest);
      bone.quaternion.copy(localRest).multiply(deltaLocal);
    } else {
      bone.quaternion.copy(worldPose);
    }
  });
}

export function disposeObjectHierarchy(root: THREE.Object3D | null | undefined): void {
  if (!root) return;
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => m?.dispose?.());
    } else if (mat && typeof (mat as THREE.Material).dispose === 'function') {
      (mat as THREE.Material).dispose();
    }
  });
}

export function applyMaterialToHierarchy(
  root: THREE.Object3D,
  material: THREE.Material,
  preserveOutfitMaterials = false
): void {
  root.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh || (child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.userData?.boneName || mesh.userData?.isCollider || mesh.userData?.isJointDot) {
        return; // 피킹 콜라이더 및 관절 도트 제외
      }
      if (
        preserveOutfitMaterials &&
        (mesh.userData?.isOutfitMesh || mesh.userData?.isWardrobeMesh || mesh.userData?.isBodyAccessory) &&
        mesh.userData?.outfitMaterial
      ) {
        mesh.material = mesh.userData.outfitMaterial;
        return;
      }
      mesh.material = material;
    }
  });
}

export function setJointDotsVisible(
  root: THREE.Object3D,
  visible: boolean,
  selectedBoneName?: string | null
): void {
  root.traverse((child) => {
    if (child.userData?.isJointDot) {
      child.visible = visible;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat && mat.color) {
        const isSelected = selectedBoneName && child.userData.boneName === selectedBoneName;
        if (isSelected) {
          mat.color.setHex(0xff3b30);
          mat.opacity = 1.0;
          mesh.scale.setScalar(1.45);
        } else {
          mat.color.setHex(child.userData.boneName === 'Hips' ? 0x0066ff : 0x38bdf8);
          mat.opacity = 0.82;
          mesh.scale.setScalar(1.0);
        }
      }
    }
  });
}

export function createStylizedSkeletonHelper(): THREE.LineSegments {
  const positions = new Float32Array(CORE_BONE_PAIRS.length * 2 * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65,
    depthTest: false,
  });

  const lines = new THREE.LineSegments(geometry, material);
  lines.renderOrder = 998;
  lines.frustumCulled = false;
  return lines;
}

const TEMP_V1 = new THREE.Vector3();
const TEMP_V2 = new THREE.Vector3();

export function updateStylizedSkeletonHelper(
  lines: THREE.LineSegments,
  bones: Map<string, THREE.Bone>
): void {
  if (!lines.visible) return;
  const posAttr = lines.geometry.getAttribute('position') as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;

  for (let i = 0; i < CORE_BONE_PAIRS.length; i++) {
    const [b1Name, b2Name] = CORE_BONE_PAIRS[i];
    const b1 = bones.get(b1Name);
    const b2 = bones.get(b2Name);
    const idx = i * 6;
    if (b1 && b2) {
      b1.getWorldPosition(TEMP_V1);
      b2.getWorldPosition(TEMP_V2);
      arr[idx] = TEMP_V1.x;
      arr[idx + 1] = TEMP_V1.y;
      arr[idx + 2] = TEMP_V1.z;
      arr[idx + 3] = TEMP_V2.x;
      arr[idx + 4] = TEMP_V2.y;
      arr[idx + 5] = TEMP_V2.z;
    }
  }
  posAttr.needsUpdate = true;
}

let sharedRenderTarget: THREE.WebGLRenderTarget | null = null;

export function disposeSharedRenderTarget(): void {
  if (sharedRenderTarget) {
    sharedRenderTarget.dispose();
    sharedRenderTarget = null;
  }
}

export function renderOffscreenSceneSnapshot(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  humanoidGroup: THREE.Object3D,
  transformHelper: THREE.Object3D,
  skeletonHelper: THREE.Object3D,
  offCanvas: HTMLCanvasElement,
  width: number,
  restoreDots: boolean,
  selectedBoneName: string | null,
  height = width,
  sharedRenderer?: THREE.WebGLRenderer,
  partnerGroup?: THREE.Object3D
): void {
  const renderCam = camera.clone();
  renderCam.aspect = width / height;
  renderCam.updateMatrixWorld();
  renderCam.updateProjectionMatrix();

  const prevHelperVis = transformHelper.visible;
  const prevSkelVis = skeletonHelper.visible;

  try {
    transformHelper.visible = false;
    skeletonHelper.visible = false;
    setJointDotsVisible(humanoidGroup, false);
    if (partnerGroup) setJointDotsVisible(partnerGroup, false);

    if (sharedRenderer) {
      if (
        !sharedRenderTarget ||
        sharedRenderTarget.width !== width ||
        sharedRenderTarget.height !== height
      ) {
        sharedRenderTarget?.dispose();
        sharedRenderTarget = new THREE.WebGLRenderTarget(width, height, {
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          depthBuffer: true,
        });
      }

      const prevTarget = sharedRenderer.getRenderTarget();
      try {
        sharedRenderer.setRenderTarget(sharedRenderTarget);
        sharedRenderer.clear();
        sharedRenderer.render(scene, renderCam);

        const pixels = new Uint8Array(width * height * 4);
        sharedRenderer.readRenderTargetPixels(sharedRenderTarget, 0, 0, width, height, pixels);

        const ctx = offCanvas.getContext('2d');
        if (ctx) {
          const imgData = ctx.createImageData(width, height);
          const rowBytes = width * 4;
          for (let y = 0; y < height; y++) {
            const srcOffset = (height - 1 - y) * rowBytes;
            const dstOffset = y * rowBytes;
            imgData.data.set(pixels.subarray(srcOffset, srcOffset + rowBytes), dstOffset);
          }
          ctx.putImageData(imgData, 0, 0);
        }
      } finally {
        sharedRenderer.setRenderTarget(prevTarget);
      }
      return;
    }

    const offRenderer = new THREE.WebGLRenderer({
      canvas: offCanvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    try {
      offRenderer.setSize(width, height, false);
      offRenderer.render(scene, renderCam);
    } finally {
      offRenderer.dispose();
    }
  } finally {
    transformHelper.visible = prevHelperVis;
    skeletonHelper.visible = prevSkelVis;
    setJointDotsVisible(humanoidGroup, restoreDots, selectedBoneName);
  }
}

export function applyMannequinGroupTransform(
  group: THREE.Group,
  pos: [number, number, number],
  rot: [number, number, number],
  scaleMult = 1.0
): void {
  const baseScale: number = group.userData.baseScale || 1.0;
  group.position.set(pos[0], pos[1], pos[2]);
  group.rotation.set(rot[0], rot[1], rot[2]);
  group.scale.setScalar(baseScale * Math.max(0.2, Math.min(3.0, scaleMult)));
  group.updateMatrixWorld(true);
}

export function applyCouplePresetToRigs(
  mainRig: HumanoidRigResult,
  partnerRig: HumanoidRigResult,
  preset: PosePreset,
  isMainMale: boolean
): {
  mainPos: [number, number, number];
  mainRotY: number;
  partnerPos: [number, number, number];
  partnerRotY: number;
} {
  const fPose = preset.pose;
  const fOffset: [number, number, number] = preset.mainOffset || [0, 0, 0];
  const fRotY = preset.mainRotationY ?? 0;

  const mPose = preset.partnerPose || POSE_PRESETS[0].pose;
  const mOffset: [number, number, number] = preset.partnerOffset || [0, 0, -0.28];
  const mRotY = preset.partnerRotationY ?? 0;

  if (isMainMale) {
    applyPosePreset(mainRig.bones, { ...preset, pose: mPose });
    applyMannequinGroupTransform(mainRig.group, mOffset, [0, mRotY, 0], 1.0);
    applyPosePreset(partnerRig.bones, { ...preset, pose: fPose });
    applyMannequinGroupTransform(partnerRig.group, fOffset, [0, fRotY, 0], 1.0);
    return { mainPos: mOffset, mainRotY: mRotY, partnerPos: fOffset, partnerRotY: fRotY };
  }

  applyPosePreset(mainRig.bones, { ...preset, pose: fPose });
  applyMannequinGroupTransform(mainRig.group, fOffset, [0, fRotY, 0], 1.0);
  applyPosePreset(partnerRig.bones, { ...preset, pose: mPose });
  applyMannequinGroupTransform(partnerRig.group, mOffset, [0, mRotY, 0], 1.0);
  return { mainPos: fOffset, mainRotY: fRotY, partnerPos: mOffset, partnerRotY: mRotY };
}

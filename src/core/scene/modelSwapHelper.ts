import * as THREE from 'three';

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
        (mesh.userData?.isOutfitMesh || mesh.userData?.isBodyAccessory) &&
        mesh.userData?.outfitMaterial
      ) {
        mesh.material = mesh.userData.outfitMaterial;
        return;
      }
      mesh.material = material;
    }
  });
}

export function setJointDotsVisible(root: THREE.Object3D, visible: boolean, selectedBoneName?: string | null): void {
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

// 지저분한 보조 본을 제외하고 핵심 18개 골격 연결선만 깔끔하게 그리는 고급 포즈선 오버레이
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

export function renderOffscreenSceneSnapshot(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  humanoidGroup: THREE.Object3D,
  transformHelper: THREE.Object3D,
  skeletonHelper: THREE.Object3D,
  offCanvas: HTMLCanvasElement,
  resolution: number,
  restoreDots: boolean,
  selectedBoneName: string | null
): void {
  const offRenderer = new THREE.WebGLRenderer({ canvas: offCanvas, antialias: true, preserveDrawingBuffer: true });
  offRenderer.setSize(resolution, resolution, false);
  const oldAspect = camera.aspect;
  camera.aspect = 1.0;
  camera.updateProjectionMatrix();

  const [prevHelperVis, prevSkelVis] = [transformHelper.visible, skeletonHelper.visible];
  transformHelper.visible = false;
  skeletonHelper.visible = false;
  setJointDotsVisible(humanoidGroup, false);
  offRenderer.render(scene, camera);
  transformHelper.visible = prevHelperVis;
  skeletonHelper.visible = prevSkelVis;
  setJointDotsVisible(humanoidGroup, restoreDots, selectedBoneName);
  camera.aspect = oldAspect;
  camera.updateProjectionMatrix();
  offRenderer.dispose();
}


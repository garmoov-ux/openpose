import * as THREE from 'three';

export function backupBoneRotations(bones: Map<string, THREE.Bone>): Map<string, THREE.Quaternion> {
  const backup = new Map<string, THREE.Quaternion>();
  bones.forEach((bone, name) => {
    backup.set(name, bone.quaternion.clone());
  });
  return backup;
}

export function restoreBoneRotations(
  bones: Map<string, THREE.Bone>,
  backup: Map<string, THREE.Quaternion>
): void {
  backup.forEach((quat, name) => {
    const bone = bones.get(name);
    if (bone) {
      bone.quaternion.copy(quat);
    }
  });
}

export function applyMaterialToHierarchy(root: THREE.Object3D, material: THREE.Material): void {
  root.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh || (child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.userData?.boneName) return; // 피킹 콜라이더 제외
      mesh.material = material;
    }
  });
}

export function createStylizedSkeletonHelper(root: THREE.Object3D): THREE.SkeletonHelper {
  const helper = new THREE.SkeletonHelper(root);
  const mat = helper.material as THREE.LineBasicMaterial;
  mat.color = new THREE.Color(0x38bdf8);
  mat.transparent = true;
  mat.opacity = 0.55;
  mat.depthTest = false;
  helper.renderOrder = 998;
  return helper;
}



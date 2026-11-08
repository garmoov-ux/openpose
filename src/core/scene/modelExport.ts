import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

export type ModelExportFormat = 'glb' | 'obj' | 'fbx' | 'stl';

function isExportableMesh(object: THREE.Object3D): object is THREE.Mesh {
  if (!(object as THREE.Mesh).isMesh || !object.visible) return false;
  if (object.userData.isCollider || object.userData.isJointDot || object.userData.boneName) return false;
  const mesh = object as THREE.Mesh;
  if (!mesh.geometry?.getAttribute('position')?.count) return false;
  return !Array.isArray(mesh.material)
    ? mesh.material?.visible !== false
    : mesh.material.some((material) => material.visible);
}

function isVisibleInHierarchy(object: THREE.Object3D, root: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = object;
  while (current && current !== root) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return root.visible;
}

export function buildEditableModelScene(actors: THREE.Object3D[]): THREE.Scene {
  const scene = new THREE.Scene();
  actors.forEach((actor, index) => {
    actor.updateMatrixWorld(true);
    const cloned = cloneSkeleton(actor);
    cloned.name = index === 0 ? 'MainMannequin' : 'PartnerMannequin';
    const removable: THREE.Object3D[] = [];
    cloned.traverse((object) => {
      if (object.userData.isCollider || object.userData.isJointDot) removable.push(object);
      object.userData = {};
    });
    removable.forEach((object) => object.removeFromParent());
    cloned.visible = true;
    scene.add(cloned);
  });
  scene.updateMatrixWorld(true);
  return scene;
}

export function buildStaticModelScene(actors: THREE.Object3D[]): THREE.Scene {
  const scene = new THREE.Scene();
  const vertex = new THREE.Vector3();
  actors.forEach((actor, actorIndex) => {
    actor.updateMatrixWorld(true);
    actor.traverse((object) => {
      if (!isExportableMesh(object) || !isVisibleInHierarchy(object, actor)) return;
      const geometry = object.geometry.clone();
      const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
      const skinned = (object as THREE.SkinnedMesh).isSkinnedMesh ? object as THREE.SkinnedMesh : null;
      for (let i = 0; i < positions.count; i++) {
        if (skinned) skinned.getVertexPosition(i, vertex);
        else vertex.fromBufferAttribute(positions, i);
        vertex.applyMatrix4(object.matrixWorld);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      positions.needsUpdate = true;
      geometry.deleteAttribute('skinIndex');
      geometry.deleteAttribute('skinWeight');
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, object.material);
      mesh.name = `${actorIndex === 0 ? 'Main' : 'Partner'}_${object.name || object.type}`;
      scene.add(mesh);
    });
  });
  scene.updateMatrixWorld(true);
  return scene;
}

export async function encodeModelScene(scene: THREE.Scene, format: ModelExportFormat): Promise<Blob> {
  if (format === 'glb') {
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
    const bytes = await new GLTFExporter().parseAsync(scene, { binary: true, onlyVisible: true });
    return new Blob([bytes as ArrayBuffer], { type: 'model/gltf-binary' });
  }
  if (format === 'fbx') {
    const { FBXExporter } = await import('@comfyorg/fbx-exporter-three');
    const bytes = await new FBXExporter().parseAsync(scene, { preset: 'blender', onlyVisible: true, includeAnimations: false });
    return new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' });
  }
  if (format === 'obj') {
    const { OBJExporter } = await import('three/examples/jsm/exporters/OBJExporter.js');
    return new Blob([new OBJExporter().parse(scene)], { type: 'text/plain;charset=utf-8' });
  }
  const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter.js');
  const view = new STLExporter().parse(scene, { binary: true }) as DataView;
  const buffer = new ArrayBuffer(view.byteLength);
  new Uint8Array(buffer).set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return new Blob([buffer], { type: 'model/stl' });
}

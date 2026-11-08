import * as THREE from 'three';

export interface OwnedRenderResources {
  geometries: Set<THREE.BufferGeometry>;
  materials: Set<THREE.Material>;
  textures: Set<THREE.Texture>;
}

export function createOwnedResourceTracker(): OwnedRenderResources {
  return {
    geometries: new Set<THREE.BufferGeometry>(),
    materials: new Set<THREE.Material>(),
    textures: new Set<THREE.Texture>(),
  };
}

export function registerOwnedMeshResources(
  tracker: OwnedRenderResources,
  mesh: THREE.Object3D
): void {
  mesh.traverse((child) => {
    const m = child as THREE.Mesh;
    if (m.geometry) {
      tracker.geometries.add(m.geometry);
    }
    const mat = m.material;
    if (Array.isArray(mat)) {
      mat.forEach((mt) => {
        if (mt) tracker.materials.add(mt);
      });
    } else if (mat) {
      tracker.materials.add(mat);
    }
  });
}

export function disposeWardrobeMeshesOnRoot(root: THREE.Object3D): number {
  const toRemove: THREE.Object3D[] = [];
  root.traverse((child) => {
    if (child.userData?.isWardrobeMesh) {
      toRemove.push(child);
    }
  });

  const disposedGeoms = new Set<THREE.BufferGeometry>();
  const disposedMats = new Set<THREE.Material>();
  const disposedTex = new Set<THREE.Texture>();

  for (const obj of toRemove) {
    obj.parent?.remove(obj);
    obj.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.geometry && !disposedGeoms.has(m.geometry)) {
        disposedGeoms.add(m.geometry);
        m.geometry.dispose();
      }
      const mats = Array.isArray(m.material)
        ? m.material
        : m.material
        ? [m.material]
        : [];
      for (const mat of mats) {
        if (mat && !disposedMats.has(mat)) {
          disposedMats.add(mat);
          const stdMat = mat as THREE.MeshStandardMaterial;
          if (stdMat.map && !disposedTex.has(stdMat.map)) {
            disposedTex.add(stdMat.map);
            stdMat.map.dispose();
          }
          if (stdMat.alphaMap && !disposedTex.has(stdMat.alphaMap)) {
            disposedTex.add(stdMat.alphaMap);
            stdMat.alphaMap.dispose();
          }
          mat.dispose();
        }
      }
    });
  }

  return disposedGeoms.size + disposedMats.size;
}


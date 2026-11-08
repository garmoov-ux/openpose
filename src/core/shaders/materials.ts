import * as THREE from 'three';

// 1. 선형 Z-Depth 머티리얼 (SkinnedMesh 골격 변형 및 동적 Near/Far 선형 정규화)
export function createDepthShaderMaterial(near = 2.0, far = 4.2): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      cameraNear: { value: near },
      cameraFar: { value: far },
    },
    vertexShader: `
      #include <common>
      #include <skinning_pars_vertex>
      varying float vDepth;

      void main() {
        #include <skinbase_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>

        vDepth = -mvPosition.z;
      }
    `,
    fragmentShader: `
      uniform float cameraNear;
      uniform float cameraFar;
      varying float vDepth;

      void main() {
        float span = max(0.001, cameraFar - cameraNear);
        float t = clamp((cameraFar - vDepth) / span, 0.0, 1.0);
        gl_FragColor = vec4(vec3(t), 1.0);
      }
    `,
    depthTest: true,
    depthWrite: true,
  });
}

// 2. View-space 표면 법선(Normal) 머티리얼 (normal * 0.5 + 0.5 규약, SkinnedMesh 지원)
export function createNormalShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
      #include <common>
      #include <skinning_pars_vertex>
      varying vec3 vViewNormal;

      void main() {
        #include <skinbase_vertex>
        #include <beginnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>

        vViewNormal = normalize(transformedNormal);
      }
    `,
    fragmentShader: `
      varying vec3 vViewNormal;

      void main() {
        vec3 n = normalize(vViewNormal);
        if (!gl_FrontFacing) {
          n = -n;
        }
        vec3 rgb = n * 0.5 + 0.5;
        gl_FragColor = vec4(rgb, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: true,
  });
}

// 3. 실루엣 및 곡률 불연속 기반 Lineart 윤곽선 셰이더 머티리얼
export function createLineartShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
      #include <common>
      #include <skinning_pars_vertex>
      varying vec3 vViewNormal;
      varying vec3 vViewPos;

      void main() {
        #include <skinbase_vertex>
        #include <beginnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>

        vViewNormal = normalize(transformedNormal);
        vViewPos = -mvPosition.xyz;
      }
    `,
    fragmentShader: `
      varying vec3 vViewNormal;
      varying vec3 vViewPos;

      void main() {
        vec3 n = normalize(vViewNormal);
        vec3 v = normalize(vViewPos);
        float ndotv = abs(dot(n, v));
        float edge = 1.0 - smoothstep(0.18, 0.42, ndotv);
        gl_FragColor = vec4(vec3(edge), 1.0);
      }
    `,
    depthTest: true,
    depthWrite: true,
  });
}

// 4. 개발/검토용 와이어프레임 머티리얼 (기존 canny 호환 별칭 유지)
export function createWireframeMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
}

export const createCannyMaterial = createWireframeMaterial;

// 5. 카메라 공간 기준 인물 그룹의 전후 깊이 경계([near, far]) 계산
export function computeCameraSpaceDepthBounds(
  camera: THREE.Camera,
  groups: THREE.Object3D[]
): { near: number; far: number } {
  camera.updateMatrixWorld();
  const invCam = camera.matrixWorldInverse;
  let minDepth = Infinity;
  let maxDepth = -Infinity;
  const worldBox = new THREE.Box3();
  const tempBox = new THREE.Box3();
  const corners = [
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ];

  for (const group of groups) {
    if (!group.visible) continue;
    group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData?.isCollider || mesh.userData?.isJointDot) return;
      if (!mesh.geometry) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingBox) return;
      tempBox.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
      worldBox.union(tempBox);
    });
  }

  if (!worldBox.isEmpty()) {
    const { min, max } = worldBox;
    corners[0].set(min.x, min.y, min.z);
    corners[1].set(min.x, min.y, max.z);
    corners[2].set(min.x, max.y, min.z);
    corners[3].set(min.x, max.y, max.z);
    corners[4].set(max.x, min.y, min.z);
    corners[5].set(max.x, min.y, max.z);
    corners[6].set(max.x, max.y, min.z);
    corners[7].set(max.x, max.y, max.z);

    for (const c of corners) {
      c.applyMatrix4(invCam);
      const d = -c.z;
      if (d < minDepth) minDepth = d;
      if (d > maxDepth) maxDepth = d;
    }
  }

  if (!Number.isFinite(minDepth) || !Number.isFinite(maxDepth) || maxDepth <= minDepth) {
    return { near: 1.8, far: 4.5 };
  }

  const pad = Math.max(0.08, (maxDepth - minDepth) * 0.06);
  return {
    near: Math.max(0.1, Number((minDepth - pad).toFixed(3))),
    far: Math.max(0.3, Number((maxDepth + pad).toFixed(3))),
  };
}

// 6. 기본 PBR 셰이딩 머티리얼 및 스타일 팩토리
export function createDefaultShadingMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.72,
    metalness: 0.06,
  });
}

export function createMaterialByStyle(style: string): THREE.Material {
  switch (style) {
    case 'clay':
      return new THREE.MeshStandardMaterial({
        color: 0xb08968,
        roughness: 0.85,
        metalness: 0.02,
      });
    case 'toon_outline':
      return new THREE.MeshToonMaterial({
        color: 0xf1f5f9,
      });
    case 'chrome':
      return new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.18,
        metalness: 0.88,
      });
    case 'matte_white':
    default:
      return new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.68,
        metalness: 0.06,
      });
  }
}

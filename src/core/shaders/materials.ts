import * as THREE from 'three';

// 1. 선형 Z-Depth 머티리얼 (SkinnedMesh 골격 변형 및 동적 Near/Far 지원)
export function createDepthShaderMaterial(near = 2.2, far = 3.8): THREE.ShaderMaterial {
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
        // 가까울수록 1.0 (흰색), 멀수록 0.08 (어두운 회색)
        float t = clamp((cameraFar - vDepth) / max(0.001, (cameraFar - cameraNear)), 0.0, 1.0);
        float linear = mix(0.08, 1.0, pow(t, 0.85));
        gl_FragColor = vec4(vec3(linear), 1.0);
      }
    `,
    depthTest: true,
    depthWrite: true,
  });
}

// 2. View-space 표면 법선(Normal) 머티리얼 (Three.js 표준 SkinnedMesh 완벽 지원)
export function createNormalShaderMaterial(): THREE.Material {
  return new THREE.MeshNormalMaterial();
}

// 3. Canny / 외곽선 윤곽선용 와이어프레임 머티리얼
export function createCannyMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
}

// 4. 기본 PBR 셰이딩 머티리얼
export function createDefaultShadingMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.72,
    metalness: 0.06,
  });
}

// 5. 스타일별 마네킹 머티리얼 팩토리
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

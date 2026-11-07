import * as THREE from 'three';

// 1. 선형 Z-Depth 머티리얼 (SkinnedMesh 골격 변형 지원)
export function createDepthShaderMaterial(near = 0.5, far = 6.0): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      cameraNear: { value: near },
      cameraFar: { value: far },
    },
    vertexShader: `
      #include <skinning_pars_vertex>
      varying float vDepth;

      void main() {
        #include <skinbase_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>

        vec4 viewPos = modelViewMatrix * vec4(transformed, 1.0);
        vDepth = -viewPos.z; // 카메라 전방 z거리
      }
    `,
    fragmentShader: `
      uniform float cameraNear;
      uniform float cameraFar;
      varying float vDepth;

      void main() {
        // 가까울수록 1.0 (흰색), 멀수록 0.0 (검정색)
        float linear = clamp((cameraFar - vDepth) / (cameraFar - cameraNear), 0.0, 1.0);
        gl_FragColor = vec4(vec3(linear), 1.0);
      }
    `,
    depthTest: true,
    depthWrite: true,
  });
}

// 2. View-space 표면 법선(Normal) 머티리얼 (ControlNet 표준)
export function createNormalShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
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

        vViewNormal = normalize(normalMatrix * objectNormal);
      }
    `,
    fragmentShader: `
      varying vec3 vViewNormal;

      void main() {
        // [-1.0, 1.0] -> [0.0, 1.0] RGB 매핑
        vec3 normalColor = vViewNormal * 0.5 + 0.5;
        gl_FragColor = vec4(normalColor, 1.0);
      }
    `,
    depthTest: true,
    depthWrite: true,
  });
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
    color: 0xa0b0c0,
    roughness: 0.3,
    metalness: 0.1,
  });
}

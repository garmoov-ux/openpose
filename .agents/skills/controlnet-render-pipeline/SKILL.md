---
name: controlnet-render-pipeline
description: OpenPose 컬러 스켈레톤, Depth z-buffer 흑백 셰이더, Surface Normal 셰이더, Canny 윤곽선 렌더 파이프라인 구현 가이드
---

# ControlNet 멀티 렌더링 파이프라인 스킬

- **역할**: 3D 인체 마네킹의 씬에서 Stable Diffusion / ControlNet이 요구하는 4대 모드(OpenPose, Depth, Normal, Canny/Lineart)로 씬 재질과 셰이더를 즉시 전환하여 픽셀 단위로 정확한 제어 이미지를 생성합니다.
- **조합**: `[기술스택] Three.js, Custom Shaders(GLSL), Canvas 2D, WebGLRenderTarget` + `[짝꿍 스킬] threejs-pose-editor, comfyui-integration` + `[짝꿍 MCP] context7`

---

## 1. OpenPose 18/25 키포인트 2D 프로젝션 및 Canvas 렌더링

마네킹의 3D 월드 관절 좌표를 현재 카메라의 화면(2D Screen Coordinates)으로 투영한 후, 표준 COCO 컬러 선과 원으로 검정 배경 위에 그립니다:

```typescript
export interface JointPoint {
  id: number;
  name: string;
  worldPos: THREE.Vector3;
  screenPos?: { x: number; y: number };
}

// 3D 월드 좌표 -> 2D 화면 좌표 변환
export function projectJoints(
  joints: JointPoint[],
  camera: THREE.Camera,
  width: number,
  height: number
): void {
  joints.forEach(j => {
    const v = j.worldPos.clone().project(camera);
    // NDC (-1 ~ 1) -> 픽셀 좌표 (0 ~ width/height)
    j.screenPos = {
      x: ((v.x + 1) * width) / 2,
      y: ((-v.y + 1) * height) / 2
    };
  });
}

// 2D 캔버스에 OpenPose 컬러 스켈레톤 드로잉
export function renderOpenPoseCanvas(
  ctx: CanvasRenderingContext2D,
  joints: Record<string, { x: number; y: number }>,
  limbs: Array<{ from: string; to: string; color: string }>,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Limb 라인 드로잉
  ctx.lineWidth = 4;
  limbs.forEach(limb => {
    const p1 = joints[limb.from];
    const p2 = joints[limb.to];
    if (p1 && p2) {
      ctx.strokeStyle = limb.color;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });

  // Joint 원 드로잉
  Object.values(joints).forEach(pos => {
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}
```

---

## 2. Linear Depth Map 셰이더 (GLSL)

원근 카메라의 비선형 Z-depth를 선형화하여, 카메라에 가까울수록 흰색(1.0), 멀어질수록 검은색(0.0)을 출력하는 커스텀 머티리얼입니다:

```typescript
import * as THREE from 'three';

export function createDepthMaterial(near: number, far: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      cameraNear: { value: near },
      cameraFar: { value: far }
    },
    vertexShader: `
      varying float vDepth;
      void main() {
        vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
        vDepth = -viewPos.z; // 카메라 뷰 공간에서의 거리
        gl_Position = projectionMatrix * viewPos;
      }
    `,
    fragmentShader: `
      uniform float cameraNear;
      uniform float cameraFar;
      varying float vDepth;

      void main() {
        // 거리 선형 정규화 (가까우면 1.0 흰색, 멀면 0.0 검정색)
        float linear = clamp((cameraFar - vDepth) / (cameraFar - cameraNear), 0.0, 1.0);
        gl_FragColor = vec4(vec3(linear), 1.0);
      }
    `
  });
}
```

---

## 3. Surface Normal Map 셰이더 (GLSL)

카메라 뷰 공간의 표면 법선 벡터(Normal)를 ControlNet 규격의 RGB 컬러로 변환합니다:

```typescript
export function createNormalMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        // 뷰 공간(카메라 기준)의 노멀 벡터 계산
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        // [-1, 1] 범위를 [0, 1] RGB로 매핑
        vec3 color = vNormal * 0.5 + 0.5;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
}
```

---

## 4. 렌더 모드 스위칭 아키텍처

마네킹 메시에 `overrideMaterial`을 적용하거나 씬 전체의 재질을 임시 교체한 뒤 단일 프레임을 오프스크린 타겟에 렌더링하고 원래 재질로 복원하는 원자적(Atomic) 렌더링 함수를 구성합니다.


---
name: offscreen-canvas-exporter
description: 고해상도 캔버스 캡처, 원클릭 클립보드 복사, 포즈 프리셋 JSON 저장 및 불러오기 파이프라인 구현 가이드
---

# 고해상도 캔버스 캡처 및 클립보드 내보내기 스킬

- **역할**: Three.js 뷰포트의 현재 프레임을 원하는 출력 해상도(512x512, 768x768, 1024x1024, 2048x2048 등)로 무손실 캡처하고, 브라우저 클립보드에 즉시 복사하거나 PNG 파일로 저장하며, 마네킹 관절 각도를 JSON 프리셋으로 보관/복원합니다.
- **조합**: `[기술스택] HTML5 Canvas, OffscreenCanvas, Clipboard API, FileSaver, JSON Schema` + `[짝꿍 스킬] controlnet-render-pipeline, threejs-pose-editor` + `[짝꿍 MCP] playwright`

---

## 1. 캔버스 해상도 독립적(Offscreen) 고해상도 캡처

사용자의 모니터 해상도나 브라우저 창 크기에 구애받지 않고, 정확한 ControlNet 정사각형/직사각형 규격(예: 1024x1024)으로 렌더링하여 Blob을 추출합니다:

```typescript
import * as THREE from 'three';

export async function captureSceneAtResolution(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  targetWidth = 1024,
  targetHeight = 1024
): Promise<Blob> {
  // 별도의 오프스크린 렌더 타겟 구성
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = targetWidth;
  offscreenCanvas.height = targetHeight;

  const offscreenRenderer = new THREE.WebGLRenderer({
    canvas: offscreenCanvas,
    antialias: true,
    preserveDrawingBuffer: true
  });
  offscreenRenderer.setSize(targetWidth, targetHeight, false);

  // 카메라 종횡비(Aspect)를 출력 해상도에 일시 동기화
  const originalAspect = camera.aspect;
  camera.aspect = targetWidth / targetHeight;
  camera.updateProjectionMatrix();

  // 렌더링 실행
  offscreenRenderer.render(scene, camera);

  // 카메라 복원
  camera.aspect = originalAspect;
  camera.updateProjectionMatrix();

  // Blob 추출
  return new Promise((resolve, reject) => {
    offscreenCanvas.toBlob((blob) => {
      offscreenRenderer.dispose();
      if (blob) resolve(blob);
      else reject(new Error('Canvas Blob 추출 실패'));
    }, 'image/png');
  });
}
```

---

## 2. 원클릭 클립보드 PNG 복사 파이프라인

사용자가 번거롭게 다운로드 후 드래그할 필요 없이, 버튼 클릭 한 번으로 ComfyUI나 WebUI 브라우저 창에 `Ctrl+V`로 붙여넣을 수 있도록 클립보드에 PNG 데이터를 주입합니다:

```typescript
export async function copyBlobToClipboard(pngBlob: Blob): Promise<boolean> {
  try {
    const item = new ClipboardItem({ 'image/png': pngBlob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('클립보드 복사 실패 (보안 정책 또는 권한 필요):', err);
    return false;
  }
}
```

---

## 3. 포즈 프리셋 JSON 직렬화 및 역직렬화

마네킹의 각 본 이름과 로컬 회전 쿼터니언(`x, y, z, w`), 위치(`x, y, z`)를 표준 JSON으로 저장하고 불러옵니다:

```typescript
export interface PoseSnapshot {
  name: string;
  timestamp: number;
  bones: Record<string, {
    rotation: [number, number, number, number]; // Quaternion
    position?: [number, number, number];
  }>;
}

export function serializeSkeletonPose(skeleton: THREE.Skeleton, name = 'custom-pose'): PoseSnapshot {
  const snapshot: PoseSnapshot = {
    name,
    timestamp: Date.now(),
    bones: {}
  };

  skeleton.bones.forEach((bone) => {
    snapshot.bones[bone.name] = {
      rotation: [bone.quaternion.x, bone.quaternion.y, bone.quaternion.z, bone.quaternion.w],
      position: [bone.position.x, bone.position.y, bone.position.z]
    };
  });

  return snapshot;
}

export function applyPoseSnapshot(skeleton: THREE.Skeleton, snapshot: PoseSnapshot): void {
  skeleton.bones.forEach((bone) => {
    const data = snapshot.bones[bone.name];
    if (data) {
      bone.quaternion.set(data.rotation[0], data.rotation[1], data.rotation[2], data.rotation[3]);
      if (data.position) {
        bone.position.set(data.position[0], data.position[1], data.position[2]);
      }
      bone.updateMatrixWorld(true);
    }
  });
}
```


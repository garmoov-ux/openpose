---
name: threejs-pose-editor
description: Three.js 기반 3D 인체 마네킹 로딩, 본 및 관절 조작, TransformControls 기즈모 인터랙션, 카메라 뷰포트 제어 구현 가이드
---

# Three.js 3D 마네킹 및 포즈 에디터 스킬

- **역할**: 웹 브라우저 상에서 Three.js를 구동하여 3D 인체 마네킹(GLB/FBX)을 로드하고, 골격(Skeleton)의 각 관절(Bone)을 마우스 피킹 및 TransformControls 기즈모로 실시간 회전/이동하며, 인체 가동 범위 제약과 카메라 뷰포트를 통합 제어합니다.
- **조합**: `[기술스택] Three.js, React 19, TypeScript, TransformControls, OrbitControls` + `[짝꿍 스킬] controlnet-render-pipeline, offscreen-canvas-exporter` + `[짝꿍 MCP] context7, playwright`

---

## 1. 씬 기본 셋업 및 렌더 루프 표준

Three.js 씬 초기화 시 캔버스 앤티앨리어싱, 물리 기반 렌더링(PBR) 톤매핑, 조명 설정을 표준화합니다:

```typescript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export class PoseSceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;
  private transformControls: TransformControls;
  private animId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.2, 3.0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true // 캡처를 위해 필수
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // 조명 구성 (3점 조명)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 4, 3);
    this.scene.add(ambientLight, dirLight);

    // 컨트롤러 구성
    this.orbitControls = new OrbitControls(this.camera, canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.target.set(0, 1.0, 0);

    this.transformControls = new TransformControls(this.camera, canvas);
    this.transformControls.setMode('rotate');
    this.transformControls.setSpace('local');
    this.scene.add(this.transformControls.getHelper());

    // 기즈모 드래그 시 카메라 회전 방지
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.orbitControls.enabled = !event.value;
    });

    this.startLoop();
  }

  private startLoop(): void {
    const tick = () => {
      this.orbitControls.update();
      this.renderer.render(this.scene, this.camera);
      this.animId = requestAnimationFrame(tick);
    };
    tick();
  }

  public dispose(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.orbitControls.dispose();
    this.transformControls.dispose();
    this.renderer.dispose();
  }
}
```

---

## 2. 관절(Bone) 마우스 피킹 및 기즈모 바인딩

1. **Raycaster 피킹**:
   - 마네킹의 스켈레톤 본(Bone) 객체는 메시가 아니므로 직접 레이캐스팅하기 어렵습니다.
   - 각 주요 관절 위치에 보이지 않는 히트 박스(지름 0.05m의 `THREE.SphereGeometry` 콜라이더)를 본의 자식 노드로 부착합니다.
2. **선택 이벤트 처리**:
   - 클릭 지점에서 Raycast를 수행하여 충돌한 구체의 부모 본(Bone)을 `TransformControls.attach(bone)`으로 바인딩합니다.
   - 선택된 관절의 하이라이트 색상을 표시합니다.

---

## 3. 카메라 프리셋 시점 전환

ControlNet 렌더링을 위해 정면(Front), 측면(Right), 상단(Top), 후면(Back), 전신(Full Body), 상반신(Close-up) 프리셋을 즉시 전환할 수 있는 카메라 메서드를 제공합니다:

```typescript
public setViewPreset(preset: 'front' | 'side' | 'top' | 'closeup'): void {
  const target = new THREE.Vector3(0, 1.0, 0);
  switch (preset) {
    case 'front':
      this.camera.position.set(0, 1.0, 3.2);
      break;
    case 'side':
      this.camera.position.set(3.2, 1.0, 0);
      break;
    case 'top':
      this.camera.position.set(0, 4.0, 0.1);
      break;
    case 'closeup':
      target.set(0, 1.45, 0);
      this.camera.position.set(0, 1.45, 1.2);
      break;
  }
  this.orbitControls.target.copy(target);
  this.camera.lookAt(target);
}
```


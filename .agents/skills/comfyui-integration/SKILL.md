---
name: comfyui-integration
description: ComfyUI 로컬 서버(127.0.0.1:8188) 연동, 포즈/뎁스 이미지 업로드, WebSocket 실시간 생성 진행도 구독, 워크플로우 큐 실행 가이드
---

# ComfyUI 및 WebUI ControlNet 연동 스킬

- **역할**: 에디터에서 완성된 포즈(OpenPose, Depth, Normal) 이미지를 브라우저에서 실행 중인 로컬 ComfyUI 서버로 자동 업로드하고, ControlNet 워크플로우를 트리거하여 생성된 AI 이미지를 웹 상에서 실시간으로 확인하는 연동 파이프라인을 구축합니다.
- **조합**: `[기술스택] Fetch API, WebSocket, ComfyUI REST API, Blob, FormData` + `[짝꿍 스킬] controlnet-render-pipeline, offscreen-canvas-exporter` + `[짝꿍 MCP] context7`

---

## 1. ComfyUI 클라이언트 API 서비스 구현

```typescript
export class ComfyUIService {
  private baseUrl: string;
  private ws: WebSocket | null = null;
  private clientId: string;

  constructor(baseUrl = 'http://127.0.0.1:8188') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.clientId = crypto.randomUUID();
  }

  // 1. WebSocket 연결 및 진행도 리스너 등록
  public connectWebSocket(onProgress: (percent: number, node: string) => void): void {
    const wsUrl = `${this.baseUrl.replace(/^http/, 'ws')}/ws?clientId=${this.clientId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'progress') {
          const { value, max } = msg.data;
          onProgress(Math.round((value / max) * 100), 'K-Sampler');
        } else if (msg.type === 'executing') {
          onProgress(100, msg.data.node ? `Node: ${msg.data.node}` : '완료');
        }
      } catch (err) {
        console.error('WS 메시지 파싱 오류:', err);
      }
    };
  }

  // 2. 캔버스 캡처 이미지 업로드 (POST /upload/image)
  public async uploadImage(imageBlob: Blob, filename = 'pose_input.png'): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageBlob, filename);
    formData.append('overwrite', 'true');

    const res = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error(`이미지 업로드 실패: ${res.statusText}`);
    const data = await res.json();
    return data.name; // ComfyUI에 저장된 파일명
  }

  // 3. 워크플로우 실행 요청 (POST /prompt)
  public async queuePrompt(workflowPrompt: Record<string, unknown>): Promise<string> {
    const body = {
      prompt: workflowPrompt,
      client_id: this.clientId
    };

    const res = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`프롬프트 등록 실패: ${res.statusText}`);
    const data = await res.json();
    return data.prompt_id;
  }
}
```

---

## 2. ComfyUI ControlNet 워크플로우 템플릿 주입

- 사용자가 지정한 ControlNet 노드의 `LoadImage` 파일명을 업로드된 이미지 파일명으로 동적 교체합니다:

```typescript
export function injectPoseImageToWorkflow(
  workflow: Record<string, any>,
  uploadedFilename: string,
  targetNodeTitle = 'Pose Image'
): Record<string, any> {
  const cloned = JSON.parse(JSON.stringify(workflow));
  for (const nodeId in cloned) {
    const node = cloned[nodeId];
    if (node._meta?.title === targetNodeTitle || node.class_type === 'LoadImage') {
      node.inputs.image = uploadedFilename;
      break;
    }
  }
  return cloned;
}
```

---

## 3. 연결 장애 진단 및 CORS 대응

1. 브라우저에서 `http://127.0.0.1:8188` 접근 시 CORS 차단이 발생하는 경우:
   - 안내 메시지: `ComfyUI 실행 인자에 --enable-cors-header 를 추가하여 재실행해 주세요.`
   - Vite 환경에서는 `vite.config.ts`의 `server.proxy` 설정을 통해 로컬 프록시 우회 경로를 기본 제공합니다.


export interface ComfyProgressCallback {
  (percent: number, status: string): void;
}

export class ComfyClient {
  private baseUrl: string;
  private ws: WebSocket | null = null;
  private clientId: string;

  constructor(serverUrl = 'http://127.0.0.1:8188') {
    this.baseUrl = serverUrl.replace(/\/$/, '');
    this.clientId = crypto.randomUUID();
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
    this.disconnect();
  }

  // 서버 헬스체크
  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/system_stats`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  // WebSocket 실시간 진행도 리스너 연결
  public connect(onProgress: ComfyProgressCallback): void {
    this.disconnect();
    const wsUrl = `${this.baseUrl.replace(/^http/, 'ws')}/ws?clientId=${this.clientId}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'progress') {
            const { value, max } = msg.data;
            const pct = Math.round((value / max) * 100);
            onProgress(pct, `샘플링 중 (${pct}%)`);
          } else if (msg.type === 'executing') {
            if (msg.data.node) {
              onProgress(100, `노드 실행: ${msg.data.node}`);
            } else {
              onProgress(100, '생성 완료');
            }
          }
        } catch (e) {
          console.error('WS 메시지 파싱 오류:', e);
        }
      };

      this.ws.onerror = () => {
        onProgress(0, 'ComfyUI WebSocket 연결 실패');
      };
    } catch (e) {
      console.error('WebSocket 생성 실패:', e);
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // PNG 이미지 업로드 (POST /upload/image)
  public async uploadImage(imageBlob: Blob, filename = 'openpose_input.png'): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageBlob, filename);
    formData.append('overwrite', 'true');

    const res = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`이미지 업로드 실패: ${res.statusText}`);
    }

    const data = await res.json();
    return data.name;
  }
}

export const comfyClient = new ComfyClient();

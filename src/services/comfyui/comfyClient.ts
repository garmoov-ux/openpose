import { ComfyApiWorkflow, UploadedComfyAsset } from './workflowMapper';

export type ComfyJobState =
  | 'idle'
  | 'checking'
  | 'uploading'
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ComfyOutputImageInfo {
  filename: string;
  subfolder: string;
  type: string;
  viewUrl: string;
}

export interface ComfyJobUpdate {
  state: ComfyJobState;
  promptId?: string;
  stepPercent?: number;
  message: string;
  errorDetail?: string;
  outputImages?: ComfyOutputImageInfo[];
}

export interface ComfyProgressCallback {
  (percent: number, status: string): void;
}

export class ComfyClient {
  private baseUrl: string;
  private ws: WebSocket | null = null;
  private clientId: string;
  private activePromptId: string | null = null;

  constructor(serverUrl = 'http://127.0.0.1:8188') {
    this.baseUrl = serverUrl.replace(/\/$/, '');
    this.clientId = crypto.randomUUID();
  }

  public getBaseUrl(): string { return this.baseUrl; }
  public getClientId(): string { return this.clientId; }
  public getActivePromptId(): string | null { return this.activePromptId; }

  public setBaseUrl(url: string): void {
    const trimmed = url.trim().replace(/\/$/, '');
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        this.baseUrl = `${parsed.protocol}//${parsed.host}`;
      } else {
        this.baseUrl = trimmed;
      }
    } catch {
      this.baseUrl = trimmed;
    }
    this.disconnect();
  }

  private classifyFetchError(err: unknown, contextLabel: string): Error {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      return new Error(`${contextLabel} 시간 초과: 서버가 응답하지 않습니다.`);
    }
    if (err instanceof TypeError) {
      return new Error(
        `${contextLabel} 연결 실패: ComfyUI 서버(${this.baseUrl}) 미실행 또는 CORS 차단 (--enable-cors-header 확인)`
      );
    }
    return err instanceof Error ? err : new Error(`${contextLabel} 중 알 수 없는 오류 발생`);
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/system_stats`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async uploadImageAsset(
    imageBlob: Blob,
    filename?: string,
    options: { overwrite?: boolean; subfolder?: string } = {}
  ): Promise<UploadedComfyAsset> {
    const uniqueName = filename || `pose_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.png`;
    const formData = new FormData();
    formData.append('image', imageBlob, uniqueName);
    formData.append('overwrite', options.overwrite ? 'true' : 'false');
    if (options.subfolder) formData.append('subfolder', options.subfolder);

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000),
      });
    } catch (err) {
      throw this.classifyFetchError(err, '이미지 업로드');
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`이미지 업로드 실패 (${res.status}): ${text || res.statusText}`);
    }

    const data = (await res.json()) as { name?: string; subfolder?: string; type?: string };
    if (!data || typeof data.name !== 'string' || !data.name) {
      throw new Error('서버 업로드 응답에 파일명(name)이 없습니다.');
    }

    return {
      name: data.name,
      subfolder: typeof data.subfolder === 'string' ? data.subfolder : '',
      type: typeof data.type === 'string' ? data.type : 'input',
    };
  }

  public async uploadImage(imageBlob: Blob, filename?: string): Promise<string> {
    const asset = await this.uploadImageAsset(imageBlob, filename, { overwrite: false });
    return asset.subfolder ? `${asset.subfolder}/${asset.name}` : asset.name;
  }

  public async queuePrompt(workflow: ComfyApiWorkflow): Promise<{ promptId: string }> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow, client_id: this.clientId }),
        signal: AbortSignal.timeout(10000),
      });
    } catch (err) {
      throw this.classifyFetchError(err, '워크플로우 큐 제출');
    }

    const bodyText = await res.text().catch(() => '');
    let parsed: Record<string, unknown> = {};
    try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch { /* ignore */ }

    if (!res.ok) {
      const errObj = parsed.error as { message?: string } | undefined;
      throw new Error(`큐 제출 실패 (${res.status}): ${errObj?.message || bodyText || res.statusText}`);
    }

    const promptId = typeof parsed.prompt_id === 'string' ? parsed.prompt_id : '';
    if (!promptId) throw new Error('ComfyUI 응답에 prompt_id가 없습니다.');
    this.activePromptId = promptId;
    return { promptId };
  }

  public async fetchPromptHistory(promptId: string): Promise<{
    completed: boolean;
    failed: boolean;
    errorMessage?: string;
    outputImages: ComfyOutputImageInfo[];
  }> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/history/${encodeURIComponent(promptId)}`, {
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      throw this.classifyFetchError(err, '히스토리 조회');
    }

    if (!res.ok) return { completed: false, failed: false, outputImages: [] };
    const data = (await res.json()) as Record<string, unknown>;
    const entry = data[promptId] as Record<string, unknown> | undefined;
    if (!entry) return { completed: false, failed: false, outputImages: [] };

    const statusObj = entry.status as { status_str?: string; completed?: boolean } | undefined;
    if (statusObj?.status_str === 'error') {
      return {
        completed: false,
        failed: true,
        errorMessage: 'ComfyUI 워크플로우 실행 중 서버 오류가 발생했습니다.',
        outputImages: [],
      };
    }

    const outputs = entry.outputs as Record<string, { images?: Array<Record<string, string>> }> | undefined;
    const outputImages: ComfyOutputImageInfo[] = [];
    if (outputs && typeof outputs === 'object') {
      for (const nodeOut of Object.values(outputs)) {
        if (!Array.isArray(nodeOut?.images)) continue;
        for (const img of nodeOut.images) {
          if (typeof img.filename !== 'string') continue;
          const subfolder = typeof img.subfolder === 'string' ? img.subfolder : '';
          const type = typeof img.type === 'string' ? img.type : 'output';
          const qs = new URLSearchParams({ filename: img.filename, subfolder, type }).toString();
          outputImages.push({ filename: img.filename, subfolder, type, viewUrl: `${this.baseUrl}/view?${qs}` });
        }
      }
    }

    return {
      completed: Boolean(statusObj?.completed || outputImages.length > 0),
      failed: false,
      outputImages,
    };
  }

  public subscribePromptJob(promptId: string, onUpdate: (update: ComfyJobUpdate) => void): void {
    this.disconnect();
    this.activePromptId = promptId;
    const wsUrl = `${this.baseUrl.replace(/^http/, 'ws')}/ws?clientId=${this.clientId}`;
    let finished = false;

    try {
      this.ws = new WebSocket(wsUrl);
      this.ws.onmessage = async (event) => {
        if (typeof event.data !== 'string') return;
        try {
          const msg = JSON.parse(event.data) as { type?: string; data?: Record<string, unknown> };
          const data = msg.data || {};
          const msgPromptId = typeof data.prompt_id === 'string' ? data.prompt_id : null;
          if (msgPromptId && msgPromptId !== promptId) return;

          if (msg.type === 'progress') {
            const value = Number(data.value) || 0;
            const max = Math.max(1, Number(data.max) || 1);
            const pct = Math.min(99, Math.round((value / max) * 100));
            onUpdate({
              state: 'running', promptId, stepPercent: pct,
              message: `샘플러 단계 진행 중 (${value}/${max}, ${pct}%)`,
            });
          } else if (msg.type === 'executing') {
            const node = data.node;
            if (node !== null && node !== undefined) {
              onUpdate({ state: 'running', promptId, message: `노드 #${String(node)} 실행 중...` });
            } else if (msgPromptId === promptId) {
              finished = true;
              const history = await this.fetchPromptHistory(promptId).catch(() => ({
                completed: true, failed: false, outputImages: [],
              }));
              onUpdate({
                state: 'completed', promptId, stepPercent: 100,
                message: '워크플로우 생성 완료', outputImages: history.outputImages,
              });
              this.disconnect();
            }
          } else if (msg.type === 'execution_error') {
            finished = true;
            const errMsg = typeof data.exception_message === 'string'
              ? data.exception_message
              : '노드 실행 중 오류가 발생했습니다.';
            onUpdate({ state: 'failed', promptId, message: '워크플로우 실행 실패', errorDetail: errMsg });
            this.disconnect();
          }
        } catch { /* ignore */ }
      };

      this.ws.onerror = () => { if (!finished) this.recoverFromHistory(promptId, onUpdate); };
      this.ws.onclose = () => { if (!finished) this.recoverFromHistory(promptId, onUpdate); };
    } catch (err) {
      onUpdate({
        state: 'failed', promptId, message: 'WebSocket 연결 생성 실패',
        errorDetail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private async recoverFromHistory(promptId: string, onUpdate: (update: ComfyJobUpdate) => void): Promise<void> {
    try {
      const history = await this.fetchPromptHistory(promptId);
      if (history.failed) {
        onUpdate({ state: 'failed', promptId, message: '워크플로우 실행 실패 (히스토리 확인)', errorDetail: history.errorMessage });
      } else if (history.completed) {
        onUpdate({
          state: 'completed', promptId, stepPercent: 100,
          message: '생성 완료 (히스토리 복구됨)', outputImages: history.outputImages,
        });
      } else {
        onUpdate({ state: 'failed', promptId, message: 'WebSocket 연결이 끊어졌으며 완료된 결과를 찾지 못했습니다.' });
      }
    } catch (err) {
      onUpdate({
        state: 'failed', promptId, message: '연결 끊김 후 히스토리 상태 복구 실패',
        errorDetail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.close();
      this.ws = null;
    }
  }
}

export const comfyClient = new ComfyClient();

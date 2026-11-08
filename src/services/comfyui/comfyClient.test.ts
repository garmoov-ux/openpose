import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  injectImageIntoWorkflow,
  parseAndValidateComfyWorkflow,
} from './workflowMapper';
import { ComfyClient, ComfyJobUpdate } from './comfyClient';

describe('ComfyUI 워크플로우 매퍼 및 상태 추적 클라이언트 (comfyClient & workflowMapper)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('UI 그래프 형식 워크플로우를 거절하고 API 형식 워크플로우에서 명시적 LoadImage 노드 ID 주입만 허용해야 한다', () => {
    const uiWorkflow = { nodes: [{ id: 1 }], links: [] };
    const uiRes = parseAndValidateComfyWorkflow(uiWorkflow);
    expect(uiRes.error).toContain('Save (API Format)');

    const apiWorkflow = {
      '10': {
        class_type: 'LoadImage',
        inputs: { image: 'default.png' },
        _meta: { title: 'Pose Input' },
      },
      '20': {
        class_type: 'SaveImage',
        inputs: { filename_prefix: 'ComfyUI', images: ['10', 0] },
      },
    };

    const parsed = parseAndValidateComfyWorkflow(apiWorkflow);
    expect(parsed.error).toBeUndefined();
    expect(parsed.loadImageNodes).toHaveLength(1);
    expect(parsed.loadImageNodes[0].nodeId).toBe('10');

    // 노드 ID 미지정 시 거절
    expect(
      injectImageIntoWorkflow(parsed.workflow!, '', { name: 'pose.png' }).error
    ).toContain('명시적으로 선택');

    // 정상 주입 시 subfolder/name 보존 및 원본 불변 보장
    const injected = injectImageIntoWorkflow(parsed.workflow!, '10', {
      name: 'pose_01.png',
      subfolder: 'controlnet',
    });
    expect(injected.error).toBeUndefined();
    expect(injected.workflow?.['10'].inputs.image).toBe('controlnet/pose_01.png');
    expect(parsed.workflow?.['10'].inputs.image).toBe('default.png');
  });

  it('업로드 성공 후 큐 제출 실패, 타 작업 이벤트 무시, executing node 진행 중/완료 구분, 연결 끊김 시 history 복구를 수행해야 한다', async () => {
    const client = new ComfyClient('http://127.0.0.1:8188');

    // 1. 이미지 업로드 성공 검증 (name + subfolder 보존, overwrite 기본 false)
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'uploaded_pose.png', subfolder: 'poses', type: 'input' }),
    });

    const asset = await client.uploadImageAsset(new Blob(['png']), 'test.png');
    expect(asset).toEqual({
      name: 'uploaded_pose.png',
      subfolder: 'poses',
      type: 'input',
    });

    // 2. 큐 제출 실패 시 상세 오류 반환
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => JSON.stringify({ error: { message: 'Invalid node input' } }),
    });

    await expect(
      client.queuePrompt({
        '1': { class_type: 'LoadImage', inputs: { image: 'a.png' } },
      })
    ).rejects.toThrow('Invalid node input');

    // 3. 큐 제출 성공
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ prompt_id: 'prompt-target-123' }),
    });
    const queued = await client.queuePrompt({
      '1': { class_type: 'LoadImage', inputs: { image: 'a.png' } },
    });
    expect(queued.promptId).toBe('prompt-target-123');

    // 4. WebSocket 이벤트 추적: 타 작업 무시, executing node !== null 은 running, 소켓 종료 시 history 복구
    let wsInstance: {
      onmessage?: (ev: { data: string }) => void;
      onclose?: () => void;
      close: () => void;
    } | null = null;

    class MockWebSocket {
      public onmessage?: (ev: { data: string }) => void;
      public onerror?: () => void;
      public onclose?: () => void;
      constructor() {
        wsInstance = this;
      }
      close() {}
    }
    vi.stubGlobal('WebSocket', MockWebSocket);

    const updates: ComfyJobUpdate[] = [];
    client.subscribePromptJob('prompt-target-123', (u) => updates.push(u));
    expect(wsInstance).not.toBeNull();

    // 다른 prompt_id 이벤트는 무시되어야 함
    await wsInstance!.onmessage?.({
      data: JSON.stringify({
        type: 'executing',
        data: { prompt_id: 'other-prompt-999', node: null },
      }),
    });
    expect(updates).toHaveLength(0);

    // 대상 prompt_id의 node 실행 중 이벤트는 completed가 아닌 running이어야 함
    await wsInstance!.onmessage?.({
      data: JSON.stringify({
        type: 'executing',
        data: { prompt_id: 'prompt-target-123', node: '5' },
      }),
    });
    expect(updates).toHaveLength(1);
    expect(updates[0].state).toBe('running');

    // 소켓 연결이 끊겼을 때 GET /history/prompt-target-123 로 완료 상태 복구
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        'prompt-target-123': {
          status: { status_str: 'success', completed: true },
          outputs: {
            '9': {
              images: [{ filename: 'result_0001.png', subfolder: '', type: 'output' }],
            },
          },
        },
      }),
    });

    await wsInstance!.onclose?.();
    await new Promise((r) => setTimeout(r, 10));

    const lastUpdate = updates[updates.length - 1];
    expect(lastUpdate.state).toBe('completed');
    expect(lastUpdate.outputImages?.[0].filename).toBe('result_0001.png');
  });
});


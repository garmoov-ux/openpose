import React, { useState, useRef } from 'react';
import { Upload, Play, CheckCircle2, AlertCircle, FileUp, RefreshCw } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { comfyClient, ComfyJobState, ComfyOutputImageInfo } from '@/services/comfyui/comfyClient';
import {
  ComfyApiWorkflow,
  injectImageIntoWorkflow,
  LoadImageNodeInfo,
  parseAndValidateComfyWorkflow,
  UploadedComfyAsset,
} from '@/services/comfyui/workflowMapper';

interface ComfyWorkflowSectionProps {
  sceneManager: SceneManager | null;
}

export const ComfyWorkflowSection: React.FC<ComfyWorkflowSectionProps> = ({ sceneManager }) => {
  const { comfyUrl, setComfyUrl, exportWidth, exportHeight, bodyFormat, renderMode, sceneRevision } = useEditorStore();
  const { showPartnerGuide } = useThemeSoloStore();

  const [jobState, setJobState] = useState<ComfyJobState>('idle');
  const [stepPercent, setStepPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('대기 중');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedAsset, setUploadedAsset] = useState<UploadedComfyAsset | null>(null);

  const [workflow, setWorkflow] = useState<ComfyApiWorkflow | null>(null);
  const [workflowFileName, setWorkflowFileName] = useState<string | null>(null);
  const [loadImageNodes, setLoadImageNodes] = useState<LoadImageNodeInfo[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [outputImages, setOutputImages] = useState<ComfyOutputImageInfo[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const captureCurrentBlob = () => {
    if (!sceneManager) throw new Error('3D 장면이 아직 준비되지 않았습니다.');
    return sceneManager.runRenderJob({
      sceneRevision,
      width: exportWidth,
      height: exportHeight,
      mode: renderMode,
      actorIds: showPartnerGuide ? ['main', 'partner'] : ['main'],
      bodyFormat,
    }).png;
  };

  const handleUploadOnly = async () => {
    if (!sceneManager) return;
    setUploadError(null);
    setJobState('checking');
    setStatusMessage('ComfyUI 서버 연결 확인 중...');

    try {
      comfyClient.setBaseUrl(comfyUrl);
      if (!(await comfyClient.checkHealth())) {
        throw new Error(`ComfyUI 서버(${comfyUrl})에 연결할 수 없습니다. 로컬 서버 실행 및 CORS 설정을 확인하세요.`);
      }
      setJobState('uploading');
      setStatusMessage('현재 렌더 맵 PNG 업로드 중...');
      const asset = await comfyClient.uploadImageAsset(captureCurrentBlob());
      setUploadedAsset(asset);
      setJobState('idle');
      setStatusMessage(`업로드 완료: ${asset.subfolder ? `${asset.subfolder}/` : ''}${asset.name}`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
      setJobState('failed');
      setStatusMessage('업로드 실패');
    }
  };

  const handleWorkflowFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWorkflowError(null);
    setRunError(null);
    try {
      const parsed = parseAndValidateComfyWorkflow(await file.text());
      if (!parsed.workflow || parsed.error) {
        setWorkflow(null);
        setLoadImageNodes([]);
        setSelectedNodeId('');
        setWorkflowError(parsed.error || '워크플로우 검증 실패');
        return;
      }
      setWorkflow(parsed.workflow);
      setWorkflowFileName(file.name);
      setLoadImageNodes(parsed.loadImageNodes);
      setSelectedNodeId('');
    } catch {
      setWorkflowError('워크플로우 파일을 읽는 중 오류가 발생했습니다.');
    } finally {
      e.target.value = '';
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!sceneManager || !workflow || !selectedNodeId) return;
    setRunError(null);
    setOutputImages([]);
    setJobState('checking');
    setStatusMessage('서버 상태 확인 중...');

    try {
      comfyClient.setBaseUrl(comfyUrl);
      if (!(await comfyClient.checkHealth())) {
        throw new Error(`ComfyUI 서버(${comfyUrl})가 응답하지 않습니다.`);
      }

      let activeAsset = uploadedAsset;
      if (!activeAsset) {
        setJobState('uploading');
        setStatusMessage('제어 맵 이미지 업로드 중...');
        activeAsset = await comfyClient.uploadImageAsset(captureCurrentBlob());
        setUploadedAsset(activeAsset);
      }

      const injected = injectImageIntoWorkflow(workflow, selectedNodeId, activeAsset);
      if (!injected.workflow || injected.error) {
        throw new Error(injected.error || '워크플로우 노드 매핑 실패');
      }

      setJobState('queued');
      setStatusMessage('워크플로우 큐 제출 중...');
      const { promptId } = await comfyClient.queuePrompt(injected.workflow);
      setStatusMessage(`큐 등록됨 (ID: ${promptId.slice(0, 8)}...)`);

      comfyClient.subscribePromptJob(promptId, (update) => {
        setJobState(update.state);
        if (update.stepPercent !== undefined) setStepPercent(update.stepPercent);
        setStatusMessage(update.message);
        if (update.state === 'failed') setRunError(update.errorDetail || update.message);
        if (update.outputImages?.length) setOutputImages(update.outputImages);
      });
    } catch (err) {
      setRunError(err instanceof Error ? err.message : '워크플로우 실행 실패');
      setJobState('failed');
      setStatusMessage('실행 실패');
    }
  };

  const isBusy = ['checking', 'uploading', 'queued', 'running'].includes(jobState);
  const canExecuteWorkflow = Boolean(workflow && selectedNodeId && !isBusy);

  return (
    <div className="p-4 bg-white rounded-3xl border border-zinc-200/90 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-zinc-900 text-xs">3. ComfyUI 업로드 및 워크플로우 실행</span>
        <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold text-xs">
          상태: {jobState}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label htmlFor="comfy-url-input" className="text-xs font-semibold text-zinc-600 shrink-0">서버 주소</label>
        <input
          id="comfy-url-input"
          type="text"
          value={comfyUrl}
          onChange={(e) => setComfyUrl(e.target.value)}
          className="flex-1 px-2.5 py-1.5 bg-zinc-100 rounded-xl text-xs text-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleUploadOnly}
          disabled={isBusy}
          className="min-h-10 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold rounded-full transition-all focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Upload className="w-4 h-4" />
          <span>ComfyUI에 이미지 업로드</span>
        </button>

        {uploadedAsset && !uploadError && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">
              업로드됨: <strong>{uploadedAsset.subfolder ? `${uploadedAsset.subfolder}/` : ''}{uploadedAsset.name}</strong>
            </span>
          </div>
        )}

        {uploadError && (
          <div className="flex flex-col gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
            <button
              type="button"
              onClick={handleUploadOnly}
              className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-300 text-red-800 font-semibold hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3" />
              <span>업로드 재시도</span>
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-100 pt-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-700">API 워크플로우 매핑 (선택)</span>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleWorkflowFileSelect} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>{workflowFileName ? '워크플로우 교체' : 'API JSON 열기'}</span>
          </button>
        </div>

        {workflowFileName && (
          <div className="text-xs text-zinc-600 truncate">
            불러온 파일: <span className="font-mono text-zinc-900">{workflowFileName}</span>
          </div>
        )}

        {loadImageNodes.length > 0 && (
          <div className="flex flex-col gap-1">
            <label htmlFor="loadimage-node-select" className="text-xs font-semibold text-zinc-700">
              주입할 LoadImage 노드 ID 지정 (필수)
            </label>
            <select
              id="loadimage-node-select"
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- 대상 LoadImage 노드를 선택하세요 --</option>
              {loadImageNodes.map((n) => (
                <option key={n.nodeId} value={n.nodeId}>
                  #{n.nodeId} - {n.title} ({n.currentImage || '빈 이미지'})
                </option>
              ))}
            </select>
          </div>
        )}

        {workflowError && (
          <div className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{workflowError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleExecuteWorkflow}
          disabled={!canExecuteWorkflow}
          title={
            !workflow
              ? '먼저 ComfyUI API 형식 워크플로우 JSON을 불러오세요'
              : !selectedNodeId
              ? '이미지를 주입할 LoadImage 노드 ID를 선택하세요'
              : '선택한 노드에 이미지를 주입하고 큐를 실행합니다'
          }
          className="min-h-10 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-200 disabled:text-zinc-500 text-white text-xs font-bold rounded-full transition-all focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{jobState === 'running' ? `워크플로우 실행 중 (단계 ${stepPercent}%)` : '워크플로우 큐 실행'}</span>
        </button>

        <div className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-200/80 px-3 py-2 rounded-xl">
          진행 상태: <span className="font-semibold text-zinc-900">{statusMessage}</span>
        </div>

        {runError && (
          <div className="flex flex-col gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{runError}</span>
            </div>
            <button
              type="button"
              onClick={handleExecuteWorkflow}
              className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-300 text-red-800 font-semibold hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3" />
              <span>실행 재시도</span>
            </button>
          </div>
        )}

        {outputImages.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-xs font-bold text-emerald-700">생성 결과 이미지 ({outputImages.length}장)</span>
            <div className="grid grid-cols-2 gap-2">
              {outputImages.map((img, i) => (
                <a key={`${img.filename}-${i}`} href={img.viewUrl} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-zinc-200 bg-zinc-950">
                  <img src={img.viewUrl} alt={img.filename} className="w-full h-28 object-contain" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

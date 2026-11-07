import React, { useState } from 'react';
import { Copy, Download, Send, Check, AlertCircle, FileCode } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { dataURLtoBlob, copyBlobToClipboard, downloadBlobAsFile, downloadJson } from '@/utils/exportUtils';
import { getJointScreenPositions, exportOpenPoseJson } from '@/core/pipeline/openposePipeline';
import { comfyClient } from '@/services/comfyui/comfyClient';

interface ExportPanelProps {
  sceneManager: SceneManager | null;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ sceneManager }) => {
  const {
    exportResolution,
    setExportResolution,
    comfyUrl,
    setComfyUrl,
    isGenerating,
    setIsGenerating,
    generationProgress,
    generationStatus,
    setGenerationProgress,
  } = useEditorStore();

  const [copied, setCopied] = useState(false);
  const [comfyStatus, setComfyStatus] = useState<string | null>(null);

  const resolutions = [512, 768, 1024];

  const handleCopyClipboard = async () => {
    if (!sceneManager) return;
    const dataUrl = sceneManager.captureSnapshot(exportResolution);
    const blob = dataURLtoBlob(dataUrl);
    const success = await copyBlobToClipboard(blob);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = () => {
    if (!sceneManager) return;
    const dataUrl = sceneManager.captureSnapshot(exportResolution);
    const blob = dataURLtoBlob(dataUrl);
    downloadBlobAsFile(blob, `pose_${exportResolution}x${exportResolution}.png`);
  };

  const handleExportJson = () => {
    if (!sceneManager) return;
    const positions = getJointScreenPositions(
      sceneManager.humanoid.bones,
      sceneManager.camera,
      exportResolution,
      exportResolution
    );
    const jsonData = exportOpenPoseJson(positions, exportResolution, exportResolution);
    downloadJson(jsonData, 'openpose_keypoints.json');
  };

  const handleSendToComfy = async () => {
    if (!sceneManager) return;
    setIsGenerating(true);
    setComfyStatus('연결 확인 중...');

    try {
      comfyClient.setBaseUrl(comfyUrl);
      const isOnline = await comfyClient.checkHealth();
      if (!isOnline) {
        throw new Error('ComfyUI 서버에 연결할 수 없습니다. (127.0.0.1:8188 실행 확인 필요)');
      }

      setComfyStatus('이미지 캡처 및 업로드 중...');
      const dataUrl = sceneManager.captureSnapshot(exportResolution);
      const blob = dataURLtoBlob(dataUrl);
      const filename = await comfyClient.uploadImage(blob);

      setComfyStatus(`업로드 완료: ${filename}`);

      // WebSocket 실시간 진행도 수신
      comfyClient.connect((percent, status) => {
        setGenerationProgress(percent, status);
        if (percent >= 100) {
          setIsGenerating(false);
          setComfyStatus('생성 완료');
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '알 수 없는 오류 발생';
      setComfyStatus(msg);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800 shadow-xl">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
        내보내기 및 AI 연동
      </div>

      {/* 해상도 선택 */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
        <span className="text-neutral-400 px-2 font-medium">해상도:</span>
        {resolutions.map((res) => (
          <button
            key={res}
            onClick={() => setExportResolution(res)}
            className={`flex-1 py-1 rounded-lg font-medium transition-all ${
              exportResolution === res
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {res}px
          </button>
        ))}
      </div>

      {/* 원클릭 클립보드 복사 및 다운로드 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopyClipboard}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '복사 완료' : '클립보드 복사'}</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl border border-neutral-700 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>PNG 저장</span>
        </button>
      </div>

      {/* OpenPose JSON 내보내기 */}
      <button
        onClick={handleExportJson}
        className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 text-xs font-medium rounded-xl border border-neutral-800 transition-all"
      >
        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
        <span>OpenPose JSON 다운로드</span>
      </button>

      {/* ComfyUI 직결 섹션 */}
      <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>ComfyUI 서버:</span>
          <input
            type="text"
            value={comfyUrl}
            onChange={(e) => setComfyUrl(e.target.value)}
            className="w-40 px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-[11px] text-neutral-200 font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSendToComfy}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isGenerating ? `생성 중 (${generationProgress}%)` : 'ComfyUI로 전송'}</span>
        </button>

        {comfyStatus && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate">{generationStatus || comfyStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};


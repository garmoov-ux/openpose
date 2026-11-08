import React, { useState } from 'react';
import { Copy, Download, Send, Check, AlertCircle, FileCode } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { buildThemeSoloPrompt } from '@/services/comfyui/promptBuilder';
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

  const themeStore = useThemeSoloStore();

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

      // 현재 테마와 프롬프트 생성
      const promptText = buildThemeSoloPrompt({
        themeId: themeStore.selectedThemeId,
        envIndex: themeStore.selectedEnvIndex,
        lightIndex: themeStore.selectedLightIndex,
        outfitId: themeStore.selectedOutfitId,
        outfitCategory: themeStore.selectedOutfitCategory,
        postureId: themeStore.selectedPostureId,
        shotPrefixIndex: themeStore.selectedShotPrefixIndex,
        isWildcardMode: themeStore.isWildcardMode,
      });

      console.log('ComfyUI 업로드 완료:', filename, '프롬프트:', promptText.slice(0, 80));
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
    <div className="flex flex-col gap-3 p-3.5 bg-[#ffffff] rounded-[24px] border border-[#e0e0e0] text-xs">
      <div className="text-[11px] font-semibold text-[#707070] tracking-wider px-1">
        화면 캡처 저장 및 생성 서버 연동
      </div>

      {/* 해상도 선택 (세그먼트 컨트롤 스타일) */}
      <div className="flex items-center gap-1 p-1 bg-[#f0f0f0] rounded-full">
        <span className="text-[#707070] px-2 text-[11px] font-medium">출력 크기:</span>
        {resolutions.map((res) => (
          <button
            key={res}
            onClick={() => setExportResolution(res)}
            className={`flex-1 py-1 rounded-full text-[11px] font-medium transition-all ${
              exportResolution === res
                ? 'bg-[#ffffff] text-[#141414] shadow-sm'
                : 'text-[#707070] hover:text-[#141414]'
            }`}
          >
            {res} 화소
          </button>
        ))}
      </div>

      {/* 원클릭 클립보드 복사 및 다운로드 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopyClipboard}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#141414] hover:bg-[#262626] text-[#ffffff] font-medium rounded-full transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '복사 완료' : '클립보드 복사'}</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] font-medium rounded-full border border-[#e0e0e0] transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-[#707070]" />
          <span>이미지 저장</span>
        </button>
      </div>

      {/* 관절 좌표 데이터 내보내기 */}
      <button
        onClick={handleExportJson}
        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] font-medium rounded-full transition-all"
      >
        <FileCode className="w-3.5 h-3.5 text-[#0066ff]" />
        <span>관절 좌표 데이터 저장</span>
      </button>

      {/* 인공지능 생성 서버 직결 섹션 */}
      <div className="pt-2 border-t border-[#f0f0f0] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#707070]">
          <span className="font-medium">생성 서버 주소:</span>
          <input
            type="text"
            value={comfyUrl}
            onChange={(e) => setComfyUrl(e.target.value)}
            className="w-36 px-2.5 py-1 bg-[#f0f0f0] rounded-[12px] text-[11px] text-[#141414] font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
          />
        </div>

        <button
          onClick={handleSendToComfy}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#141414] hover:bg-[#262626] disabled:opacity-50 text-[#ffffff] font-medium rounded-full transition-all active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>{isGenerating ? `생성 진행 중 (${generationProgress}%)` : '생성 서버로 즉시 전송'}</span>
        </button>

        {comfyStatus && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#707070] bg-[#f0f0f0] p-2 rounded-[12px]">
            <AlertCircle className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" />
            <span className="truncate">{generationStatus || comfyStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};

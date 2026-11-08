import React, { useState, useMemo } from 'react';
import { Copy, Download, Send, Check, AlertCircle, FileCode, Tag } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { buildCompactSceneTagSummary } from '@/services/comfyui/promptBuilder';
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
    currentModelId,
  } = useEditorStore();

  const themeStore = useThemeSoloStore();

  const [copiedImg, setCopiedImg] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [comfyStatus, setComfyStatus] = useState<string | null>(null);

  const resolutions = [512, 768, 1024];

  const compactSceneTags = useMemo(() => {
    return buildCompactSceneTagSummary({
      modelId: currentModelId,
      outfitId: themeStore.selectedOutfitId,
      themeId: themeStore.selectedThemeId,
      envIndex: themeStore.selectedEnvIndex,
      lightIndex: themeStore.selectedLightIndex,
      postureId: themeStore.selectedPostureId,
      nailColorId: themeStore.nailColorId,
      footwearId: themeStore.footwearId,
      neckItemId: themeStore.neckItemId,
      wristItemId: themeStore.wristItemId,
      legItemId: themeStore.legItemId,
      toyItemId: themeStore.toyItemId,
      extraSceneProps: themeStore.extraSceneProps,
      roomProps: themeStore.roomProps,
    });
  }, [
    currentModelId,
    themeStore.selectedOutfitId,
    themeStore.selectedThemeId,
    themeStore.selectedEnvIndex,
    themeStore.selectedLightIndex,
    themeStore.selectedPostureId,
    themeStore.nailColorId,
    themeStore.footwearId,
    themeStore.neckItemId,
    themeStore.wristItemId,
    themeStore.legItemId,
    themeStore.toyItemId,
    themeStore.extraSceneProps,
    themeStore.roomProps,
  ]);

  const handleCopyClipboard = async () => {
    if (!sceneManager) return;
    const dataUrl = sceneManager.captureSnapshot(exportResolution);
    const blob = dataURLtoBlob(dataUrl);
    const success = await copyBlobToClipboard(blob);
    if (success) {
      setCopiedImg(true);
      setTimeout(() => setCopiedImg(false), 2000);
    }
  };

  const handleCopySceneTags = async () => {
    try {
      await navigator.clipboard.writeText(compactSceneTags);
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } catch {
      // 클립보드 권한 실패 무시
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

      console.log('ComfyUI 업로드 완료:', filename, '장면 태그:', compactSceneTags);
      setComfyStatus(`업로드 완료: ${filename}`);

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
    <div className="flex flex-col gap-3.5 text-xs">
      {/* 1. 고해상도 캔버스 캡처 & 클립보드 복사 카드 */}
      <div className="flex flex-col gap-3 p-4 bg-white rounded-3xl border border-zinc-200/90 shadow-xs">
        <div className="text-xs font-bold text-zinc-900 tracking-tight">
          1. 3D 뷰포트 & ControlNet 맵 캡처
        </div>

        {/* 해상도 선택 */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-full">
          <span className="text-zinc-600 px-2.5 text-xs font-semibold">출력 해상도</span>
          {resolutions.map((res) => (
            <button
              key={res}
              onClick={() => setExportResolution(res)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                exportResolution === res
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {res}px
            </button>
          ))}
        </div>

        {/* 원클릭 클립보드 복사 및 PNG 저장 */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full transition-all active:scale-95"
          >
            {copiedImg ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copiedImg ? '이미지 복사됨' : '클립보드 이미지 복사'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-full border border-zinc-200 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-zinc-700" />
            <span>PNG 파일 저장</span>
          </button>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-full transition-all"
        >
          <FileCode className="w-4 h-4 text-blue-600" />
          <span>OpenPose 관절 좌표 JSON 내보내기</span>
        </button>
      </div>

      {/* 2. 방안 A: 현재 3D 장면 핵심 태그 요약기 (경량화 통합) */}
      <div className="flex flex-col gap-2.5 p-4 bg-zinc-50 rounded-3xl border border-zinc-200/90">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs">
            <Tag className="w-4 h-4 text-blue-600" />
            <span>2. 현재 3D 장면 핵심 태그 요약</span>
          </span>
          <span className="text-[10px] font-semibold text-zinc-500">
            마네킹 · 복장 · 조명 자동 반영
          </span>
        </div>

        <div className="p-2.5 bg-white border border-zinc-200 rounded-2xl text-[11px] text-zinc-700 font-mono leading-relaxed select-all">
          {compactSceneTags}
        </div>

        <button
          onClick={handleCopySceneTags}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full transition-all active:scale-95"
        >
          {copiedTags ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>핵심 태그 복사 완료</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>핵심 장면 태그 한 줄 복사</span>
            </>
          )}
        </button>
      </div>

      {/* 3. ComfyUI 로컬 생성 서버 직결 섹션 */}
      <div className="p-4 bg-white rounded-3xl border border-zinc-200/90 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-zinc-700">
          <span className="font-bold text-zinc-900">3. ComfyUI 서버 직결</span>
          <input
            type="text"
            value={comfyUrl}
            onChange={(e) => setComfyUrl(e.target.value)}
            className="w-40 px-2.5 py-1 bg-zinc-100 rounded-xl text-[11px] text-zinc-900 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <button
          onClick={handleSendToComfy}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-full transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isGenerating ? `생성 진행 중 (${generationProgress}%)` : 'ComfyUI로 캡처 즉시 전송'}</span>
        </button>

        {comfyStatus && (
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-700 bg-zinc-100 p-2 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="truncate">{generationStatus || comfyStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};

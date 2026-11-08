import React, { useState, useMemo } from 'react';
import { Copy, Download, Check, AlertCircle, FileCode, Eye } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { buildCompactSceneTagSummary } from '@/services/comfyui/promptBuilder';
import { composeOutfit } from '@/core/mannequin/wardrobe/composition';
import { SceneManager } from '@/core/scene/SceneManager';
import { copyBlobToClipboard, downloadBlobAsFile, downloadJson } from '@/utils/exportUtils';
import { RenderSpec } from '@/types/sceneDocument';
import { ComfyWorkflowSection } from './ComfyWorkflowSection';
import { SceneDocumentIoSection } from './SceneDocumentIoSection';

interface ExportPanelProps {
  sceneManager: SceneManager | null;
}

const SIZE_PRESETS = [
  { label: '512×512 (1:1)', width: 512, height: 512 },
  { label: '768×1024 (3:4)', width: 768, height: 1024 },
  { label: '1024×1024 (1:1)', width: 1024, height: 1024 },
];

export const ExportPanel: React.FC<ExportPanelProps> = ({ sceneManager }) => {
  const {
    exportWidth, exportHeight, setExportDimensions, bodyFormat, setBodyFormat,
    renderMode, sceneRevision, currentModelId,
  } = useEditorStore();
  const themeStore = useThemeSoloStore();

  const [copiedImg, setCopiedImg] = useState(false);
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [appearanceMode, setAppearanceMode] = useState<'dressed' | 'body'>('dressed');

  const activeActorIds = useMemo(
    () => (themeStore.showPartnerGuide ? ['main', 'partner'] : ['main']),
    [themeStore.showPartnerGuide]
  );

  const currentRenderSpec: RenderSpec = useMemo(
    () => ({
      sceneRevision, width: exportWidth, height: exportHeight,
      mode: renderMode, actorIds: activeActorIds, bodyFormat,
      appearanceMode,
    }),
    [sceneRevision, exportWidth, exportHeight, renderMode, activeActorIds, bodyFormat, appearanceMode]
  );

  const mainComposed = useMemo(
    () => composeOutfit(themeStore.outfitCompositions.main.itemIds, { modelId: currentModelId }),
    [themeStore.outfitCompositions.main.itemIds, currentModelId]
  );

  const compactSceneTags = useMemo(
    () =>
      buildCompactSceneTagSummary({
        modelId: currentModelId,
        outfitId: themeStore.selectedOutfitId,
        outfitComposition: themeStore.outfitCompositions.main,
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
      }),
    [
      currentModelId, themeStore.selectedOutfitId, themeStore.outfitCompositions.main, themeStore.selectedThemeId,
      themeStore.selectedEnvIndex, themeStore.selectedLightIndex, themeStore.selectedPostureId,
      themeStore.nailColorId, themeStore.footwearId, themeStore.neckItemId,
      themeStore.wristItemId, themeStore.legItemId, themeStore.toyItemId,
      themeStore.extraSceneProps, themeStore.roomProps,
    ]
  );

  const handleRefreshPreview = () => {
    if (!sceneManager) return;
    setPreviewUrl(sceneManager.runRenderJob(currentRenderSpec).dataUrl);
  };

  const handleCopyClipboard = async () => {
    if (!sceneManager) return;
    setClipboardError(null);
    const res = sceneManager.runRenderJob(currentRenderSpec);
    setPreviewUrl(res.dataUrl);
    if (await copyBlobToClipboard(res.png)) {
      setCopiedImg(true);
      setTimeout(() => setCopiedImg(false), 2000);
    } else {
      setClipboardError('클립보드 복사 권한이 거부되었거나 브라우저가 지원하지 않습니다. PNG 다운로드를 이용하세요.');
    }
  };

  const handleDownloadPng = () => {
    if (!sceneManager) return;
    const res = sceneManager.runRenderJob(currentRenderSpec);
    setPreviewUrl(res.dataUrl);
    downloadBlobAsFile(res.png, `pose_${renderMode}_${exportWidth}x${exportHeight}.png`);
  };

  const handleExportOpenPoseJson = () => {
    if (!sceneManager) return;
    const res = sceneManager.runRenderJob(currentRenderSpec);
    setPreviewUrl(res.dataUrl);
    if (res.keypoints) {
      downloadJson(res.keypoints, `openpose_${bodyFormat}_${exportWidth}x${exportHeight}.json`);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 text-xs">
      <div className="flex flex-col gap-3 p-4 bg-white rounded-3xl border border-zinc-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-900">1. 출력 규격 (RenderSpec) & 맵 내보내기</span>
          <span className="text-xs font-semibold text-zinc-600">인물 {activeActorIds.length}명 · rev #{sceneRevision}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 rounded-2xl">
          {SIZE_PRESETS.map((preset) => {
            const active = exportWidth === preset.width && exportHeight === preset.height;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setExportDimensions(preset.width, preset.height)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  active ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-zinc-50 rounded-2xl border border-zinc-200/80">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-800">OpenPose 규격</span>
            <span className="text-xs text-zinc-500">14개 신체·코 유효 투영 (미지원 점은 0,0,0)</span>
          </div>
          <div className="flex items-center gap-1 bg-zinc-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setBodyFormat('coco18')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${bodyFormat === 'coco18' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
            >
              COCO 18
            </button>
            <button
              type="button"
              onClick={() => setBodyFormat('body25')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${bodyFormat === 'body25' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
            >
              BODY_25
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-zinc-50 rounded-2xl border border-zinc-200/80">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-800">외형 투영 모드 (appearanceMode)</span>
            <span className="text-xs text-zinc-500">Depth/Normal/Lineart에 의상 포함 여부</span>
          </div>
          <div className="flex items-center gap-1 bg-zinc-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setAppearanceMode('dressed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${appearanceMode === 'dressed' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
            >
              의상 포함 (dressed)
            </button>
            <button
              type="button"
              onClick={() => setAppearanceMode('body')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${appearanceMode === 'body' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
            >
              순수 체형 (body)
            </button>
          </div>
        </div>

        {mainComposed.promptOnlyItemIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            3D 미표시(prompt-only) 품목은 제어 맵에 반영되지 않으며 프롬프트에만 포함됩니다: {mainComposed.promptOnlyItemIds.join(', ')}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleRefreshPreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>출력 미리보기 갱신 ({exportWidth}×{exportHeight})</span>
          </button>
          <span className="text-xs text-zinc-500">모드: {renderMode}</span>
        </div>

        {previewUrl && (
          <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 flex items-center justify-center p-2">
            <img src={previewUrl} alt="출력 미리보기" className="max-h-40 object-contain rounded-lg" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="min-h-10 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full transition-all"
          >
            {copiedImg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedImg ? 'PNG 복사됨' : 'PNG 복사'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="min-h-10 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-full border border-zinc-200 transition-all"
          >
            <Download className="w-4 h-4 text-zinc-700" />
            <span>PNG 다운로드</span>
          </button>
        </div>

        {clipboardError && (
          <div className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{clipboardError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleExportOpenPoseJson}
          className="min-h-10 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-full transition-all"
        >
          <FileCode className="w-4 h-4 text-blue-600" />
          <span>OpenPose 2D JSON 다운로드 ({bodyFormat.toUpperCase()})</span>
        </button>
      </div>

      <SceneDocumentIoSection sceneManager={sceneManager} compactSceneTags={compactSceneTags} />

      <ComfyWorkflowSection sceneManager={sceneManager} />
    </div>
  );
};

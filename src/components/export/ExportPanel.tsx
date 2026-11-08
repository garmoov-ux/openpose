import React, { useState, useMemo, useRef } from 'react';
import { Copy, Download, Check, AlertCircle, FileCode, Tag, FolderOpen, Save, Eye } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { buildCompactSceneTagSummary } from '@/services/comfyui/promptBuilder';
import { SceneManager } from '@/core/scene/SceneManager';
import { copyBlobToClipboard, downloadBlobAsFile, downloadJson } from '@/utils/exportUtils';
import { MAX_SCENE_JSON_BYTES, validateSceneDocumentV1 } from '@/utils/securityUtils';
import { RenderSpec } from '@/types/sceneDocument';
import { ComfyWorkflowSection } from './ComfyWorkflowSection';

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
    renderMode, sceneRevision, currentModelId, commitSceneDocument,
  } = useEditorStore();
  const themeStore = useThemeSoloStore();
  const sceneFileInputRef = useRef<HTMLInputElement | null>(null);

  const [copiedImg, setCopiedImg] = useState(false);
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const [copiedTags, setCopiedTags] = useState(false);
  const [tagCopyError, setTagCopyError] = useState<string | null>(null);
  const [sceneIoMessage, setSceneIoMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const activeActorIds = useMemo(
    () => (themeStore.showPartnerGuide ? ['main', 'partner'] : ['main']),
    [themeStore.showPartnerGuide]
  );

  const currentRenderSpec: RenderSpec = useMemo(
    () => ({
      sceneRevision, width: exportWidth, height: exportHeight,
      mode: renderMode, actorIds: activeActorIds, bodyFormat,
    }),
    [sceneRevision, exportWidth, exportHeight, renderMode, activeActorIds, bodyFormat]
  );

  const compactSceneTags = useMemo(
    () =>
      buildCompactSceneTagSummary({
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
      }),
    [
      currentModelId, themeStore.selectedOutfitId, themeStore.selectedThemeId,
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

  const handleSaveSceneDocument = () => {
    if (!sceneManager) return;
    const doc = sceneManager.extractSceneDocument(sceneRevision, exportWidth, exportHeight, bodyFormat);
    downloadJson(doc, `scene_v1_rev${doc.revision}.json`);
    setSceneIoMessage({ type: 'ok', text: `장면 파일(SceneDocumentV1, rev ${doc.revision}) 저장 완료` });
  };

  const handleOpenSceneDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sceneManager) return;
    setSceneIoMessage(null);
    try {
      if (file.size > MAX_SCENE_JSON_BYTES) {
        throw new Error(`파일 크기가 허용 한도(${MAX_SCENE_JSON_BYTES / 1024}KB)를 초과했습니다.`);
      }
      const validated = validateSceneDocumentV1(JSON.parse(await file.text()));
      if (!validated.document || validated.error) {
        throw new Error(validated.error || '유효하지 않은 SceneDocumentV1 파일입니다.');
      }
      sceneManager.applySceneDocument(validated.document);
      themeStore.setShowPartnerGuide(Boolean(validated.document.actors.find((a) => a.id === 'partner')?.visible));
      commitSceneDocument(validated.document, 'file', null);
      setSceneIoMessage({
        type: 'ok',
        text: `장면 불러오기 완료 (${validated.document.actors.length}인, ${validated.document.export.width}×${validated.document.export.height})`,
      });
    } catch (err) {
      setSceneIoMessage({
        type: 'err',
        text: err instanceof Error ? err.message : '장면 JSON 파일을 읽는 중 오류가 발생했습니다.',
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleCopySceneTags = async () => {
    setTagCopyError(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('클립보드 텍스트 쓰기를 사용할 수 없습니다.');
      await navigator.clipboard.writeText(compactSceneTags);
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } catch (err) {
      setTagCopyError(
        err instanceof Error ? `태그 복사 실패: ${err.message}` : '클립보드 접근 권한이 없어 복사하지 못했습니다.'
      );
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

      <div className="flex flex-col gap-2.5 p-4 bg-white rounded-3xl border border-zinc-200/90">
        <div className="text-xs font-bold text-zinc-900">2. 3D 장면 데이터 (SceneDocumentV1) 저장 · 열기</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSaveSceneDocument}
            className="min-h-10 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full transition-all"
          >
            <Save className="w-4 h-4" />
            <span>장면 JSON 저장</span>
          </button>
          <input ref={sceneFileInputRef} type="file" accept=".json,application/json" onChange={handleOpenSceneDocument} className="hidden" />
          <button
            type="button"
            onClick={() => sceneFileInputRef.current?.click()}
            className="min-h-10 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-full transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            <span>장면 JSON 열기</span>
          </button>
        </div>

        {sceneIoMessage && (
          <div
            className={`flex items-start gap-1.5 text-xs p-2.5 rounded-xl border ${
              sceneIoMessage.type === 'err' ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{sceneIoMessage.text}</span>
          </div>
        )}
      </div>

      <ComfyWorkflowSection sceneManager={sceneManager} />

      <div className="flex flex-col gap-2.5 p-4 bg-zinc-50 rounded-3xl border border-zinc-200/90">
        <span className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs">
          <Tag className="w-4 h-4 text-blue-600" />
          <span>4. 장면 보조 프롬프트 태그</span>
        </span>
        <div className="p-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-700 font-mono leading-relaxed select-all">
          {compactSceneTags}
        </div>
        <button
          type="button"
          onClick={handleCopySceneTags}
          className="min-h-10 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full transition-all"
        >
          {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedTags ? '태그 복사 완료' : '장면 태그 복사'}</span>
        </button>
        {tagCopyError && (
          <div className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{tagCopyError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { AlertCircle, Check, Copy, FolderOpen, Save, Tag } from 'lucide-react';
import { SceneManager } from '@/core/scene/SceneManager';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { downloadJson } from '@/utils/exportUtils';
import { MAX_SCENE_JSON_BYTES, validateSceneDocumentV1 } from '@/utils/securityUtils';

interface SceneDocumentIoSectionProps {
  sceneManager: SceneManager | null;
  compactSceneTags: string;
}

export const SceneDocumentIoSection: React.FC<SceneDocumentIoSectionProps> = ({
  sceneManager,
  compactSceneTags,
}) => {
  const { exportWidth, exportHeight, bodyFormat, sceneRevision, commitSceneDocument } = useEditorStore();
  const themeStore = useThemeSoloStore();
  const sceneFileInputRef = useRef<HTMLInputElement | null>(null);

  const [sceneIoMessage, setSceneIoMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [copiedTags, setCopiedTags] = useState(false);
  const [tagCopyError, setTagCopyError] = useState<string | null>(null);

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
      const mainActor = validated.document.actors.find((a) => a.id === 'main');
      if (mainActor?.outfit) {
        themeStore.setOutfitCompositionDirect(mainActor.outfit, 'main');
      }
      themeStore.setShowPartnerGuide(Boolean(validated.document.actors.find((a) => a.id === 'partner')?.visible));
      commitSceneDocument(validated.document, 'file', validated.warnings?.join(' / ') || null);
      const warnSuffix =
        validated.warnings && validated.warnings.length > 0 ? ` (경고: ${validated.warnings.join(', ')})` : '';
      setSceneIoMessage({
        type: 'ok',
        text: `장면 불러오기 완료 (${validated.document.actors.length}인, ${validated.document.export.width}×${validated.document.export.height})${warnSuffix}`,
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
    <>
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
          <input
            ref={sceneFileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleOpenSceneDocument}
            className="hidden"
          />
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
              sceneIoMessage.type === 'err'
                ? 'text-red-700 bg-red-50 border-red-200'
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{sceneIoMessage.text}</span>
          </div>
        )}
      </div>

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
    </>
  );
};


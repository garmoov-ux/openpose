import React, { useState, useEffect } from 'react';
import { useThemeSoloStore, BodyProfileMode } from '@/stores/useThemeSoloStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { buildThemeSoloPrompt } from '@/services/comfyui/promptBuilder';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { applyPosePreset } from '@/core/mannequin/presets';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { SceneManager } from '@/core/scene/SceneManager';
import { Copy, Check, Download, Dices, User, Sliders, RotateCcw } from 'lucide-react';
import { downloadTextFile } from '@/utils/exportUtils';

interface PromptPreviewBoxProps {
  sceneManager: SceneManager | null;
}

const BODY_MODE_OPTIONS: Array<{ id: BodyProfileMode; label: string }> = [
  { id: 'mannequin', label: '현재 마네킹 연동' },
  { id: 'free', label: '체형 고정 안 함' },
  { id: 'petite155', label: '155cm 단신' },
];

export const PromptPreviewBox: React.FC<PromptPreviewBoxProps> = ({ sceneManager }) => {
  const store = useThemeSoloStore();
  const { currentModelId } = useEditorStore();
  const [copied, setCopied] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<string | null>(null);

  const currentModelMeta = MANNEQUIN_MODELS.find((m) => m.id === currentModelId);

  const generatedPrompt = buildThemeSoloPrompt({
    themeId: store.selectedThemeId,
    envIndex: store.selectedEnvIndex,
    lightIndex: store.selectedLightIndex,
    outfitId: store.selectedOutfitId,
    outfitCategory: store.selectedOutfitCategory,
    outfitComposition: store.outfitCompositions.main,
    postureId: store.selectedPostureId,
    shotPrefixIndex: store.selectedShotPrefixIndex,
    isWildcardMode: store.isWildcardMode,
    bodyProfileMode: store.bodyProfileMode,
    modelId: currentModelId,
    includeMasterRef: store.includeMasterRef,
  });

  // 옵션 변경 시 자동 생성 프롬프트로 동기화
  useEffect(() => {
    setEditedPrompt(null);
  }, [generatedPrompt]);

  const activeText = editedPrompt !== null ? editedPrompt : generatedPrompt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('프롬프트 복사 실패:', e);
    }
  };

  const handleDownloadTxt = () => {
    const filename = `prompt_${store.selectedThemeId}_p${store.selectedPostureId}.txt`;
    downloadTextFile(activeText, filename);
  };

  const handleSelectBodyMode = (mode: BodyProfileMode) => {
    store.setBodyProfileMode(mode);
    if (sceneManager) {
      sceneManager.setPetiteProportions(mode === 'petite155');
    }
  };

  const handleShuffleAll = () => {
    store.rollRandomAll();
    if (!sceneManager) return;
    const nextPostureId = useThemeSoloStore.getState().selectedPostureId;
    const keyframe = getSoloThemePoseKeyframe(nextPostureId);
    const postureData = POSTURES_DATA.find((p) => p.id === nextPostureId);
    if (keyframe) {
      applyPosePreset(sceneManager.humanoid.bones, {
        id: `theme-pose-${nextPostureId}`,
        title: postureData?.labelKo || `포즈 ${nextPostureId}`,
        category: 'action',
        description: postureData?.coreText || '',
        pose: keyframe,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs pb-4">
      {/* 1. 상단 타이틀 & 전체 셔플 */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-zinc-900 text-xs tracking-tight">
          솔로 테마 프롬프트 빌더
        </span>
        <button
          onClick={handleShuffleAll}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-full transition-colors active:scale-95"
          title="테마, 배경, 의상, 포즈 전체 무작위 추첨 및 3D 즉시 동기화"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>전체 셔플</span>
        </button>
      </div>

      {/* 2. 단일 확정 vs 와일드카드 모드 세그먼트 */}
      <div className="flex p-1 bg-zinc-100 rounded-2xl">
        <button
          onClick={() => store.setIsWildcardMode(false)}
          className={`flex-1 py-1.5 text-center font-bold rounded-xl transition-all ${
            !store.isWildcardMode
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          단일 확정 프롬프트 (3D 동기화)
        </button>
        <button
          onClick={() => store.setIsWildcardMode(true)}
          className={`flex-1 py-1.5 text-center font-bold rounded-xl transition-all ${
            store.isWildcardMode
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          와일드카드 프롬프트 유지
        </button>
      </div>

      {/* 3. 체형 프롬프트 옵션 (무조건 155cm 단신 고정 해제 -> 자유 선택) */}
      <div className="p-2.5 bg-zinc-100/90 rounded-2xl flex flex-col gap-2 border border-zinc-200/70">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-zinc-800 text-[11px]">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>체형·신장 프롬프트 반영 방식</span>
          </span>
          {store.bodyProfileMode === 'mannequin' && currentModelMeta && (
            <span className="text-[10px] font-bold text-blue-600">
              {currentModelMeta.name} ({currentModelMeta.heightCm}cm)
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {BODY_MODE_OPTIONS.map((opt) => {
            const isSelected = store.bodyProfileMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectBodyMode(opt.id)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/80'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* 레퍼런스(Picture 1) 마스터 템플릿 포함 여부 선택 토글 */}
        <label className="flex items-center justify-between pt-1.5 border-t border-zinc-200/70 cursor-pointer">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700">
            <Sliders className="w-3 h-3 text-zinc-500" />
            <span>Picture 1 레퍼런스 고정 상세 문구 포함</span>
          </span>
          <input
            type="checkbox"
            checked={store.includeMasterRef}
            onChange={(e) => store.setIncludeMasterRef(e.target.checked)}
            className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* 4. 직접 편집 가능한 프롬프트 텍스트에어리어 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-semibold text-zinc-500">
            생성된 프롬프트 (직접 수정 가능)
          </span>
          {editedPrompt !== null && (
            <button
              onClick={() => setEditedPrompt(null)}
              className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>자동 생성 문구로 복원</span>
            </button>
          )}
        </div>
        <textarea
          value={activeText}
          onChange={(e) => setEditedPrompt(e.target.value)}
          rows={7}
          className="w-full bg-zinc-100 text-zinc-900 font-mono text-[11px] leading-relaxed p-3 rounded-2xl border border-zinc-200/80 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 5. 프롬프트 복사 & 파일 저장 버튼 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-full transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '복사 완료' : '프롬프트 복사'}</span>
        </button>

        <button
          onClick={handleDownloadTxt}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-full border border-zinc-200 transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-zinc-600" />
          <span>.txt 저장</span>
        </button>
      </div>
    </div>
  );
};

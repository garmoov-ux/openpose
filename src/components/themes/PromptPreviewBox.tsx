import React, { useState } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { buildThemeSoloPrompt } from '@/services/comfyui/promptBuilder';
import { SceneManager } from '@/core/scene/SceneManager';
import { Copy, Check, Download, Dices, Sparkles } from 'lucide-react';
import { downloadTextFile } from '@/utils/exportUtils';

interface PromptPreviewBoxProps {
  sceneManager: SceneManager | null;
}

export const PromptPreviewBox: React.FC<PromptPreviewBoxProps> = ({ sceneManager }) => {
  const store = useThemeSoloStore();
  const [copied, setCopied] = useState(false);

  const promptText = buildThemeSoloPrompt({
    themeId: store.selectedThemeId,
    envIndex: store.selectedEnvIndex,
    lightIndex: store.selectedLightIndex,
    outfitId: store.selectedOutfitId,
    outfitCategory: store.selectedOutfitCategory,
    postureId: store.selectedPostureId,
    shotPrefixIndex: store.selectedShotPrefixIndex,
    isWildcardMode: store.isWildcardMode,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('프롬프트 복사 실패:', e);
    }
  };

  const handleDownloadTxt = () => {
    const filename = `prompt_${store.selectedThemeId}_p${store.selectedPostureId}.txt`;
    downloadTextFile(promptText, filename);
  };

  const handleTogglePetite = (checked: boolean) => {
    store.setIsPetite155(checked);
    if (sceneManager) {
      sceneManager.setPetiteProportions(checked);
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* 상단 모드 토글 (세그먼트 컨트롤: 단일 확정 vs 와일드카드) */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#141414] text-[13px] tracking-tight">
          솔로 테마 프롬프트 빌더
        </span>
        <button
          onClick={store.rollRandomAll}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] font-medium rounded-full transition-colors active:scale-95"
          title="테마, 배경, 의상, 포즈 전체 랜덤 추첨"
        >
          <Dices className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>전체 셔플</span>
        </button>
      </div>

      {/* 세그먼트 컨트롤 */}
      <div className="flex p-1 bg-[#f0f0f0] rounded-full">
        <button
          onClick={() => store.setIsWildcardMode(false)}
          className={`flex-1 py-1.5 text-center font-medium rounded-full transition-all ${
            !store.isWildcardMode
              ? 'bg-[#ffffff] text-[#141414] shadow-sm'
              : 'text-[#707070] hover:text-[#141414]'
          }`}
        >
          단일 확정 프롬프트 (3D 동기화)
        </button>
        <button
          onClick={() => store.setIsWildcardMode(true)}
          className={`flex-1 py-1.5 text-center font-medium rounded-full transition-all ${
            store.isWildcardMode
              ? 'bg-[#ffffff] text-[#141414] shadow-sm'
              : 'text-[#707070] hover:text-[#141414]'
          }`}
        >
          와일드카드 프롬프트 유지
        </button>
      </div>

      {/* 155cm 단신 체형 스케일 토글 */}
      <label className="flex items-center justify-between px-3 py-2 bg-[#f3f3f3] rounded-[16px] cursor-pointer">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0066ff]" />
          <span className="font-medium text-[#141414]">155cm 단신 아시안 체형 릭 적용</span>
        </div>
        <input
          type="checkbox"
          checked={store.isPetite155}
          onChange={(e) => handleTogglePetite(e.target.checked)}
          className="w-4 h-4 accent-[#0066ff] rounded cursor-pointer"
        />
      </label>

      {/* 프롬프트 미리보기 텍스트에어리어 */}
      <div className="flex flex-col gap-1.5">
        <textarea
          readOnly
          value={promptText}
          rows={7}
          className="w-full bg-[#f0f0f0] text-[#141414] font-mono text-[11px] leading-relaxed p-3 rounded-[16px] border-none resize-none focus:outline-none focus:ring-2 focus:ring-[#141414]"
        />
      </div>

      {/* 프롬프트 복사 & 파일 저장 버튼 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#141414] hover:bg-[#262626] text-[#ffffff] font-medium rounded-full transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '복사 완료' : '프롬프트 복사'}</span>
        </button>

        <button
          onClick={handleDownloadTxt}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] font-medium rounded-full border border-[#e0e0e0] transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-[#707070]" />
          <span>.txt 저장</span>
        </button>
      </div>
    </div>
  );
};


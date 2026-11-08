import React, { useState } from 'react';
import { Check, Loader2, Sparkles, User, Users, Baby, Crown } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { MANNEQUIN_MODELS, MATERIAL_OPTIONS } from '@/core/mannequin/models';
import { SceneManager } from '@/core/scene/SceneManager';
import { MannequinModelId, MaterialStyle } from '@/types';
import { MannequinPreviewThumbnail } from '../sidebar/MannequinPreviewThumbnail';

interface MannequinSidebarTabProps {
  sceneManager: SceneManager | null;
}

const CATEGORIES = [
  { id: 'all', label: '전체 (14)', icon: <Users className="w-3 h-3" /> },
  { id: 'age_body', label: '연령·체형 (7)', icon: <Baby className="w-3 h-3" /> },
  { id: 'realistic', label: '실사 (2)', icon: <User className="w-3 h-3" /> },
  { id: 'anime', label: '애니 (2)', icon: <Sparkles className="w-3 h-3" /> },
  { id: 'stylized', label: '특수·교보재 (3)', icon: <Crown className="w-3 h-3" /> },
];

export const MannequinSidebarTab: React.FC<MannequinSidebarTabProps> = ({ sceneManager }) => {
  const {
    currentModelId,
    setCurrentModelId,
    currentMaterialStyle,
    setCurrentMaterialStyle,
    modelLoadingProgress,
    setModelLoadingProgress,
  } = useEditorStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredModels = MANNEQUIN_MODELS.filter((m) =>
    activeCategory === 'all' ? true : m.category === activeCategory
  );

  const handleSelectModel = async (modelId: MannequinModelId) => {
    if (!sceneManager || modelId === currentModelId || isLoading) return;
    setIsLoading(true);
    setModelLoadingProgress(10);
    try {
      await sceneManager.loadMannequinModel(modelId, (progress) => {
        setModelLoadingProgress(progress);
      });
      setCurrentModelId(modelId);
    } catch (err) {
      console.error('모델 로드 실패:', err);
    } finally {
      setIsLoading(false);
      setModelLoadingProgress(null);
    }
  };

  const handleSelectMaterial = (style: MaterialStyle) => {
    if (!sceneManager) return;
    sceneManager.setMaterialStyle(style);
    setCurrentMaterialStyle(style);
  };

  return (
    <div className="block space-y-3 text-xs">
      {/* 1. 표면 질감(머티리얼) 선택 바 */}
      <div className="p-2.5 bg-zinc-100/80 rounded-2xl flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-zinc-700 whitespace-nowrap">표면 재질</span>
        <div className="grid grid-cols-4 gap-1 flex-1">
          {MATERIAL_OPTIONS.map((mat) => {
            const isSelected = currentMaterialStyle === mat.id;
            const shortName =
              mat.id === 'matte_white'
                ? '석고'
                : mat.id === 'clay'
                  ? '황토'
                  : mat.id === 'toon_outline'
                    ? '만화풍'
                    : '메탈릭';
            return (
              <button
                key={mat.id}
                onClick={() => handleSelectMaterial(mat.id)}
                title={`${mat.name}: ${mat.description}`}
                className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-full border text-[10px] font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-zinc-400/50 flex-shrink-0"
                  style={{ backgroundColor: mat.color }}
                />
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 연령/체형 카테고리 아이콘 필터 */}
      <div className="flex flex-wrap items-center gap-1">
        {CATEGORIES.map((c) => {
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-700 font-semibold">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>3D 체형 불러오는 중...</span>
          </div>
          {modelLoadingProgress !== null && <span>{modelLoadingProgress}%</span>}
        </div>
      )}

      {/* 3. 마네킹 비주얼 미리보기 2열 그리드 (높이 제한 없이 전체 스크롤) */}
      <div className="grid grid-cols-2 gap-2.5 pb-4">
        {filteredModels.map((model) => {
          const isSelected = currentModelId === model.id;
          return (
            <button
              key={model.id}
              disabled={isLoading}
              onClick={() => handleSelectModel(model.id)}
              className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-md'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              {/* 비율/체형 썸네일 미리보기 */}
              <MannequinPreviewThumbnail modelId={model.id} isSelected={isSelected} />

              <div className="flex items-center justify-between mt-0.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {model.badge}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    isSelected ? 'text-blue-300' : 'text-zinc-500'
                  }`}
                >
                  {model.heightCm}cm
                </span>
              </div>

              <div className="font-bold text-[11px] truncate leading-tight">
                {model.name}
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className={isSelected ? 'text-zinc-400' : 'text-zinc-500'}>
                  {model.headRatio}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

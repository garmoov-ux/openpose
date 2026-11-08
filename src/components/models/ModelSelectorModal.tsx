import React, { useState } from 'react';
import { X, Sparkles, Check, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { MANNEQUIN_MODELS, MATERIAL_OPTIONS } from '@/core/mannequin/models';
import { SceneManager } from '@/core/scene/SceneManager';
import { MannequinModelId, MaterialStyle } from '@/types';

interface ModelSelectorModalProps {
  sceneManager: SceneManager | null;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({ sceneManager }) => {
  const {
    isModelModalOpen,
    setIsModelModalOpen,
    currentModelId,
    setCurrentModelId,
    currentMaterialStyle,
    setCurrentMaterialStyle,
    modelLoadingProgress,
    setModelLoadingProgress,
  } = useEditorStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  if (!isModelModalOpen) return null;

  const categories = [
    { id: 'all', label: '전체 모델' },
    { id: 'realistic', label: '실사 체형' },
    { id: 'anime', label: '애니메이션' },
    { id: 'stylized', label: '소형/캐주얼' },
  ];

  const filteredModels = MANNEQUIN_MODELS.filter((m) =>
    activeCategory === 'all' ? true : m.category === activeCategory
  );

  const handleSelectModel = async (modelId: MannequinModelId) => {
    if (!sceneManager || modelId === currentModelId || isLoading) return;

    setIsLoading(true);
    setModelLoadingProgress(10);
    try {
      useThemeSoloStore.getState().syncWardrobeForModelChange(modelId, 'main');
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
    <div
      onClick={() => setIsModelModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* 모달 헤더 */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">3D 마네킹 라이브러리</h2>
              <p className="text-xs text-zinc-400">포즈와 체형에 최적화된 고해상도 인체 모델을 선택하세요</p>
            </div>
          </div>
          <button
            onClick={() => setIsModelModalOpen(false)}
            aria-label="닫기"
            className="w-9 h-9 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 & 머티리얼 바 */}
        <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3">
          {/* 카테고리 필터 */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-full border border-zinc-800">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  activeCategory === c.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* 머티리얼 스타일 셀렉터 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">표면 질감:</span>
            <div className="flex items-center gap-1.5">
              {MATERIAL_OPTIONS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => handleSelectMaterial(mat.id)}
                  title={`${mat.name}: ${mat.description}`}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                    currentMaterialStyle === mat.id
                      ? 'border-blue-500 scale-110 shadow-md shadow-blue-500/20'
                      : 'border-zinc-700 hover:border-zinc-500 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: mat.color }}
                >
                  {currentMaterialStyle === mat.id && (
                    <Check className={`w-3.5 h-3.5 ${mat.id === 'matte_white' || mat.id === 'toon_outline' ? 'text-zinc-900' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 로딩 인디케이터 바 */}
        {isLoading && (
          <div className="px-6 py-2 bg-blue-950/40 border-b border-blue-900/30 flex items-center justify-between text-xs text-blue-400">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>3D 마네킹 에셋 로드 중...</span>
            </div>
            {modelLoadingProgress !== null && <span>{modelLoadingProgress}%</span>}
          </div>
        )}

        {/* 모델 카드 그리드 */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => {
            const isSelected = currentModelId === model.id;
            return (
              <button
                key={model.id}
                disabled={isLoading}
                onClick={() => handleSelectModel(model.id)}
                className={`group relative text-left rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-zinc-950 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                      }`}
                    >
                      {model.badge || model.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] text-blue-400 font-bold">
                        <Check className="w-3.5 h-3.5" /> 사용 중
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{model.gender === 'female' ? '여성 체형' : model.gender === 'male' ? '남성 체형' : '중립 체형'}</span>
                  <span className="font-semibold text-zinc-400">전신 관절 100% 호환</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 모달 풋터 */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between text-xs text-zinc-400">
          <div>
            선택된 모델은 현재 설정된 포즈, 관절 각도, 시점 상태를 그대로 유지한 채 교체됩니다.
          </div>
          <button
            onClick={() => setIsModelModalOpen(false)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-md shadow-blue-600/30"
          >
            확인 및 뷰포트로 복귀
          </button>
        </div>
      </div>
    </div>
  );
};

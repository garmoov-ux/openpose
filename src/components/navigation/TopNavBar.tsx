import React from 'react';
import {
  Sparkles,
  Palette,
  Bookmark,
  Download,
  RotateCcw,
  Activity,
  Layers,
} from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';

interface TopNavBarProps {
  sceneManager: SceneManager | null;
}

const RENDER_MODE_KO: Record<string, string> = {
  shading: '마네킹 셰이딩',
  openpose: '오픈포즈 관절선',
  depth: '깊이 맵',
  normal: '표면 법선',
  canny: '외곽 윤곽선',
};

export const TopNavBar: React.FC<TopNavBarProps> = ({ sceneManager }) => {
  const {
    currentModelId,
    setIsModelModalOpen,
    isThemesDrawerOpen,
    setIsThemesDrawerOpen,
    isPresetsDrawerOpen,
    setIsPresetsDrawerOpen,
    isExportDrawerOpen,
    setIsExportDrawerOpen,
    renderMode,
  } = useEditorStore();

  const themeStore = useThemeSoloStore();
  const currentModelMeta = MANNEQUIN_MODELS.find((m) => m.id === currentModelId);

  const handleResetPose = () => {
    if (!sceneManager) return;
    const defaultPose = POSE_PRESETS[0];
    applyPosePreset(sceneManager.humanoid.bones, defaultPose);
    sceneManager.setCameraPreset('front');
    themeStore.setSelectedPostureId(1);
  };

  return (
    <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
      {/* 좌측: 브랜드 및 마네킹 변경 버튼 */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-zinc-200/80 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="font-bold text-xs tracking-tight text-zinc-900 hidden sm:inline">
            3D 인체 포즈 에디터
          </span>
        </div>

        {/* 마네킹 교체 버튼 */}
        <button
          onClick={() => setIsModelModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="고해상도 3D 마네킹 라이브러리 열기"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>{currentModelMeta?.name.split(' (')[0] || '마네킹 선택'}</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-700/80 rounded-full font-normal hidden md:inline">
            변경
          </span>
        </button>
      </div>

      {/* 중앙: 모달/드로어 토글 스타디움 알약 바 */}
      <nav className="pointer-events-auto flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-full border border-zinc-200/80 shadow-sm">
        <button
          onClick={() => {
            setIsThemesDrawerOpen(!isThemesDrawerOpen);
            if (isPresetsDrawerOpen) setIsPresetsDrawerOpen(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isThemesDrawerOpen
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden md:inline">테마 & 의상</span>
        </button>

        <button
          onClick={() => {
            setIsPresetsDrawerOpen(!isPresetsDrawerOpen);
            if (isThemesDrawerOpen) setIsThemesDrawerOpen(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isPresetsDrawerOpen
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="hidden md:inline">100종 포즈</span>
        </button>

        <button
          onClick={() => setIsExportDrawerOpen(!isExportDrawerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isExportDrawerOpen
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">내보내기 / ComfyUI</span>
        </button>
      </nav>

      {/* 우측: 렌더 모드 배지 및 포즈 리셋 */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-zinc-200/80 shadow-sm text-xs font-medium text-zinc-600">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-zinc-800">{RENDER_MODE_KO[renderMode] || renderMode}</span>
        </div>

        <button
          onClick={handleResetPose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full border border-zinc-200/80 text-zinc-700 hover:text-zinc-900 text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="기본 T/서기 자세로 복귀"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden sm:inline">초기화</span>
        </button>
      </div>
    </header>
  );
};


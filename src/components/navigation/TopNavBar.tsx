import React from 'react';
import {
  RotateCcw,
  Activity,
  Sun,
  Layers,
  Box,
  Grid,
  Eye,
  EyeOff,
  User,
  Bookmark,
  Palette,
  Download,
  Sofa,
  Gem,
  Dices,
} from 'lucide-react';
import { useEditorStore, LeftSidebarSection } from '@/stores/useEditorStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { getMannequinProfile } from '@/core/mannequin/mannequinProfiles';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { RenderMode } from '@/types';

interface TopNavBarProps {
  sceneManager: SceneManager | null;
}

const TOP_DOCK_ITEMS: Array<{
  id: Exclude<LeftSidebarSection, null>;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'mannequin', label: '마네킹 선택', icon: <User className="w-4 h-4" /> },
  { id: 'poses', label: '자세 보관함', icon: <Bookmark className="w-4 h-4" /> },
  { id: 'themes', label: '테마 & 의상', icon: <Palette className="w-4 h-4" /> },
  { id: 'export', label: '저장 & 연동', icon: <Download className="w-4 h-4" /> },
];

const QUICK_MODES: Array<{ id: RenderMode; label: string; icon: React.ReactNode }> = [
  { id: 'shading', label: '마네킹', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'openpose', label: '관절선', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'depth', label: '깊이', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'normal', label: '법선', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'canny', label: '윤곽선', icon: <Grid className="w-3.5 h-3.5" /> },
];

export const TopNavBar: React.FC<TopNavBarProps> = ({ sceneManager }) => {
  const {
    renderMode,
    setRenderMode,
    showSkeleton,
    setShowSkeleton,
    setSelectedBoneName,
    activeLeftSection,
    setActiveLeftSection,
    currentModelId,
  } = useEditorStore();

  const themeStore = useThemeSoloStore();

  const isPropsTabActive =
    activeLeftSection === 'themes' && themeStore.activeSidebarTab === 'props';

  const handleToggleSection = (id: Exclude<LeftSidebarSection, null>) => {
    if (id === 'themes') {
      if (activeLeftSection === 'themes' && !isPropsTabActive) {
        setActiveLeftSection(null);
      } else {
        setActiveLeftSection('themes');
        if (themeStore.activeSidebarTab === 'props') {
          themeStore.setActiveSidebarTab('theme');
        }
      }
      return;
    }
    setActiveLeftSection(activeLeftSection === id ? null : id);
  };

  const handleTogglePropsSection = () => {
    if (isPropsTabActive) {
      setActiveLeftSection(null);
    } else {
      setActiveLeftSection('themes');
      themeStore.setActiveSidebarTab('props');
    }
  };

  const handleResetPose = () => {
    if (!sceneManager) return;
    const profile = getMannequinProfile(currentModelId);
    const defaultPose =
      POSE_PRESETS.find((p) => p.id === profile.defaultStandardPoseId) || POSE_PRESETS[0];
    applyPosePreset(sceneManager.humanoid.bones, defaultPose);
    sceneManager.selectBone(null);
    setSelectedBoneName(null);
    const modelInfo = MANNEQUIN_MODELS.find((m) => m.id === currentModelId);
    sceneManager.cameraController.frameFullBody(modelInfo?.targetHeight || 1.72);
    themeStore.setSelectedPostureId(1);
  };

  return (
    <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
      {/* 1. 좌측: 가로형 통합 아이콘 메뉴 독 (전체 랜덤 세트 아이콘 일체형 부착) */}
      <div className="flex items-center pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-full shadow-md">
          {TOP_DOCK_ITEMS.map((item) => {
            const isActive =
              item.id === 'themes'
                ? activeLeftSection === 'themes' && !isPropsTabActive
                : activeLeftSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleToggleSection(item.id)}
                aria-label={item.label}
                title={item.label}
                className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-blue-400 shadow-sm scale-105'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {item.icon}
                <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={handleTogglePropsSection}
            aria-label="아이템 & 소품"
            title="바디 아이템 & 소품 (네일·구두·초커·가터·3D소품)"
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              isPropsTabActive
                ? 'bg-zinc-900 text-pink-400 shadow-sm scale-105'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
              아이템 & 소품
            </span>
          </button>

          <div className="w-px h-5 bg-zinc-200 mx-0.5" />

          <button
            onClick={() => themeStore.rollRandomAll()}
            aria-label="전체 랜덤 세트"
            title="전체 랜덤 세트 (테마·세부장소·조명·의상·아이템·자세 무작위 조합)"
            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 shadow-sm transition-all active:scale-95"
          >
            <Dices className="w-4 h-4" />
            <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
              전체 랜덤 세트
            </span>
          </button>
        </div>
      </div>

      {/* 2. 우측: 빠른 화면 모드 아이콘 스위치 & 테마 사물/관절선 토글 & 초기화 */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-0.5 p-1 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200/90 shadow-sm">
          {QUICK_MODES.map((m) => {
            const isActive = renderMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setRenderMode(m.id)}
                title={`${m.label} 화면 모드로 전환`}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {m.icon}
                <span className="hidden md:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* 테마 3D 사물 표시 토글 */}
        <button
          onClick={() => themeStore.setShowThemeProps(!themeStore.showThemeProps)}
          title={themeStore.showThemeProps ? '테마 3D 사물 숨기기' : '테마 3D 사물 표시하기'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm transition-all ${
            themeStore.showThemeProps
              ? 'bg-white/95 border-zinc-200/90 text-amber-600 hover:bg-white'
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
          }`}
        >
          <Sofa className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">테마 사물</span>
        </button>

        {/* 관절 조절점 및 포즈선 표시 토글 */}
        <button
          onClick={() => setShowSkeleton(!showSkeleton)}
          title={showSkeleton ? '관절선 및 조절점 숨기기' : '관절선 및 조절점 표시하기'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm transition-all ${
            showSkeleton
              ? 'bg-white/95 border-zinc-200/90 text-blue-600 hover:bg-white'
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
          }`}
        >
          {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">관절선</span>
        </button>

        {/* 자세 초기화 */}
        <button
          onClick={handleResetPose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 hover:bg-white backdrop-blur-md rounded-full border border-zinc-200/90 text-zinc-800 hover:text-zinc-950 text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="마네킹 기본 자세 및 전신 풀샷으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
          <span className="hidden sm:inline">초기화</span>
        </button>
      </div>
    </header>
  );
};

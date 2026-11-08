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
  Sparkles,
  Download,
  Gem,
  Dices,
  Ban,
  Undo2,
  Redo2,
  PenTool,
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
  id: Exclude<LeftSidebarSection, null> | 'props';
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}> = [
  { id: 'mannequin', label: '마네킹', shortLabel: '마네킹', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'poses', label: '자세', shortLabel: '자세', icon: <Bookmark className="w-3.5 h-3.5" /> },
  { id: 'themes', label: '의상', shortLabel: '의상', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'props', label: '공간 꾸미기', shortLabel: '공간', icon: <Gem className="w-3.5 h-3.5" /> },
  { id: 'export', label: '내보내기', shortLabel: '내보내기', icon: <Download className="w-3.5 h-3.5" /> },
];

const QUICK_MODES: Array<{ id: RenderMode; label: string; icon: React.ReactNode }> = [
  { id: 'shading', label: '입체 보기', icon: <Sun className="w-4 h-4" /> },
  { id: 'openpose', label: '관절선 보기', icon: <Activity className="w-4 h-4" /> },
  { id: 'depth', label: '깊이 지도', icon: <Layers className="w-4 h-4" /> },
  { id: 'normal', label: '표면 방향 지도', icon: <Box className="w-4 h-4" /> },
  { id: 'lineart', label: '윤곽선 보기', icon: <PenTool className="w-4 h-4" /> },
  { id: 'canny', label: '철망 보기', icon: <Grid className="w-4 h-4" /> },
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
    undoStack,
    redoStack,
    undoSceneDocument,
    redoSceneDocument,
    sceneRevision,
    exportWidth,
    exportHeight,
    bodyFormat,
    commitSceneDocument,
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
        themeStore.setActiveSidebarTab('outfit');
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

  const handleUndo = () => {
    const doc = undoSceneDocument();
    if (doc && sceneManager) {
      sceneManager.applySceneDocument(doc);
      const outfit = doc.actors.find((actor) => actor.id === 'main')?.outfit;
      if (outfit) themeStore.setOutfitCompositionDirect(outfit, 'main');
    }
  };

  const handleRedo = () => {
    const doc = redoSceneDocument();
    if (doc && sceneManager) {
      sceneManager.applySceneDocument(doc);
      const outfit = doc.actors.find((actor) => actor.id === 'main')?.outfit;
      if (outfit) themeStore.setOutfitCompositionDirect(outfit, 'main');
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
    const nextDoc = sceneManager.extractSceneDocument(
      sceneRevision,
      exportWidth,
      exportHeight,
      bodyFormat
    );
    commitSceneDocument(nextDoc, 'preset', null);
  };

  return (
    <header className="editor-topbar absolute top-3 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none" aria-label="편집기 메뉴">
      {/* 1. 좌측: 가로형 통합 아이콘 메뉴 독 + Undo/Redo */}
      <div className="editor-topbar-group flex items-center gap-2 pointer-events-auto" aria-label="작업 메뉴">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-full shadow-md">
          {TOP_DOCK_ITEMS.map((item) => {
            const isActive =
              item.id === 'props'
                ? isPropsTabActive
                : item.id === 'themes'
                ? activeLeftSection === 'themes' && !isPropsTabActive
                : activeLeftSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => item.id === 'props' ? handleTogglePropsSection() : handleToggleSection(item.id)}
                aria-label={item.label}
                aria-pressed={isActive}
                title={item.label}
                className={`group relative flex flex-col items-center justify-center gap-0.5 min-w-11 h-11 px-1 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  isActive
                    ? `bg-zinc-900 ${item.id === 'props' ? 'text-pink-400' : 'text-blue-400'} shadow-sm scale-105`
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {item.icon}
                <span className="text-[10px] leading-none font-semibold">{item.shortLabel}</span>
                <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="w-px h-5 bg-zinc-200 mx-0.5" />

          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            aria-label="실행 취소"
            title={undoStack.length === 0 ? '되돌릴 작업이 없습니다' : '실행 취소'}
            className="flex flex-col items-center justify-center gap-0.5 w-9 h-9 rounded-full text-zinc-700 hover:bg-zinc-100 disabled:opacity-35 transition-all"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="text-[9px] leading-none">취소</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            aria-label="다시 실행"
            title={redoStack.length === 0 ? '다시 적용할 작업이 없습니다' : '다시 실행'}
            className="flex flex-col items-center justify-center gap-0.5 w-9 h-9 rounded-full text-zinc-700 hover:bg-zinc-100 disabled:opacity-35 transition-all"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="text-[9px] leading-none">다시</span>
          </button>

          <div className="w-px h-5 bg-zinc-200 mx-0.5" />

          <button
            type="button"
            onClick={() => themeStore.rollRandomAll()}
            aria-label="의상과 자세 무작위 선택"
            title="의상과 자세 무작위 선택"
            className="group relative flex flex-col items-center justify-center gap-0.5 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 shadow-sm transition-all active:scale-95"
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="text-[9px] leading-none">무작위</span>
          </button>
        </div>
      </div>

      {/* 2. 우측: 렌더 모드 + 순수 마네킹 + 관절선 + 초기화 */}
      <div className="editor-topbar-group flex items-center pointer-events-auto" aria-label="보기 메뉴">
        <div className="flex items-center gap-1 p-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-full shadow-md">
          {QUICK_MODES.map((m) => {
            const isActive = renderMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setRenderMode(m.id)}
                aria-label={m.label}
                aria-pressed={isActive}
                title={m.label}
                className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm scale-105'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {m.icon}
                <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
                  {m.label}
                </span>
              </button>
            );
          })}

          <div className="w-px h-5 bg-zinc-200 mx-0.5" />

          <button
            type="button"
            onClick={() => themeStore.toggleBareMannequinMode()}
            aria-label="전체 해제"
            aria-pressed={themeStore.isBareMannequinMode}
            title={
              themeStore.isBareMannequinMode
                ? '전체 해제됨 (클릭 시 이전 의상·아이템 복원)'
                : '전체 해제 (순수 마네킹 모드)'
            }
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              themeStore.isBareMannequinMode
                ? 'bg-zinc-900 text-emerald-400 ring-2 ring-emerald-500/40 shadow-sm'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Ban className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowSkeleton(!showSkeleton)}
            aria-label="관절선 표시 토글"
            aria-pressed={showSkeleton}
            title={showSkeleton ? '관절선 및 조절점 숨기기' : '관절선 및 조절점 표시하기'}
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              showSkeleton
                ? 'bg-zinc-900 text-blue-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {showSkeleton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleResetPose}
            aria-label="자세 초기화"
            title="마네킹 기본 자세 및 전신 풀샷으로 초기화"
            className="group relative flex items-center justify-center w-9 h-9 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

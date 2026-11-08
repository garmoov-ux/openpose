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
  id: Exclude<LeftSidebarSection, null>;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'mannequin', label: '마네킹 선택', icon: <User className="w-4 h-4" /> },
  { id: 'poses', label: '자세 보관함', icon: <Bookmark className="w-4 h-4" /> },
  { id: 'themes', label: '맞춤 의상', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'export', label: '저장 & 연동', icon: <Download className="w-4 h-4" /> },
];

const QUICK_MODES: Array<{ id: RenderMode; label: string; icon: React.ReactNode }> = [
  { id: 'shading', label: '마네킹 3D 셰이딩', icon: <Sun className="w-4 h-4" /> },
  { id: 'openpose', label: 'OpenPose 관절선', icon: <Activity className="w-4 h-4" /> },
  { id: 'depth', label: 'Depth 깊이맵', icon: <Layers className="w-4 h-4" /> },
  { id: 'normal', label: 'Normal 법선맵', icon: <Box className="w-4 h-4" /> },
  { id: 'lineart', label: 'Lineart 실루엣', icon: <PenTool className="w-4 h-4" /> },
  { id: 'canny', label: '와이어프레임 (개발용)', icon: <Grid className="w-4 h-4" /> },
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
    }
  };

  const handleRedo = () => {
    const doc = redoSceneDocument();
    if (doc && sceneManager) {
      sceneManager.applySceneDocument(doc);
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
    <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
      {/* 1. 좌측: 가로형 통합 아이콘 메뉴 독 + Undo/Redo */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-full shadow-md">
          {TOP_DOCK_ITEMS.map((item) => {
            const isActive =
              item.id === 'themes'
                ? activeLeftSection === 'themes' && !isPropsTabActive
                : activeLeftSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
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
                <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleTogglePropsSection}
            aria-label="아이템 & 소품"
            title="아이템 & 소품 (확장 작업 공간)"
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              isPropsTabActive
                ? 'bg-zinc-900 text-pink-400 shadow-sm scale-105'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span className="pointer-events-none absolute top-11 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-40">
              아이템 & 소품
            </span>
          </button>

          <div className="w-px h-5 bg-zinc-200 mx-0.5" />

          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            aria-label="실행 취소 (Ctrl+Z)"
            title={undoStack.length === 0 ? '되돌릴 작업이 없습니다 (Ctrl+Z)' : '실행 취소 (Ctrl+Z)'}
            className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-700 hover:bg-zinc-100 disabled:opacity-35 transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            aria-label="다시 실행 (Ctrl+Shift+Z)"
            title={redoStack.length === 0 ? '다시 적용할 작업이 없습니다 (Ctrl+Shift+Z)' : '다시 실행 (Ctrl+Shift+Z)'}
            className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-700 hover:bg-zinc-100 disabled:opacity-35 transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-200 mx-0.5" />

          <button
            type="button"
            onClick={() => themeStore.rollRandomAll()}
            aria-label="랜덤 코디·자세 세트"
            title="랜덤 코디·자세 세트"
            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 shadow-sm transition-all active:scale-95"
          >
            <Dices className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 우측: 렌더 모드 + 순수 마네킹 + 관절선 + 초기화 */}
      <div className="flex items-center pointer-events-auto">
        <div className="flex items-center gap-1 p-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-full shadow-md">
          {QUICK_MODES.map((m) => {
            const isActive = renderMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setRenderMode(m.id)}
                aria-label={m.label}
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

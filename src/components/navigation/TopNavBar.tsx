import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Activity,
  Sun,
  Layers,
  Box,
  Grid,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { RenderMode } from '@/types';

interface TopNavBarProps {
  sceneManager: SceneManager | null;
}

const QUICK_MODES: Array<{ id: RenderMode; label: string; icon: React.ReactNode }> = [
  { id: 'shading', label: '마네킹', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'openpose', label: '관절선', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'depth', label: '깊이', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'normal', label: '법선', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'canny', label: '윤곽선', icon: <Grid className="w-3.5 h-3.5" /> },
];

export const TopNavBar: React.FC<TopNavBarProps> = ({ sceneManager }) => {
  const {
    currentModelId,
    activeLeftSection,
    setActiveLeftSection,
    renderMode,
    setRenderMode,
    showSkeleton,
    setShowSkeleton,
    setSelectedBoneName,
  } = useEditorStore();

  const themeStore = useThemeSoloStore();
  const currentModelMeta = MANNEQUIN_MODELS.find((m) => m.id === currentModelId);

  const handleResetPose = () => {
    if (!sceneManager) return;
    const defaultPose = POSE_PRESETS[0];
    applyPosePreset(sceneManager.humanoid.bones, defaultPose);
    sceneManager.selectBone(null);
    setSelectedBoneName(null);
    sceneManager.setCameraPreset('front');
    themeStore.setSelectedPostureId(1);
  };

  return (
    <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
      {/* 1. 좌측: 브랜드 및 현재 착용 마네킹 표시 뱃지 (클릭 시 왼쪽 마네킹 사이드바 토글) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200/90 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="font-bold text-xs tracking-tight text-zinc-900 hidden sm:inline">
            인체 포즈 스튜디오
          </span>
        </div>

        <button
          onClick={() =>
            setActiveLeftSection(activeLeftSection === 'mannequin' ? null : 'mannequin')
          }
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="좌측 마네킹 체형 보관함 열기"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>{currentModelMeta?.name || '마네킹 선택'}</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-700/80 rounded-full font-normal hidden sm:inline">
            {currentModelMeta?.heightCm ? `${currentModelMeta.heightCm}cm` : '변경'}
          </span>
        </button>
      </div>

      {/* 2. 우측: 빠른 화면 모드 아이콘 스위치 & 관절선 토글 & 초기화 */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {/* 5대 렌더 모드 원클릭 아이콘 바 */}
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
          title="기본 서기 자세 및 정면 시점으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
          <span className="hidden sm:inline">초기화</span>
        </button>
      </div>
    </header>
  );
};

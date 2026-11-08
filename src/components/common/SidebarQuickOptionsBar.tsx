import React from 'react';
import {
  Sun,
  Activity,
  Layers,
  Box,
  Grid,
  Eye,
  EyeOff,
  RotateCcw,
  Ban,
  Users,
} from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { getMannequinProfile } from '@/core/mannequin/mannequinProfiles';
import { RenderMode } from '@/types';

interface SidebarQuickOptionsBarProps {
  sceneManager: SceneManager | null;
}

const MODES: Array<{ id: RenderMode; label: string; icon: React.ReactNode }> = [
  { id: 'shading', label: '마네킹 3D 셰이딩', icon: <Sun className="w-4 h-4" /> },
  { id: 'openpose', label: 'OpenPose 관절선', icon: <Activity className="w-4 h-4" /> },
  { id: 'depth', label: 'Depth 깊이맵', icon: <Layers className="w-4 h-4" /> },
  { id: 'normal', label: 'Normal 법선맵', icon: <Box className="w-4 h-4" /> },
  { id: 'canny', label: 'Canny 윤곽선', icon: <Grid className="w-4 h-4" /> },
];

export const SidebarQuickOptionsBar: React.FC<SidebarQuickOptionsBarProps> = ({
  sceneManager,
}) => {
  const {
    renderMode,
    setRenderMode,
    showSkeleton,
    setShowSkeleton,
    setSelectedBoneName,
    currentModelId,
  } = useEditorStore();

  const {
    showPartnerGuide,
    setShowPartnerGuide,
    isBareMannequinMode,
    toggleBareMannequinMode,
    setSelectedPostureId,
  } = useThemeSoloStore();

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
    setSelectedPostureId(1);
  };

  return (
    <div className="px-4 py-2 bg-zinc-100/90 border-b border-zinc-200/80 flex items-center justify-between gap-2 shrink-0">
      {/* 좌측: 5대 렌더 모드 아이콘 버튼 */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-zinc-200/90 shadow-2xs">
        {MODES.map((m) => {
          const active = renderMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setRenderMode(m.id)}
              title={m.label}
              aria-label={m.label}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                active
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {m.icon}
            </button>
          );
        })}
      </div>

      {/* 우측: 순수 마네킹(미착용) / 파트너 / 관절선 / 초기화 아이콘 버튼 */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-zinc-200/90 shadow-2xs">
        <button
          type="button"
          onClick={toggleBareMannequinMode}
          title={
            isBareMannequinMode
              ? '순수 마네킹 모드 ON (클릭 시 이전 의상·아이템 복원)'
              : '올클린 미착용 (모든 의상·바디 아이템 한 번에 해제)'
          }
          aria-label="순수 마네킹 모드"
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            isBareMannequinMode
              ? 'bg-zinc-900 text-emerald-400 ring-2 ring-emerald-500/40'
              : 'text-rose-500 hover:bg-rose-50'
          }`}
        >
          <Ban className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowPartnerGuide(!showPartnerGuide)}
          title={showPartnerGuide ? '파트너 마네킹 숨기기' : '파트너 마네킹 표시'}
          aria-label="파트너 마네킹 표시 토글"
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            showPartnerGuide
              ? 'bg-rose-600 text-white'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Users className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowSkeleton(!showSkeleton)}
          title={showSkeleton ? '관절 조절점·뼈대선 숨기기' : '관절 조절점·뼈대선 표시'}
          aria-label="관절선 표시 토글"
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            showSkeleton
              ? 'bg-zinc-900 text-blue-400'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {showSkeleton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={handleResetPose}
          title="마네킹 기본 자세 및 카메라 초기화"
          aria-label="자세 초기화"
          className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

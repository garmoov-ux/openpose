import React from 'react';
import {
  Sun,
  Activity,
  Layers,
  Box,
  Grid,
  Sofa,
  Eye,
  EyeOff,
  RotateCcw,
  Ban,
  Users,
  CheckCircle2,
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
  { id: 'shading', label: '마네킹', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'openpose', label: '관절선', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'depth', label: '깊이', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'normal', label: '법선', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'canny', label: '윤곽선', icon: <Grid className="w-3.5 h-3.5" /> },
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
    showThemeProps,
    setShowThemeProps,
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
    <div className="px-4 py-2.5 bg-zinc-100/90 border-b border-zinc-200/80 space-y-2 shrink-0 text-xs">
      {/* 1행: 순수 마네킹 모드(올클린 미착용) 원클릭 스마트 스위치 & 방 사물/관절선/파트너/초기화 토글 */}
      <div className="flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={toggleBareMannequinMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all border ${
            isBareMannequinMode
              ? 'bg-zinc-900 text-emerald-400 border-emerald-500/70 shadow-xs'
              : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-200/70'
          }`}
          title="켜면 의상과 모든 바디 아이템을 즉시 벗기고, 다시 누르면 이전 착용 상태로 복원합니다"
        >
          {isBareMannequinMode ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          )}
          <span>{isBareMannequinMode ? '순수 마네킹 모드 ON' : '올클린 미착용 모드'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowThemeProps(!showThemeProps)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10.5px] font-bold border transition-all ${
              showThemeProps
                ? 'bg-zinc-900 text-amber-400 border-zinc-900'
                : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-800'
            }`}
            title="방 가구 및 3D 배경 사물 켜기/끄기"
          >
            <Sofa className="w-3 h-3" />
            <span>방 사물 {showThemeProps ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10.5px] font-bold border transition-all ${
              showSkeleton
                ? 'bg-zinc-900 text-blue-400 border-zinc-900'
                : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-800'
            }`}
            title="관절 조절점 및 뼈대선 켜기/끄기"
          >
            {showSkeleton ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>관절선</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPartnerGuide(!showPartnerGuide)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10.5px] font-bold border transition-all ${
              showPartnerGuide
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-800'
            }`}
            title="파트너 마네킹 켜기/끄기"
          >
            <Users className="w-3 h-3" />
            <span>파트너</span>
          </button>

          <button
            type="button"
            onClick={handleResetPose}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-[10.5px] font-bold transition-colors"
            title="마네킹 기본 자세 및 카메라 초기화"
          >
            <RotateCcw className="w-3 h-3" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* 2행: 이미지2의 5대 렌더 모드 스위치를 사이드바 내부에서도 즉시 전환 */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-zinc-200/80 rounded-xl">
        {MODES.map((m) => {
          const active = renderMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setRenderMode(m.id)}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10.5px] font-bold transition-all ${
                active
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


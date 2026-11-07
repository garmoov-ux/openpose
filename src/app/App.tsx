import React, { useState } from 'react';
import { ViewportCanvas } from '@/components/editor/ViewportCanvas';
import { GizmoToolbar } from '@/components/editor/GizmoToolbar';
import { CameraToolbar } from '@/components/editor/CameraToolbar';
import { ModeSelector } from '@/components/sidebar/ModeSelector';
import { PresetGallery } from '@/components/sidebar/PresetGallery';
import { ExportPanel } from '@/components/export/ExportPanel';
import { SceneManager } from '@/core/scene/SceneManager';
import { Activity, RotateCcw } from 'lucide-react';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';

export const App: React.FC = () => {
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);

  const handleResetPose = () => {
    if (!sceneManager) return;
    const defaultPose = POSE_PRESETS[0];
    applyPosePreset(sceneManager.humanoid.bones, defaultPose);
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* 상단 네비게이션 헤더 */}
      <header className="h-12 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-4 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            OpenPose & 3D Mannequin Editor
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
            ControlNet v1.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetPose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-all"
            title="기본 서기 자세로 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>포즈 초기화</span>
          </button>
        </div>
      </header>

      {/* 중앙 메인 작업 영역 */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* 3D 뷰포트 영역 */}
        <main className="flex-1 relative h-full">
          <ViewportCanvas onSceneReady={(manager) => setSceneManager(manager)} />
          <GizmoToolbar />
          <CameraToolbar />
        </main>

        {/* 우측 사이드바 컨트롤 패널 */}
        <aside className="w-80 h-full border-l border-neutral-800 bg-neutral-900/60 backdrop-blur-md p-3.5 flex flex-col gap-4 overflow-y-auto flex-shrink-0 z-10">
          <ModeSelector />
          <PresetGallery sceneManager={sceneManager} />
          <ExportPanel sceneManager={sceneManager} />
        </aside>
      </div>
    </div>
  );
};

export default App;

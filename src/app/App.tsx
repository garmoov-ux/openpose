import React, { useState } from 'react';
import { ViewportCanvas } from '@/components/editor/ViewportCanvas';
import { GizmoToolbar } from '@/components/editor/GizmoToolbar';
import { CameraToolbar } from '@/components/editor/CameraToolbar';
import { ThemeStudioSidebar } from '@/components/themes/ThemeStudioSidebar';
import { ModeSelector } from '@/components/sidebar/ModeSelector';
import { PresetGallery } from '@/components/sidebar/PresetGallery';
import { ExportPanel } from '@/components/export/ExportPanel';
import { SceneManager } from '@/core/scene/SceneManager';
import { Activity, RotateCcw, Sparkles } from 'lucide-react';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';

export const App: React.FC = () => {
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);
  const themeStore = useThemeSoloStore();

  const handleResetPose = () => {
    if (!sceneManager) return;
    const defaultPose = POSE_PRESETS[0];
    applyPosePreset(sceneManager.humanoid.bones, defaultPose);
    sceneManager.setCameraPreset('front');
    themeStore.setSelectedPostureId(1);
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#ffffff] text-[#141414] overflow-hidden font-sans">
      {/* 상단 플로팅 네비게이션 필 (Mobbin nav-pill 스타일) */}
      <header className="h-14 bg-transparent px-6 flex items-center justify-between z-20 flex-shrink-0 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#141414] text-[#ffffff] flex items-center justify-center font-bold text-xs shadow-sm">
            <Activity className="w-4 h-4 text-[#0066ff]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[#141414]">
              OpenPose & 3D Mannequin Editor
            </span>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f3f3f3] text-[#707070] border border-[#e0e0e0]">
              Solo Themes Studio
            </span>
          </div>
        </div>

        {/* 중앙 상태 인디케이터 필 */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#f3f3f3] rounded-full text-xs text-[#707070] border border-[#e0e0e0]">
          <Sparkles className="w-3.5 h-3.5 text-[#0066ff]" />
          <span className="font-medium">16개 테마 · 200종 의상 · 100종 다이나믹 포즈</span>
        </div>

        {/* 우측 포즈 초기화 CTA 필 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetPose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#e0e0e0] bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] text-xs font-semibold transition-all active:scale-95"
            title="기본 서기 자세 및 정면 시점으로 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#707070]" />
            <span>포즈 초기화</span>
          </button>
        </div>
      </header>

      {/* 중앙 메인 3단 작업 영역 */}
      <div className="flex flex-1 relative overflow-hidden pt-2">
        {/* 좌측 사이드바: 16대 테마 & 배경 380종 & 의상 200종 & 프롬프트 빌더 */}
        <ThemeStudioSidebar sceneManager={sceneManager} />

        {/* 중앙: 3D 뷰포트 영역 */}
        <main className="flex-1 relative h-full bg-[#f3f3f3]">
          <ViewportCanvas onSceneReady={(manager) => setSceneManager(manager)} />
          <GizmoToolbar />
          <CameraToolbar />
        </main>

        {/* 우측 사이드바: 렌더링 모드, 100종 포즈 갤러리, 내보내기/ComfyUI */}
        <aside className="w-80 h-full border-l border-[#e0e0e0] bg-[#ffffff] p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0 z-10">
          <ModeSelector />
          <PresetGallery sceneManager={sceneManager} />
          <ExportPanel sceneManager={sceneManager} />
        </aside>
      </div>
    </div>
  );
};

export default App;

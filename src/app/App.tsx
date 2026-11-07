import React, { useState, useCallback } from 'react';
import { ViewportCanvas } from '@/components/editor/ViewportCanvas';
import { GizmoToolbar } from '@/components/editor/GizmoToolbar';
import { CameraToolbar } from '@/components/editor/CameraToolbar';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { ThemeStudioDrawer } from '@/components/themes/ThemeStudioDrawer';
import { PoseLibraryDrawer } from '@/components/sidebar/PoseLibraryDrawer';
import { ModelSelectorModal } from '@/components/models/ModelSelectorModal';
import { ExportModal } from '@/components/export/ExportModal';
import { SceneManager } from '@/core/scene/SceneManager';

export const App: React.FC = () => {
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);

  const handleSceneReady = useCallback((manager: SceneManager) => {
    setSceneManager(manager);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-zinc-950 text-zinc-900 overflow-hidden font-sans select-none">
      {/* 1. 100% 풀스크린 3D 뷰포트 */}
      <div className="absolute inset-0 w-full h-full">
        <ViewportCanvas onSceneReady={handleSceneReady} />
      </div>

      {/* 2. 상단 플로팅 알약 네비게이션 바 */}
      <TopNavBar sceneManager={sceneManager} />

      {/* 3. 뷰포트 플로팅 조작 툴바 (좌하단: 기즈모 제어, 우하단: 카메라 시점) */}
      <GizmoToolbar />
      <CameraToolbar />

      {/* 4. 좌측 슬라이드 오버 드로어: 16대 테마 & 의상 200선 & 프롬프트 빌더 */}
      <ThemeStudioDrawer sceneManager={sceneManager} />

      {/* 5. 우측 슬라이드 오버 드로어: ControlNet 4대 렌더 모드 & 100종 다이나믹 포즈 */}
      <PoseLibraryDrawer sceneManager={sceneManager} />

      {/* 6. 모달: 6대 프리미엄 3D 마네킹 & 4대 머티리얼 선택기 */}
      <ModelSelectorModal sceneManager={sceneManager} />

      {/* 7. 모달: 원클릭 클립보드 복사 & ComfyUI 연동 */}
      <ExportModal sceneManager={sceneManager} />
    </div>
  );
};

export default App;

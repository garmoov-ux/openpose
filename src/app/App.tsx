import React, { useState, useCallback } from 'react';
import { ViewportCanvas } from '@/components/editor/ViewportCanvas';
import { GizmoToolbar } from '@/components/editor/GizmoToolbar';
import { CameraToolbar } from '@/components/editor/CameraToolbar';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { LeftUnifiedSidebar } from '@/components/sidebar/LeftUnifiedSidebar';
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

      {/* 3. 좌측 상단 통합 아이콘 사이드바 (마네킹, 자세 보관함, 테마 & 의상, 저장 & 연동) */}
      <LeftUnifiedSidebar sceneManager={sceneManager} />

      {/* 4. 뷰포트 플로팅 조작 툴바 (좌하단: 기즈모 제어, 우하단: 카메라 시점) */}
      <GizmoToolbar />
      <CameraToolbar />
    </div>
  );
};

export default App;

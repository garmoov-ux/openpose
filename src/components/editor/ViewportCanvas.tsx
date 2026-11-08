import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { SceneManager } from '@/core/scene/SceneManager';

interface ViewportCanvasProps {
  onSceneReady?: (manager: SceneManager) => void;
}

export const ViewportCanvas: React.FC<ViewportCanvasProps> = ({ onSceneReady }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const onSceneReadyRef = useRef(onSceneReady);
  onSceneReadyRef.current = onSceneReady;

  const {
    renderMode,
    gizmoMode,
    gizmoSpace,
    cameraPreset,
    selectedBoneName,
    setSelectedBoneName,
  } = useEditorStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new SceneManager(canvasRef.current, (boneName) => {
      setSelectedBoneName(boneName);
    });

    managerRef.current = manager;
    onSceneReadyRef.current?.(manager);

    const handleResize = () => {
      if (!canvasRef.current || !managerRef.current) return;
      managerRef.current.resize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      manager.dispose();
      managerRef.current = null;
    };
  }, [setSelectedBoneName]);

  // 스토어 상태 변경 시 씬 매니저에 반영
  useEffect(() => {
    managerRef.current?.setRenderMode(renderMode);
  }, [renderMode]);

  useEffect(() => {
    managerRef.current?.setGizmoMode(gizmoMode);
  }, [gizmoMode]);

  useEffect(() => {
    managerRef.current?.setGizmoSpace(gizmoSpace);
  }, [gizmoSpace]);

  useEffect(() => {
    managerRef.current?.setCameraPreset(cameraPreset);
  }, [cameraPreset]);

  useEffect(() => {
    const currentAttached = managerRef.current?.transformControls?.object?.name || null;
    if (currentAttached !== selectedBoneName) {
      managerRef.current?.selectBone(selectedBoneName);
    }
  }, [selectedBoneName]);

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />
    </div>
  );
};


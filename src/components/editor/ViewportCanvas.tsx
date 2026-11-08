import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
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
    showGrid,
    showSkeleton,
    selectedBoneName,
    setSelectedBoneName,
  } = useEditorStore();

  const {
    selectedThemeId,
    selectedEnvIndex,
    selectedLightIndex,
    selectedOutfitId,
  } = useThemeSoloStore();

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
    managerRef.current?.setShowGrid(showGrid);
  }, [showGrid]);

  useEffect(() => {
    managerRef.current?.setShowSkeleton(showSkeleton);
  }, [showSkeleton]);

  useEffect(() => {
    const currentAttached = managerRef.current?.transformControls?.object?.name || null;
    if (currentAttached !== selectedBoneName) {
      managerRef.current?.selectBone(selectedBoneName);
    }
  }, [selectedBoneName]);

  // 16대 테마, 세부 장소, 조명이 변경될 때 3D 스튜디오 조명 및 배경 즉시 반영
  useEffect(() => {
    managerRef.current?.applyThemeEnvironment(
      selectedThemeId,
      selectedEnvIndex,
      selectedLightIndex
    );
  }, [selectedThemeId, selectedEnvIndex, selectedLightIndex]);

  // 200종 의상 변경 시 3D 마네킹 골격에 의상 파츠 실시간 착용/해제
  useEffect(() => {
    managerRef.current?.applyOutfit(selectedOutfitId);
  }, [selectedOutfitId]);

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />
    </div>
  );
};

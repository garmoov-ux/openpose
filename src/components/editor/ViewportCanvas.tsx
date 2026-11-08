import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { applyPosePreset } from '@/core/mannequin/presets';

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
    selectedPostureId,
    showThemeProps,
    showPartnerGuide,
    nailColorId,
    footwearId,
    neckItemId,
    wristItemId,
    legItemId,
    roomProps,
    selectedPropUid,
    setSelectedPropUid,
    updateRoomPropTransform,
  } = useThemeSoloStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new SceneManager(canvasRef.current, (boneName) => {
      setSelectedBoneName(boneName);
      if (boneName) setSelectedPropUid(null);
    });
    manager.onPropSelectedCallback = (propUid) => {
      setSelectedPropUid(propUid);
      if (propUid) setSelectedBoneName(null);
    };
    manager.onPropTransformCallback = (propUid, pos, rotY) => {
      updateRoomPropTransform(propUid, pos, rotY);
    };

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
  }, [setSelectedBoneName, setSelectedPropUid, updateRoomPropTransform]);

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
    if (!selectedBoneName) {
      if (!selectedPropUid) managerRef.current?.selectBone(null);
      return;
    }
    const currentAttached = managerRef.current?.transformControls?.object?.name || null;
    if (currentAttached !== selectedBoneName) {
      managerRef.current?.selectBone(selectedBoneName);
    }
  }, [selectedBoneName, selectedPropUid]);

  // 룸 사물 선택 동기화 (사이드바 또는 3D 뷰포트 클릭 시 기즈모 부착)
  useEffect(() => {
    if (selectedPropUid) {
      managerRef.current?.selectProp(selectedPropUid);
    } else if (!selectedBoneName) {
      managerRef.current?.selectProp(null);
    }
  }, [selectedPropUid, selectedBoneName]);

  // 16대 테마, 380종 세부 장소, 시간대 조명 및 사각 룸 가구·소품(roomProps) 실시간 반영
  useEffect(() => {
    managerRef.current?.applyThemeEnvironment(
      selectedThemeId,
      selectedEnvIndex,
      selectedLightIndex,
      roomProps
    );
  }, [selectedThemeId, selectedEnvIndex, selectedLightIndex, roomProps]);

  // 의상 변경 시 3D 마네킹 골격에 의상 파츠 실시간 착용/해제 (0 = 무의상)
  useEffect(() => {
    managerRef.current?.applyOutfit(selectedOutfitId > 0 ? selectedOutfitId : null);
  }, [selectedOutfitId]);

  // 신체 부위별 아이템(네일, 신발/스타킹/맨발, 목걸이/초커, 팔찌/커프, 가터링/앵클릿) 실시간 부착
  useEffect(() => {
    managerRef.current?.applyBodyAccessories({
      nailColorId,
      footwearId,
      neckItemId,
      wristItemId,
      legItemId,
    });
  }, [nailColorId, footwearId, neckItemId, wristItemId, legItemId]);

  // 자세 ID 변경(전체 랜덤 세트 등) 시 3D 마네킹 골격 회전 동기화
  useEffect(() => {
    if (!managerRef.current || selectedPostureId <= 1) return;
    const kf = getSoloThemePoseKeyframe(selectedPostureId);
    if (!kf) return;
    applyPosePreset(managerRef.current.humanoid.bones, {
      id: `solo-${selectedPostureId}`,
      title: `테마 포즈 ${selectedPostureId}`,
      category: 'standing',
      description: '',
      pose: kf,
    });
  }, [selectedPostureId]);

  // 테마 3D 배경 사물(가구/오브젝트) 표시 ON/OFF 동기화
  useEffect(() => {
    managerRef.current?.setShowThemeProps(showThemeProps);
  }, [showThemeProps]);

  // 커플 파트너 가이드 마네킹 표시 ON/OFF 동기화
  useEffect(() => {
    managerRef.current?.setPartnerGuide(showPartnerGuide);
  }, [showPartnerGuide]);

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />
    </div>
  );
};

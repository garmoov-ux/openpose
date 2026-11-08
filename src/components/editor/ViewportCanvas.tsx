import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';

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
    activePoseAccordion,
    activeCouplePresetId,
    nailColorId,
    footwearId,
    neckItemId,
    wristItemId,
    legItemId,
    toyItemId,
    customAccessoryColors,
    roomProps,
    selectedPropUid,
    activeTransformTarget,
    mainMannequinTransform,
    partnerMannequinTransform,
    setSelectedPropUid,
    setActiveTransformTarget,
    setMainMannequinTransform,
    setPartnerMannequinTransform,
    updateRoomPropTransform,
  } = useThemeSoloStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new SceneManager(canvasRef.current, (boneName) => {
      setSelectedBoneName(boneName);
      if (boneName) {
        setSelectedPropUid(null);
        setActiveTransformTarget('none');
      }
    });
    manager.onPropSelectedCallback = (propUid) => {
      setSelectedPropUid(propUid);
      if (propUid) setSelectedBoneName(null);
    };
    manager.onPropTransformCallback = (propUid, pos, rotY, scale, rotX, rotZ) => {
      updateRoomPropTransform(propUid, pos, rotY, scale, rotX, rotZ);
    };
    manager.onMannequinTransformCallback = (target, pos, rot, scale) => {
      if (target === 'main') {
        setMainMannequinTransform({ position: pos, rotation: rot, scale });
      } else {
        setPartnerMannequinTransform({ position: pos, rotation: rot, scale });
      }
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
  }, [
    setSelectedBoneName,
    setSelectedPropUid,
    setActiveTransformTarget,
    setMainMannequinTransform,
    setPartnerMannequinTransform,
    updateRoomPropTransform,
  ]);

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
      if (!selectedPropUid && activeTransformTarget === 'none') {
        managerRef.current?.selectBone(null);
      }
      return;
    }
    const currentAttached = managerRef.current?.transformControls?.object?.name || null;
    if (currentAttached !== selectedBoneName) {
      managerRef.current?.selectBone(selectedBoneName);
    }
  }, [selectedBoneName, selectedPropUid, activeTransformTarget]);

  // 룸 사물 또는 마네킹 루트 기즈모 선택 동기화
  useEffect(() => {
    if (!managerRef.current) return;
    if (activeTransformTarget === 'main' || activeTransformTarget === 'partner') {
      managerRef.current.selectMannequinRoot(activeTransformTarget);
    } else if (selectedPropUid) {
      managerRef.current.selectProp(selectedPropUid);
    } else if (!selectedBoneName) {
      managerRef.current.selectMannequinRoot(null);
      managerRef.current.selectProp(null);
    }
  }, [selectedPropUid, activeTransformTarget, selectedBoneName]);

  // 메인/파트너 마네킹 3D 위치·회전·크기 변환 동기화
  useEffect(() => {
    managerRef.current?.applyMannequinTransform(
      'main',
      mainMannequinTransform.position,
      mainMannequinTransform.rotation,
      mainMannequinTransform.scale
    );
  }, [mainMannequinTransform]);

  useEffect(() => {
    managerRef.current?.applyMannequinTransform(
      'partner',
      partnerMannequinTransform.position,
      partnerMannequinTransform.rotation,
      partnerMannequinTransform.scale
    );
  }, [partnerMannequinTransform]);

  // 사각 룸 가구·소품(roomProps) 및 커스텀 색상 실시간 반영
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

  // 신체 부위별 아이템 및 부위별 커스텀 색상 실시간 부착
  useEffect(() => {
    managerRef.current?.applyBodyAccessories({
      nailColorId,
      footwearId,
      neckItemId,
      wristItemId,
      legItemId,
      toyItemId,
      customColors: customAccessoryColors,
    });
  }, [nailColorId, footwearId, neckItemId, wristItemId, legItemId, toyItemId, customAccessoryColors]);

  // 솔로 자세 ID 변경 시 (개인 솔로 아코디언 모드일 때만) 3D 마네킹 골격 회전 동기화
  useEffect(() => {
    if (!managerRef.current || activePoseAccordion === 'couple' || selectedPostureId <= 1) return;
    const kf = getSoloThemePoseKeyframe(selectedPostureId);
    if (!kf) return;
    applyPosePreset(managerRef.current.humanoid.bones, {
      id: `solo-${selectedPostureId}`,
      title: `테마 포즈 ${selectedPostureId}`,
      category: 'standing',
      description: '',
      pose: kf,
    });
  }, [selectedPostureId, activePoseAccordion]);

  // 테마 3D 배경 사물(가구/오브젝트) 표시 ON/OFF 동기화
  useEffect(() => {
    managerRef.current?.setShowThemeProps(showThemeProps);
  }, [showThemeProps]);

  // 커플 파트너 가이드 마네킹 표시 ON/OFF 및 선택된 커플 프리셋 동기화
  useEffect(() => {
    if (!managerRef.current) return;
    const couplePreset = activeCouplePresetId
      ? POSE_PRESETS.find((p) => p.id === activeCouplePresetId)
      : undefined;
    managerRef.current.setPartnerGuide(showPartnerGuide, couplePreset);
  }, [showPartnerGuide, activeCouplePresetId]);

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />
    </div>
  );
};

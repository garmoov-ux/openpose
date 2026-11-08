import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import {
  clampQuaternionToRom,
  getSymmetricBoneName,
  mirrorQuaternionLeftRight,
} from '@/core/commands/commandApplier';
import { applyRestDeltaQuat } from '@/core/scene/sceneDocumentSync';

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
    selectedActorId,
    setSelectedBoneName,
  } = useEditorStore();

  const {
    selectedThemeId,
    selectedEnvIndex,
    selectedLightIndex,
    selectedOutfitId,
    outfitCompositions,
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

    const manager = new SceneManager(canvasRef.current, (boneName, actorId) => {
      setSelectedBoneName(boneName, actorId || 'main');
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
    manager.onBoneTransformEndCallback = (actorId, boneId, deltaRotation) => {
      const state = useEditorStore.getState();
      const rig = actorId === 'partner' ? manager.partnerHumanoid : manager.humanoid;
      const bone = rig.bones.get(boneId);
      let warning: string | null = null;

      let finalDelta = deltaRotation;
      if (state.romEnabled && bone) {
        const romRes = clampQuaternionToRom(boneId, deltaRotation);
        finalDelta = romRes.rotation;
        if (romRes.clamped) {
          applyRestDeltaQuat(bone, finalDelta);
          warning = `${boneId}: 해부학적 가동 범위(ROM) 내로 보정됨`;
        }
      }

      if (state.symmetryEnabled) {
        const symName = getSymmetricBoneName(boneId);
        const symBone = symName ? rig.bones.get(symName) : undefined;
        if (symBone) {
          const mirrored = mirrorQuaternionLeftRight(finalDelta);
          applyRestDeltaQuat(symBone, mirrored);
        }
      }

      const nextDoc = manager.extractSceneDocument(
        state.sceneRevision,
        state.exportWidth,
        state.exportHeight,
        state.bodyFormat
      );
      state.commitSceneDocument(nextDoc, 'user', warning);
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

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        const store = useEditorStore.getState();
        const doc = e.shiftKey ? store.redoSceneDocument() : store.undoSceneDocument();
        if (doc && managerRef.current) {
          managerRef.current.applySceneDocument(doc);
          const mActor = doc.actors.find((a) => a.id === 'main');
          if (mActor?.outfit) {
            useThemeSoloStore.getState().setOutfitCompositionDirect(mActor.outfit, 'main');
          }
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        const doc = useEditorStore.getState().redoSceneDocument();
        if (doc && managerRef.current) {
          managerRef.current.applySceneDocument(doc);
          const mActor = doc.actors.find((a) => a.id === 'main');
          if (mActor?.outfit) {
            useThemeSoloStore.getState().setOutfitCompositionDirect(mActor.outfit, 'main');
          }
        }
        return;
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key.toLowerCase() === 'f') {
          useEditorStore.getState().setCameraPreset('fullbody');
          managerRef.current?.setCameraPreset('fullbody');
        } else if (e.key === '1') {
          useEditorStore.getState().setCameraPreset('front');
          managerRef.current?.setCameraPreset('front');
        } else if (e.key === '2') {
          useEditorStore.getState().setCameraPreset('side');
          managerRef.current?.setCameraPreset('side');
        } else if (e.key === '3') {
          useEditorStore.getState().setCameraPreset('top');
          managerRef.current?.setCameraPreset('top');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
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

  // { actorId, boneId } 단위 관절 선택 동기화 (2인 장면에서 동일 관절명 충돌 방지)
  useEffect(() => {
    if (!selectedBoneName) {
      if (!selectedPropUid && activeTransformTarget === 'none') {
        managerRef.current?.selectBone(null, selectedActorId);
      }
      return;
    }
    const currentAttached = managerRef.current?.transformControls?.object?.name || null;
    const currentActor = managerRef.current?.getSelectedActorId() || 'main';
    if (currentAttached !== selectedBoneName || currentActor !== selectedActorId) {
      managerRef.current?.selectBone(selectedBoneName, selectedActorId);
    }
  }, [selectedBoneName, selectedActorId, selectedPropUid, activeTransformTarget]);

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

  // 정규화된 부위별 의상(WardrobeItemV1) 조합 실시간 적용
  useEffect(() => {
    managerRef.current?.applyWardrobeComposition(outfitCompositions.main, 'main');
  }, [outfitCompositions.main]);

  useEffect(() => {
    managerRef.current?.applyWardrobeComposition(outfitCompositions.partner, 'partner');
  }, [outfitCompositions.partner]);

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
        tabIndex={0}
        aria-label="3D 포즈 편집 캔버스"
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
      />
    </div>
  );
};

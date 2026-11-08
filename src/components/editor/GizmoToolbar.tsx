import React from 'react';
import {
  RotateCw,
  Move,
  Maximize2,
  Globe,
  Box,
  X,
  User,
  Users,
  FlipHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { JOINT_DEFINITIONS } from '@/core/mannequin/humanoidRig';

export const GizmoToolbar: React.FC = () => {
  const {
    gizmoMode,
    gizmoSpace,
    selectedBoneName,
    selectedActorId,
    symmetryEnabled,
    romEnabled,
    lastCommandWarning,
    setGizmoMode,
    setGizmoSpace,
    setSelectedBoneName,
    setSymmetryEnabled,
    setRomEnabled,
  } = useEditorStore();

  const {
    activeTransformTarget,
    showPartnerGuide,
    setActiveTransformTarget,
    setSelectedPropUid,
  } = useThemeSoloStore();

  const selectedJointInfo = JOINT_DEFINITIONS.find((j) => j.name === selectedBoneName);
  const actorLabel = selectedActorId === 'partner' ? '파트너 인물' : '메인 인물';

  const handleToggleMannequinGizmo = (target: 'main' | 'partner') => {
    setSelectedBoneName(null, target);
    setSelectedPropUid(null);
    if (activeTransformTarget === target) {
      setActiveTransformTarget('none');
    } else {
      setActiveTransformTarget(target);
      if (gizmoMode === 'rotate') setGizmoMode('translate');
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-none text-xs">
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200 pointer-events-auto shadow-sm">
        <button
          type="button"
          onClick={() => setGizmoMode('translate')}
          title="이동 모드 (X/Y/Z)"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            gizmoMode === 'translate'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>이동</span>
        </button>

        <button
          type="button"
          onClick={() => setGizmoMode('rotate')}
          title="회전 모드 (X/Y/Z)"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            gizmoMode === 'rotate'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>회전</span>
        </button>

        <button
          type="button"
          onClick={() => setGizmoMode('scale')}
          title="크기·배율 모드"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            gizmoMode === 'scale'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>크기</span>
        </button>

        <div className="w-px h-4 bg-zinc-200 mx-0.5" />

        <button
          type="button"
          onClick={() => setSymmetryEnabled(!symmetryEnabled)}
          title="좌우 관절 대칭 회전 토글"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            symmetryEnabled
              ? 'bg-blue-600 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>대칭</span>
        </button>

        <button
          type="button"
          onClick={() => setRomEnabled(!romEnabled)}
          title="해부학적 가동 범위(ROM) 보호 토글"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            romEnabled
              ? 'bg-emerald-600 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ROM</span>
        </button>

        <div className="w-px h-4 bg-zinc-200 mx-0.5" />

        <button
          type="button"
          onClick={() => handleToggleMannequinGizmo('main')}
          title="메인 마네킹 전체 이동·회전·크기 기즈모 제어"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            activeTransformTarget === 'main'
              ? 'bg-blue-600 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>메인</span>
        </button>

        {showPartnerGuide && (
          <button
            type="button"
            onClick={() => handleToggleMannequinGizmo('partner')}
            title="파트너 마네킹 전체 이동·회전·크기 기즈모 제어"
            className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
              activeTransformTarget === 'partner'
                ? 'bg-rose-600 text-white'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>파트너</span>
          </button>
        )}

        <div className="w-px h-4 bg-zinc-200 mx-0.5" />

        <button
          type="button"
          onClick={() => setGizmoSpace(gizmoSpace === 'local' ? 'world' : 'local')}
          title="좌표계 전환 (로컬 / 월드)"
          className="flex items-center gap-1 px-2.5 py-1.5 font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
        >
          {gizmoSpace === 'local' ? (
            <>
              <Box className="w-3.5 h-3.5 text-blue-600" />
              <span>로컬</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-zinc-900" />
              <span>월드</span>
            </>
          )}
        </button>
      </div>

      {/* 관절 트리/드롭다운 선택 및 현재 인물·관절 표시 */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200 pointer-events-auto shadow-sm">
        <span
          className={`w-2 h-2 rounded-full ${
            selectedActorId === 'partner' ? 'bg-rose-500' : 'bg-blue-600'
          }`}
        />
        {showPartnerGuide && (
          <select
            aria-label="대상 인물 선택"
            value={selectedActorId}
            onChange={(e) => {
              const nextActor = e.target.value as 'main' | 'partner';
              setSelectedBoneName(selectedBoneName, nextActor);
            }}
            className="bg-zinc-100 px-2 py-0.5 rounded-lg font-bold text-zinc-800 focus:outline-none"
          >
            <option value="main">메인 인물</option>
            <option value="partner">파트너 인물</option>
          </select>
        )}
        {!showPartnerGuide && <span className="font-bold text-zinc-800">{actorLabel}:</span>}

        <select
          aria-label="관절 선택"
          value={selectedBoneName || ''}
          onChange={(e) => setSelectedBoneName(e.target.value || null, selectedActorId)}
          className="bg-transparent font-semibold text-zinc-900 focus:outline-none"
        >
          <option value="">관절 직접 선택...</option>
          {JOINT_DEFINITIONS.map((j) => (
            <option key={j.name} value={j.name}>
              {j.label} ({j.name})
            </option>
          ))}
        </select>

        {selectedBoneName && (
          <>
            <span className="text-zinc-400">·</span>
            <span className="font-bold text-blue-600">
              {actorLabel} / {selectedJointInfo?.label || selectedBoneName}
            </span>
            <button
              type="button"
              onClick={() => setSelectedBoneName(null, selectedActorId)}
              className="p-0.5 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-zinc-100"
              title="관절 선택 해제"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {lastCommandWarning && (
        <div className="px-3 py-1.5 bg-amber-50/95 border border-amber-200 text-amber-800 rounded-full font-medium pointer-events-auto">
          {lastCommandWarning}
        </div>
      )}
    </div>
  );
};

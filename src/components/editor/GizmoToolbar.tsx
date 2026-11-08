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
    activeLeftSection,
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

  const handleSelectJoint = (boneName: string | null, actorId = selectedActorId) => {
    if (boneName) {
      setSelectedPropUid(null);
      setActiveTransformTarget('none');
    }
    setSelectedBoneName(boneName, actorId);
  };

  return (
    <div className={`editor-gizmo absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-none text-xs ${activeLeftSection ? 'editor-gizmo--sidebar-open' : ''}`}>
      <div className="editor-gizmo-actions flex flex-wrap items-center gap-1 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 pointer-events-auto shadow-sm">
        <button
          type="button"
          onClick={() => setGizmoMode('translate')}
          title="이동 도구"
          aria-pressed={gizmoMode === 'translate'}
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
          title="회전 도구"
          aria-pressed={gizmoMode === 'rotate'}
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
          title="크기 조절 도구"
          aria-pressed={gizmoMode === 'scale'}
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
          aria-pressed={symmetryEnabled}
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
          title="관절 가동 범위 보호"
          aria-pressed={romEnabled}
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            romEnabled
              ? 'bg-emerald-600 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>가동 범위</span>
        </button>

        <div className="w-px h-4 bg-zinc-200 mx-0.5" />

        <button
          type="button"
          onClick={() => setGizmoSpace(gizmoSpace === 'local' ? 'world' : 'local')}
          title="좌표계 전환 (개별 / 전역)"
          aria-label={`현재 ${gizmoSpace === 'local' ? '개별' : '전역'} 좌표계, 누르면 전환`}
          className="flex items-center gap-1 px-2.5 py-1.5 font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
        >
          {gizmoSpace === 'local' ? (
            <>
              <Box className="w-3.5 h-3.5 text-blue-600" />
              <span>개별</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-zinc-900" />
              <span>전역</span>
            </>
          )}
        </button>
      </div>

      {/* 관절 트리/드롭다운 선택 및 현재 인물·관절 표시 */}
      <div className="editor-gizmo-status order-first flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 pointer-events-auto shadow-sm">
        <span className="shrink-0 font-bold text-zinc-500">대상</span>
        <button
          type="button"
          onClick={() => handleToggleMannequinGizmo('main')}
          title="주 인물 전체 이동·회전·크기 조절"
          aria-pressed={activeTransformTarget === 'main'}
          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-semibold transition-colors ${activeTransformTarget === 'main' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
        >
          <User className="h-3.5 w-3.5" />
          <span>주 인물</span>
        </button>
        {showPartnerGuide && (
          <button
            type="button"
            onClick={() => handleToggleMannequinGizmo('partner')}
            title="파트너 인물 전체 이동·회전·크기 조절"
            aria-pressed={activeTransformTarget === 'partner'}
            className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-semibold transition-colors ${activeTransformTarget === 'partner' ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>파트너</span>
          </button>
        )}
        <div className="h-4 w-px shrink-0 bg-zinc-200" />
        <span
          className={`w-2 h-2 shrink-0 rounded-full ${
            selectedActorId === 'partner' ? 'bg-rose-500' : 'bg-blue-600'
          }`}
        />
        {showPartnerGuide && (
          <select
            aria-label="대상 인물 선택"
            value={selectedActorId}
            onChange={(e) => {
              const nextActor = e.target.value as 'main' | 'partner';
              handleSelectJoint(selectedBoneName, nextActor);
            }}
            className="bg-zinc-100 px-2 py-0.5 rounded-lg font-bold text-zinc-800 focus:outline-none"
          >
            <option value="main">메인 인물</option>
            <option value="partner">파트너 인물</option>
          </select>
        )}
        <select
          aria-label="관절 선택"
          value={selectedBoneName || ''}
          onChange={(e) => handleSelectJoint(e.target.value || null)}
          className="min-w-0 flex-1 bg-transparent font-semibold text-zinc-900 focus:outline-none"
        >
          <option value="">관절 직접 선택...</option>
          {JOINT_DEFINITIONS.map((j) => (
            <option key={j.name} value={j.name}>
              {j.label}
            </option>
          ))}
        </select>

        {selectedBoneName && (
          <button
            type="button"
            onClick={() => handleSelectJoint(null)}
            className="shrink-0 rounded-full p-0.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            title={`${actorLabel}의 ${selectedJointInfo?.label || selectedBoneName} 선택 해제`}
            aria-label="관절 선택 해제"
          >
            <X className="h-3.5 w-3.5" />
          </button>
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

import React from 'react';
import { RotateCw, Move, Maximize2, Globe, Box, X, User, Users } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { JOINT_DEFINITIONS } from '@/core/mannequin/humanoidRig';

export const GizmoToolbar: React.FC = () => {
  const {
    gizmoMode,
    gizmoSpace,
    selectedBoneName,
    setGizmoMode,
    setGizmoSpace,
    setSelectedBoneName,
  } = useEditorStore();

  const {
    activeTransformTarget,
    showPartnerGuide,
    setActiveTransformTarget,
    setSelectedPropUid,
  } = useThemeSoloStore();

  const selectedJointInfo = JOINT_DEFINITIONS.find((j) => j.name === selectedBoneName);

  const handleToggleMannequinGizmo = (target: 'main' | 'partner') => {
    setSelectedBoneName(null);
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
      <div className="flex items-center gap-1 p-1 bg-[#ffffff]/90 backdrop-blur-md rounded-full border border-[#e0e0e0] pointer-events-auto shadow-xs">
        <button
          onClick={() => setGizmoMode('translate')}
          title="이동 모드 (X/Y/Z)"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            gizmoMode === 'translate'
              ? 'bg-[#141414] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>이동</span>
        </button>

        <button
          onClick={() => setGizmoMode('rotate')}
          title="회전 모드 (X/Y/Z)"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            gizmoMode === 'rotate'
              ? 'bg-[#141414] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>회전</span>
        </button>

        <button
          onClick={() => setGizmoMode('scale')}
          title="크기·배율 모드"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            gizmoMode === 'scale'
              ? 'bg-[#141414] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>크기</span>
        </button>

        <div className="w-px h-4 bg-[#e0e0e0] mx-0.5" />

        <button
          onClick={() => handleToggleMannequinGizmo('main')}
          title="메인 마네킹 전체 이동·회전·크기 기즈모 제어"
          className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
            activeTransformTarget === 'main'
              ? 'bg-[#0066ff] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>메인 마네킹</span>
        </button>

        {showPartnerGuide && (
          <button
            onClick={() => handleToggleMannequinGizmo('partner')}
            title="파트너 마네킹 전체 이동·회전·크기 기즈모 제어"
            className={`flex items-center gap-1 px-2.5 py-1.5 font-semibold rounded-full transition-all ${
              activeTransformTarget === 'partner'
                ? 'bg-rose-600 text-[#ffffff]'
                : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>파트너</span>
          </button>
        )}

        <div className="w-px h-4 bg-[#e0e0e0] mx-0.5" />

        <button
          onClick={() => setGizmoSpace(gizmoSpace === 'local' ? 'world' : 'local')}
          title="좌표계 전환"
          className="flex items-center gap-1 px-2.5 py-1.5 font-medium text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3] rounded-full transition-all"
        >
          {gizmoSpace === 'local' ? (
            <>
              <Box className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>로컬</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-[#141414]" />
              <span>월드</span>
            </>
          )}
        </button>
      </div>

      {selectedBoneName && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-[#ffffff]/90 backdrop-blur-md rounded-full border border-[#e0e0e0] pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066ff]" />
            <span className="text-[#707070]">선택 관절:</span>
            <span className="font-semibold text-[#141414]">
              {selectedJointInfo?.label || selectedBoneName}
            </span>
          </div>
          <button
            onClick={() => setSelectedBoneName(null)}
            className="p-0.5 text-[#707070] hover:text-[#141414] rounded-full hover:bg-[#f3f3f3]"
            title="해제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { RotateCw, Move, Globe, Box, X } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
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

  const selectedJointInfo = JOINT_DEFINITIONS.find((j) => j.name === selectedBoneName);

  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-none text-xs">
      <div className="flex items-center gap-1.5 p-1 bg-[#ffffff]/90 backdrop-blur-md rounded-full border border-[#e0e0e0] pointer-events-auto">
        <button
          onClick={() => setGizmoMode('rotate')}
          title="회전 모드"
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-full transition-all ${
            gizmoMode === 'rotate'
              ? 'bg-[#141414] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>회전</span>
        </button>

        <button
          onClick={() => setGizmoMode('translate')}
          title="이동 모드"
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-full transition-all ${
            gizmoMode === 'translate'
              ? 'bg-[#141414] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>이동</span>
        </button>

        <div className="w-px h-4 bg-[#e0e0e0] mx-0.5" />

        <button
          onClick={() => setGizmoSpace(gizmoSpace === 'local' ? 'world' : 'local')}
          title="좌표계 전환"
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3] rounded-full transition-all"
        >
          {gizmoSpace === 'local' ? (
            <>
              <Box className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>로컬 축</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-[#141414]" />
              <span>월드 축</span>
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
            title="선택 해제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

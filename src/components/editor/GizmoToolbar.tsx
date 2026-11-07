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
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 backdrop-blur-md rounded-xl border border-neutral-800 shadow-xl pointer-events-auto">
        <button
          onClick={() => setGizmoMode('rotate')}
          title="회전 모드 (R)"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            gizmoMode === 'rotate'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>회전</span>
        </button>

        <button
          onClick={() => setGizmoMode('translate')}
          title="이동 모드 (W)"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            gizmoMode === 'translate'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>이동</span>
        </button>

        <div className="w-px h-4 bg-neutral-800 mx-1" />

        <button
          onClick={() => setGizmoSpace(gizmoSpace === 'local' ? 'world' : 'local')}
          title="좌표계 전환"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
        >
          {gizmoSpace === 'local' ? (
            <>
              <Box className="w-3.5 h-3.5 text-indigo-400" />
              <span>로컬 축</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>월드 축</span>
            </>
          )}
        </button>
      </div>

      {selectedBoneName && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-neutral-900/90 backdrop-blur-md rounded-lg border border-neutral-800/80 shadow-md text-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400">선택 관절:</span>
            <span className="font-semibold text-neutral-200">
              {selectedJointInfo?.label || selectedBoneName}
            </span>
          </div>
          <button
            onClick={() => setSelectedBoneName(null)}
            className="p-0.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
            title="선택 해제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};


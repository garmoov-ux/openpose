import React from 'react';
import { Layers, Activity, Sun, Box, Grid } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { RenderMode } from '@/types';

export const ModeSelector: React.FC = () => {
  const { renderMode, setRenderMode } = useEditorStore();

  const modes: Array<{
    id: RenderMode;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'shading',
      label: '마네킹 (Shading)',
      sublabel: 'PBR 기본 3D 뷰',
      icon: <Sun className="w-3.5 h-3.5" />,
    },
    {
      id: 'openpose',
      label: 'OpenPose',
      sublabel: 'COCO 18 키포인트',
      icon: <Activity className="w-3.5 h-3.5 text-[#0066ff]" />,
    },
    {
      id: 'depth',
      label: 'Depth Map',
      sublabel: '선형 Z-버퍼 명암',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'normal',
      label: 'Surface Normal',
      sublabel: '뷰 공간 법선 RGB',
      icon: <Box className="w-3.5 h-3.5" />,
    },
    {
      id: 'canny',
      label: 'Canny / Lineart',
      sublabel: '외곽선 윤곽선 엣지',
      icon: <Grid className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[11px] font-semibold text-[#707070] uppercase tracking-wider px-1">
        ControlNet 렌더링 모드
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {modes.map((m) => {
          const isSelected = renderMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setRenderMode(m.id)}
              className={`flex items-center justify-between p-2 rounded-[16px] border text-left transition-all ${
                isSelected
                  ? 'bg-[#141414] text-[#ffffff] border-[#141414]'
                  : 'bg-[#ffffff] text-[#141414] border-[#e0e0e0] hover:bg-[#f3f3f3]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-full ${
                    isSelected ? 'bg-[#262626] text-[#ffffff]' : 'bg-[#f0f0f0] text-[#707070]'
                  }`}
                >
                  {m.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight">{m.label}</div>
                  <div
                    className={`text-[10px] ${
                      isSelected ? 'text-[#adadad]' : 'text-[#707070]'
                    }`}
                  >
                    {m.sublabel}
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-[#0066ff]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

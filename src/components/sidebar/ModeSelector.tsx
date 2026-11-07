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
    color: string;
  }> = [
    {
      id: 'shading',
      label: '마네킹 (Shading)',
      sublabel: 'PBR 기본 3D 뷰',
      icon: <Sun className="w-4 h-4" />,
      color: 'border-neutral-500 bg-neutral-800/80',
    },
    {
      id: 'openpose',
      label: 'OpenPose',
      sublabel: 'COCO 18 키포인트',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300',
    },
    {
      id: 'depth',
      label: 'Depth Map',
      sublabel: '선형 Z-버퍼 명암',
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-500/80 bg-sky-950/40 text-sky-300',
    },
    {
      id: 'normal',
      label: 'Surface Normal',
      sublabel: '뷰 공간 법선 RGB',
      icon: <Box className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/80 bg-purple-950/40 text-purple-300',
    },
    {
      id: 'canny',
      label: 'Canny / Lineart',
      sublabel: '외곽선 윤곽선 엣지',
      icon: <Grid className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/80 bg-amber-950/40 text-amber-300',
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
        <span>ControlNet 렌더링 모드</span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {modes.map((m) => {
          const isSelected = renderMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setRenderMode(m.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? `${m.color} shadow-lg ring-1 ring-white/10`
                  : 'border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-neutral-700 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-neutral-800'}`}>
                  {m.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight">{m.label}</div>
                  <div className="text-[11px] text-neutral-400">{m.sublabel}</div>
                </div>
              </div>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};


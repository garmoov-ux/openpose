import React from 'react';
import { Layers, Activity, Sun, Box, Grid } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { RenderMode } from '@/types';

export const ModeSelector: React.FC = () => {
  const { renderMode, setRenderMode } = useEditorStore();

  const modes: Array<{
    id: RenderMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'shading',
      label: '마네킹',
      icon: <Sun className="w-4 h-4" />,
    },
    {
      id: 'openpose',
      label: '관절선',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'depth',
      label: '깊이맵',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'normal',
      label: '법선맵',
      icon: <Box className="w-4 h-4" />,
    },
    {
      id: 'canny',
      label: '윤곽선',
      icon: <Grid className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {modes.map((m) => {
        const isSelected = renderMode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setRenderMode(m.id)}
            title={`${m.label} 화면 모드`}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl border transition-all ${
              isSelected
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <span className={isSelected ? 'text-blue-400' : 'text-zinc-500'}>{m.icon}</span>
            <span className="text-[10px] font-bold tracking-tight">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};

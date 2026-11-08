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
      label: '마네킹 셰이딩',
      sublabel: '입체 음영 3차원 뷰',
      icon: <Sun className="w-3.5 h-3.5" />,
    },
    {
      id: 'openpose',
      label: '오픈포즈 관절선',
      sublabel: '표준 18개 신체 관절선',
      icon: <Activity className="w-3.5 h-3.5 text-[#0066ff]" />,
    },
    {
      id: 'depth',
      label: '거리별 깊이 맵',
      sublabel: '원근 명암 깊이 추출',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'normal',
      label: '입체 표면 법선',
      sublabel: '표면 굴곡 방향 색상 맵',
      icon: <Box className="w-3.5 h-3.5" />,
    },
    {
      id: 'canny',
      label: '인체 외곽 윤곽선',
      sublabel: '윤곽선 및 선화 추출',
      icon: <Grid className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[11px] font-semibold text-zinc-500 tracking-tight px-1">
        인공지능 제어 맵 화면 모드
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
                  ? 'bg-[#141414] border-[#141414] text-[#ffffff]'
                  : 'bg-[#ffffff] border-[#e0e0e0] text-[#707070] hover:bg-[#f3f3f3] hover:text-[#141414]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-full ${
                    isSelected ? 'bg-[#262626] text-[#ffffff]' : 'bg-[#f3f3f3] text-[#707070]'
                  }`}
                >
                  {m.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight">{m.label}</div>
                  <div
                    className={`text-[10px] leading-tight mt-0.5 ${
                      isSelected ? 'text-[#adadad]' : 'text-[#707070]'
                    }`}
                  >
                    {m.sublabel}
                  </div>
                </div>
              </div>
              {isSelected && <span className="w-2 h-2 rounded-full bg-[#0066ff] mr-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

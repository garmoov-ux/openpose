import React from 'react';
import { Camera, User, Eye, Compass, RotateCcw } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { CameraPreset } from '@/types';

export const CameraToolbar: React.FC = () => {
  const { cameraPreset, setCameraPreset } = useEditorStore();

  const presets: Array<{ id: CameraPreset; label: string; icon: React.ReactNode }> = [
    { id: 'front', label: '정면', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'side', label: '측면', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'top', label: '상단', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'fullbody', label: '전신', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'closeup', label: '상반신', icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 bg-[#ffffff]/90 backdrop-blur-md rounded-full border border-[#e0e0e0] text-xs">
      {presets.map((p) => (
        <button
          key={p.id}
          onClick={() => setCameraPreset(p.id)}
          className={`flex items-center gap-1 px-3 py-1.5 font-medium rounded-full transition-all ${
            cameraPreset === p.id
              ? 'bg-[#141414] text-[#ffffff]'
              : 'text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3]'
          }`}
          title={`${p.label} 시점`}
        >
          {p.icon}
          <span>{p.label}</span>
        </button>
      ))}

      <div className="w-px h-4 bg-[#e0e0e0] mx-0.5" />

      <button
        onClick={() => setCameraPreset('front')}
        title="카메라 리셋"
        className="p-1.5 text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3] rounded-full transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

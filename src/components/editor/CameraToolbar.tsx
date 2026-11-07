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
    <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1.5 bg-neutral-900/90 backdrop-blur-md rounded-xl border border-neutral-800 shadow-xl">
      {presets.map((p) => (
        <button
          key={p.id}
          onClick={() => setCameraPreset(p.id)}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            cameraPreset === p.id
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title={`${p.label} 시점`}
        >
          {p.icon}
          <span>{p.label}</span>
        </button>
      ))}

      <div className="w-px h-4 bg-neutral-800 mx-1" />

      <button
        onClick={() => setCameraPreset('front')}
        title="카메라 리셋"
        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

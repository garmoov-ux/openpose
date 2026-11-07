import React from 'react';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { SceneManager } from '@/core/scene/SceneManager';
import { Bookmark, Sparkles } from 'lucide-react';

interface PresetGalleryProps {
  sceneManager: SceneManager | null;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({ sceneManager }) => {
  const handleSelectPreset = (presetId: string) => {
    if (!sceneManager) return;
    const preset = POSE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      applyPosePreset(sceneManager.humanoid.bones, preset);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
        <div className="flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
          <span>포즈 프리셋 라이브러리</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {POSE_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id)}
            className="group flex flex-col p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-left transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-neutral-200 group-hover:text-blue-400 transition-colors">
                {p.title}
              </span>
              <Sparkles className="w-3 h-3 text-neutral-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
              {p.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};


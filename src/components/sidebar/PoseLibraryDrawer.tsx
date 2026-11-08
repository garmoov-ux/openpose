import React from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ModeSelector } from './ModeSelector';
import { PresetGallery } from './PresetGallery';
import { SceneManager } from '@/core/scene/SceneManager';
import { Bookmark, X, Layers } from 'lucide-react';

interface PoseLibraryDrawerProps {
  sceneManager: SceneManager | null;
}

export const PoseLibraryDrawer: React.FC<PoseLibraryDrawerProps> = ({ sceneManager }) => {
  const { isPresetsDrawerOpen, setIsPresetsDrawerOpen } = useEditorStore();

  if (!isPresetsDrawerOpen) return null;

  return (
    <div className="absolute top-16 right-4 bottom-16 w-96 max-w-[calc(100vw-2rem)] z-20 flex flex-col bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right duration-200">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">포즈 & 렌더 보관함</h2>
            <p className="text-[11px] text-zinc-500">프리미엄 자세 모음 및 5대 제어 맵</p>
          </div>
        </div>
        <button
          onClick={() => setIsPresetsDrawerOpen(false)}
          aria-label="닫기"
          className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* 제어 맵 렌더 모드 */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold text-zinc-800 tracking-tight">제어 맵 화면 모드</span>
          </div>
          <ModeSelector />
        </div>

        <div className="border-t border-zinc-100 pt-3">
          <PresetGallery sceneManager={sceneManager} />
        </div>
      </div>
    </div>
  );
};

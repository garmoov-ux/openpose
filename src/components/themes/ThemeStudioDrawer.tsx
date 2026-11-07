import React from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { ThemeEnvironmentTab } from './ThemeEnvironmentTab';
import { OutfitSelectorTab } from './OutfitSelectorTab';
import { PromptPreviewBox } from './PromptPreviewBox';
import { SceneManager } from '@/core/scene/SceneManager';
import { Palette, Sparkles, FileText, X } from 'lucide-react';

interface ThemeStudioDrawerProps {
  sceneManager: SceneManager | null;
}

export const ThemeStudioDrawer: React.FC<ThemeStudioDrawerProps> = ({ sceneManager }) => {
  const { activeSidebarTab, setActiveSidebarTab } = useThemeSoloStore();
  const { isThemesDrawerOpen, setIsThemesDrawerOpen } = useEditorStore();

  if (!isThemesDrawerOpen) return null;

  const tabs: { id: typeof activeSidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'theme', label: '16대 테마', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'outfit', label: '의상 200선', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'prompt', label: '프롬프트 빌더', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="absolute top-16 left-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-20 flex flex-col bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left duration-200">
      {/* 드로어 헤더 */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">테마 & 의상 스튜디오</h2>
            <p className="text-[11px] text-zinc-500">16대 공간과 200종 콘셉트 의상</p>
          </div>
        </div>
        <button
          onClick={() => setIsThemesDrawerOpen(false)}
          className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 세그먼트 탭 */}
      <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex p-1 bg-zinc-200/60 rounded-full">
          {tabs.map((t) => {
            const isActive = activeSidebarTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSidebarTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSidebarTab === 'theme' && <ThemeEnvironmentTab />}
        {activeSidebarTab === 'outfit' && <OutfitSelectorTab />}
        {activeSidebarTab === 'prompt' && <PromptPreviewBox sceneManager={sceneManager} />}
      </div>
    </div>
  );
};

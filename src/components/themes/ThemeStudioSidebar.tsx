import React from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { ThemeEnvironmentTab } from './ThemeEnvironmentTab';
import { OutfitSelectorTab } from './OutfitSelectorTab';
import { PromptPreviewBox } from './PromptPreviewBox';
import { SceneManager } from '@/core/scene/SceneManager';
import { Palette, Sparkles, FileText } from 'lucide-react';

interface ThemeStudioSidebarProps {
  sceneManager: SceneManager | null;
}

export const ThemeStudioSidebar: React.FC<ThemeStudioSidebarProps> = ({ sceneManager }) => {
  const { activeSidebarTab, setActiveSidebarTab } = useThemeSoloStore();

  const tabs: { id: typeof activeSidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'theme', label: '16대 테마', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'outfit', label: '의상 200선', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'prompt', label: '프롬프트', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside className="w-80 h-full border-r border-[#e0e0e0] bg-[#ffffff] p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0 z-10">
      {/* 탭 네비게이션 (세그먼트 컨트롤 스타일) */}
      <div className="flex p-1 bg-[#f3f3f3] rounded-full">
        {tabs.map((t) => {
          const isActive = activeSidebarTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSidebarTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#ffffff] text-[#141414] shadow-sm'
                  : 'text-[#707070] hover:text-[#141414]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1">
        {activeSidebarTab === 'theme' && <ThemeEnvironmentTab />}
        {activeSidebarTab === 'outfit' && <OutfitSelectorTab />}
        {activeSidebarTab === 'prompt' && <PromptPreviewBox sceneManager={sceneManager} />}
      </div>
    </aside>
  );
};

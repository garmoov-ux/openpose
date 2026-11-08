import React, { Suspense, lazy } from 'react';
import {
  User,
  Bookmark,
  Download,
  Sparkles,
  X,
} from 'lucide-react';
import { useEditorStore, LeftSidebarSection } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';

const MannequinSidebarTab = lazy(() =>
  import('../models/MannequinSidebarTab').then((m) => ({ default: m.MannequinSidebarTab }))
);
const PresetGallery = lazy(() =>
  import('./PresetGallery').then((m) => ({ default: m.PresetGallery }))
);
const OutfitSelectorTab = lazy(() =>
  import('../themes/OutfitSelectorTab').then((m) => ({ default: m.OutfitSelectorTab }))
);
const PropsAndAccessoriesTab = lazy(() =>
  import('../themes/PropsAndAccessoriesTab').then((m) => ({ default: m.PropsAndAccessoriesTab }))
);
const ExportPanel = lazy(() =>
  import('../export/ExportPanel').then((m) => ({ default: m.ExportPanel }))
);

interface LeftUnifiedSidebarProps {
  sceneManager: SceneManager | null;
}

const NAV_ITEMS: Array<{
  id: Exclude<LeftSidebarSection, null>;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'mannequin',
    label: '마네킹',
    subtitle: '모델과 체형 선택',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 'poses',
    label: '자세',
    subtitle: '자세 프리셋 선택',
    icon: <Bookmark className="w-4 h-4" />,
  },
  {
    id: 'themes',
    label: '의상',
    subtitle: '마네킹에 입힐 의상 선택',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'export',
    label: '내보내기',
    subtitle: '이미지와 장면 저장',
    icon: <Download className="w-4 h-4" />,
  },
];

export const LeftUnifiedSidebar: React.FC<LeftUnifiedSidebarProps> = ({ sceneManager }) => {
  const { activeLeftSection, setActiveLeftSection } = useEditorStore();
  const activeSidebarTab = useThemeSoloStore((state) => state.activeSidebarTab);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollPositions = React.useRef<Record<string, number>>({});
  const effectiveThemeTab = activeSidebarTab === 'props' ? 'props' : 'outfit';
  const sectionKey = activeLeftSection === 'themes' ? `themes-${effectiveThemeTab}` : activeLeftSection;

  React.useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositions.current[sectionKey ?? ''] ?? 0;
    }
  }, [sectionKey]);

  const currentMeta = NAV_ITEMS.find((item) => item.id === activeLeftSection);

  if (!activeLeftSection || !currentMeta) {
    return null;
  }

  const isPropsTab = activeLeftSection === 'themes' && effectiveThemeTab === 'props';
  const headerIcon = currentMeta.icon;
  const headerTitle = isPropsTab ? '공간 꾸미기' : currentMeta.label;
  const headerSub = isPropsTab
    ? '가구, 장식, 배경 항목을 배치합니다'
    : currentMeta.subtitle;

  return (
    <aside className="editor-sidebar absolute top-16 left-4 bottom-[118px] z-20 flex items-center pointer-events-none" aria-labelledby="editor-sidebar-title">
      <div className="editor-sidebar-panel pointer-events-auto h-full flex flex-col bg-[#F7F8FA]/95 backdrop-blur-xl border border-[#D9DEE5] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* 사이드바 상단 고정 헤더 */}
        <div className="px-4 py-3 border-b border-[#D9DEE5] flex items-center justify-between gap-2 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-blue-400 flex items-center justify-center shadow-xs shrink-0">
              {headerIcon}
            </div>
            <div className="min-w-0">
              <h2 id="editor-sidebar-title" className="text-base font-bold text-[#20242B] tracking-tight leading-tight truncate">
                {headerTitle}
              </h2>
              <p className="text-xs text-[#65707D] mt-0.5 truncate">{headerSub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveLeftSection(null)}
            aria-label="사이드바 닫기"
            className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={(event) => { scrollPositions.current[sectionKey ?? ''] = event.currentTarget.scrollTop; }}
          className="editor-sidebar-content flex-1 overflow-y-auto overscroll-contain p-4"
        >
          <Suspense
            fallback={
              <div className="py-12 text-center text-xs font-semibold text-zinc-500">
                패널 데이터를 불러오는 중...
              </div>
            }
          >
            {activeLeftSection === 'mannequin' && (
              <MannequinSidebarTab sceneManager={sceneManager} />
            )}

            {activeLeftSection === 'poses' && (
              <PresetGallery sceneManager={sceneManager} />
            )}

            {activeLeftSection === 'themes' && (
              <>
                {effectiveThemeTab === 'outfit' && <OutfitSelectorTab />}
                {effectiveThemeTab === 'props' && <PropsAndAccessoriesTab />}
              </>
            )}

            {activeLeftSection === 'export' && <ExportPanel sceneManager={sceneManager} />}
          </Suspense>
        </div>
      </div>
    </aside>
  );
};

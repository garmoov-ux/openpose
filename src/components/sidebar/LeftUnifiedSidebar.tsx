import React, { Suspense, lazy } from 'react';
import {
  User,
  Bookmark,
  Download,
  Sparkles,
  Gem,
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
    label: '의상과 소품',
    subtitle: '의상, 액세서리, 소품 선택',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'export',
    label: '내보내기',
    subtitle: '이미지와 장면 저장, ComfyUI 연동',
    icon: <Download className="w-4 h-4" />,
  },
];

export const LeftUnifiedSidebar: React.FC<LeftUnifiedSidebarProps> = ({ sceneManager }) => {
  const { activeLeftSection, setActiveLeftSection } = useEditorStore();
  const { activeSidebarTab, setActiveSidebarTab } = useThemeSoloStore();
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeLeftSection, activeSidebarTab]);

  const currentMeta = NAV_ITEMS.find((item) => item.id === activeLeftSection);

  if (!activeLeftSection || !currentMeta) {
    return null;
  }

  const effectiveThemeTab = activeSidebarTab === 'props' ? 'props' : 'outfit';

  const isPropsTab = activeLeftSection === 'themes' && effectiveThemeTab === 'props';
  const headerIcon = isPropsTab ? <Gem className="w-4 h-4 text-pink-400" /> : currentMeta.icon;
  const headerTitle = isPropsTab ? '아이템과 소품' : currentMeta.label;
  const headerSub = isPropsTab
    ? '액세서리와 장면 소품 선택'
    : currentMeta.subtitle;

  return (
    <aside className="editor-sidebar absolute top-16 left-4 bottom-[118px] z-20 flex items-start pointer-events-none" aria-label="편집 사이드바">
      <div className="editor-sidebar-panel pointer-events-auto h-full w-[480px] max-w-[calc(100vw-2rem)] flex flex-col bg-[#F7F8FA]/95 backdrop-blur-xl border border-[#D9DEE5] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* 사이드바 상단 고정 헤더 */}
        <div className="px-4 py-3 border-b border-[#D9DEE5] flex items-center justify-between gap-2 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-blue-400 flex items-center justify-center shadow-xs shrink-0">
              {headerIcon}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#20242B] tracking-tight leading-tight truncate">
                {headerTitle}
              </h2>
              <p className="text-xs text-[#65707D] mt-0.5 truncate">{headerSub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveLeftSection(null)}
            aria-label="사이드바 닫기"
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="grid grid-cols-4 gap-1 px-3 py-2 bg-white border-b border-[#D9DEE5] shrink-0" aria-label="사이드바 섹션">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveLeftSection(item.id)}
              aria-current={activeLeftSection === item.id ? 'page' : undefined}
              className={`flex items-center justify-center gap-1.5 min-w-0 min-h-9 px-1 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeLeftSection === item.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 맞춤 의상 vs 아이템 & 소품 2분할 탭 메뉴 */}
        {activeLeftSection === 'themes' && (
          <div className="px-4 py-2 border-b border-[#D9DEE5] bg-zinc-50/80 flex-shrink-0">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-200/75 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveSidebarTab('outfit')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  effectiveThemeTab === 'outfit'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>맞춤 의상</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab('props')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  effectiveThemeTab === 'props'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Gem className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span>아이템 & 소품</span>
              </button>
            </div>
          </div>
        )}

        {/* 사이드바 단일 통합 스크롤 영역 (수요 시 지연 로드) */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
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

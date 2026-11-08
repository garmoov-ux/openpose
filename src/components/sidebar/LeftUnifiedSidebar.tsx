import React from 'react';
import {
  User,
  Bookmark,
  Palette,
  Download,
  Sparkles,
  Gem,
  Dices,
  X,
  Layers,
} from 'lucide-react';
import { useEditorStore, LeftSidebarSection } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { SceneManager } from '@/core/scene/SceneManager';
import { MannequinSidebarTab } from '../models/MannequinSidebarTab';
import { ModeSelector } from './ModeSelector';
import { PresetGallery } from './PresetGallery';
import { ThemeEnvironmentTab } from '../themes/ThemeEnvironmentTab';
import { OutfitSelectorTab } from '../themes/OutfitSelectorTab';
import { PropsAndAccessoriesTab } from '../themes/PropsAndAccessoriesTab';
import { ExportPanel } from '../export/ExportPanel';

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
    label: '마네킹 선택',
    subtitle: '유년·초중고·대학생·솔로·직장인·유부남녀·시니어 27종 (기본 무의상)',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 'poses',
    label: '자세 보관함',
    subtitle: '화보·글래머·커플 듀오 및 189종 자세 프리뷰 (3열)',
    icon: <Bookmark className="w-4 h-4" />,
  },
  {
    id: 'themes',
    label: '테마 · 의상 · 바디 아이템',
    subtitle: '380종 배경 사물, 맞춤 의상, 네일·구두·초커·가터 소품',
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: 'export',
    label: '저장 & 연동',
    subtitle: '고해상도 캡처, 핵심 장면 태그 복사 및 서버 전송',
    icon: <Download className="w-4 h-4" />,
  },
];

export const LeftUnifiedSidebar: React.FC<LeftUnifiedSidebarProps> = ({ sceneManager }) => {
  const { activeLeftSection, setActiveLeftSection } = useEditorStore();
  const { activeSidebarTab, setActiveSidebarTab, rollRandomAll } = useThemeSoloStore();
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

  const effectiveThemeTab =
    activeSidebarTab === 'outfit' || activeSidebarTab === 'props' ? activeSidebarTab : 'theme';

  return (
    <aside className="absolute top-16 left-4 bottom-20 z-20 flex items-start pointer-events-none">
      {/* 3열 그리드 표시를 위해 확장된 좌측 사이드바 패널 (w-[480px]) */}
      <div className="pointer-events-auto h-full w-[480px] max-w-[calc(100vw-2rem)] flex flex-col bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* 사이드바 상단 고정 헤더 + 전체 랜덤 세트 버튼 */}
        <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-blue-400 flex items-center justify-center shadow-xs shrink-0">
              {currentMeta.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight leading-tight truncate">
                {currentMeta.label}
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{currentMeta.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={rollRandomAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 rounded-full text-[11px] font-bold shadow-xs transition-all active:scale-95"
              title="배경 테마 + 세부장소 + 조명 + 의상 + 바디 아이템 + 자세를 한 번에 무작위 조합"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>전체 랜덤 세트</span>
            </button>
            <button
              onClick={() => setActiveLeftSection(null)}
              aria-label="사이드바 닫기"
              className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 테마 & 의상 & 바디 아이템 3분할 확대 탭 메뉴 */}
        {activeLeftSection === 'themes' && (
          <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/80 flex-shrink-0">
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-200/75 rounded-2xl">
              <button
                onClick={() => setActiveSidebarTab('theme')}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  effectiveThemeTab === 'theme'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>테마 & 사물</span>
              </button>
              <button
                onClick={() => setActiveSidebarTab('outfit')}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  effectiveThemeTab === 'outfit'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>맞춤 의상</span>
              </button>
              <button
                onClick={() => setActiveSidebarTab('props')}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
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

        {/* 사이드바 단일 통합 스크롤 영역 */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
          {activeLeftSection === 'mannequin' && (
            <MannequinSidebarTab sceneManager={sceneManager} />
          )}

          {activeLeftSection === 'poses' && (
            <div className="block space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-zinc-900 tracking-tight">
                    화면 렌더 모드 (5종)
                  </span>
                </div>
                <ModeSelector />
              </div>
              <div className="border-t border-zinc-100 pt-3">
                <PresetGallery sceneManager={sceneManager} />
              </div>
            </div>
          )}

          {activeLeftSection === 'themes' && (
            <>
              {effectiveThemeTab === 'theme' && <ThemeEnvironmentTab />}
              {effectiveThemeTab === 'outfit' && <OutfitSelectorTab />}
              {effectiveThemeTab === 'props' && <PropsAndAccessoriesTab />}
            </>
          )}

          {activeLeftSection === 'export' && <ExportPanel sceneManager={sceneManager} />}
        </div>
      </div>
    </aside>
  );
};

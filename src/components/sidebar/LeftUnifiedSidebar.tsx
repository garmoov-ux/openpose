import React from 'react';
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
import { MannequinSidebarTab } from '../models/MannequinSidebarTab';
import { PresetGallery } from './PresetGallery';
import { OutfitSelectorTab } from '../themes/OutfitSelectorTab';
import { PropsAndAccessoriesTab } from '../themes/PropsAndAccessoriesTab';
import { ExportPanel } from '../export/ExportPanel';
import { SidebarQuickOptionsBar } from '../common/SidebarQuickOptionsBar';

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
    subtitle: '유년·초중고·대학생·솔로·직장인·유부남녀·시니어 27종 체형',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 'poses',
    label: '자세 보관함 (커플 100 · 솔로 129)',
    subtitle: '남녀 커플 체위 100종 & 개인 솔로·셀프플레이 아코디언 제어',
    icon: <Bookmark className="w-4 h-4" />,
  },
  {
    id: 'themes',
    label: '맞춤 의상 · 아이템 & 소품',
    subtitle: '맞춤 의상, 방 가구·성인기구 55종, 바디 착용·성인토이 84종',
    icon: <Sparkles className="w-4 h-4" />,
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

  // 테마&사물 탭을 제거하고 '맞춤 의상(outfit)'과 '아이템 & 소품(props)' 2단 구성으로 직관화
  const effectiveThemeTab = activeSidebarTab === 'props' ? 'props' : 'outfit';

  const isPropsTab = activeLeftSection === 'themes' && effectiveThemeTab === 'props';
  const headerIcon = isPropsTab ? <Gem className="w-4 h-4 text-pink-400" /> : currentMeta.icon;
  const headerTitle = isPropsTab
    ? '아이템 & 소품 (색상 선택 지원)'
    : activeLeftSection === 'themes'
    ? '맞춤 의상 & 바디 코디'
    : currentMeta.label;
  const headerSub = isPropsTab
    ? '방 가구·성인스테이지(55종) 및 바디 착용·성인기구(84종) 색상·착탈 제어'
    : currentMeta.subtitle;

  return (
    <aside className="absolute top-16 left-4 bottom-20 z-20 flex items-start pointer-events-none">
      {/* 3열 그리드 표시를 위해 확장된 좌측 사이드바 패널 (w-[480px]) */}
      <div className="pointer-events-auto h-full w-[480px] max-w-[calc(100vw-2rem)] flex flex-col bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* 사이드바 상단 고정 헤더 */}
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-blue-400 flex items-center justify-center shadow-xs shrink-0">
              {headerIcon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight leading-tight truncate">
                {headerTitle}
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{headerSub}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveLeftSection(null)}
            aria-label="사이드바 닫기"
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 사이드바 내부 상시 노출 빠른 옵션 스위치 바 (순수 마네킹 모드, 방 사물, 관절선, 파트너, 렌더모드 5종) */}
        <SidebarQuickOptionsBar sceneManager={sceneManager} />

        {/* 맞춤 의상 vs 아이템 & 소품 2분할 탭 메뉴 (테마 & 사물 탭 제거 완료) */}
        {activeLeftSection === 'themes' && (
          <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/80 flex-shrink-0">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-200/75 rounded-2xl">
              <button
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

        {/* 사이드바 단일 통합 스크롤 영역 */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
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
        </div>
      </div>
    </aside>
  );
};

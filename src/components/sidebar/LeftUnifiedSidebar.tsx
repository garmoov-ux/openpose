import React from 'react';
import {
  User,
  Bookmark,
  Palette,
  Download,
  Sparkles,
  FileText,
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
import { PromptPreviewBox } from '../themes/PromptPreviewBox';
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
    subtitle: '유아부터 노년·체형별 14종 3D 인체 모델',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 'poses',
    label: '자세 보관함',
    subtitle: '표준 6종 & 프리미엄 100종 관절 프리뷰',
    icon: <Bookmark className="w-4 h-4" />,
  },
  {
    id: 'themes',
    label: '테마 & 의상',
    subtitle: '16대 공간 조명 무드와 200종 3D 의상',
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: 'export',
    label: '저장 & 연동',
    subtitle: '고해상도 캡처 및 생성 서버 직결',
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

  const handleToggleSection = (id: Exclude<LeftSidebarSection, null>) => {
    setActiveLeftSection(activeLeftSection === id ? null : id);
  };

  return (
    <aside className="absolute top-16 left-4 bottom-20 z-20 flex items-start gap-2.5 pointer-events-none">
      {/* 1. 왼쪽 상단 순수 아이콘 버튼 독 (Icon-Only Pill Rail) */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-full shadow-xl">
        {NAV_ITEMS.map((item) => {
          const isActive = activeLeftSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleToggleSection(item.id)}
              aria-label={item.label}
              title={item.label}
              className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isActive
                  ? 'bg-zinc-900 text-blue-400 shadow-md scale-105'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {item.icon}
              {/* 마우스 호버 시 우측 플로팅 툴팁 (사이드바가 닫혀 있을 때 표시) */}
              {!activeLeftSection && (
                <span className="pointer-events-none absolute left-12 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. 선택된 아이콘의 확장형 왼쪽 사이드바 뷰 (높이 제한 없이 전체 스크롤) */}
      {activeLeftSection && currentMeta && (
        <div className="pointer-events-auto h-full w-[390px] max-w-[calc(100vw-5rem)] flex flex-col bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-150">
          {/* 사이드바 상단 고정 헤더 */}
          <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-zinc-900 text-blue-400 flex items-center justify-center shadow-xs">
                {currentMeta.icon}
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900 tracking-tight leading-tight">
                  {currentMeta.label}
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">{currentMeta.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveLeftSection(null)}
              aria-label="사이드바 닫기"
              className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 테마 & 의상 탭일 때만 상단 아이콘 세그먼트 표시 */}
          {activeLeftSection === 'themes' && (
            <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/70 flex-shrink-0">
              <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-200/70 rounded-2xl">
                <button
                  onClick={() => setActiveSidebarTab('theme')}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSidebarTab === 'theme'
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  <span>16대 테마</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('outfit')}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSidebarTab === 'outfit'
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>의상 200선</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('prompt')}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSidebarTab === 'prompt'
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>프롬프트</span>
                </button>
              </div>
            </div>
          )}

          {/* 사이드바 단일 통합 스크롤 영역 */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3.5">
            {activeLeftSection === 'mannequin' && (
              <MannequinSidebarTab sceneManager={sceneManager} />
            )}

            {activeLeftSection === 'poses' && (
              <div className="block space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
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
                {activeSidebarTab === 'theme' && <ThemeEnvironmentTab />}
                {activeSidebarTab === 'outfit' && <OutfitSelectorTab />}
                {activeSidebarTab === 'prompt' && <PromptPreviewBox sceneManager={sceneManager} />}
              </>
            )}

            {activeLeftSection === 'export' && <ExportPanel sceneManager={sceneManager} />}
          </div>
        </div>
      )}
    </aside>
  );
};

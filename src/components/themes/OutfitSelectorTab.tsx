import React, { useState, useMemo } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { OutfitCategory } from '@/types/themeSolo';
import { Dices, Search, Check, Sparkles, Shirt, Gem, Sun, Layers, Crown, Palette } from 'lucide-react';

const CATEGORIES: { id: OutfitCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: '전체 (200)', icon: <Layers className="w-3 h-3" /> },
  { id: 'lingerie', label: '실크 슬립 (30)', icon: <Sparkles className="w-3 h-3" /> },
  { id: 'micro_bikini', label: '비치웨어 (30)', icon: <Sun className="w-3 h-3" /> },
  { id: 'body_jewelry', label: '주얼리 (20)', icon: <Gem className="w-3 h-3" /> },
  { id: 'crop_hotpants', label: '크롭·쇼츠 (20)', icon: <Shirt className="w-3 h-3" /> },
  { id: 'top_only', label: '오버핏 셔츠 (25)', icon: <Shirt className="w-3 h-3" /> },
  { id: 'topless_bottom', label: '모던 바텀 (25)', icon: <Layers className="w-3 h-3" /> },
  { id: 'costume_dress', label: '드레스 (25)', icon: <Crown className="w-3 h-3" /> },
  { id: 'color_contrast', label: '컬러 배색 (25)', icon: <Palette className="w-3 h-3" /> },
];

const CATEGORY_VISUALS: Record<string, { bg: string; color: string; label: string }> = {
  lingerie: { bg: 'from-rose-950 via-pink-950 to-zinc-950', color: '#fb7185', label: '실크 라운지' },
  micro_bikini: { bg: 'from-cyan-950 via-sky-950 to-zinc-950', color: '#38bdf8', label: '리조트 비치' },
  body_jewelry: { bg: 'from-amber-950 via-yellow-950 to-zinc-950', color: '#fbbf24', label: '크리스탈 체인' },
  crop_hotpants: { bg: 'from-indigo-950 via-blue-950 to-zinc-950', color: '#818cf8', label: '스트리트 크롭' },
  top_only: { bg: 'from-slate-800 via-zinc-900 to-zinc-950', color: '#e2e8f0', label: '루즈핏 셔츠' },
  topless_bottom: { bg: 'from-violet-950 via-purple-950 to-zinc-950', color: '#c084fc', label: '하이웨이스트' },
  costume_dress: { bg: 'from-fuchsia-950 via-rose-950 to-zinc-950', color: '#f472b6', label: '이브닝 드레스' },
  color_contrast: { bg: 'from-emerald-950 via-teal-950 to-zinc-950', color: '#34d399', label: '포인트 배색' },
};

// 의상 카테고리별 실루엣 SVG 렌더러
function renderOutfitSilhouette(category: string, accent: string) {
  switch (category) {
    case 'costume_dress':
      return (
        <path
          d="M38 24 L62 24 L57 45 L72 82 L28 82 L43 45 Z"
          fill={accent}
          fillOpacity="0.8"
          stroke="#ffffff"
          strokeWidth="1.2"
        />
      );
    case 'micro_bikini':
      return (
        <g fill={accent} fillOpacity="0.85" stroke="#ffffff" strokeWidth="1.2">
          <polygon points="36,36 48,36 42,26" />
          <polygon points="52,36 64,36 58,26" />
          <polygon points="36,56 64,56 50,70" />
        </g>
      );
    case 'crop_hotpants':
      return (
        <g fill={accent} fillOpacity="0.85" stroke="#ffffff" strokeWidth="1.2">
          <rect x="35" y="24" width="30" height="16" rx="3" />
          <path d="M35 50 L65 50 L67 68 L52 68 L50 58 L48 68 L33 68 Z" />
        </g>
      );
    case 'top_only':
      return (
        <path
          d="M26 28 L38 22 L62 22 L74 28 L68 44 L62 42 L64 70 L36 70 L38 42 L32 44 Z"
          fill={accent}
          fillOpacity="0.82"
          stroke="#ffffff"
          strokeWidth="1.2"
        />
      );
    default:
      return (
        <path
          d="M36 24 L64 24 L60 46 L66 74 L34 74 L40 46 Z"
          fill={accent}
          fillOpacity="0.8"
          stroke="#ffffff"
          strokeWidth="1.2"
        />
      );
  }
}

function cleanOutfitKoreanName(rawName: string): string {
  return rawName
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/란제리 세트/g, '실크 슬립 세트')
    .replace(/마이크로 비키니/g, '리조트 비치웨어')
    .replace(/#(\d+)/g, '$1번')
    .trim();
}

export const OutfitSelectorTab: React.FC = () => {
  const {
    selectedOutfitId,
    selectedOutfitCategory,
    setSelectedOutfitId,
    setSelectedOutfitCategory,
    rollRandomOutfit,
  } = useThemeSoloStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredOutfits = useMemo(() => {
    return OUTFITS_DATA.filter((item) => {
      const matchCat =
        selectedOutfitCategory === 'all' || item.category === selectedOutfitCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.id).includes(searchQuery.trim());
      return matchCat && matchQuery;
    });
  }, [selectedOutfitCategory, searchQuery]);

  return (
    <div className="block space-y-3 text-xs pb-4">
      {/* 상단 헤더 & 무작위 추천 */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-zinc-900 text-xs tracking-tight">
          200종 콘셉트 의상 미리보기
        </span>
        <button
          onClick={rollRandomOutfit}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-full transition-colors active:scale-95"
          title="현재 분류 내 무작위 의상 추천"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>무작위 의상</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="의상 번호, 실크, 드레스, 셔츠 등 검색..."
          className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 아이콘 카테고리 필터 (줄바꿈 가능한 칩 레이아웃) */}
      <div className="flex flex-wrap items-center gap-1">
        {CATEGORIES.map((c) => {
          const isActive = selectedOutfitCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedOutfitCategory(c.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* 높이 제한 없이 전체 스크롤되는 2열 비주얼 의상 그리드 */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredOutfits.map((item) => {
          const isSelected = selectedOutfitId === item.id;
          const vis = CATEGORY_VISUALS[item.category] || CATEGORY_VISUALS.lingerie;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedOutfitId(item.id)}
              className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-md'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              {/* 의상 실루엣 미리보기 썸네일 */}
              <div
                className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br ${vis.bg} flex items-center justify-center border border-white/10`}
              >
                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/45 text-white/90">
                  {String(item.id).padStart(3, '0')}번
                </span>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                <svg viewBox="0 0 100 95" className="w-16 h-16">
                  {renderOutfitSilhouette(item.category, vis.color)}
                </svg>
              </div>

              <div className="font-bold text-[11px] truncate mt-0.5">
                {cleanOutfitKoreanName(item.nameKo)}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className={isSelected ? 'text-zinc-400' : 'text-zinc-500'}>
                  {vis.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

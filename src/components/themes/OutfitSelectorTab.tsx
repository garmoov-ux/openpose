import React, { useState, useMemo } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import {
  getMannequinProfile,
  getOutfitsForMannequin,
} from '@/core/mannequin/mannequinProfiles';
import { OutfitCategory } from '@/types/themeSolo';
import {
  Dices,
  Search,
  Check,
  Sparkles,
  Shirt,
  Gem,
  Sun,
  Layers,
  Crown,
  Palette,
  Ban,
  UserCheck,
} from 'lucide-react';

const FEMALE_CATEGORIES: { id: OutfitCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: '전체 추천', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'crop_hotpants', label: '애슬레저·쇼츠', icon: <Shirt className="w-3.5 h-3.5" /> },
  { id: 'costume_dress', label: '드레스·원피스', icon: <Crown className="w-3.5 h-3.5" /> },
  { id: 'top_only', label: '오버핏 셔츠', icon: <Shirt className="w-3.5 h-3.5" /> },
  { id: 'color_contrast', label: '컬러 배색', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'topless_bottom', label: '모던 바텀', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'lingerie', label: '실크 슬립', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'micro_bikini', label: '비치웨어', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'body_jewelry', label: '주얼리', icon: <Gem className="w-3.5 h-3.5" /> },
];

const CATEGORY_VISUALS: Record<string, { bg: string; color: string; label: string }> = {
  lingerie: { bg: 'from-rose-950 via-pink-950 to-zinc-950', color: '#fb7185', label: '실크 라운지' },
  micro_bikini: { bg: 'from-cyan-950 via-sky-950 to-zinc-950', color: '#38bdf8', label: '리조트 비치' },
  body_jewelry: { bg: 'from-amber-950 via-yellow-950 to-zinc-950', color: '#fbbf24', label: '크리스탈 체인' },
  crop_hotpants: { bg: 'from-indigo-950 via-blue-950 to-zinc-950', color: '#60a5fa', label: '스포티·쇼츠' },
  top_only: { bg: 'from-slate-800 via-zinc-900 to-zinc-950', color: '#e2e8f0', label: '셔츠·데님' },
  topless_bottom: { bg: 'from-violet-950 via-purple-950 to-zinc-950', color: '#c084fc', label: '트레이닝 하의' },
  costume_dress: { bg: 'from-fuchsia-950 via-rose-950 to-zinc-950', color: '#f472b6', label: '원피스·스커트' },
  color_contrast: { bg: 'from-emerald-950 via-teal-950 to-zinc-950', color: '#34d399', label: '수트·캐주얼 세트' },
};

function renderOutfitSilhouette(category: string, accent: string, outfitId: number) {
  if (outfitId >= 1000 && category === 'color_contrast') {
    return (
      <g fill={accent} fillOpacity="0.86" stroke="#ffffff" strokeWidth="1.2">
        <path d="M28 24 L38 20 L62 20 L72 24 L68 46 L62 46 L62 52 L38 52 L38 46 L32 46 Z" />
        <path d="M38 54 L62 54 L65 84 L52 84 L50 64 L48 84 L35 84 Z" fill="#94a3b8" />
      </g>
    );
  }
  switch (category) {
    case 'costume_dress':
      return (
        <path
          d="M38 24 L62 24 L57 45 L72 82 L28 82 L43 45 Z"
          fill={accent}
          fillOpacity="0.82"
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
          <rect x="35" y="24" width="30" height="18" rx="3" />
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
  const currentModelId = useEditorStore((s) => s.currentModelId);
  const {
    selectedOutfitId,
    selectedOutfitCategory,
    setSelectedOutfitId,
    setSelectedOutfitCategory,
  } = useThemeSoloStore();

  const [searchQuery, setSearchQuery] = useState('');

  const profile = useMemo(() => getMannequinProfile(currentModelId), [currentModelId]);
  const availableOutfits = useMemo(() => getOutfitsForMannequin(currentModelId), [currentModelId]);

  const filteredOutfits = useMemo(() => {
    return availableOutfits.filter((item) => {
      const matchCat =
        profile.outfitProfile !== 'adult_female' ||
        selectedOutfitCategory === 'all' ||
        item.category === selectedOutfitCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.id).includes(searchQuery.trim());
      return matchCat && matchQuery;
    });
  }, [availableOutfits, profile.outfitProfile, selectedOutfitCategory, searchQuery]);

  const handleRollRandomCompatible = () => {
    if (filteredOutfits.length === 0) return;
    const rand = filteredOutfits[Math.floor(Math.random() * filteredOutfits.length)];
    setSelectedOutfitId(rand.id);
  };

  return (
    <div className="block space-y-3 text-xs pb-4">
      {/* 현재 마네킹 전용 복장 프로필 안내 배너 */}
      <div className="p-3 bg-zinc-900 text-white rounded-2xl flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-blue-400">
            <UserCheck className="w-4 h-4" />
            <span>{profile.profileTitleKo}</span>
          </span>
          <span className="text-[10px] text-zinc-400">{availableOutfits.length}종 호환</span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-snug">{profile.profileDescKo}</p>
      </div>

      {/* 상단 헤더 & 기본 복장 / 의상 해제 / 무작위 추천 */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="font-bold text-zinc-900 text-xs tracking-tight">
          마네킹 맞춤 3D 의상 (3열)
        </span>
        <div className="flex items-center gap-1.5">
          {profile.defaultOutfitId > 0 && (
            <button
              onClick={() => setSelectedOutfitId(profile.defaultOutfitId)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedOutfitId === profile.defaultOutfitId
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
              }`}
            >
              기본 복장
            </button>
          )}
          <button
            onClick={() => setSelectedOutfitId(0)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedOutfitId === 0
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="의상 벗기기 (순수 교보재 바디)"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>의상 해제</span>
          </button>
          <button
            onClick={handleRollRandomCompatible}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold rounded-full transition-colors active:scale-95"
            title="현재 마네킹 호환 의상 중 무작위 추천"
          >
            <Dices className="w-3.5 h-3.5 text-blue-600" />
            <span>무작위</span>
          </button>
        </div>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="의상 이름, 수트, 트레이닝, 스쿨룩, 드레스 등 검색..."
          className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 성인 여성 프로필일 때만 세부 카테고리 탭 표시 (크기 확대) */}
      {profile.outfitProfile === 'adult_female' && (
        <div className="flex flex-wrap items-center gap-1.5">
          {FEMALE_CATEGORIES.map((c) => {
            const isActive = selectedOutfitCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedOutfitCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
      )}

      {/* 3열 비주얼 의상 그리드 (grid-cols-3) */}
      <div className="grid grid-cols-3 gap-2.5">
        {filteredOutfits.map((item) => {
          const isSelected = selectedOutfitId === item.id;
          const vis = CATEGORY_VISUALS[item.category] || CATEGORY_VISUALS.color_contrast;

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
              <div
                className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br ${vis.bg} flex items-center justify-center border border-white/10`}
              >
                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/45 text-white/90">
                  {item.id >= 1000 ? '전용' : `${String(item.id).padStart(3, '0')}번`}
                </span>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                <svg viewBox="0 0 100 95" className="w-14 h-14">
                  {renderOutfitSilhouette(item.category, vis.color, item.id)}
                </svg>
              </div>

              <div className="font-bold text-[11px] truncate mt-0.5">
                {cleanOutfitKoreanName(item.nameKo)}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className={`truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {item.categoryLabelKo || vis.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

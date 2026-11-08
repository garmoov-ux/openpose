import React, { useMemo, useState } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import {
  getMannequinProfile,
  getOutfitsForMannequin,
} from '@/core/mannequin/mannequinProfiles';
import { OutfitCategory } from '@/types/themeSolo';
import { Check, Search, Dices, Ban, ArrowRightLeft } from 'lucide-react';

const FEMALE_CATEGORIES: { id: OutfitCategory | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'crop_hotpants', label: '애슬레저·쇼츠' },
  { id: 'costume_dress', label: '드레스·원피스' },
  { id: 'top_only', label: '오버핏 셔츠' },
  { id: 'color_contrast', label: '컬러 배색' },
  { id: 'topless_bottom', label: '모던 바텀' },
  { id: 'lingerie', label: '실크 슬립' },
  { id: 'micro_bikini', label: '비치웨어' },
  { id: 'body_jewelry', label: '주얼리' },
];

export const LegacyOutfitListView: React.FC = () => {
  const currentModelId = useEditorStore((s) => s.currentModelId);
  const {
    selectedOutfitId,
    selectedOutfitCategory,
    footwearId,
    setSelectedOutfitId,
    setSelectedOutfitCategory,
    migrateLegacyAppearanceToWardrobe,
  } = useThemeSoloStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAllVariants, setShowAllVariants] = useState(false);
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

  const displayedOutfits = useMemo(() => {
    if (showAllVariants || searchQuery.trim()) return filteredOutfits;
    const byShape = new Map<string, (typeof filteredOutfits)[number]>();
    filteredOutfits.forEach((item) => {
      if (!byShape.has(item.category)) byShape.set(item.category, item);
      if (item.id === selectedOutfitId) byShape.set(item.category, item);
    });
    return [...byShape.values()];
  }, [filteredOutfits, selectedOutfitId, searchQuery, showAllVariants]);

  const shapeCount = new Set(availableOutfits.map((item) => item.category)).size;

  const handleRollLegacy = () => {
    if (filteredOutfits.length === 0) return;
    const currentCategory = availableOutfits.find((item) => item.id === selectedOutfitId)?.category;
    const alternatives = filteredOutfits.filter((item) => item.category !== currentCategory);
    const pool = alternatives.length > 0 ? alternatives : filteredOutfits;
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setSelectedOutfitId(rand.id, currentModelId);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-2.5 bg-zinc-100 rounded-2xl border border-zinc-200 flex items-center justify-between gap-2">
        <div className="text-[11px] text-zinc-600">
          레거시 문구 {availableOutfits.length}개는 기본 형태 {shapeCount}계열을 공유합니다. 색상과 문구 변형은 전체 보기에서 선택할 수 있습니다.
        </div>
        {selectedOutfitId > 0 && (
          <button
            type="button"
            onClick={() => migrateLegacyAppearanceToWardrobe(selectedOutfitId, footwearId, currentModelId)}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[11px]"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>부위별 변환</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="레거시 코디 검색..."
            className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-xl pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <button
          type="button"
          onClick={() => setSelectedOutfitId(0)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold text-xs"
        >
          <Ban className="w-3.5 h-3.5" />
          <span>해제</span>
        </button>
        <button
          type="button"
          onClick={handleRollLegacy}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs"
        >
          <Dices className="w-3.5 h-3.5 text-blue-400" />
          <span>무작위</span>
        </button>
      </div>

      {profile.outfitProfile === 'adult_female' && (
        <div className="flex flex-wrap gap-1">
          {FEMALE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedOutfitCategory(c.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                selectedOutfitCategory === c.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-600">
        <span>{searchQuery.trim() ? `검색 결과 ${filteredOutfits.length}개` : `표시 ${displayedOutfits.length}개 · 기본 형태 ${shapeCount}계열`}</span>
        <button
          type="button"
          onClick={() => setShowAllVariants((current) => !current)}
          aria-pressed={showAllVariants}
          className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-semibold text-zinc-800 hover:bg-zinc-100"
        >
          {showAllVariants ? '대표 형태만 보기' : `전체 변형 ${availableOutfits.length}개 보기`}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {displayedOutfits.map((item) => {
          const isSelected = selectedOutfitId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedOutfitId(item.id, currentModelId)}
              className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-blue-500">#{item.id}</span>
                {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="font-bold text-[11px] truncate">{item.nameKo.split(' (')[0]}</div>
              <div className="text-[10px] text-zinc-400 truncate">{item.categoryLabelKo} · 변형 {item.id}번</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};


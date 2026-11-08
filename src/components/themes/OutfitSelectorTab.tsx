import React, { useState, useMemo } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { OutfitCategory } from '@/types/themeSolo';
import { Dices, Search, Check } from 'lucide-react';

const CATEGORIES: { id: OutfitCategory | 'all'; label: string }[] = [
  { id: 'all', label: '전체 (200)' },
  { id: 'lingerie', label: '란제리 (30)' },
  { id: 'micro_bikini', label: '비키니 (30)' },
  { id: 'body_jewelry', label: '바디 주얼리 (20)' },
  { id: 'crop_hotpants', label: '크롭&핫팬츠 (20)' },
  { id: 'top_only', label: '하의 실종 (25)' },
  { id: 'topless_bottom', label: '탑리스 매치 (25)' },
  { id: 'costume_dress', label: '코스튬 (25)' },
  { id: 'color_contrast', label: '보색 배색 (25)' },
];

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
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameKo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedOutfitCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* 상단 헤더 & 랜덤 주사위 */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#141414] text-[13px] tracking-tight">
          200종 의상 & 스타일링
        </span>
        <button
          onClick={rollRandomOutfit}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] font-medium rounded-full transition-colors active:scale-95"
          title="현재 카테고리 내 무작위 추첨"
        >
          <Dices className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>랜덤 의상</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="의상 명칭, 소재, 컬러 검색..."
          className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] rounded-[16px] pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#141414]"
        />
      </div>

      {/* 카테고리 필터 필 (Stadium Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedOutfitCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedOutfitCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#141414] text-[#ffffff]'
                  : 'bg-[#f3f3f3] text-[#707070] hover:text-[#141414] hover:bg-[#e0e0e0]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 의상 리스트 (200종) */}
      <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
        {filteredOutfits.map((item) => {
          const isSelected = selectedOutfitId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedOutfitId(item.id)}
              className={`p-2.5 rounded-[16px] text-left transition-all border flex items-start justify-between gap-2 ${
                isSelected
                  ? 'bg-[#141414] text-[#ffffff] border-[#141414]'
                  : 'bg-[#ffffff] text-[#141414] border-[#e0e0e0] hover:bg-[#f3f3f3]'
              }`}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-[#262626] text-[#ffffff]' : 'bg-[#f0f0f0] text-[#707070]'
                    }`}
                  >
                    #{item.id}
                  </span>
                  <span className="font-semibold text-[11px] truncate">{item.nameKo || item.nameEn}</span>
                </div>
                <p
                  className={`text-[10px] line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-[#adadad]' : 'text-[#707070]'
                  }`}
                >
                  {item.text}
                </p>
              </div>
              {isSelected && (
                <div className="p-1 rounded-full bg-[#0066ff] text-[#ffffff] flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};


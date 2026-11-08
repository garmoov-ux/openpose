import React, { useState, useMemo } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { OutfitCategory } from '@/types/themeSolo';
import { Dices, Search, Check } from 'lucide-react';

const CATEGORIES: { id: OutfitCategory | 'all'; label: string }[] = [
  { id: 'all', label: '전체 (200)' },
  { id: 'lingerie', label: '실크 슬립 (30)' },
  { id: 'micro_bikini', label: '비치웨어 (30)' },
  { id: 'body_jewelry', label: '바디 주얼리 (20)' },
  { id: 'crop_hotpants', label: '크롭 & 쇼츠 (20)' },
  { id: 'top_only', label: '오버핏 셔츠 (25)' },
  { id: 'topless_bottom', label: '모던 바텀 (25)' },
  { id: 'costume_dress', label: '드레스 & 코스튬 (25)' },
  { id: 'color_contrast', label: '컬러 배색 (25)' },
];

const CATEGORY_DESC_KO: Record<string, string> = {
  lingerie: '고급 실크와 섬세한 레이스 디테일의 라운지 스타일링',
  micro_bikini: '리조트 및 풀사이드 콘셉트에 어울리는 비치웨어 스타일링',
  body_jewelry: '우아한 메탈 체인과 크리스탈 포인트 주얼리 연출',
  crop_hotpants: '경쾌하고 활동적인 스트리트 캐주얼 크롭 매치',
  top_only: '자연스러운 루즈핏 실루엣의 실내 내추럴 스타일링',
  topless_bottom: '세련된 하이웨이스트 라인 중심의 모던 화보 스타일링',
  costume_dress: '파티 및 무대 화보용 이브닝 드레스와 콘셉트 의상',
  color_contrast: '선명한 색감 대비로 시선을 사로잡는 포인트 배색 의상',
};

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
    <div className="flex flex-col gap-3 text-xs">
      {/* 상단 헤더 & 무작위 추천 */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#141414] text-[13px] tracking-tight">
          200종 콘셉트 의상 보관함
        </span>
        <button
          onClick={rollRandomOutfit}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] font-medium rounded-full transition-colors active:scale-95"
          title="현재 분류 내 무작위 의상 추천"
        >
          <Dices className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>무작위 의상</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="의상 번호, 실크, 드레스, 데님 등 검색..."
          className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] rounded-[16px] pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#141414]"
        />
      </div>

      {/* 카테고리 필터 필 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((c) => {
          const isActive = selectedOutfitCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedOutfitCategory(c.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#141414] text-[#ffffff]'
                  : 'bg-[#f3f3f3] text-[#707070] hover:text-[#141414] hover:bg-[#e0e0e0]'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* 의상 리스트 (200종 - 2열 그리드로 공간 활용 극대화) */}
      <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {filteredOutfits.map((item) => {
          const isSelected = selectedOutfitId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedOutfitId(item.id)}
              className={`p-2.5 rounded-[16px] text-left transition-all border flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-[#141414] text-[#ffffff] border-[#141414] shadow-sm'
                  : 'bg-[#ffffff] text-[#141414] border-[#e0e0e0] hover:bg-[#f3f3f3]'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#0066ff] text-[#ffffff]' : 'bg-[#f0f0f0] text-[#707070]'
                  }`}
                >
                  {item.id}번
                </span>
                {isSelected && (
                  <div className="p-0.5 rounded-full bg-[#0066ff] text-[#ffffff] flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <div className="font-bold text-[11px] truncate">{item.nameKo}</div>
              <p
                className={`text-[10px] line-clamp-1 leading-relaxed ${
                  isSelected ? 'text-[#adadad]' : 'text-[#707070]'
                }`}
              >
                {CATEGORY_DESC_KO[item.category] || '프리미엄 화보 스타일링 의상'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

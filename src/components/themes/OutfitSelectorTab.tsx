import React, { useMemo, useState } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { WARDROBE_ITEMS, WARDROBE_SETS } from '@/core/mannequin/wardrobe/catalog';
import { getModelAgeClass, isCompatible, isSetCompatible } from '@/core/mannequin/wardrobe/compatibility';
import { composeOutfit } from '@/core/mannequin/wardrobe/composition';
import { WardrobeFitProfile } from '@/types/wardrobe';
import { WardrobeSlotSummaryBar } from './WardrobeSlotSummaryBar';
import { LegacyOutfitListView } from './LegacyOutfitListView';
import { WardrobeCatalogGrid } from './WardrobeCatalogGrid';
import { Search, Dices, Footprints, Sparkles, Archive } from 'lucide-react';

type PanelMode = 'items' | 'sets' | 'legacy';
type StyleFilterKey =
  | 'all' | '일상' | '오피스' | '스포츠' | '데이트' | '라운지'
  | '수영복' | '성인 이너웨어' | '성인 콘셉트 코디' | '구두·신발';

const STYLE_FILTERS: Array<{ id: StyleFilterKey; label: string; adultOnly?: boolean }> = [
  { id: 'all', label: '전체' },
  { id: '일상', label: '일상' },
  { id: '오피스', label: '오피스' },
  { id: '스포츠', label: '스포츠' },
  { id: '데이트', label: '데이트' },
  { id: '라운지', label: '라운지' },
  { id: '수영복', label: '수영복' },
  { id: '성인 이너웨어', label: '성인 이너웨어', adultOnly: true },
  { id: '성인 콘셉트 코디', label: '성인 콘셉트 코디', adultOnly: true },
  { id: '구두·신발', label: '구두·신발' },
];

const ADULT_SET_SUB_TAGS = ['전체', '이너웨어', '이브닝', '리조트', '데이트', '대학·프레피'];

export const OutfitSelectorTab: React.FC = () => {
  const currentModelId = useEditorStore((s) => s.currentModelId);
  const {
    outfitCompositions, lastWardrobeMessage, toggleWardrobeItem, applyWardrobeSet,
    setWardrobeItemOverride, clearWardrobeItems, rollRandomWardrobeCoordi,
  } = useThemeSoloStore();

  const [panelMode, setPanelMode] = useState<PanelMode>('items');
  const [styleFilter, setStyleFilter] = useState<StyleFilterKey>('all');
  const [adultSetSubTag, setAdultSetSubTag] = useState<string>('전체');
  const [fitFilter, setFitFilter] = useState<'model-default' | WardrobeFitProfile>('model-default');
  const [searchQuery, setSearchQuery] = useState('');

  const ageClass = useMemo(() => getModelAgeClass(currentModelId), [currentModelId]);
  const mainComp = outfitCompositions.main;
  const composed = useMemo(() => composeOutfit(mainComp.itemIds, { modelId: currentModelId }), [mainComp.itemIds, currentModelId]);

  const compatibleItems = useMemo(
    () => WARDROBE_ITEMS.filter((i) => (i.renderSupport === 'asset' || i.renderSupport === 'procedural') && isCompatible(i, currentModelId).compatible),
    [currentModelId]
  );
  const compatibleSets = useMemo(
    () => WARDROBE_SETS.filter((s) => isSetCompatible(s, currentModelId).compatible),
    [currentModelId]
  );

  const filteredItems = useMemo(() => {
    return compatibleItems.filter((item) => {
      if (styleFilter !== 'all' && styleFilter !== '성인 콘셉트 코디' && !item.styleTags.includes(styleFilter)) return false;
      if (fitFilter !== 'model-default' && item.fitProfile !== fitFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!item.nameKo.toLowerCase().includes(q) && !item.nameEn.toLowerCase().includes(q) && !item.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [compatibleItems, styleFilter, fitFilter, searchQuery]);

  const filteredSets = useMemo(() => {
    return compatibleSets.filter((setItem) => {
      if (styleFilter === '성인 콘셉트 코디') {
        if (!setItem.id.startsWith('set-adult.')) return false;
        if (adultSetSubTag !== '전체' && !setItem.styleTags.includes(adultSetSubTag)) return false;
      } else if (styleFilter !== 'all' && !setItem.styleTags.includes(styleFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!setItem.nameKo.toLowerCase().includes(q) && !setItem.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [compatibleSets, styleFilter, adultSetSubTag, searchQuery]);

  const handleSelectStyleFilter = (key: StyleFilterKey) => {
    setStyleFilter(key);
    if (key === '성인 콘셉트 코디') setPanelMode('sets');
    else if (panelMode === 'sets' && key === '구두·신발') setPanelMode('items');
  };

  return (
    <div className="block space-y-3 text-xs pb-4">
      <div className="p-3 bg-zinc-900 text-white rounded-2xl flex items-center justify-between gap-2">
        <div>
          <div className="font-bold text-blue-400 text-xs">
            현재 모델에 맞는 의상 고르기
          </div>
          <div className="text-[11px] text-zinc-300 mt-0.5">
            단품 {compatibleItems.length}개 · 코디 세트 {compatibleSets.length}개
            {ageClass !== 'adult' && ' · 일반 의상만 표시'}
          </div>
        </div>
      </div>

      <WardrobeSlotSummaryBar
        composition={mainComp}
        composed={composed}
        onRemoveItem={(id) => toggleWardrobeItem(id, 'main', currentModelId)}
        onClearAll={() => clearWardrobeItems('main')}
        onUpdateColor={(id, color) => setWardrobeItemOverride(id, { color }, 'main')}
        onToggleClosure={(id, closureState) => setWardrobeItemOverride(id, { closureState }, 'main')}
      />

      {lastWardrobeMessage && (
        <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold">
          {lastWardrobeMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1 p-1 bg-zinc-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setPanelMode('items')}
            aria-pressed={panelMode === 'items'}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${panelMode === 'items' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
          >
            단품 추가 ({filteredItems.length})
          </button>
          <button
            type="button"
            onClick={() => setPanelMode('sets')}
            aria-pressed={panelMode === 'sets'}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${panelMode === 'sets' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
          >
            코디 세트 ({filteredSets.length})
          </button>
          <button
            type="button"
            onClick={() => setPanelMode('legacy')}
            aria-pressed={panelMode === 'legacy'}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${panelMode === 'legacy' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'}`}
          >
            <Archive className="w-3 h-3" />
            <span>레거시 변형</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={compatibleItems.length === 0}
            onClick={() => rollRandomWardrobeCoordi({ modelIdOverride: currentModelId })}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white font-bold text-xs"
          >
            <Dices className="w-3.5 h-3.5 text-blue-400" />
            <span>무작위 코디</span>
          </button>
          <button
            type="button"
            disabled={!compatibleItems.some((i) => i.slots.includes('footwear'))}
            onClick={() => rollRandomWardrobeCoordi({ slotFilter: 'footwear', modelIdOverride: currentModelId })}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 text-zinc-900 font-bold text-xs border border-zinc-200"
          >
            <Footprints className="w-3.5 h-3.5 text-amber-600" />
            <span>무작위 신발</span>
          </button>
        </div>
      </div>

      {panelMode === 'legacy' ? (
        <LegacyOutfitListView />
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="의상 이름 검색"
                aria-label="의상 이름 검색"
                className="w-full min-h-10 bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            {panelMode === 'items' && (
              <select
                value={fitFilter}
                onChange={(e) => setFitFilter(e.target.value as typeof fitFilter)}
                className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
                aria-label="체형별 의상 필터"
              >
                <option value="model-default">현재 체형 전체</option>
                <option value="adult-feminine">여성형 핏</option>
                <option value="adult-masculine">남성형 핏</option>
                <option value="adult-unisex">중성형 핏</option>
                <option value="youth">아동·청소년 핏</option>
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {STYLE_FILTERS.filter((f) => !f.adultOnly || ageClass === 'adult').map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleSelectStyleFilter(f.id)}
                aria-pressed={styleFilter === f.id}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  styleFilter === f.id ? 'bg-zinc-900 text-white shadow-2xs' : 'bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {styleFilter === '성인 콘셉트 코디' && ageClass === 'adult' && (
            <div className="flex flex-wrap items-center gap-1 p-2 bg-rose-50/80 border border-rose-200 rounded-xl">
              <span className="text-[11px] font-bold text-rose-800 mr-1 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 콘셉트:
              </span>
              {ADULT_SET_SUB_TAGS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setAdultSetSubTag(sub)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${adultSetSubTag === sub ? 'bg-rose-700 text-white' : 'bg-white text-rose-800'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          <WardrobeCatalogGrid
            mode={panelMode}
            items={filteredItems}
            sets={filteredSets}
            composition={mainComp}
            onToggleItem={(itemId) => toggleWardrobeItem(itemId, 'main', currentModelId)}
            onApplySet={(setId) => applyWardrobeSet(setId, 'main', currentModelId)}
          />
        </>
      )}
    </div>
  );
};

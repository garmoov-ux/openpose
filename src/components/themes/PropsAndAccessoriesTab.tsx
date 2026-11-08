import React, { useState, useMemo } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import {
  NAIL_ITEMS,
  FOOTWEAR_ITEMS,
  NECK_ITEMS,
  WRIST_ITEMS,
  LEG_ITEMS,
  TOY_SPECIAL_ITEMS,
  BodyAccessoryOption,
} from '@/data/themesSolo/accessoriesAndPropsData';
import { BodyAccessoryCategoryKey } from '@/core/mannequin/bodyAccessoryMeshes';
import { getModelAgeClass } from '@/core/mannequin/wardrobe/compatibility';
import { RoomPropsManagerView } from './RoomPropsManagerView';
import { ColorPaletteBar } from '../common/ColorPaletteBar';
import { Dices, Ban, Check, Sparkles, Sofa, X } from 'lucide-react';

type MainMode = 'room_props' | 'body_items';

const SUB_SECTIONS: Array<{
  id: BodyAccessoryCategoryKey;
  label: string;
  noneId: string;
  items: BodyAccessoryOption[];
}> = [
  { id: 'toy_special', label: '성인기구·페티시 (21)', noneId: 'toy_none', items: TOY_SPECIAL_ITEMS },
  { id: 'footwear', label: '신발·스타킹·부츠 (15)', noneId: 'bare_feet', items: FOOTWEAR_ITEMS },
  { id: 'neck', label: '초커·목줄·체인 (12)', noneId: 'none', items: NECK_ITEMS },
  { id: 'legs', label: '가터·발목커프 (12)', noneId: 'none', items: LEG_ITEMS },
  { id: 'wrist', label: '수갑·커프·글러브 (12)', noneId: 'none', items: WRIST_ITEMS },
  { id: 'nails', label: '매니큐어·페디 (12)', noneId: 'none', items: NAIL_ITEMS },
];

export const PropsAndAccessoriesTab: React.FC = () => {
  const currentModelId = useEditorStore((s) => s.currentModelId);
  const ageClass = useMemo(() => getModelAgeClass(currentModelId), [currentModelId]);
  const [mainMode, setMainMode] = useState<MainMode>('room_props');
  const [activeSub, setActiveSub] = useState<BodyAccessoryCategoryKey>('footwear');

  const {
    nailColorId,
    footwearId,
    neckItemId,
    wristItemId,
    legItemId,
    toyItemId,
    customAccessoryColors,
    roomProps,
    setNailColorId,
    setFootwearId,
    setNeckItemId,
    setWristItemId,
    setLegItemId,
    setToyItemId,
    setCustomAccessoryColor,
    clearAllAccessories,
    rollRandomAccessories,
  } = useThemeSoloStore();

  const slotMap: Record<
    BodyAccessoryCategoryKey,
    { selectedId: string; setter: (id: string) => void; noneId: string; title: string }
  > = {
    toy_special: { selectedId: toyItemId, setter: setToyItemId, noneId: 'toy_none', title: '성인·페티시 기구' },
    footwear: { selectedId: footwearId, setter: setFootwearId, noneId: 'bare_feet', title: '신발·스타킹' },
    neck: { selectedId: neckItemId, setter: setNeckItemId, noneId: 'none', title: '목걸이·초커' },
    legs: { selectedId: legItemId, setter: setLegItemId, noneId: 'none', title: '가터·다리장식' },
    wrist: { selectedId: wristItemId, setter: setWristItemId, noneId: 'none', title: '손목·수갑·글러브' },
    nails: { selectedId: nailColorId, setter: setNailColorId, noneId: 'none', title: '네일·페디' },
  };

  const visibleSections = useMemo(
    () => (ageClass === 'adult' ? SUB_SECTIONS : SUB_SECTIONS.filter((s) => s.id !== 'toy_special')),
    [ageClass]
  );

  // 현재 착용 중인 바디 아이템 목록 추출
  const equippedList = visibleSections.map((sec) => {
    const slot = slotMap[sec.id];
    const found = sec.items.find((i) => i.id === slot.selectedId);
    const isEquipped = found && found.id !== sec.noneId;
    return isEquipped ? { catId: sec.id, item: found, noneId: sec.noneId, setter: slot.setter } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const currentSec = visibleSections.find((s) => s.id === activeSub) || visibleSections[0];
  const currentSlot = slotMap[currentSec.id];
  const currentSelectedOpt = currentSec.items.find((i) => i.id === currentSlot.selectedId);

  const handleToggleItem = (itemId: string) => {
    // 이미 착용된 아이템을 다시 클릭하면 즉시 미착용(noneId)으로 해제
    if (currentSlot.selectedId === itemId && itemId !== currentSlot.noneId) {
      currentSlot.setter(currentSlot.noneId);
    } else {
      currentSlot.setter(itemId);
    }
  };

  return (
    <div className="block space-y-3 text-xs pb-4">
      {/* 상단 2대 모드 전환 (방 가구 & 성인스테이지 55종 vs 바디 착용 & 성인기구 84종) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-2xl border border-zinc-200/80">
        <button
          onClick={() => setMainMode('room_props')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-[11px] transition-all ${
            mainMode === 'room_props'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Sofa className="w-3.5 h-3.5 text-amber-400" />
          <span>방 가구·소품 ({roomProps.length}/55)</span>
        </button>
        <button
          onClick={() => setMainMode('body_items')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-[11px] transition-all ${
            mainMode === 'body_items'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>바디 착용·성인기구 (84)</span>
        </button>
      </div>

      {mainMode === 'room_props' ? (
        <RoomPropsManagerView />
      ) : (
        <div className="space-y-3">
          {/* 바디 착용 아이템 요약 & 원클릭 전체 해제 패널 */}
          <div className="p-3 bg-zinc-100/95 rounded-2xl border border-zinc-200/85 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>현재 착용 아이템 ({equippedList.length}개)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearAllAccessories}
                  className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-[11px] font-bold transition-colors shadow-xs"
                  title="모든 바디 착용 아이템 및 성인기구 전체 해제"
                >
                  <Ban className="w-3 h-3" />
                  <span>전체 해제</span>
                </button>
                <button
                  onClick={rollRandomAccessories}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-white rounded-full text-[11px] font-bold hover:bg-zinc-800 transition-colors"
                >
                  <Dices className="w-3.5 h-3.5 text-pink-400" />
                  <span>랜덤</span>
                </button>
              </div>
            </div>

            {equippedList.length === 0 ? (
              <p className="text-[10.5px] text-zinc-500">
                현재 착용 중인 바디 아이템이 없습니다. 아래 카드를 클릭해 착용하고, 다시 클릭하면 해제됩니다.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {equippedList.map(({ catId, item, noneId, setter }) => {
                  const customHex = customAccessoryColors[catId] ?? item.colorHex;
                  const hexStr = `#${customHex.toString(16).padStart(6, '0')}`;
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-[10.5px] font-semibold"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/30"
                        style={{ backgroundColor: hexStr }}
                      />
                      <button
                        type="button"
                        onClick={() => setActiveSub(catId)}
                        className="truncate max-w-[140px] hover:underline"
                      >
                        {item.nameKo}
                      </button>
                      <button
                        type="button"
                        onClick={() => setter(noneId)}
                        className="p-0.5 rounded-full hover:bg-zinc-700 text-rose-400"
                        title="이 부위 착용 해제"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* 부위별 서브 카테고리 탭 */}
          <div className="grid grid-cols-3 gap-1.5">
            {visibleSections.map((sec) => {
              const active = currentSec.id === sec.id;
              const slot = slotMap[sec.id];
              const isSlotEquipped = slot.selectedId !== sec.noneId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSub(sec.id)}
                  className={`px-2 py-2 rounded-xl text-[10.5px] font-bold transition-all border text-center truncate ${
                    active
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : isSlotEquipped
                      ? 'bg-pink-50 text-pink-900 border-pink-300'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200/80 hover:text-zinc-900'
                  }`}
                >
                  {sec.label}
                </button>
              );
            })}
          </div>

          {/* 현재 부위 색상 커스터마이징 바 (12색 추천 스와치 + 자유 RGB 컬러 피커) */}
          <ColorPaletteBar
            title={`${currentSlot.title} 색상 선택 (${currentSelectedOpt?.nameKo || '기본'})`}
            currentColorHex={customAccessoryColors[activeSub]}
            defaultColorHex={currentSelectedOpt?.colorHex ?? 0xe11d48}
            onSelectColor={(hex) => setCustomAccessoryColor(activeSub, hex)}
            onResetColor={() => setCustomAccessoryColor(activeSub, undefined)}
          />

          {/* 현재 부위 아이템 3열 그리드 (재클릭 시 즉시 미착용 토글) */}
          <div className="grid grid-cols-3 gap-2">
            {currentSec.items.map((item) => {
              const isSelected = currentSlot.selectedId === item.id;
              const isNoneCard = item.id === currentSlot.noneId;
              const displayHex =
                isSelected && customAccessoryColors[activeSub] !== undefined
                  ? customAccessoryColors[activeSub]!
                  : item.colorHex;
              const hexStr = `#${displayHex.toString(16).padStart(6, '0')}`;
              const secHexStr = item.secondaryHex
                ? `#${item.secondaryHex.toString(16).padStart(6, '0')}`
                : hexStr;

              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-pink-500 ring-2 ring-pink-500/25 shadow-sm'
                      : isNoneCard
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
                      : 'bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {isNoneCard ? (
                      <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                    ) : (
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0"
                        style={{ background: `linear-gradient(135deg, ${hexStr} 55%, ${secHexStr} 45%)` }}
                      />
                    )}
                    {isSelected && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        {isNoneCard ? '해제됨' : '착용중'}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-[10.5px] leading-tight line-clamp-2">
                    {item.nameKo}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

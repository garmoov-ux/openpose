import React, { useState } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import {
  NAIL_ITEMS,
  FOOTWEAR_ITEMS,
  NECK_ITEMS,
  WRIST_ITEMS,
  LEG_ITEMS,
  EXTRA_SCENE_PROPS,
  BodyAccessoryOption,
} from '@/data/themesSolo/accessoriesAndPropsData';
import { Dices, RotateCcw, Check, Sparkles, Sofa } from 'lucide-react';

type BodySubSection = 'footwear' | 'nails' | 'neck' | 'wrist' | 'legs' | 'scene_props';

const SUB_SECTIONS: Array<{ id: BodySubSection; label: string }> = [
  { id: 'footwear', label: '신발·스타킹·맨발 (12)' },
  { id: 'nails', label: '매니큐어·페디 (9)' },
  { id: 'neck', label: '목걸이·초커·체인 (9)' },
  { id: 'legs', label: '종아리·가터·발목 (9)' },
  { id: 'wrist', label: '손목·팔찌·커프 (8)' },
  { id: 'scene_props', label: '3D 공간 소품 (12)' },
];

export const PropsAndAccessoriesTab: React.FC = () => {
  const [activeSub, setActiveSub] = useState<BodySubSection>('footwear');

  const {
    nailColorId,
    footwearId,
    neckItemId,
    wristItemId,
    legItemId,
    extraSceneProps,
    setNailColorId,
    setFootwearId,
    setNeckItemId,
    setWristItemId,
    setLegItemId,
    toggleExtraSceneProp,
    clearAllAccessories,
    rollRandomAccessories,
  } = useThemeSoloStore();

  const renderAccessoryGrid = (
    items: BodyAccessoryOption[],
    selectedId: string,
    onSelect: (id: string) => void
  ) => (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const hexStr = `#${item.colorHex.toString(16).padStart(6, '0')}`;
        const secHexStr = item.secondaryHex
          ? `#${item.secondaryHex.toString(16).padStart(6, '0')}`
          : hexStr;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              isSelected
                ? 'bg-zinc-900 text-white border-pink-500 ring-2 ring-pink-500/25 shadow-sm'
                : 'bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span
                  className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0"
                  style={{ background: `linear-gradient(135deg, ${hexStr} 55%, ${secHexStr} 45%)` }}
                />
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-pink-400" />}
            </div>
            <div className="font-bold text-[10.5px] leading-tight line-clamp-2">
              {item.nameKo}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="block space-y-3 text-xs pb-4">
      {/* 상단 요약 및 랜덤/초기화 컨트롤 */}
      <div className="p-3 bg-zinc-100/90 rounded-2xl border border-zinc-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-zinc-900">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span>바디 아이템 & 3D 공간 소품</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={rollRandomAccessories}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-white rounded-full text-[11px] font-bold hover:bg-zinc-800 transition-colors"
          >
            <Dices className="w-3.5 h-3.5 text-pink-400" />
            <span>아이템 셔플</span>
          </button>
          <button
            onClick={clearAllAccessories}
            className="flex items-center gap-1 px-2.5 py-1 bg-white text-zinc-700 border border-zinc-200 rounded-full text-[11px] font-semibold hover:bg-zinc-200 transition-colors"
            title="맨발 및 모든 장식 해제"
          >
            <RotateCcw className="w-3 h-3" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* 부위별 서브 카테고리 탭 (3열 2줄 버튼) */}
      <div className="grid grid-cols-3 gap-1.5">
        {SUB_SECTIONS.map((sec) => {
          const active = activeSub === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSub(sec.id)}
              className={`px-2 py-2 rounded-xl text-[11px] font-bold transition-all border text-center truncate ${
                active
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200/80 hover:text-zinc-900 hover:bg-zinc-200/70'
              }`}
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* 선택된 부위별 3열 아이템 그리드 */}
      {activeSub === 'footwear' && renderAccessoryGrid(FOOTWEAR_ITEMS, footwearId, setFootwearId)}
      {activeSub === 'nails' && renderAccessoryGrid(NAIL_ITEMS, nailColorId, setNailColorId)}
      {activeSub === 'neck' && renderAccessoryGrid(NECK_ITEMS, neckItemId, setNeckItemId)}
      {activeSub === 'wrist' && renderAccessoryGrid(WRIST_ITEMS, wristItemId, setWristItemId)}
      {activeSub === 'legs' && renderAccessoryGrid(LEG_ITEMS, legItemId, setLegItemId)}

      {activeSub === 'scene_props' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5 text-[11px] text-zinc-600 font-semibold">
            <span className="flex items-center gap-1">
              <Sofa className="w-3.5 h-3.5 text-amber-600" />
              3D 무대 위에 원하는 소품을 중복 배치할 수 있습니다
            </span>
            <span className="text-amber-600 font-bold">{extraSceneProps.length}개 선택됨</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {EXTRA_SCENE_PROPS.map((prop) => {
              const isSelected = extraSceneProps.includes(prop.id);
              const hexStr = `#${prop.colorHex.toString(16).padStart(6, '0')}`;
              return (
                <button
                  key={prop.id}
                  onClick={() => toggleExtraSceneProp(prop.id)}
                  className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-amber-500 ring-2 ring-amber-500/25 shadow-sm'
                      : 'bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: hexStr, color: '#fff' }}
                    >
                      {prop.categoryKo}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="font-bold text-[10.5px] leading-tight line-clamp-2">
                    {prop.nameKo}
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


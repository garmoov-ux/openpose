import React, { useState } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import {
  NAIL_ITEMS,
  FOOTWEAR_ITEMS,
  NECK_ITEMS,
  WRIST_ITEMS,
  LEG_ITEMS,
  BodyAccessoryOption,
} from '@/data/themesSolo/accessoriesAndPropsData';
import { RoomPropsManagerView } from './RoomPropsManagerView';
import { Dices, RotateCcw, Check, Sparkles, Sofa } from 'lucide-react';

type MainMode = 'room_props' | 'body_items';
type BodySubSection = 'footwear' | 'nails' | 'neck' | 'wrist' | 'legs';

const SUB_SECTIONS: Array<{ id: BodySubSection; label: string }> = [
  { id: 'footwear', label: '신발·스타킹·맨발 (12)' },
  { id: 'nails', label: '매니큐어·페디 (9)' },
  { id: 'neck', label: '목걸이·초커·체인 (9)' },
  { id: 'legs', label: '종아리·가터·발목 (9)' },
  { id: 'wrist', label: '손목·팔찌·커프 (8)' },
];

export const PropsAndAccessoriesTab: React.FC = () => {
  const [mainMode, setMainMode] = useState<MainMode>('room_props');
  const [activeSub, setActiveSub] = useState<BodySubSection>('footwear');

  const {
    nailColorId,
    footwearId,
    neckItemId,
    wristItemId,
    legItemId,
    roomProps,
    setNailColorId,
    setFootwearId,
    setNeckItemId,
    setWristItemId,
    setLegItemId,
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
              <span
                className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0"
                style={{ background: `linear-gradient(135deg, ${hexStr} 55%, ${secHexStr} 45%)` }}
              />
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
      {/* 상단 2대 모드 전환 (방 가구 & 소품 45종 vs 바디 착용 아이템 47종) */}
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
          <span>방 가구·소품 ({roomProps.length})</span>
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
          <span>바디 착용 아이템 (47)</span>
        </button>
      </div>

      {mainMode === 'room_props' ? (
        <RoomPropsManagerView />
      ) : (
        <div className="space-y-3">
          {/* 바디 착용 아이템 상단 컨트롤 */}
          <div className="p-3 bg-zinc-100/90 rounded-2xl border border-zinc-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>네일·구두·초커·가터 바디 착용</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={rollRandomAccessories}
                className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-white rounded-full text-[11px] font-bold hover:bg-zinc-800 transition-colors"
              >
                <Dices className="w-3.5 h-3.5 text-pink-400" />
                <span>풀세트 셔플</span>
              </button>
              <button
                onClick={clearAllAccessories}
                className="flex items-center gap-1 px-2.5 py-1 bg-white text-zinc-700 border border-zinc-200 rounded-full text-[11px] font-semibold hover:bg-zinc-200 transition-colors"
                title="맨발 및 모든 장식 해제"
              >
                <RotateCcw className="w-3 h-3" />
                <span>해제</span>
              </button>
            </div>
          </div>

          {/* 부위별 서브 카테고리 탭 */}
          <div className="grid grid-cols-3 gap-1.5">
            {SUB_SECTIONS.map((sec) => {
              const active = activeSub === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSub(sec.id)}
                  className={`px-2 py-2 rounded-xl text-[10.5px] font-bold transition-all border text-center truncate ${
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

          {activeSub === 'footwear' && renderAccessoryGrid(FOOTWEAR_ITEMS, footwearId, setFootwearId)}
          {activeSub === 'nails' && renderAccessoryGrid(NAIL_ITEMS, nailColorId, setNailColorId)}
          {activeSub === 'neck' && renderAccessoryGrid(NECK_ITEMS, neckItemId, setNeckItemId)}
          {activeSub === 'wrist' && renderAccessoryGrid(WRIST_ITEMS, wristItemId, setWristItemId)}
          {activeSub === 'legs' && renderAccessoryGrid(LEG_ITEMS, legItemId, setLegItemId)}
        </div>
      )}
    </div>
  );
};

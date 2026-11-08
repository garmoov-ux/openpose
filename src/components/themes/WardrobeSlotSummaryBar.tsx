import React from 'react';
import {
  ComposedOutfitResult,
  OutfitCompositionV1,
  WardrobeItemV1,
} from '@/types/wardrobe';
import { EyeOff, Ban, Palette, DoorOpen } from 'lucide-react';

interface WardrobeSlotSummaryBarProps {
  composition: OutfitCompositionV1;
  composed: ComposedOutfitResult;
  onRemoveItem: (itemId: string) => void;
  onClearAll: () => void;
  onUpdateColor: (itemId: string, color: string) => void;
  onToggleClosure: (itemId: string, nextState: 'open' | 'closed') => void;
}

const SLOT_GROUP_DEFS: Array<{
  id: string;
  label: string;
  match: (item: WardrobeItemV1) => boolean;
}> = [
  { id: 'inner', label: '속옷', match: (i) => i.slots.includes('underwear_top') || i.slots.includes('underwear_bottom') },
  { id: 'top_bottom', label: '상·하의/원피스', match: (i) => i.slots.includes('base_top') || i.slots.includes('base_bottom') || i.slots.includes('one_piece') },
  { id: 'swim', label: '수영복', match: (i) => i.slots.includes('swim_top') || i.slots.includes('swim_bottom') || i.slots.includes('swim_one_piece') },
  { id: 'outer', label: '아우터', match: (i) => i.slots.includes('outerwear') || i.slots.includes('swim_cover') },
  { id: 'legwear', label: '양말·스타킹', match: (i) => i.slots.includes('socks') || i.slots.includes('legwear') },
  { id: 'footwear', label: '신발', match: (i) => i.slots.includes('footwear') },
  { id: 'acc', label: '장신구', match: (i) => i.slots.some((s) => s.endsWith('_accessory') || s === 'bag') },
];

const QUICK_COLORS = ['#f8fafc', '#18181b', '#1e293b', '#2563eb', '#e11d48', '#b45309', '#d6d3d1'];

export const WardrobeSlotSummaryBar: React.FC<WardrobeSlotSummaryBarProps> = ({
  composition,
  composed,
  onRemoveItem,
  onClearAll,
  onUpdateColor,
  onToggleClosure,
}) => {
  return (
    <div className="p-3 bg-white rounded-2xl border border-zinc-200/90 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-zinc-900">
            현재 착장 슬롯 ({composed.activeItems.length}개 착용)
          </span>
          {composed.fullyHiddenItemIds.length > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              겉옷 가림 {composed.fullyHiddenItemIds.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClearAll}
          disabled={composed.activeItems.length === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 text-zinc-800 transition-colors"
        >
          <Ban className="w-3 h-3 text-rose-500" />
          <span>전체 해제</span>
        </button>
      </div>

      {/* 7대 부위 슬롯 칩 (모바일 가로 스크롤 지원) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {SLOT_GROUP_DEFS.map((grp) => {
          const matched = composed.activeItems.filter(grp.match);
          const hasAny = matched.length > 0;
          return (
            <div
              key={grp.id}
              className={`shrink-0 px-2.5 py-1 rounded-xl border text-xs flex items-center gap-1.5 ${
                hasAny
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-zinc-50 text-zinc-500 border-zinc-200'
              }`}
            >
              <span className="font-bold">{grp.label}</span>
              <span className={`text-[11px] ${hasAny ? 'text-blue-300' : 'text-zinc-400'}`}>
                {hasAny ? matched.map((m) => m.nameKo).join(' · ') : '비어있음'}
              </span>
            </div>
          );
        })}
      </div>

      {/* 착용 품목별 개별 해제 · 색상 · 여밈 제어 */}
      {composed.activeItems.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-zinc-100">
          {composed.activeItems.map((item) => {
            const ov = composition.overrides?.[item.id];
            const activeColor = ov?.color || item.materials[0]?.color || '#f8fafc';
            const pickerColor = /^#[0-9a-f]{6}$/i.test(activeColor) ? activeColor : '#f8fafc';
            const isHidden = composed.fullyHiddenItemIds.includes(item.id);
            const canToggleClosure =
              item.slots.includes('outerwear') || item.slots.includes('swim_cover');
            const currentClosure = ov?.closureState || item.shape?.closureState || 'open';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full border border-zinc-400 shrink-0"
                    style={{ backgroundColor: activeColor }}
                  />
                  <span className="font-bold text-zinc-900 truncate">{item.nameKo}</span>
                  {isHidden && (
                    <span
                      className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0"
                      title="바깥 레이어 의상에 의해 가려진 상태입니다."
                    >
                      <EyeOff className="w-2.5 h-2.5" />
                      가려짐
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center gap-0.5 mr-1" title="추천 색상 선택">
                    <Palette className="w-3 h-3 text-zinc-400 mr-0.5" />
                    {QUICK_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => onUpdateColor(item.id, hex)}
                        className={`w-3.5 h-3.5 rounded-full border ${
                          activeColor.toLowerCase() === hex
                            ? 'border-blue-600 scale-110'
                            : 'border-zinc-300'
                        }`}
                        style={{ backgroundColor: hex }}
                        aria-label={`${item.nameKo} 색상 ${hex}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={pickerColor}
                      onChange={(event) => onUpdateColor(item.id, event.target.value)}
                      aria-label={`${item.nameKo} 직접 색상 선택`}
                      title="직접 색상 선택"
                      className="ml-1 h-6 w-7 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-0.5"
                    />
                  </div>

                  {canToggleClosure && (
                    <button
                      type="button"
                      onClick={() =>
                        onToggleClosure(item.id, currentClosure === 'open' ? 'closed' : 'open')
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200 hover:bg-zinc-300 text-[11px] font-semibold text-zinc-800 inline-flex items-center gap-0.5"
                      title="아우터/로브 여밈 상태 전환"
                    >
                      <DoorOpen className="w-3 h-3" />
                      <span>{currentClosure === 'open' ? '오픈' : '여밈'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px]"
                  >
                    제거
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

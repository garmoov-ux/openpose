import React from 'react';
import { Check, Layers } from 'lucide-react';
import { getWardrobeItemById } from '@/core/mannequin/wardrobe/catalog';
import { OutfitCompositionV1, WardrobeItemV1, WardrobeSetV1 } from '@/types/wardrobe';

function renderItemShapePreview(item: WardrobeItemV1, color: string) {
  const g = item.geometryKey;
  if (g === 'shoe') {
    const isHeel = (item.shape?.heelHeightCm ?? 2) >= 4.5;
    const isBoot = (item.shape?.shaftHeightCm ?? 0) >= 14;
    return (
      <svg viewBox="0 0 80 60" className="w-12 h-10">
        {isBoot ? (
          <path d="M26 10 L44 10 L46 38 L62 44 L62 50 L22 50 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        ) : isHeel ? (
          <path d="M18 28 L34 42 L62 44 L62 49 L32 49 L24 38 L22 50 L18 50 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        ) : (
          <path d="M18 34 L36 34 L62 42 L62 50 L18 50 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        )}
      </svg>
    );
  }
  if (g === 'trousers' || g === 'shorts-skirt') {
    const isSkirt = item.id.includes('skirt');
    return (
      <svg viewBox="0 0 80 60" className="w-12 h-10">
        {isSkirt ? (
          <path d="M26 14 L54 14 L62 48 L18 48 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        ) : (
          <path d="M24 12 L56 12 L58 50 L44 50 L40 28 L36 50 L22 50 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        )}
      </svg>
    );
  }
  if (g === 'underwear' || g === 'swim-bottom') {
    const isThong = item.shape?.legCut === 'thong';
    return (
      <svg viewBox="0 0 80 60" className="w-12 h-10">
        {isThong ? (
          <path d="M20 18 L60 18 L60 23 L45 25 L40 46 L35 25 L20 23 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        ) : (
          <path d="M22 16 L58 16 L56 36 L44 44 L36 44 L24 36 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        )}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 60" className="w-12 h-10">
      <path d="M20 16 L30 12 L50 12 L60 16 L56 30 L50 28 L52 48 L28 48 L30 28 L24 30 Z" fill={color} stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

interface WardrobeCatalogGridProps {
  mode: 'items' | 'sets';
  items: WardrobeItemV1[];
  sets: WardrobeSetV1[];
  composition: OutfitCompositionV1;
  onToggleItem: (itemId: string) => void;
  onApplySet: (setId: string) => void;
}

export const WardrobeCatalogGrid: React.FC<WardrobeCatalogGridProps> = ({
  mode,
  items,
  sets,
  composition,
  onToggleItem,
  onApplySet,
}) => {
  if (mode === 'items') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const isEquipped = composition.itemIds.includes(item.id);
          const ovColor = composition.overrides?.[item.id]?.color;
          const displayColor = ovColor || item.materials[0]?.color || '#f8fafc';
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleItem(item.id)}
              className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                isEquipped
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-sm'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div className="relative w-full aspect-[4/3] rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/50 text-white">
                  {item.slots[0]}
                </span>
                <span className="absolute bottom-1 right-1 text-[9px] font-semibold px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {item.renderSupport === 'procedural' ? '3D 절차형' : item.renderSupport}
                </span>
                {isEquipped && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                {renderItemShapePreview(item, displayColor)}
              </div>
              <div className="font-bold text-xs truncate">{item.nameKo}</div>
              <div className="flex items-center justify-between text-[10px] opacity-75">
                <span className="truncate">{item.materials[0]?.fabric}</span>
                <span>
                  {item.fitProfile === 'adult-unisex'
                    ? '공용'
                    : item.fitProfile === 'adult-feminine'
                    ? '여성형'
                    : item.fitProfile === 'adult-masculine'
                    ? '남성형'
                    : '주니어'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {sets.map((setItem) => {
        const memberItems = setItem.itemIds
          .map((id) => getWardrobeItemById(id))
          .filter((x): x is WardrobeItemV1 => Boolean(x));
        const allEquipped =
          setItem.itemIds.length > 0 &&
          setItem.itemIds.every((id) => composition.itemIds.includes(id));

        return (
          <button
            key={setItem.id}
            type="button"
            onClick={() => onApplySet(setItem.id)}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              allEquipped
                ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25'
                : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="inline-flex items-center gap-1 font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>{setItem.nameKo}</span>
              </span>
              {allEquipped && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
            <div className="text-[11px] opacity-80 leading-snug">
              구성 ({memberItems.length}): {memberItems.map((m) => m.nameKo).join(' + ')}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {setItem.styleTags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-500/15 font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};


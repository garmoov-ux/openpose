import { MannequinModelId } from '@/types';
import {
  ComposedOutfitResult,
  WardrobeItemV1,
  WardrobeLayer,
  WardrobeRenderSupport,
  WardrobeSetV1,
  WardrobeSlot,
} from '@/types/wardrobe';
import { getWardrobeItemById } from './catalog';
import { isCompatible, isSetCompatible } from './compatibility';

const LAYER_ORDER: Record<WardrobeLayer, number> = {
  underwear: 1,
  base: 2,
  outer: 3,
  accessory: 4,
};

const SLOT_ORDER: Record<WardrobeSlot, number> = {
  underwear_top: 10,
  underwear_bottom: 11,
  swim_top: 20,
  swim_bottom: 21,
  swim_one_piece: 22,
  base_top: 30,
  base_bottom: 31,
  one_piece: 32,
  swim_cover: 40,
  outerwear: 41,
  legwear: 50,
  socks: 51,
  footwear: 60,
  neck_accessory: 70,
  wrist_accessory: 71,
  head_accessory: 72,
  face_accessory: 73,
  bag: 74,
};

/**
 * 슬롯 간 상호 배타 충돌 규칙:
 * - 같은 슬롯을 점유하는 새 품목은 기존 품목을 교체
 * - one_piece는 base_top, base_bottom, swim_one_piece와 상호 교체
 * - swim_one_piece는 swim_top, swim_bottom, one_piece와 상호 교체
 * - swim_top은 base_top과 교체 (단, 래시가드(layer: outer)는 기본 swim_top 위에 겹침 허용)
 * - swim_bottom은 base_bottom과 교체 (단, beach-shorts(base_bottom)를 입으면 swim_bottom 위에 겹침 가능하도록 처리하거나 슬롯 기준 판단)
 */
function doItemsConflict(existing: WardrobeItemV1, incoming: WardrobeItemV1): WardrobeSlot | null {
  if (existing.id === incoming.id) return incoming.slots[0] || 'base_top';

  // 래시가드(swim_top & layer: outer)는 일반 비키니/수영 상의(swim_top & layer: base) 위에 겹쳐 입을 수 있음
  const isRashguardOverlay =
    (existing.slots.includes('swim_top') &&
      incoming.slots.includes('swim_top') &&
      existing.layer !== incoming.layer) ||
    false;

  if (!isRashguardOverlay) {
    for (const s of incoming.slots) {
      if (existing.slots.includes(s)) {
        return s;
      }
    }
  }

  // one_piece <-> base_top / base_bottom 충돌 (단, outerwear나 swim_cover는 허용)
  if (incoming.slots.includes('one_piece')) {
    if (existing.slots.includes('base_top')) return 'base_top';
    if (existing.slots.includes('base_bottom')) return 'base_bottom';
    if (existing.slots.includes('swim_one_piece')) return 'swim_one_piece';
  }
  if (existing.slots.includes('one_piece')) {
    if (incoming.slots.includes('base_top')) return 'one_piece';
    if (incoming.slots.includes('base_bottom')) return 'one_piece';
    if (incoming.slots.includes('swim_one_piece')) return 'one_piece';
  }

  // swim_one_piece <-> swim_top(base) / swim_bottom 충돌
  if (incoming.slots.includes('swim_one_piece')) {
    if (existing.slots.includes('swim_top') && existing.layer === 'base') return 'swim_top';
    if (existing.slots.includes('swim_bottom')) return 'swim_bottom';
  }
  if (existing.slots.includes('swim_one_piece')) {
    if (incoming.slots.includes('swim_top') && incoming.layer === 'base') return 'swim_one_piece';
    if (incoming.slots.includes('swim_bottom')) return 'swim_one_piece';
  }

  return null;
}

export function sortWardrobeItemsByLayer(items: WardrobeItemV1[]): WardrobeItemV1[] {
  return [...items].sort((a, b) => {
    const lDiff = LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer];
    if (lDiff !== 0) return lDiff;
    const sA = SLOT_ORDER[a.slots[0] || 'base_top'] ?? 50;
    const sB = SLOT_ORDER[b.slots[0] || 'base_top'] ?? 50;
    if (sA !== sB) return sA - sB;
    return a.sortOrder - b.sortOrder;
  });
}

/**
 * 순수 함수 composeOutfit:
 * 입력된 품목 또는 ID 배열을 순서대로 적용하여 슬롯 충돌을 해결하고,
 * 가림(visibilityMask / hideWhenCoveredBy) 및 renderSupport 요약을 계산한다.
 */
export function composeOutfit(
  itemsOrIds: Array<WardrobeItemV1 | string>,
  options?: { modelId?: MannequinModelId }
): ComposedOutfitResult {
  const activeMap = new Map<string, WardrobeItemV1>();
  const slotConflicts: Array<{ slot: WardrobeSlot; replacedItemId: string; byItemId: string }> = [];
  const warnings: string[] = [];

  for (const entry of itemsOrIds) {
    const item = typeof entry === 'string' ? getWardrobeItemById(entry) : entry;
    if (!item) {
      warnings.push(`존재하지 않는 품목 ID가 제외되었습니다: ${String(entry)}`);
      continue;
    }

    if (options?.modelId) {
      const compat = isCompatible(item, options.modelId);
      if (!compat.compatible) {
        warnings.push(`${item.nameKo}: ${compat.reason}`);
        continue;
      }
    }

    for (const [extId, extItem] of Array.from(activeMap.entries())) {
      const conflictSlot = doItemsConflict(extItem, item);
      if (conflictSlot) {
        activeMap.delete(extId);
        if (extId !== item.id) {
          slotConflicts.push({
            slot: conflictSlot,
            replacedItemId: extId,
            byItemId: item.id,
          });
        }
      }
    }

    activeMap.set(item.id, item);
  }

  const activeItems = sortWardrobeItemsByLayer(Array.from(activeMap.values()));
  const activeItemIds = activeItems.map((i) => i.id);

  // 가림 규칙 계산 (visibilityMask / hideWhenCoveredBy)
  const hiddenRegionsByItem: Record<string, string[]> = {};
  const partiallyHiddenItemIds: string[] = [];
  const fullyHiddenItemIds: string[] = [];

  const hasOpaqueBaseTop = activeItems.some(
    (i) =>
      (i.slots.includes('base_top') || i.slots.includes('one_piece')) &&
      i.shape?.opacity !== 'semi-sheer' &&
      i.shape?.opacity !== 'sheer'
  );
  const hasOpaqueBottom = activeItems.some(
    (i) =>
      (i.slots.includes('base_bottom') || i.slots.includes('one_piece')) &&
      i.shape?.opacity !== 'semi-sheer' &&
      i.shape?.opacity !== 'sheer'
  );
  const hasClosedOuter = activeItems.some(
    (i) =>
      (i.slots.includes('outerwear') || i.slots.includes('swim_cover')) &&
      i.shape?.closureState === 'closed' &&
      i.shape?.opacity !== 'semi-sheer' &&
      i.shape?.opacity !== 'sheer'
  );
  const equippedFootwear = activeItems.find((i) => i.slots.includes('footwear'));
  const isBootEquipped =
    equippedFootwear?.shape?.shoeForm === 'boot' ||
    (equippedFootwear?.shape?.shaftHeightCm ?? 0) >= 14;

  for (const item of activeItems) {
    const hidden: string[] = [];

    if (item.slots.includes('underwear_top')) {
      if (hasOpaqueBaseTop || hasClosedOuter) {
        hidden.push(...item.coverage);
      }
    } else if (item.slots.includes('underwear_bottom')) {
      if (hasOpaqueBottom) {
        hidden.push(...item.coverage);
      }
    } else if (item.slots.includes('base_top')) {
      if (hasClosedOuter) {
        hidden.push('upper_torso', 'lower_torso');
      }
    } else if (item.slots.includes('socks')) {
      if (equippedFootwear) {
        hidden.push('feet');
        const sockShaft = item.shape?.shaftHeightCm ?? 8;
        const bootShaft = equippedFootwear.shape?.shaftHeightCm ?? 0;
        if (isBootEquipped && bootShaft >= sockShaft) {
          hidden.push('lower_legs');
        }
      }
    } else if (item.slots.includes('legwear')) {
      if (equippedFootwear) {
        hidden.push('feet');
      }
    }

    const uniqueHidden = Array.from(new Set(hidden));
    if (uniqueHidden.length > 0) {
      hiddenRegionsByItem[item.id] = uniqueHidden;
      const allCovered = item.coverage.every((c) => uniqueHidden.includes(c));
      if (allCovered) {
        fullyHiddenItemIds.push(item.id);
      } else {
        partiallyHiddenItemIds.push(item.id);
      }
    }
  }

  const visibleItems = activeItems.filter((i) => !fullyHiddenItemIds.includes(i.id));

  const renderSupportSummary: Record<WardrobeRenderSupport, number> = {
    asset: 0,
    procedural: 0,
    'color-only': 0,
    'prompt-only': 0,
  };
  const promptOnlyItemIds: string[] = [];

  for (const item of activeItems) {
    renderSupportSummary[item.renderSupport] =
      (renderSupportSummary[item.renderSupport] || 0) + 1;
    if (item.renderSupport === 'prompt-only') {
      promptOnlyItemIds.push(item.id);
    }
  }

  return {
    activeItems,
    activeItemIds,
    slotConflicts,
    hiddenRegionsByItem,
    partiallyHiddenItemIds,
    fullyHiddenItemIds,
    visibleItems,
    renderSupportSummary,
    promptOnlyItemIds,
    warnings,
  };
}

export function toggleItemInOutfit(
  currentItemIds: string[],
  targetItemId: string,
  modelId: MannequinModelId
): {
  ok: boolean;
  nextItemIds: string[];
  replacedItemIds: string[];
  error?: string;
} {
  if (currentItemIds.includes(targetItemId)) {
    return {
      ok: true,
      nextItemIds: currentItemIds.filter((id) => id !== targetItemId),
      replacedItemIds: [],
    };
  }

  const targetItem = getWardrobeItemById(targetItemId);
  if (!targetItem) {
    return {
      ok: false,
      nextItemIds: currentItemIds,
      replacedItemIds: [],
      error: `존재하지 않는 품목 ID입니다: ${targetItemId}`,
    };
  }

  const compat = isCompatible(targetItem, modelId);
  if (!compat.compatible) {
    return {
      ok: false,
      nextItemIds: currentItemIds,
      replacedItemIds: [],
      error: compat.reason,
    };
  }

  const composed = composeOutfit([...currentItemIds, targetItemId], { modelId });
  const replacedItemIds = composed.slotConflicts
    .filter((c) => c.byItemId === targetItemId)
    .map((c) => c.replacedItemId);

  return {
    ok: true,
    nextItemIds: composed.activeItemIds,
    replacedItemIds,
  };
}

export function applyWardrobeSetToOutfit(
  currentItemIds: string[],
  setItem: WardrobeSetV1,
  modelId: MannequinModelId
): {
  ok: boolean;
  nextItemIds: string[];
  replacedItemIds: string[];
  error?: string;
} {
  const compat = isSetCompatible(setItem, modelId);
  if (!compat.compatible) {
    return {
      ok: false,
      nextItemIds: currentItemIds,
      replacedItemIds: [],
      error: compat.reason,
    };
  }

  const composed = composeOutfit([...currentItemIds, ...setItem.itemIds], { modelId });
  const replacedItemIds = composed.slotConflicts.map((c) => c.replacedItemId);

  return {
    ok: true,
    nextItemIds: composed.activeItemIds,
    replacedItemIds: Array.from(new Set(replacedItemIds)),
  };
}


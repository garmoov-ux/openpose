import {
  OutfitCompositionV1,
  WardrobeSlot,
} from '@/types/wardrobe';
import { MannequinModelId } from '@/types';
import {
  WARDROBE_ITEMS,
} from './catalog';
import { isCompatible } from './compatibility';
import { composeOutfit } from './composition';

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function buildRandomWardrobeComposition(
  currentComp: OutfitCompositionV1,
  modelId: MannequinModelId,
  options?: { slotFilter?: WardrobeSlot; styleFilter?: string }
): OutfitCompositionV1 | null {
  const compatItems = WARDROBE_ITEMS.filter(
    (i) =>
      (i.renderSupport === 'asset' || i.renderSupport === 'procedural') &&
      isCompatible(i, modelId).compatible &&
      (!options?.styleFilter || options.styleFilter === 'all' || i.styleTags.includes(options.styleFilter))
  );
  if (compatItems.length === 0) return null;

  if (options?.slotFilter) {
    const slotCandidates = compatItems.filter((i) => i.slots.includes(options.slotFilter!));
    if (slotCandidates.length === 0) return null;
    const picked = pickRandom(slotCandidates);
    const composed = composeOutfit([...currentComp.itemIds, picked.id], { modelId });
    return {
      ...currentComp,
      itemIds: composed.activeItemIds,
    };
  }

  const tops = compatItems.filter((i) => i.slots.includes('base_top'));
  const bottoms = compatItems.filter((i) => i.slots.includes('base_bottom'));
  const shoes = compatItems.filter((i) => i.slots.includes('footwear'));
  const socks = compatItems.filter((i) => i.slots.includes('socks'));

  const chosen: string[] = [];
  if (tops.length > 0) chosen.push(pickRandom(tops).id);
  if (bottoms.length > 0) chosen.push(pickRandom(bottoms).id);
  if (socks.length > 0 && Math.random() > 0.35) chosen.push(pickRandom(socks).id);
  if (shoes.length > 0) chosen.push(pickRandom(shoes).id);

  const composed = composeOutfit(chosen, { modelId });
  return {
    schemaVersion: 1,
    actorId: currentComp.actorId,
    itemIds: composed.activeItemIds,
  };
}


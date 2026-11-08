import topsRaw from '@/data/wardrobe/items/tops.json';
import bottomsAndDressesRaw from '@/data/wardrobe/items/bottomsAndDresses.json';
import innerwearAndLoungeRaw from '@/data/wardrobe/items/innerwearAndLounge.json';
import swimwearRaw from '@/data/wardrobe/items/swimwear.json';
import footwearAndLegwearRaw from '@/data/wardrobe/items/footwearAndLegwear.json';
import adultExtendedApparelRaw from '@/data/wardrobe/items/adultExtendedApparel.json';
import accessoriesAndYouthRaw from '@/data/wardrobe/items/accessoriesAndYouth.json';
import setsRaw from '@/data/wardrobe/items/sets.json';
import {
  WardrobeItemV1,
  WardrobeSetV1,
  WardrobeSlot,
} from '@/types/wardrobe';

export const WARDROBE_ITEMS: WardrobeItemV1[] = [
  ...(topsRaw as WardrobeItemV1[]),
  ...(bottomsAndDressesRaw as WardrobeItemV1[]),
  ...(innerwearAndLoungeRaw as WardrobeItemV1[]),
  ...(swimwearRaw as WardrobeItemV1[]),
  ...(footwearAndLegwearRaw as WardrobeItemV1[]),
  ...(adultExtendedApparelRaw as WardrobeItemV1[]),
  ...(accessoriesAndYouthRaw as WardrobeItemV1[]),
];

export const WARDROBE_SETS: WardrobeSetV1[] = setsRaw as WardrobeSetV1[];

const ITEM_MAP = new Map<string, WardrobeItemV1>(
  WARDROBE_ITEMS.map((item) => [item.id, item])
);

const SET_MAP = new Map<string, WardrobeSetV1>(
  WARDROBE_SETS.map((setItem) => [setItem.id, setItem])
);

export function getWardrobeItemById(id: string): WardrobeItemV1 | undefined {
  return ITEM_MAP.get(id);
}

export function getWardrobeSetById(id: string): WardrobeSetV1 | undefined {
  return SET_MAP.get(id);
}

export function getWardrobeItemsBySlot(slot: WardrobeSlot): WardrobeItemV1[] {
  return WARDROBE_ITEMS.filter((item) => item.slots.includes(slot));
}

export interface CatalogValidationReport {
  valid: boolean;
  totalItems: number;
  totalSets: number;
  totalCandidates: number;
  verifiedRenderCount: number;
  errors: string[];
}

export function validateWardrobeCatalog(): CatalogValidationReport {
  const errors: string[] = [];
  const seenItemIds = new Set<string>();
  const seenSetIds = new Set<string>();

  for (const item of WARDROBE_ITEMS) {
    if (!item.id || typeof item.id !== 'string') {
      errors.push('품목 ID가 누락되었습니다.');
      continue;
    }
    if (seenItemIds.has(item.id)) {
      errors.push(`중복된 품목 ID가 발견되었습니다: ${item.id}`);
    }
    seenItemIds.add(item.id);

    if (item.version !== 1) {
      errors.push(`${item.id}: version은 1이어야 합니다.`);
    }
    if (!item.nameKo || !item.nameEn) {
      errors.push(`${item.id}: 한글/영문 표시명이 누락되었습니다.`);
    }
    if (!Array.isArray(item.slots) || item.slots.length === 0) {
      errors.push(`${item.id}: 최소 1개 이상의 슬롯이 지정되어야 합니다.`);
    }
    if (!Array.isArray(item.compatibleProfileIds) || item.compatibleProfileIds.length === 0) {
      errors.push(`${item.id}: compatibleProfileIds가 비어 있습니다.`);
    }
    if (!Array.isArray(item.promptTags) || item.promptTags.length === 0) {
      errors.push(`${item.id}: promptTags가 비어 있습니다.`);
    } else {
      for (const tag of item.promptTags) {
        if (/Picture 1|image1|bare breasts|hairless/i.test(tag)) {
          errors.push(`${item.id}: promptTags에 금지된 신체/레퍼런스 문구가 포함되어 있습니다.`);
        }
      }
    }
  }

  for (const setItem of WARDROBE_SETS) {
    if (!setItem.id || typeof setItem.id !== 'string') {
      errors.push('세트 ID가 누락되었습니다.');
      continue;
    }
    if (seenSetIds.has(setItem.id)) {
      errors.push(`중복된 세트 ID가 발견되었습니다: ${setItem.id}`);
    }
    seenSetIds.add(setItem.id);

    if (!Array.isArray(setItem.itemIds) || setItem.itemIds.length === 0) {
      errors.push(`${setItem.id}: 세트의 itemIds가 비어 있습니다.`);
      continue;
    }

    let hasAdultMember = false;
    for (const refId of setItem.itemIds) {
      const target = ITEM_MAP.get(refId);
      if (!target) {
        errors.push(`${setItem.id}: 존재하지 않는 단품 ID를 참조합니다 (${refId}).`);
      } else if (target.adultOnly) {
        hasAdultMember = true;
      }
    }

    if (hasAdultMember && !setItem.adultOnly) {
      errors.push(`${setItem.id}: 성인 전용 단품을 포함한 세트는 adultOnly: true여야 합니다.`);
    }
  }

  const verifiedRenderCount = WARDROBE_ITEMS.filter(
    (i) => i.renderSupport === 'asset' || i.renderSupport === 'procedural'
  ).length;

  return {
    valid: errors.length === 0,
    totalItems: WARDROBE_ITEMS.length,
    totalSets: WARDROBE_SETS.length,
    totalCandidates: WARDROBE_ITEMS.length + WARDROBE_SETS.length,
    verifiedRenderCount,
    errors,
  };
}

// 레거시 selectedOutfitId(1~200, 1001~1034) 및 footwearId를 신규 카탈로그 itemIds로 변환하는 매핑 헬퍼
export function mapLegacyOutfitToWardrobeItems(
  legacyOutfitId: number,
  legacyFootwearId?: string
): { itemIds: string[]; warning?: string } {
  const resultIds: string[] = [];
  let warning: string | undefined;

  if (legacyOutfitId > 0) {
    if (legacyOutfitId <= 30) {
      resultIds.push('inner-top.lace-bralette', 'inner-f.lace-thong');
    } else if (legacyOutfitId <= 60) {
      resultIds.push('swim-f.triangle-top', 'swim-f.side-tie-bottom');
    } else if (legacyOutfitId <= 80) {
      resultIds.push('acc.chain-necklace', 'acc.simple-bracelet');
    } else if (legacyOutfitId <= 100) {
      resultIds.push('adult-top.crop-tee', 'bottom.denim-shorts');
    } else if (legacyOutfitId <= 125) {
      resultIds.push('top.oxford-shirt');
    } else if (legacyOutfitId <= 150) {
      resultIds.push('bottom.jogger-pants');
    } else if (legacyOutfitId <= 175) {
      resultIds.push('dress.bodycon-midi');
    } else if (legacyOutfitId <= 200) {
      resultIds.push('adult-top.satin-camisole', 'bottom.satin-midi-skirt');
    } else if (legacyOutfitId === 1001 || legacyOutfitId === 1002) {
      resultIds.push('top.crew-tee', 'bottom.straight-jeans');
    } else if (legacyOutfitId >= 1011 && legacyOutfitId <= 1018) {
      resultIds.push('top.oxford-shirt', 'bottom.tailored-slacks');
    } else if (legacyOutfitId >= 1021 && legacyOutfitId <= 1026) {
      resultIds.push('youth.cotton-tee', 'youth.straight-pants');
    } else if (legacyOutfitId >= 1031 && legacyOutfitId <= 1034) {
      resultIds.push('top.fine-knit', 'bottom.tailored-slacks');
    } else {
      warning = `레거시 의상 ID(${legacyOutfitId})에 대응하는 품목을 찾지 못했습니다.`;
    }
  }

  if (legacyFootwearId && legacyFootwearId !== 'bare_feet' && legacyFootwearId !== 'foot_bare' && legacyFootwearId !== 'none') {
    if (legacyFootwearId.includes('stiletto') || legacyFootwearId.includes('heel')) {
      resultIds.push('shoe.stiletto-heel');
    } else if (legacyFootwearId.includes('boots')) {
      resultIds.push('shoe.knee-boot');
    } else if (legacyFootwearId.includes('fishnet')) {
      resultIds.push('legwear.fishnet-tights');
    } else if (legacyFootwearId.includes('stocking') || legacyFootwearId.includes('garter')) {
      resultIds.push('legwear.thigh-high-stockings');
    } else if (legacyFootwearId.includes('socks')) {
      resultIds.push('sock.knee-cotton');
    } else if (legacyFootwearId.includes('sandal')) {
      resultIds.push('shoe.strappy-sandal');
    } else {
      resultIds.push('shoe.canvas-sneaker');
    }
  }

  return { itemIds: Array.from(new Set(resultIds)), warning };
}


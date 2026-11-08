import { MannequinModelId } from '@/types';
import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { OutfitCompositionV1, OutfitItemOverride, WardrobeSlot } from '@/types/wardrobe';
import { RoomPropInstance } from '@/data/themesSolo/roomPropCatalog';
import { BodyAccessoryCategoryKey } from '@/core/mannequin/bodyAccessoryMeshes';
import { getOutfitsForMannequin } from '@/core/mannequin/mannequinProfiles';
import {
  getWardrobeSetById,
  mapLegacyOutfitToWardrobeItems,
  WARDROBE_ITEMS,
} from '@/core/mannequin/wardrobe/catalog';
import {
  isCompatible,
  ModelMigrationHoldItem,
  partitionItemsByModelCompatibility,
} from '@/core/mannequin/wardrobe/compatibility';
import {
  applyWardrobeSetToOutfit,
  composeOutfit,
  toggleItemInOutfit,
} from '@/core/mannequin/wardrobe/composition';

export type BodyProfileMode = 'mannequin' | 'free' | 'petite155';
export type TransformTargetKind = 'none' | 'main' | 'partner' | 'prop';

export interface ObjectTransform3D {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface SavedAppearanceBackup {
  outfitId: number;
  wardrobeItemIds: string[];
  wardrobeOverrides?: Record<string, OutfitItemOverride>;
  nailColorId: string;
  footwearId: string;
  neckItemId: string;
  wristItemId: string;
  legItemId: string;
  toyItemId: string;
}

export interface ThemeSoloState {
  selectedThemeId: SoloThemeId;
  selectedEnvIndex: number;
  selectedLightIndex: number;
  selectedOutfitId: number;
  selectedOutfitCategory: OutfitCategory | 'all';
  selectedPostureId: number;
  selectedShotPrefixIndex: number;
  isWildcardMode: boolean;
  isPetite155: boolean;
  bodyProfileMode: BodyProfileMode;
  includeMasterRef: boolean;
  showThemeProps: boolean;
  showPartnerGuide: boolean;
  activeSidebarTab: 'theme' | 'outfit' | 'props' | 'prompt';
  activePoseAccordion: 'couple' | 'solo';
  activeCouplePresetId: string | null;
  isBareMannequinMode: boolean;
  savedAppearanceBackup: SavedAppearanceBackup | null;
  outfitCompositions: Record<'main' | 'partner', OutfitCompositionV1>;
  heldItemsByActor: Record<'main' | 'partner', ModelMigrationHoldItem[]>;
  lastWardrobeMessage: string | null;
  roomProps: RoomPropInstance[];
  selectedPropUid: string | null;
  activeTransformTarget: TransformTargetKind;
  mainMannequinTransform: ObjectTransform3D;
  partnerMannequinTransform: ObjectTransform3D;
  nailColorId: string;
  footwearId: string;
  neckItemId: string;
  wristItemId: string;
  legItemId: string;
  toyItemId: string;
  customAccessoryColors: Partial<Record<BodyAccessoryCategoryKey, number>>;
  extraSceneProps: string[];

  setSelectedThemeId: (id: SoloThemeId) => void;
  setSelectedEnvIndex: (idx: number) => void;
  setSelectedLightIndex: (idx: number) => void;
  setSelectedOutfitId: (id: number, modelIdOverride?: MannequinModelId) => void;
  setSelectedOutfitCategory: (cat: OutfitCategory | 'all') => void;
  setSelectedPostureId: (id: number) => void;
  setSelectedShotPrefixIndex: (idx: number) => void;
  setIsWildcardMode: (wildcard: boolean) => void;
  setIsPetite155: (petite: boolean) => void;
  setBodyProfileMode: (mode: BodyProfileMode) => void;
  setIncludeMasterRef: (include: boolean) => void;
  setShowThemeProps: (show: boolean) => void;
  setShowPartnerGuide: (show: boolean) => void;
  setActiveSidebarTab: (tab: 'theme' | 'outfit' | 'props' | 'prompt') => void;
  setActivePoseAccordion: (mode: 'couple' | 'solo') => void;
  setActiveCouplePresetId: (id: string | null) => void;
  toggleBareMannequinMode: () => void;

  toggleWardrobeItem: (itemId: string, actorId?: 'main' | 'partner', modelIdOverride?: MannequinModelId) => { ok: boolean; error?: string };
  applyWardrobeSet: (setId: string, actorId?: 'main' | 'partner', modelIdOverride?: MannequinModelId) => { ok: boolean; error?: string };
  setWardrobeItemOverride: (itemId: string, override: OutfitItemOverride | null, actorId?: 'main' | 'partner') => void;
  clearWardrobeItems: (actorId?: 'main' | 'partner') => void;
  setOutfitCompositionDirect: (comp: OutfitCompositionV1, actorId?: 'main' | 'partner') => void;
  syncWardrobeForModelChange: (newModelId: MannequinModelId, actorId?: 'main' | 'partner') => ModelMigrationHoldItem[];
  rollRandomWardrobeCoordi: (options?: { slotFilter?: WardrobeSlot; styleFilter?: string; modelIdOverride?: MannequinModelId }) => void;
  migrateLegacyAppearanceToWardrobe: (outfitId: number, footwearId?: string, modelIdOverride?: MannequinModelId) => void;

  setSelectedPropUid: (uid: string | null) => void;
  setActiveTransformTarget: (target: TransformTargetKind) => void;
  setMainMannequinTransform: (patch: Partial<ObjectTransform3D>) => void;
  setPartnerMannequinTransform: (patch: Partial<ObjectTransform3D>) => void;
  resetMannequinTransform: (target: 'main' | 'partner') => void;
  addRoomProp: (propId: string) => void;
  toggleRoomProp: (uid: string) => void;
  removeRoomProp: (uid: string) => void;
  updateRoomPropTransform: (uid: string, position: [number, number, number], rotationY: number, scale?: number, rotationX?: number, rotationZ?: number) => void;
  updateRoomPropColor: (uid: string, colorHex?: number) => void;
  clearAllRoomProps: () => void;

  setNailColorId: (id: string) => void;
  setFootwearId: (id: string) => void;
  setNeckItemId: (id: string) => void;
  setWristItemId: (id: string) => void;
  setLegItemId: (id: string) => void;
  setToyItemId: (id: string) => void;
  setCustomAccessoryColor: (category: BodyAccessoryCategoryKey, colorHex?: number) => void;
  toggleExtraSceneProp: (id: string) => void;
  clearAllAccessories: () => void;
  rollRandomAll: () => void;
  rollRandomOutfit: () => void;
  rollRandomEnvironment: () => void;
  rollRandomPosture: () => void;
  rollRandomAccessories: () => void;
}

export function isAllBareAppearance(s: {
  selectedOutfitId: number;
  wardrobeCount: number;
  nailColorId: string;
  footwearId: string;
  neckItemId: string;
  wristItemId: string;
  legItemId: string;
  toyItemId: string;
}): boolean {
  return (
    s.selectedOutfitId === 0 &&
    s.wardrobeCount === 0 &&
    s.nailColorId === 'none' &&
    s.footwearId === 'bare_feet' &&
    s.neckItemId === 'none' &&
    s.wristItemId === 'none' &&
    s.legItemId === 'none' &&
    s.toyItemId === 'toy_none'
  );
}

export function getRestoredCompatibleItems(
  backup: SavedAppearanceBackup | null,
  modelId: MannequinModelId
): string[] {
  const srcIds = backup?.wardrobeItemIds?.length
    ? backup.wardrobeItemIds
    : ['top.crew-tee', 'bottom.straight-jeans', 'shoe.canvas-sneaker'];
  return srcIds.filter((id) => {
    const it = WARDROBE_ITEMS.find((x) => x.id === id);
    return it ? isCompatible(it, modelId).compatible : false;
  });
}

export function computeToggleWardrobeResult(
  currentComp: OutfitCompositionV1,
  itemId: string,
  actorId: 'main' | 'partner',
  modelId: MannequinModelId
): {
  ok: boolean;
  error?: string;
  nextComp?: OutfitCompositionV1;
  message?: string | null;
} {
  const res = toggleItemInOutfit(currentComp.itemIds, itemId, modelId);
  if (!res.ok) {
    return { ok: false, error: res.error || '착장할 수 없는 품목입니다.' };
  }
  const nextComp: OutfitCompositionV1 = {
    schemaVersion: 1,
    actorId,
    itemIds: res.nextItemIds,
    ...(currentComp.overrides ? { overrides: { ...currentComp.overrides } } : {}),
  };
  const message =
    res.replacedItemIds.length > 0
      ? `슬롯 교체: ${res.replacedItemIds.join(', ')} -> ${itemId}`
      : null;
  return { ok: true, nextComp, message };
}

export function computeApplyWardrobeSetResult(
  currentComp: OutfitCompositionV1,
  setId: string,
  actorId: 'main' | 'partner',
  modelId: MannequinModelId
): {
  ok: boolean;
  error?: string;
  nextComp?: OutfitCompositionV1;
  message?: string;
} {
  const setItem = getWardrobeSetById(setId);
  if (!setItem) {
    return { ok: false, error: `존재하지 않는 코디 세트입니다: ${setId}` };
  }
  const res = applyWardrobeSetToOutfit(currentComp.itemIds, setItem, modelId);
  if (!res.ok) {
    return { ok: false, error: res.error || '코디 세트를 적용할 수 없습니다.' };
  }
  const nextComp: OutfitCompositionV1 = {
    schemaVersion: 1,
    actorId,
    itemIds: res.nextItemIds,
    ...(currentComp.overrides ? { overrides: { ...currentComp.overrides } } : {}),
  };
  return {
    ok: true,
    nextComp,
    message: `${setItem.nameKo} 적용 완료 (${res.nextItemIds.length}개 품목)`,
  };
}

export function computeModelWardrobeSync(
  currentComp: OutfitCompositionV1,
  selectedOutfitId: number,
  newModelId: MannequinModelId,
  actorId: 'main' | 'partner'
): {
  nextLegacyId: number;
  nextComp: OutfitCompositionV1;
  heldItems: ModelMigrationHoldItem[];
  message: string | null;
} {
  const part = partitionItemsByModelCompatibility(currentComp.itemIds, newModelId);
  let nextLegacyId = selectedOutfitId;
  if (
    actorId === 'main' &&
    nextLegacyId > 0 &&
    !getOutfitsForMannequin(newModelId).some((o) => o.id === nextLegacyId)
  ) {
    nextLegacyId = 0;
  }
  return {
    nextLegacyId,
    nextComp: { ...currentComp, itemIds: part.compatibleItemIds },
    heldItems: part.heldItems,
    message:
      part.heldItems.length > 0
        ? `모델 변경으로 호환되지 않는 품목 ${part.heldItems.length}개가 보류되었습니다.`
        : null,
  };
}

export function computeLegacyMigration(
  outfitId: number,
  footwearId: string | undefined,
  modelId: MannequinModelId
): {
  nextComp: OutfitCompositionV1;
  message: string;
} {
  const mapped = mapLegacyOutfitToWardrobeItems(outfitId, footwearId);
  const composed = composeOutfit(mapped.itemIds, { modelId });
  return {
    nextComp: {
      schemaVersion: 1,
      actorId: 'main',
      itemIds: composed.activeItemIds,
    },
    message: mapped.warning || '기존 착장을 부위별 의상 조합으로 마이그레이션했습니다.',
  };
}

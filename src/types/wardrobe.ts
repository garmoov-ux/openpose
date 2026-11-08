export type WardrobeSlot =
  | 'underwear_top'
  | 'underwear_bottom'
  | 'base_top'
  | 'base_bottom'
  | 'one_piece'
  | 'outerwear'
  | 'swim_top'
  | 'swim_bottom'
  | 'swim_one_piece'
  | 'swim_cover'
  | 'legwear'
  | 'socks'
  | 'footwear'
  | 'neck_accessory'
  | 'wrist_accessory'
  | 'head_accessory'
  | 'face_accessory'
  | 'bag';

export type WardrobeLayer = 'underwear' | 'base' | 'outer' | 'accessory';

export type WardrobeFitProfile =
  | 'adult-feminine'
  | 'adult-masculine'
  | 'adult-unisex'
  | 'youth';

export type WardrobeRenderSupport =
  | 'asset'
  | 'procedural'
  | 'color-only'
  | 'prompt-only';

export type WardrobeGeometryKey =
  | 'fitted-top'
  | 'loose-top'
  | 'trousers'
  | 'shorts-skirt'
  | 'dress'
  | 'outer'
  | 'hosiery'
  | 'shoe'
  | 'swim-top'
  | 'swim-bottom'
  | 'swim-one-piece'
  | 'underwear'
  | 'accessory';

export type ShoeForm =
  | 'sneaker'
  | 'flat'
  | 'loafer'
  | 'derby'
  | 'oxford'
  | 'monk'
  | 'pump'
  | 'sandal'
  | 'mule'
  | 'boot'
  | 'slipper';

export interface WardrobeMaterialSpec {
  role: string;
  color: string;
  fabric: string;
}

export interface WardrobeShapeSpec {
  neckline?: string;
  sleeve?: string;
  rise?: string;
  legCut?: string;
  heelHeightCm?: number;
  shaftHeightCm?: number;
  soleThicknessCm?: number;
  toeShape?: string;
  closure?: string;
  shoeForm?: ShoeForm;
  leftRightPair?: boolean;
  opacity?: 'opaque' | 'semi-sheer' | 'sheer';
  closureState?: 'closed' | 'open';
  strapLayout?: string;
  cutoutLayout?: string;
}

export interface WardrobeItemV1 {
  id: string;
  version: 1;
  nameKo: string;
  nameEn: string;
  category: string;
  slots: WardrobeSlot[];
  layer: WardrobeLayer;
  styleTags: string[];
  compatibleProfileIds: string[];
  adultOnly: boolean;
  fitProfile: WardrobeFitProfile;
  coverage: string[];
  geometryKey: WardrobeGeometryKey;
  renderSupport: WardrobeRenderSupport;
  materials: WardrobeMaterialSpec[];
  promptTags: string[];
  iconKey: string;
  sortOrder: number;
  shape?: WardrobeShapeSpec;
}

export interface OutfitItemOverride {
  color?: string;
  material?: string;
  closureState?: 'closed' | 'open';
}

export interface OutfitCompositionV1 {
  schemaVersion: 1;
  actorId: string;
  itemIds: string[];
  overrides?: Record<string, OutfitItemOverride>;
}

export interface WardrobeSetV1 {
  id: string;
  nameKo: string;
  itemIds: string[];
  adultOnly: boolean;
  styleTags: string[];
}

export interface ComposedOutfitResult {
  activeItems: WardrobeItemV1[];
  activeItemIds: string[];
  slotConflicts: Array<{ slot: WardrobeSlot; replacedItemId: string; byItemId: string }>;
  hiddenRegionsByItem: Record<string, string[]>;
  partiallyHiddenItemIds: string[];
  fullyHiddenItemIds: string[];
  visibleItems: WardrobeItemV1[];
  renderSupportSummary: Record<WardrobeRenderSupport, number>;
  promptOnlyItemIds: string[];
  warnings: string[];
}

export type MannequinAgeClass = 'adult' | 'minor' | 'unknown';


export type SoloThemeId =
  | 'alley_downtown_street'
  | 'backstage_fitting_lounge'
  | 'extreme_high_tension_special'
  | 'glasshouse_sunroom_lounge'
  | 'gothic_rococo_salon'
  | 'house_indoor_room'
  | 'infinity_pool_yacht'
  | 'luxury_hotel_penthouse'
  | 'maldives_beach_villa'
  | 'onsen_ryokan_spa'
  | 'pilates_mirror_studio'
  | 'private_ceo_office'
  | 'private_jet_cabin'
  | 'private_stretch_limousine'
  | 'vip_aroma_oil_spa'
  | 'vip_gym_sauna_suite';

export type OutfitCategory =
  | 'lingerie'
  | 'micro_bikini'
  | 'body_jewelry'
  | 'crop_hotpants'
  | 'top_only'
  | 'topless_bottom'
  | 'costume_dress'
  | 'color_contrast';

export interface OutfitItem {
  id: number;
  category: OutfitCategory;
  categoryLabelKo: string;
  nameEn: string;
  nameKo: string;
  text: string;
}

export interface PostureCoreItem {
  id: number;
  labelKo: string;
  coreText: string;
  defaultShotPrefix: string;
  targetHeight: number; // Three.js 카메라 타겟 Y (0.5m/0.6m)
  cameraDistance: number; // Three.js 카메라 거리 (Z)
  fov: number; // 85mm 환산 FOV
  group: 'seated_m' | 'standing' | 'lounging' | 'furniture_straddle' | 'v_split' | 'deep_m_squat' | 'rear_arch' | 'bolster_ride' | 'high_leg';
}

export interface SoloThemeInfo {
  id: SoloThemeId;
  titleEn: string;
  titleKo: string;
  descriptionKo: string;
  environments: string[];
  lightings: string[];
}

export interface PromptBuildConfig {
  themeId: SoloThemeId;
  envIndex: number | 'random';
  lightIndex: number | 'random';
  outfitId: number | 'random' | 'wildcard_all' | 'wildcard_category';
  outfitCategory?: OutfitCategory;
  postureId: number;
  shotPrefixIndex: number;
  isWildcardMode: boolean;
}

import { create } from 'zustand';
import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import {
  NAIL_ITEMS,
  FOOTWEAR_ITEMS,
  NECK_ITEMS,
  WRIST_ITEMS,
  LEG_ITEMS,
  EXTRA_SCENE_PROPS,
} from '@/data/themesSolo/accessoriesAndPropsData';

export type BodyProfileMode = 'mannequin' | 'free' | 'petite155';

interface ThemeSoloState {
  selectedThemeId: SoloThemeId;
  selectedEnvIndex: number;
  selectedLightIndex: number;
  selectedOutfitId: number; // 0 = 기본 무의상(Bare Mannequin)
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

  // 신체 부위별 착용 아이템 및 추가 3D 공간 소품
  nailColorId: string;
  footwearId: string;
  neckItemId: string;
  wristItemId: string;
  legItemId: string;
  extraSceneProps: string[];

  // Actions
  setSelectedThemeId: (id: SoloThemeId) => void;
  setSelectedEnvIndex: (idx: number) => void;
  setSelectedLightIndex: (idx: number) => void;
  setSelectedOutfitId: (id: number) => void;
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

  setNailColorId: (id: string) => void;
  setFootwearId: (id: string) => void;
  setNeckItemId: (id: string) => void;
  setWristItemId: (id: string) => void;
  setLegItemId: (id: string) => void;
  toggleExtraSceneProp: (id: string) => void;
  clearAllAccessories: () => void;

  // Random Roll Actions
  rollRandomAll: () => void;
  rollRandomOutfit: () => void;
  rollRandomEnvironment: () => void;
  rollRandomPosture: () => void;
  rollRandomAccessories: () => void;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useThemeSoloStore = create<ThemeSoloState>((set, get) => ({
  selectedThemeId: 'alley_downtown_street',
  selectedEnvIndex: 0,
  selectedLightIndex: 0,
  selectedOutfitId: 0, // 초기 상태는 의상을 입지 않은 기본 마네킹 상태
  selectedOutfitCategory: 'all',
  selectedPostureId: 1,
  selectedShotPrefixIndex: 0,
  isWildcardMode: false,
  isPetite155: false,
  bodyProfileMode: 'mannequin',
  includeMasterRef: false,
  showThemeProps: true,
  showPartnerGuide: false,
  activeSidebarTab: 'theme',

  nailColorId: 'none',
  footwearId: 'bare_feet',
  neckItemId: 'none',
  wristItemId: 'none',
  legItemId: 'none',
  extraSceneProps: [],

  setSelectedThemeId: (id) =>
    set({
      selectedThemeId: id,
      selectedEnvIndex: 0,
      selectedLightIndex: 0,
    }),
  setSelectedEnvIndex: (idx) => set({ selectedEnvIndex: idx }),
  setSelectedLightIndex: (idx) => set({ selectedLightIndex: idx }),
  setSelectedOutfitId: (id) => set({ selectedOutfitId: id }),
  setSelectedOutfitCategory: (cat) => set({ selectedOutfitCategory: cat }),
  setSelectedPostureId: (id) => set({ selectedPostureId: id }),
  setSelectedShotPrefixIndex: (idx) => set({ selectedShotPrefixIndex: idx }),
  setIsWildcardMode: (isWildcardMode) => set({ isWildcardMode }),
  setIsPetite155: (isPetite155) =>
    set({
      isPetite155,
      bodyProfileMode: isPetite155 ? 'petite155' : 'mannequin',
    }),
  setBodyProfileMode: (bodyProfileMode) =>
    set({
      bodyProfileMode,
      isPetite155: bodyProfileMode === 'petite155',
    }),
  setIncludeMasterRef: (includeMasterRef) => set({ includeMasterRef }),
  setShowThemeProps: (showThemeProps) => set({ showThemeProps }),
  setShowPartnerGuide: (showPartnerGuide) => set({ showPartnerGuide }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),

  setNailColorId: (nailColorId) => set({ nailColorId }),
  setFootwearId: (footwearId) => set({ footwearId }),
  setNeckItemId: (neckItemId) => set({ neckItemId }),
  setWristItemId: (wristItemId) => set({ wristItemId }),
  setLegItemId: (legItemId) => set({ legItemId }),
  toggleExtraSceneProp: (id) =>
    set((state) => ({
      extraSceneProps: state.extraSceneProps.includes(id)
        ? state.extraSceneProps.filter((p) => p !== id)
        : [...state.extraSceneProps, id],
    })),
  clearAllAccessories: () =>
    set({
      nailColorId: 'none',
      footwearId: 'bare_feet',
      neckItemId: 'none',
      wristItemId: 'none',
      legItemId: 'none',
      extraSceneProps: [],
    }),

  // 테마 + 세부장소(380종) + 조명 + 의상 + 바디 아이템 + 추가 소품 + 자세 전체 랜덤 세트
  rollRandomAll: () => {
    const themeKeys = Object.keys(THEMES_DATA) as SoloThemeId[];
    const randTheme = pickRandom(themeKeys);
    const theme = THEMES_DATA[randTheme];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    const randLight = Math.floor(Math.random() * theme.lightings.length);
    const randOutfit = Math.floor(Math.random() * OUTFITS_DATA.length) + 1;
    const randPosture = Math.floor(Math.random() * POSTURES_DATA.length) + 1;
    const prop1 = pickRandom(EXTRA_SCENE_PROPS).id;
    const prop2 = pickRandom(EXTRA_SCENE_PROPS).id;

    set({
      selectedThemeId: randTheme,
      selectedEnvIndex: randEnv,
      selectedLightIndex: randLight,
      selectedOutfitId: randOutfit,
      selectedPostureId: randPosture,
      nailColorId: pickRandom(NAIL_ITEMS.slice(1)).id,
      footwearId: pickRandom(FOOTWEAR_ITEMS).id,
      neckItemId: pickRandom(NECK_ITEMS.slice(1)).id,
      wristItemId: pickRandom(WRIST_ITEMS.slice(1)).id,
      legItemId: pickRandom(LEG_ITEMS.slice(1)).id,
      extraSceneProps: Array.from(new Set([prop1, prop2])),
      showThemeProps: true,
    });
  },

  rollRandomOutfit: () => {
    const { selectedOutfitCategory } = get();
    let candidates = OUTFITS_DATA;
    if (selectedOutfitCategory !== 'all') {
      candidates = OUTFITS_DATA.filter((o) => o.category === selectedOutfitCategory);
    }
    const rand = pickRandom(candidates);
    if (rand) set({ selectedOutfitId: rand.id });
  },

  // 16개 대분류 테마 + 380개 세부 장소 + 조명 + 소품 모두 무작위 변경
  rollRandomEnvironment: () => {
    const themeKeys = Object.keys(THEMES_DATA) as SoloThemeId[];
    const randTheme = pickRandom(themeKeys);
    const theme = THEMES_DATA[randTheme];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    const randLight = Math.floor(Math.random() * theme.lightings.length);
    const randProp = pickRandom(EXTRA_SCENE_PROPS).id;
    set({
      selectedThemeId: randTheme,
      selectedEnvIndex: randEnv,
      selectedLightIndex: randLight,
      extraSceneProps: [randProp],
      showThemeProps: true,
    });
  },

  rollRandomPosture: () => {
    const rand = Math.floor(Math.random() * POSTURES_DATA.length) + 1;
    set({ selectedPostureId: rand });
  },

  rollRandomAccessories: () => {
    const prop1 = pickRandom(EXTRA_SCENE_PROPS).id;
    const prop2 = pickRandom(EXTRA_SCENE_PROPS).id;
    set({
      nailColorId: pickRandom(NAIL_ITEMS.slice(1)).id,
      footwearId: pickRandom(FOOTWEAR_ITEMS.slice(1)).id,
      neckItemId: pickRandom(NECK_ITEMS.slice(1)).id,
      wristItemId: pickRandom(WRIST_ITEMS.slice(1)).id,
      legItemId: pickRandom(LEG_ITEMS.slice(1)).id,
      extraSceneProps: Array.from(new Set([prop1, prop2])),
    });
  },
}));

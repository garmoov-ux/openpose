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
import {
  RoomPropInstance,
  ROOM_PROP_CATALOG,
  findRoomPropById,
  getDefaultRoomPropsForTheme,
} from '@/data/themesSolo/roomPropCatalog';

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

  // 사각 방(Room) 내부에 개별 배치된 가구·소품 배열 및 선택된 사물 UID
  roomProps: RoomPropInstance[];
  selectedPropUid: string | null;

  // 신체 부위별 착용 아이템 및 호환 배열
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

  // 방 내부 가구·소품 개별 추가/제거/숨김/위치조절 액션
  setSelectedPropUid: (uid: string | null) => void;
  addRoomProp: (propId: string) => void;
  toggleRoomProp: (uid: string) => void;
  removeRoomProp: (uid: string) => void;
  updateRoomPropTransform: (
    uid: string,
    position: [number, number, number],
    rotationY: number,
    scale?: number
  ) => void;
  resetRoomPropsToDefault: () => void;
  clearAllRoomProps: () => void;

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
  selectedThemeId: 'house_indoor_room',
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

  roomProps: getDefaultRoomPropsForTheme('house_indoor_room', 0),
  selectedPropUid: null,

  nailColorId: 'nail_none',
  footwearId: 'foot_bare',
  neckItemId: 'neck_none',
  wristItemId: 'wrist_none',
  legItemId: 'leg_none',
  extraSceneProps: [],

  setSelectedThemeId: (id) =>
    set({
      selectedThemeId: id,
      selectedEnvIndex: 0,
      selectedLightIndex: 0,
      roomProps: getDefaultRoomPropsForTheme(id, 0),
      selectedPropUid: null,
    }),
  setSelectedEnvIndex: (idx) =>
    set((s) => ({
      selectedEnvIndex: idx,
      roomProps: getDefaultRoomPropsForTheme(s.selectedThemeId, idx),
      selectedPropUid: null,
    })),
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

  setSelectedPropUid: (selectedPropUid) => set({ selectedPropUid }),
  addRoomProp: (propId) =>
    set((state) => {
      const existingHidden = state.roomProps.find((p) => p.propId === propId && !p.visible);
      if (existingHidden) {
        return {
          roomProps: state.roomProps.map((p) =>
            p.uid === existingHidden.uid ? { ...p, visible: true } : p
          ),
          selectedPropUid: existingHidden.uid,
          showThemeProps: true,
        };
      }
      const meta = findRoomPropById(propId);
      const count = state.roomProps.filter((p) => p.propId === propId).length;
      const offset = count * 0.28;
      const basePos = meta ? meta.defaultPos : ([0, 0, -0.4] as [number, number, number]);
      const newUid = `${propId}_${Date.now() % 10000}`;
      const newInst: RoomPropInstance = {
        uid: newUid,
        propId,
        visible: true,
        position: [basePos[0] + offset, basePos[1], basePos[2]],
        rotationY: meta?.defaultRotY || 0,
        scale: 1.0,
      };
      return {
        roomProps: [...state.roomProps, newInst],
        selectedPropUid: newUid,
        showThemeProps: true,
      };
    }),
  toggleRoomProp: (uid) =>
    set((state) => ({
      roomProps: state.roomProps.map((p) => (p.uid === uid ? { ...p, visible: !p.visible } : p)),
      selectedPropUid: state.selectedPropUid === uid ? null : state.selectedPropUid,
    })),
  removeRoomProp: (uid) =>
    set((state) => ({
      roomProps: state.roomProps.filter((p) => p.uid !== uid),
      selectedPropUid: state.selectedPropUid === uid ? null : state.selectedPropUid,
    })),
  updateRoomPropTransform: (uid, position, rotationY, scale) =>
    set((state) => ({
      roomProps: state.roomProps.map((p) =>
        p.uid === uid
          ? { ...p, position, rotationY, ...(scale !== undefined ? { scale } : {}) }
          : p
      ),
    })),
  resetRoomPropsToDefault: () =>
    set((state) => ({
      roomProps: getDefaultRoomPropsForTheme(state.selectedThemeId, state.selectedEnvIndex),
      selectedPropUid: null,
    })),
  clearAllRoomProps: () => set({ roomProps: [], selectedPropUid: null }),

  setNailColorId: (nailColorId) => set({ nailColorId }),
  setFootwearId: (footwearId) => set({ footwearId }),
  setNeckItemId: (neckItemId) => set({ neckItemId }),
  setWristItemId: (wristItemId) => set({ wristItemId }),
  setLegItemId: (legItemId) => set({ legItemId }),
  toggleExtraSceneProp: (id) => {
    const { roomProps, addRoomProp, removeRoomProp } = get();
    const existing = roomProps.find((p) => p.propId === id && p.visible);
    if (existing) {
      removeRoomProp(existing.uid);
    } else {
      addRoomProp(id);
    }
  },
  clearAllAccessories: () =>
    set({
      nailColorId: 'nail_none',
      footwearId: 'foot_bare',
      neckItemId: 'neck_none',
      wristItemId: 'wrist_none',
      legItemId: 'leg_none',
      extraSceneProps: [],
    }),

  rollRandomAll: () => {
    const themeKeys = Object.keys(THEMES_DATA) as SoloThemeId[];
    const randTheme = pickRandom(themeKeys);
    const theme = THEMES_DATA[randTheme];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    const randLight = Math.floor(Math.random() * theme.lightings.length);
    const randOutfit = Math.floor(Math.random() * OUTFITS_DATA.length) + 1;
    const randPosture = Math.floor(Math.random() * POSTURES_DATA.length) + 1;
    const baseRoomProps = getDefaultRoomPropsForTheme(randTheme, randEnv);
    const extraCatalogItem = pickRandom(ROOM_PROP_CATALOG);
    if (!baseRoomProps.some((p) => p.propId === extraCatalogItem.id)) {
      baseRoomProps.push({
        uid: `${extraCatalogItem.id}_rand`,
        propId: extraCatalogItem.id,
        visible: true,
        position: [...extraCatalogItem.defaultPos],
        rotationY: extraCatalogItem.defaultRotY || 0,
        scale: 1.0,
      });
    }

    set({
      selectedThemeId: randTheme,
      selectedEnvIndex: randEnv,
      selectedLightIndex: randLight,
      selectedOutfitId: randOutfit,
      selectedPostureId: randPosture,
      roomProps: baseRoomProps,
      selectedPropUid: null,
      nailColorId: pickRandom(NAIL_ITEMS.slice(1)).id,
      footwearId: pickRandom(FOOTWEAR_ITEMS).id,
      neckItemId: pickRandom(NECK_ITEMS.slice(1)).id,
      wristItemId: pickRandom(WRIST_ITEMS.slice(1)).id,
      legItemId: pickRandom(LEG_ITEMS.slice(1)).id,
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

  rollRandomEnvironment: () => {
    const themeKeys = Object.keys(THEMES_DATA) as SoloThemeId[];
    const randTheme = pickRandom(themeKeys);
    const theme = THEMES_DATA[randTheme];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    const randLight = Math.floor(Math.random() * theme.lightings.length);
    set({
      selectedThemeId: randTheme,
      selectedEnvIndex: randEnv,
      selectedLightIndex: randLight,
      roomProps: getDefaultRoomPropsForTheme(randTheme, randEnv),
      selectedPropUid: null,
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

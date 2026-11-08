import { create } from 'zustand';
import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { NAIL_ITEMS, FOOTWEAR_ITEMS, NECK_ITEMS, WRIST_ITEMS, LEG_ITEMS, TOY_SPECIAL_ITEMS, EXTRA_SCENE_PROPS } from '@/data/themesSolo/accessoriesAndPropsData';
import { RoomPropInstance, findRoomPropById } from '@/data/themesSolo/roomPropCatalog';
import { BodyAccessoryCategoryKey } from '@/core/mannequin/bodyAccessoryMeshes';

export type BodyProfileMode = 'mannequin' | 'free' | 'petite155';
export type TransformTargetKind = 'none' | 'main' | 'partner' | 'prop';

export interface ObjectTransform3D {
  position: [number, number, number];
  rotation: [number, number, number]; // radians [rx, ry, rz]
  scale: number;
}

interface SavedAppearanceBackup {
  outfitId: number;
  nailColorId: string;
  footwearId: string;
  neckItemId: string;
  wristItemId: string;
  legItemId: string;
  toyItemId: string;
}

interface ThemeSoloState {
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
  setActivePoseAccordion: (mode: 'couple' | 'solo') => void;
  setActiveCouplePresetId: (id: string | null) => void;
  toggleBareMannequinMode: () => void;

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

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const DEFAULT_MANNEQUIN_TRANSFORM: ObjectTransform3D = { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.0 };

const isAllBare = (s: {
  selectedOutfitId: number; nailColorId: string; footwearId: string; neckItemId: string; wristItemId: string; legItemId: string; toyItemId: string;
}) =>
  s.selectedOutfitId === 0 && s.nailColorId === 'none' && s.footwearId === 'bare_feet' &&
  s.neckItemId === 'none' && s.wristItemId === 'none' && s.legItemId === 'none' && s.toyItemId === 'toy_none';

export const useThemeSoloStore = create<ThemeSoloState>((set, get) => ({
  selectedThemeId: 'house_indoor_room',
  selectedEnvIndex: 0,
  selectedLightIndex: 0,
  selectedOutfitId: 0,
  selectedOutfitCategory: 'all',
  selectedPostureId: 1,
  selectedShotPrefixIndex: 0,
  isWildcardMode: false,
  isPetite155: false,
  bodyProfileMode: 'mannequin',
  includeMasterRef: false,
  showThemeProps: true,
  showPartnerGuide: false,
  activeSidebarTab: 'outfit',
  activePoseAccordion: 'couple',
  activeCouplePresetId: 'couple-back-hug',
  isBareMannequinMode: true,
  savedAppearanceBackup: null,
  roomProps: [],
  selectedPropUid: null,
  activeTransformTarget: 'none',
  mainMannequinTransform: { ...DEFAULT_MANNEQUIN_TRANSFORM },
  partnerMannequinTransform: { position: [0.02, 0, -0.26], rotation: [0, 0, 0], scale: 1.0 },
  nailColorId: 'none',
  footwearId: 'bare_feet',
  neckItemId: 'none',
  wristItemId: 'none',
  legItemId: 'none',
  toyItemId: 'toy_none',
  customAccessoryColors: {},
  extraSceneProps: [],

  setSelectedThemeId: (id) => set({ selectedThemeId: id, selectedEnvIndex: 0, selectedLightIndex: 0 }),
  setSelectedEnvIndex: (idx) => set({ selectedEnvIndex: idx }),
  setSelectedLightIndex: (idx) => set({ selectedLightIndex: idx }),
  setSelectedOutfitId: (id) => set((s) => ({ selectedOutfitId: id, isBareMannequinMode: isAllBare({ ...s, selectedOutfitId: id }) })),
  setSelectedOutfitCategory: (cat) => set({ selectedOutfitCategory: cat }),
  setSelectedPostureId: (id) =>
    set({ selectedPostureId: id, activePoseAccordion: 'solo', activeCouplePresetId: null, showPartnerGuide: false }),
  setSelectedShotPrefixIndex: (idx) => set({ selectedShotPrefixIndex: idx }),
  setIsWildcardMode: (isWildcardMode) => set({ isWildcardMode }),
  setIsPetite155: (isPetite155) => set({ isPetite155, bodyProfileMode: isPetite155 ? 'petite155' : 'mannequin' }),
  setBodyProfileMode: (bodyProfileMode) => set({ bodyProfileMode, isPetite155: bodyProfileMode === 'petite155' }),
  setIncludeMasterRef: (includeMasterRef) => set({ includeMasterRef }),
  setShowThemeProps: (showThemeProps) => set({ showThemeProps }),
  setShowPartnerGuide: (showPartnerGuide) => set({ showPartnerGuide }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setActivePoseAccordion: (mode) => set({ activePoseAccordion: mode, showPartnerGuide: mode === 'couple' }),
  setActiveCouplePresetId: (id) =>
    set({ activeCouplePresetId: id, activePoseAccordion: id ? 'couple' : 'solo', showPartnerGuide: Boolean(id) }),

  toggleBareMannequinMode: () =>
    set((s) => {
      if (!s.isBareMannequinMode) {
        const hasAny = !isAllBare(s);
        return {
          isBareMannequinMode: true,
          savedAppearanceBackup: hasAny
            ? {
                outfitId: s.selectedOutfitId, nailColorId: s.nailColorId, footwearId: s.footwearId,
                neckItemId: s.neckItemId, wristItemId: s.wristItemId, legItemId: s.legItemId, toyItemId: s.toyItemId,
              }
            : s.savedAppearanceBackup,
          selectedOutfitId: 0, nailColorId: 'none', footwearId: 'bare_feet',
          neckItemId: 'none', wristItemId: 'none', legItemId: 'none', toyItemId: 'toy_none',
        };
      }
      const b = s.savedAppearanceBackup;
      return {
        isBareMannequinMode: false,
        selectedOutfitId: b ? b.outfitId : 1, nailColorId: b ? b.nailColorId : 'ruby_red',
        footwearId: b ? b.footwearId : 'black_stiletto_mules', neckItemId: b ? b.neckItemId : 'black_velvet_choker',
        wristItemId: b ? b.wristItemId : 'none', legItemId: b ? b.legItemId : 'black_lace_garter', toyItemId: b ? b.toyItemId : 'toy_none',
      };
    }),

  setSelectedPropUid: (selectedPropUid) =>
    set((s) => ({
      selectedPropUid,
      activeTransformTarget: selectedPropUid ? 'prop' : s.activeTransformTarget === 'prop' ? 'none' : s.activeTransformTarget,
    })),
  setActiveTransformTarget: (activeTransformTarget) =>
    set((s) => ({ activeTransformTarget, selectedPropUid: activeTransformTarget === 'prop' ? s.selectedPropUid : null })),
  setMainMannequinTransform: (patch) => set((s) => ({ mainMannequinTransform: { ...s.mainMannequinTransform, ...patch } })),
  setPartnerMannequinTransform: (patch) => set((s) => ({ partnerMannequinTransform: { ...s.partnerMannequinTransform, ...patch } })),
  resetMannequinTransform: (target) =>
    set(() =>
      target === 'main'
        ? { mainMannequinTransform: { ...DEFAULT_MANNEQUIN_TRANSFORM } }
        : { partnerMannequinTransform: { position: [0.02, 0, -0.26], rotation: [0, 0, 0], scale: 1.0 } }
    ),

  addRoomProp: (propId) =>
    set((s) => {
      const hidden = s.roomProps.find((p) => p.propId === propId && !p.visible);
      if (hidden) {
        return {
          roomProps: s.roomProps.map((p) => (p.uid === hidden.uid ? { ...p, visible: true } : p)),
          selectedPropUid: hidden.uid, activeTransformTarget: 'prop', showThemeProps: true,
        };
      }
      const meta = findRoomPropById(propId);
      const offset = s.roomProps.filter((p) => p.propId === propId).length * 0.28;
      const basePos = meta ? meta.defaultPos : ([0, 0, -0.4] as [number, number, number]);
      const newUid = `${propId}_${Date.now() % 10000}`;
      return {
        roomProps: [
          ...s.roomProps,
          { uid: newUid, propId, visible: true, position: [basePos[0] + offset, basePos[1], basePos[2]], rotationX: 0, rotationY: meta?.defaultRotY || 0, rotationZ: 0, scale: 1.0 },
        ],
        selectedPropUid: newUid, activeTransformTarget: 'prop', showThemeProps: true,
      };
    }),
  toggleRoomProp: (uid) =>
    set((s) => ({
      roomProps: s.roomProps.map((p) => (p.uid === uid ? { ...p, visible: !p.visible } : p)),
      selectedPropUid: s.selectedPropUid === uid ? null : s.selectedPropUid,
    })),
  removeRoomProp: (uid) =>
    set((s) => ({
      roomProps: s.roomProps.filter((p) => p.uid !== uid),
      selectedPropUid: s.selectedPropUid === uid ? null : s.selectedPropUid,
    })),
  updateRoomPropTransform: (uid, position, rotationY, scale, rotationX, rotationZ) =>
    set((s) => ({
      roomProps: s.roomProps.map((p) =>
        p.uid === uid
          ? { ...p, position, rotationY, ...(scale !== undefined ? { scale } : {}), ...(rotationX !== undefined ? { rotationX } : {}), ...(rotationZ !== undefined ? { rotationZ } : {}) }
          : p
      ),
    })),
  updateRoomPropColor: (uid, colorHex) =>
    set((s) => ({ roomProps: s.roomProps.map((p) => (p.uid === uid ? { ...p, customColorHex: colorHex } : p)) })),
  clearAllRoomProps: () => set({ roomProps: [], selectedPropUid: null, activeTransformTarget: 'none' }),

  setNailColorId: (nailColorId) => set((s) => ({ nailColorId, isBareMannequinMode: isAllBare({ ...s, nailColorId }) })),
  setFootwearId: (footwearId) => set((s) => ({ footwearId, isBareMannequinMode: isAllBare({ ...s, footwearId }) })),
  setNeckItemId: (neckItemId) => set((s) => ({ neckItemId, isBareMannequinMode: isAllBare({ ...s, neckItemId }) })),
  setWristItemId: (wristItemId) => set((s) => ({ wristItemId, isBareMannequinMode: isAllBare({ ...s, wristItemId }) })),
  setLegItemId: (legItemId) => set((s) => ({ legItemId, isBareMannequinMode: isAllBare({ ...s, legItemId }) })),
  setToyItemId: (toyItemId) => set((s) => ({ toyItemId, isBareMannequinMode: isAllBare({ ...s, toyItemId }) })),
  setCustomAccessoryColor: (category, colorHex) =>
    set((s) => ({ customAccessoryColors: { ...s.customAccessoryColors, [category]: colorHex } })),
  toggleExtraSceneProp: (id) => {
    const { roomProps, addRoomProp, removeRoomProp } = get();
    const existing = roomProps.find((p) => p.propId === id && p.visible);
    if (existing) removeRoomProp(existing.uid);
    else addRoomProp(id);
  },
  clearAllAccessories: () =>
    set((s) => ({
      nailColorId: 'none', footwearId: 'bare_feet', neckItemId: 'none', wristItemId: 'none',
      legItemId: 'none', toyItemId: 'toy_none', customAccessoryColors: {}, extraSceneProps: [],
      isBareMannequinMode: s.selectedOutfitId === 0,
    })),

  rollRandomAll: () => {
    set({
      selectedOutfitId: Math.floor(Math.random() * OUTFITS_DATA.length) + 1,
      selectedPostureId: Math.floor(Math.random() * POSTURES_DATA.length) + 1,
      isBareMannequinMode: false,
      nailColorId: pickRandom(NAIL_ITEMS.slice(1)).id,
      footwearId: pickRandom(FOOTWEAR_ITEMS.slice(1)).id,
      neckItemId: pickRandom(NECK_ITEMS.slice(1)).id,
      wristItemId: pickRandom(WRIST_ITEMS.slice(1)).id,
      legItemId: pickRandom(LEG_ITEMS.slice(1)).id,
    });
  },
  rollRandomOutfit: () => {
    const { selectedOutfitCategory } = get();
    const list = selectedOutfitCategory === 'all' ? OUTFITS_DATA : OUTFITS_DATA.filter((o) => o.category === selectedOutfitCategory);
    const rand = pickRandom(list);
    if (rand) set({ selectedOutfitId: rand.id, isBareMannequinMode: false });
  },
  rollRandomEnvironment: () => {
    const randTheme = pickRandom(Object.keys(THEMES_DATA) as SoloThemeId[]);
    const theme = THEMES_DATA[randTheme];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    set({ selectedThemeId: randTheme, selectedEnvIndex: randEnv, selectedLightIndex: Math.floor(Math.random() * theme.lightings.length) });
  },
  rollRandomPosture: () =>
    set({ selectedPostureId: Math.floor(Math.random() * POSTURES_DATA.length) + 1, activePoseAccordion: 'solo', showPartnerGuide: false }),
  rollRandomAccessories: () =>
    set({
      isBareMannequinMode: false,
      nailColorId: pickRandom(NAIL_ITEMS.slice(1)).id, footwearId: pickRandom(FOOTWEAR_ITEMS.slice(1)).id,
      neckItemId: pickRandom(NECK_ITEMS.slice(1)).id, wristItemId: pickRandom(WRIST_ITEMS.slice(1)).id,
      legItemId: pickRandom(LEG_ITEMS.slice(1)).id, toyItemId: pickRandom(TOY_SPECIAL_ITEMS).id,
      extraSceneProps: Array.from(new Set([pickRandom(EXTRA_SCENE_PROPS).id, pickRandom(EXTRA_SCENE_PROPS).id])),
    }),
}));

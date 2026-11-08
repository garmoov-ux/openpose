import { create } from 'zustand';
import { SoloThemeId } from '@/types/themeSolo';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import {
  NAIL_ITEMS, NECK_ITEMS, WRIST_ITEMS, LEG_ITEMS, TOY_SPECIAL_ITEMS, EXTRA_SCENE_PROPS,
} from '@/data/themesSolo/accessoriesAndPropsData';
import { findRoomPropById } from '@/data/themesSolo/roomPropCatalog';
import { getOutfitsForMannequin } from '@/core/mannequin/mannequinProfiles';
import { buildRandomWardrobeComposition } from '@/core/mannequin/wardrobe/randomizer';
import {
  BodyProfileMode, computeApplyWardrobeSetResult, computeLegacyMigration, computeModelWardrobeSync,
  computeToggleWardrobeResult, getRestoredCompatibleItems, isAllBareAppearance,
  ObjectTransform3D, SavedAppearanceBackup, ThemeSoloState, TransformTargetKind,
} from './themeSoloWardrobeHelpers';
import { useEditorStore } from './useEditorStore';

export type { BodyProfileMode, TransformTargetKind, ObjectTransform3D, SavedAppearanceBackup };

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const DEFAULT_MANNEQUIN_TRANSFORM: ObjectTransform3D = { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.0 };

export const useThemeSoloStore = create<ThemeSoloState>((set, get) => ({
  selectedThemeId: 'house_indoor_room', selectedEnvIndex: 0, selectedLightIndex: 0,
  selectedOutfitId: 0, selectedOutfitCategory: 'all', selectedPostureId: 1, selectedShotPrefixIndex: 0,
  isWildcardMode: false, isPetite155: false, bodyProfileMode: 'mannequin',
  includeMasterRef: false, showThemeProps: true, showPartnerGuide: false,
  activeSidebarTab: 'outfit', activePoseAccordion: 'solo', activeCouplePresetId: null,
  isBareMannequinMode: true, savedAppearanceBackup: null,
  outfitCompositions: {
    main: { schemaVersion: 1, actorId: 'main', itemIds: [] },
    partner: { schemaVersion: 1, actorId: 'partner', itemIds: [] },
  },
  heldItemsByActor: { main: [], partner: [] },
  lastWardrobeMessage: null, roomProps: [], selectedPropUid: null, activeTransformTarget: 'none',
  mainMannequinTransform: { ...DEFAULT_MANNEQUIN_TRANSFORM },
  partnerMannequinTransform: { position: [0.02, 0, -0.26], rotation: [0, 0, 0], scale: 1.0 },
  nailColorId: 'none', footwearId: 'bare_feet', neckItemId: 'none', wristItemId: 'none', legItemId: 'none', toyItemId: 'toy_none',
  customAccessoryColors: {}, extraSceneProps: [],

  setSelectedThemeId: (id) => set({ selectedThemeId: id, selectedEnvIndex: 0, selectedLightIndex: 0 }),
  setSelectedEnvIndex: (idx) => set({ selectedEnvIndex: idx }),
  setSelectedLightIndex: (idx) => set({ selectedLightIndex: idx }),
  setSelectedOutfitId: (id, modelIdOverride) => {
    const modelId = modelIdOverride || useEditorStore.getState().currentModelId;
    if (id > 0 && !getOutfitsForMannequin(modelId).some((o) => o.id === id)) {
      set({ lastWardrobeMessage: `현재 모델(${modelId})과 호환되지 않는 레거시 의상(#${id})입니다.` });
      return;
    }
    set((s) => ({ selectedOutfitId: id, isBareMannequinMode: isAllBareAppearance({ ...s, selectedOutfitId: id, wardrobeCount: s.outfitCompositions.main.itemIds.length }) }));
  },
  setSelectedOutfitCategory: (cat) => set({ selectedOutfitCategory: cat }),
  setSelectedPostureId: (id) => set({ selectedPostureId: id, activePoseAccordion: 'solo', activeCouplePresetId: null, showPartnerGuide: false }),
  setSelectedShotPrefixIndex: (idx) => set({ selectedShotPrefixIndex: idx }),
  setIsWildcardMode: (isWildcardMode) => set({ isWildcardMode }),
  setIsPetite155: (isPetite155) => set({ isPetite155, bodyProfileMode: isPetite155 ? 'petite155' : 'mannequin' }),
  setBodyProfileMode: (bodyProfileMode) => set({ bodyProfileMode, isPetite155: bodyProfileMode === 'petite155' }),
  setIncludeMasterRef: (includeMasterRef) => set({ includeMasterRef }),
  setShowThemeProps: (showThemeProps) => set({ showThemeProps }),
  setShowPartnerGuide: (showPartnerGuide) => set({ showPartnerGuide }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setActivePoseAccordion: (mode) => set({ activePoseAccordion: mode, showPartnerGuide: mode === 'couple' }),
  setActiveCouplePresetId: (id) => set({ activeCouplePresetId: id, activePoseAccordion: id ? 'couple' : 'solo', showPartnerGuide: Boolean(id) }),

  toggleBareMannequinMode: () =>
    set((s) => {
      const mainComp = s.outfitCompositions.main;
      if (!s.isBareMannequinMode) {
        const hasAny = !isAllBareAppearance({ ...s, wardrobeCount: mainComp.itemIds.length });
        return {
          isBareMannequinMode: true,
          savedAppearanceBackup: hasAny
            ? {
                outfitId: s.selectedOutfitId, wardrobeItemIds: [...mainComp.itemIds],
                wardrobeOverrides: mainComp.overrides ? { ...mainComp.overrides } : undefined,
                nailColorId: s.nailColorId, footwearId: s.footwearId, neckItemId: s.neckItemId,
                wristItemId: s.wristItemId, legItemId: s.legItemId, toyItemId: s.toyItemId,
              }
            : s.savedAppearanceBackup,
          selectedOutfitId: 0,
          outfitCompositions: { ...s.outfitCompositions, main: { schemaVersion: 1, actorId: 'main', itemIds: [] } },
          nailColorId: 'none', footwearId: 'bare_feet', neckItemId: 'none', wristItemId: 'none', legItemId: 'none', toyItemId: 'toy_none',
        };
      }
      const b = s.savedAppearanceBackup;
      const defaultItems = getRestoredCompatibleItems(b, useEditorStore.getState().currentModelId);
      return {
        isBareMannequinMode: false, selectedOutfitId: b ? b.outfitId : 0,
        outfitCompositions: { ...s.outfitCompositions, main: { schemaVersion: 1, actorId: 'main', itemIds: defaultItems, overrides: b?.wardrobeOverrides } },
        nailColorId: b ? b.nailColorId : 'none', footwearId: b ? b.footwearId : 'bare_feet',
        neckItemId: b ? b.neckItemId : 'none', wristItemId: b ? b.wristItemId : 'none',
        legItemId: b ? b.legItemId : 'none', toyItemId: b ? b.toyItemId : 'toy_none',
      };
    }),

  toggleWardrobeItem: (itemId, actorId = 'main', modelIdOverride) => {
    const modelId = modelIdOverride || useEditorStore.getState().currentModelId;
    const res = computeToggleWardrobeResult(get().outfitCompositions[actorId], itemId, actorId, modelId);
    if (!res.ok || !res.nextComp) {
      set({ lastWardrobeMessage: res.error || '착장할 수 없는 품목입니다.' });
      return { ok: false, error: res.error };
    }
    const nextComp = res.nextComp;
    set((s) => ({
      selectedOutfitId: actorId === 'main' && nextComp.itemIds.length > 0 ? 0 : s.selectedOutfitId,
      outfitCompositions: { ...s.outfitCompositions, [actorId]: nextComp },
      lastWardrobeMessage: res.message ?? null,
      isBareMannequinMode: isAllBareAppearance({
        ...s,
        selectedOutfitId: actorId === 'main' && nextComp.itemIds.length > 0 ? 0 : s.selectedOutfitId,
        wardrobeCount: actorId === 'main' ? nextComp.itemIds.length : s.outfitCompositions.main.itemIds.length,
      }),
    }));
    return { ok: true };
  },

  applyWardrobeSet: (setId, actorId = 'main', modelIdOverride) => {
    const modelId = modelIdOverride || useEditorStore.getState().currentModelId;
    const res = computeApplyWardrobeSetResult(get().outfitCompositions[actorId], setId, actorId, modelId);
    if (!res.ok || !res.nextComp) {
      set({ lastWardrobeMessage: res.error || '코디 세트를 적용할 수 없습니다.' });
      return { ok: false, error: res.error };
    }
    const nextComp = res.nextComp;
    set((s) => ({
      selectedOutfitId: actorId === 'main' ? 0 : s.selectedOutfitId,
      outfitCompositions: { ...s.outfitCompositions, [actorId]: nextComp },
      lastWardrobeMessage: res.message || null,
      isBareMannequinMode: false,
    }));
    return { ok: true };
  },

  setWardrobeItemOverride: (itemId, override, actorId = 'main') =>
    set((s) => {
      const current = s.outfitCompositions[actorId];
      const nextOverrides = { ...(current.overrides || {}) };
      if (!override) delete nextOverrides[itemId];
      else nextOverrides[itemId] = { ...(nextOverrides[itemId] || {}), ...override };
      return {
        outfitCompositions: { ...s.outfitCompositions, [actorId]: { ...current, overrides: Object.keys(nextOverrides).length > 0 ? nextOverrides : undefined } },
      };
    }),

  clearWardrobeItems: (actorId = 'main') =>
    set((s) => ({
      selectedOutfitId: actorId === 'main' ? 0 : s.selectedOutfitId,
      outfitCompositions: { ...s.outfitCompositions, [actorId]: { schemaVersion: 1, actorId, itemIds: [] } },
      heldItemsByActor: { ...s.heldItemsByActor, [actorId]: [] },
      lastWardrobeMessage: null,
      isBareMannequinMode: isAllBareAppearance({ ...s, selectedOutfitId: actorId === 'main' ? 0 : s.selectedOutfitId, wardrobeCount: 0 }),
    })),

  setOutfitCompositionDirect: (comp, actorId = 'main') =>
    set((s) => ({
      outfitCompositions: { ...s.outfitCompositions, [actorId]: comp },
      isBareMannequinMode: isAllBareAppearance({ ...s, wardrobeCount: actorId === 'main' ? comp.itemIds.length : s.outfitCompositions.main.itemIds.length }),
    })),

  syncWardrobeForModelChange: (newModelId, actorId = 'main') => {
    const s = get();
    const res = computeModelWardrobeSync(s.outfitCompositions[actorId], s.selectedOutfitId, newModelId, actorId);
    set({
      selectedOutfitId: res.nextLegacyId,
      outfitCompositions: { ...s.outfitCompositions, [actorId]: res.nextComp },
      heldItemsByActor: { ...s.heldItemsByActor, [actorId]: res.heldItems },
      lastWardrobeMessage: res.message,
    });
    return res.heldItems;
  },

  rollRandomWardrobeCoordi: (options) => {
    const modelId = options?.modelIdOverride || useEditorStore.getState().currentModelId;
    const nextComp = buildRandomWardrobeComposition(get().outfitCompositions.main, modelId, options);
    if (!nextComp) return;
    set((s) => ({ selectedOutfitId: 0, isBareMannequinMode: false, outfitCompositions: { ...s.outfitCompositions, main: nextComp } }));
  },

  migrateLegacyAppearanceToWardrobe: (outfitId, footwearId, modelIdOverride) => {
    const modelId = modelIdOverride || useEditorStore.getState().currentModelId;
    const res = computeLegacyMigration(outfitId, footwearId, modelId);
    set((s) => ({
      selectedOutfitId: 0, footwearId: 'bare_feet', isBareMannequinMode: res.nextComp.itemIds.length === 0,
      outfitCompositions: { ...s.outfitCompositions, main: res.nextComp }, lastWardrobeMessage: res.message,
    }));
  },

  setSelectedPropUid: (selectedPropUid) =>
    set((s) => ({ selectedPropUid, activeTransformTarget: selectedPropUid ? 'prop' : s.activeTransformTarget === 'prop' ? 'none' : s.activeTransformTarget })),
  setActiveTransformTarget: (activeTransformTarget) =>
    set((s) => ({ activeTransformTarget, selectedPropUid: activeTransformTarget === 'prop' ? s.selectedPropUid : null })),
  setMainMannequinTransform: (patch) => set((s) => ({ mainMannequinTransform: { ...s.mainMannequinTransform, ...patch } })),
  setPartnerMannequinTransform: (patch) => set((s) => ({ partnerMannequinTransform: { ...s.partnerMannequinTransform, ...patch } })),
  resetMannequinTransform: (target) =>
    set(() => target === 'main' ? { mainMannequinTransform: { ...DEFAULT_MANNEQUIN_TRANSFORM } } : { partnerMannequinTransform: { position: [0.02, 0, -0.26], rotation: [0, 0, 0], scale: 1.0 } }),

  addRoomProp: (propId) =>
    set((s) => {
      const hidden = s.roomProps.find((p) => p.propId === propId && !p.visible);
      if (hidden) return { roomProps: s.roomProps.map((p) => (p.uid === hidden.uid ? { ...p, visible: true } : p)), selectedPropUid: hidden.uid, activeTransformTarget: 'prop', showThemeProps: true };
      const meta = findRoomPropById(propId);
      const offset = s.roomProps.filter((p) => p.propId === propId).length * 0.28;
      const basePos = meta ? meta.defaultPos : ([0, 0, -0.4] as [number, number, number]);
      const newUid = `${propId}_${Date.now() % 10000}`;
      return {
        roomProps: [...s.roomProps, { uid: newUid, propId, visible: true, position: [basePos[0] + offset, basePos[1], basePos[2]], rotationX: 0, rotationY: meta?.defaultRotY || 0, rotationZ: 0, scale: 1.0 }],
        selectedPropUid: newUid, activeTransformTarget: 'prop', showThemeProps: true,
      };
    }),
  toggleRoomProp: (uid) =>
    set((s) => ({ roomProps: s.roomProps.map((p) => (p.uid === uid ? { ...p, visible: !p.visible } : p)), selectedPropUid: s.selectedPropUid === uid ? null : s.selectedPropUid })),
  removeRoomProp: (uid) =>
    set((s) => ({ roomProps: s.roomProps.filter((p) => p.uid !== uid), selectedPropUid: s.selectedPropUid === uid ? null : s.selectedPropUid })),
  updateRoomPropTransform: (uid, position, rotationY, scale, rotationX, rotationZ) =>
    set((s) => ({
      roomProps: s.roomProps.map((p) =>
        p.uid === uid ? { ...p, position, rotationY, ...(scale !== undefined ? { scale } : {}), ...(rotationX !== undefined ? { rotationX } : {}), ...(rotationZ !== undefined ? { rotationZ } : {}) } : p
      ),
    })),
  updateRoomPropColor: (uid, colorHex) => set((s) => ({ roomProps: s.roomProps.map((p) => (p.uid === uid ? { ...p, customColorHex: colorHex } : p)) })),
  clearAllRoomProps: () => set({ roomProps: [], selectedPropUid: null, activeTransformTarget: 'none' }),

  setNailColorId: (nailColorId) => set((s) => ({ nailColorId, isBareMannequinMode: isAllBareAppearance({ ...s, nailColorId, wardrobeCount: s.outfitCompositions.main.itemIds.length }) })),
  setFootwearId: (footwearId) => set((s) => ({ footwearId, isBareMannequinMode: isAllBareAppearance({ ...s, footwearId, wardrobeCount: s.outfitCompositions.main.itemIds.length }) })),
  setNeckItemId: (neckItemId) => set((s) => ({ neckItemId, isBareMannequinMode: isAllBareAppearance({ ...s, neckItemId, wardrobeCount: s.outfitCompositions.main.itemIds.length }) })),
  setWristItemId: (wristItemId) => set((s) => ({ wristItemId, isBareMannequinMode: isAllBareAppearance({ ...s, wristItemId, wardrobeCount: s.outfitCompositions.main.itemIds.length }) })),
  setLegItemId: (legItemId) => set((s) => ({ legItemId, isBareMannequinMode: isAllBareAppearance({ ...s, legItemId, wardrobeCount: s.outfitCompositions.main.itemIds.length }) })),
  setToyItemId: (toyItemId) => set((s) => ({ toyItemId, isBareMannequinMode: isAllBareAppearance({ ...s, toyItemId, wardrobeCount: s.outfitCompositions.main.itemIds.length }) })),
  setCustomAccessoryColor: (category, colorHex) => set((s) => ({ customAccessoryColors: { ...s.customAccessoryColors, [category]: colorHex } })),
  toggleExtraSceneProp: (id) => {
    const { roomProps, addRoomProp, removeRoomProp } = get();
    const existing = roomProps.find((p) => p.propId === id && p.visible);
    if (existing) removeRoomProp(existing.uid);
    else addRoomProp(id);
  },
  clearAllAccessories: () =>
    set((s) => ({
      nailColorId: 'none', footwearId: 'bare_feet', neckItemId: 'none', wristItemId: 'none', legItemId: 'none', toyItemId: 'toy_none',
      customAccessoryColors: {}, extraSceneProps: [],
      isBareMannequinMode: s.selectedOutfitId === 0 && s.outfitCompositions.main.itemIds.length === 0,
    })),

  rollRandomAll: () => {
    get().rollRandomWardrobeCoordi();
    const modelId = useEditorStore.getState().currentModelId;
    const isMinor = modelId.startsWith('teen_') || modelId.startsWith('child_');
    set({
      selectedPostureId: isMinor ? 1 : Math.floor(Math.random() * POSTURES_DATA.length) + 1, isBareMannequinMode: false,
      nailColorId: isMinor ? 'none' : pickRandom(NAIL_ITEMS.slice(1)).id, neckItemId: isMinor ? 'none' : pickRandom(NECK_ITEMS.slice(1)).id,
      wristItemId: isMinor ? 'none' : pickRandom(WRIST_ITEMS.slice(1)).id, legItemId: isMinor ? 'none' : pickRandom(LEG_ITEMS.slice(1)).id,
    });
  },
  rollRandomOutfit: () => get().rollRandomWardrobeCoordi(),
  rollRandomEnvironment: () => {
    const randTheme = pickRandom(Object.keys(THEMES_DATA) as SoloThemeId[]);
    const theme = THEMES_DATA[randTheme];
    set({ selectedThemeId: randTheme, selectedEnvIndex: Math.floor(Math.random() * theme.environments.length), selectedLightIndex: Math.floor(Math.random() * theme.lightings.length) });
  },
  rollRandomPosture: () => set({ selectedPostureId: Math.floor(Math.random() * POSTURES_DATA.length) + 1, activePoseAccordion: 'solo', showPartnerGuide: false }),
  rollRandomAccessories: () => {
    const modelId = useEditorStore.getState().currentModelId;
    const isMinor = modelId.startsWith('teen_') || modelId.startsWith('child_');
    get().rollRandomWardrobeCoordi({ slotFilter: 'footwear', modelIdOverride: modelId });
    if (isMinor) return;
    set({
      isBareMannequinMode: false,
      nailColorId: pickRandom(NAIL_ITEMS.slice(1)).id, neckItemId: pickRandom(NECK_ITEMS.slice(1)).id,
      wristItemId: pickRandom(WRIST_ITEMS.slice(1)).id, legItemId: pickRandom(LEG_ITEMS.slice(1)).id,
      toyItemId: pickRandom(TOY_SPECIAL_ITEMS).id,
      extraSceneProps: Array.from(new Set([pickRandom(EXTRA_SCENE_PROPS).id, pickRandom(EXTRA_SCENE_PROPS).id])),
    });
  },
}));

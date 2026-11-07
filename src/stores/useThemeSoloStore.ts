import { create } from 'zustand';
import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';

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
  activeSidebarTab: 'theme' | 'outfit' | 'prompt';

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
  setActiveSidebarTab: (tab: 'theme' | 'outfit' | 'prompt') => void;

  // Random Roll Actions
  rollRandomAll: () => void;
  rollRandomOutfit: () => void;
  rollRandomEnvironment: () => void;
  rollRandomPosture: () => void;
}

export const useThemeSoloStore = create<ThemeSoloState>((set, get) => ({
  selectedThemeId: 'alley_downtown_street',
  selectedEnvIndex: 0,
  selectedLightIndex: 0,
  selectedOutfitId: 1,
  selectedOutfitCategory: 'all',
  selectedPostureId: 1,
  selectedShotPrefixIndex: 0,
  isWildcardMode: false,
  isPetite155: true,
  activeSidebarTab: 'theme',

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
  setIsPetite155: (isPetite155) => set({ isPetite155 }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),

  rollRandomAll: () => {
    const themeKeys = Object.keys(THEMES_DATA) as SoloThemeId[];
    const randTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const theme = THEMES_DATA[randTheme];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    const randLight = Math.floor(Math.random() * theme.lightings.length);
    const randOutfit = Math.floor(Math.random() * OUTFITS_DATA.length) + 1;
    const randPosture = Math.floor(Math.random() * POSTURES_DATA.length) + 1;

    set({
      selectedThemeId: randTheme,
      selectedEnvIndex: randEnv,
      selectedLightIndex: randLight,
      selectedOutfitId: randOutfit,
      selectedPostureId: randPosture,
    });
  },

  rollRandomOutfit: () => {
    const { selectedOutfitCategory } = get();
    let candidates = OUTFITS_DATA;
    if (selectedOutfitCategory !== 'all') {
      candidates = OUTFITS_DATA.filter((o) => o.category === selectedOutfitCategory);
    }
    const rand = candidates[Math.floor(Math.random() * candidates.length)];
    if (rand) set({ selectedOutfitId: rand.id });
  },

  rollRandomEnvironment: () => {
    const { selectedThemeId } = get();
    const theme = THEMES_DATA[selectedThemeId];
    const randEnv = Math.floor(Math.random() * theme.environments.length);
    const randLight = Math.floor(Math.random() * theme.lightings.length);
    set({ selectedEnvIndex: randEnv, selectedLightIndex: randLight });
  },

  rollRandomPosture: () => {
    const rand = Math.floor(Math.random() * POSTURES_DATA.length) + 1;
    set({ selectedPostureId: rand });
  },
}));


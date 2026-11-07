import { SoloThemeId, SoloThemeInfo } from '@/types/themeSolo';
import rawData from './themesData.json';

export const THEMES_DATA: Record<SoloThemeId, SoloThemeInfo> = rawData as Record<SoloThemeId, SoloThemeInfo>;

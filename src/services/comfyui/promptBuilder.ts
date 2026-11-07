import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { MASTER_PREFIX, MASTER_SUFFIX, SHOT_PREFIXES } from '@/data/themesSolo/masterTemplate';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { THEMES_DATA } from '@/data/themesSolo/themesData';

export interface PromptBuildParams {
  themeId: SoloThemeId;
  envIndex: number;
  lightIndex: number;
  outfitId: number;
  outfitCategory: OutfitCategory | 'all';
  postureId: number;
  shotPrefixIndex: number;
  isWildcardMode: boolean;
}

// 단일 확정 프롬프트 생성 (현재 3D 뷰포트 상태와 1:1 일치)
export function buildResolvedPrompt(params: PromptBuildParams): string {
  const outfit = OUTFITS_DATA.find((o) => o.id === params.outfitId) || OUTFITS_DATA[0];
  const posture = POSTURES_DATA.find((p) => p.id === params.postureId) || POSTURES_DATA[0];
  const theme = THEMES_DATA[params.themeId] || THEMES_DATA.alley_downtown_street;

  const shotPrefix = SHOT_PREFIXES[params.shotPrefixIndex] || posture.defaultShotPrefix;
  const envText = theme.environments[params.envIndex] || theme.environments[0];
  const lightText = theme.lightings[params.lightIndex] || theme.lightings[0];

  const fullPostureText = `${shotPrefix} ${posture.coreText}, her bare breasts and flat hair-free stomach completely uncovered and her hairless lower pelvis matching Picture 1 (image1), face matching Picture 1 (image1)`;

  return `${MASTER_PREFIX}, ${outfit.text}, captured in a brand-new dynamic posture: ${fullPostureText}, set ${envText} ${lightText}, ${MASTER_SUFFIX}`;
}

// 다이나믹 와일드카드 프롬프트 생성 ({옵션1|옵션2|...} 구문 유지)
export function buildWildcardPrompt(params: PromptBuildParams): string {
  const theme = THEMES_DATA[params.themeId] || THEMES_DATA.alley_downtown_street;
  const posture = POSTURES_DATA.find((p) => p.id === params.postureId) || POSTURES_DATA[0];
  const shotPrefix = SHOT_PREFIXES[params.shotPrefixIndex] || posture.defaultShotPrefix;

  // 의상 와일드카드 블록
  let outfitCandidates = OUTFITS_DATA;
  if (params.outfitCategory !== 'all') {
    outfitCandidates = OUTFITS_DATA.filter((o) => o.category === params.outfitCategory);
  }
  const outfitBlock = `{${outfitCandidates.map((o) => o.text).join('|')}}`;

  // 포즈 블록
  const fullPostureText = `${shotPrefix} ${posture.coreText}, her bare breasts and flat hair-free stomach completely uncovered and her hairless lower pelvis matching Picture 1 (image1), face matching Picture 1 (image1)`;

  // 배경 환경 블록
  const envBlock = `{${theme.environments.join('|')}}`;

  // 조명/소품 블록
  const lightBlock = `{${theme.lightings.join('|')}}`;

  return `${MASTER_PREFIX}, ${outfitBlock}, captured in a brand-new dynamic posture: ${fullPostureText}, set ${envBlock} ${lightBlock}, ${MASTER_SUFFIX}`;
}

// 모드에 따라 최종 프롬프트 생성
export function buildThemeSoloPrompt(params: PromptBuildParams): string {
  return params.isWildcardMode ? buildWildcardPrompt(params) : buildResolvedPrompt(params);
}


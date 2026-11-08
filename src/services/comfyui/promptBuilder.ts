import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { MannequinModelId } from '@/types';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { findOutfitById } from '@/core/mannequin/mannequinProfiles';
import { MASTER_PREFIX, MASTER_SUFFIX, SHOT_PREFIXES } from '@/data/themesSolo/masterTemplate';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import {
  NAIL_ITEMS,
  FOOTWEAR_ITEMS,
  NECK_ITEMS,
  WRIST_ITEMS,
  LEG_ITEMS,
  EXTRA_SCENE_PROPS,
} from '@/data/themesSolo/accessoriesAndPropsData';
import { BodyProfileMode } from '@/stores/useThemeSoloStore';

export interface PromptBuildParams {
  themeId: SoloThemeId;
  envIndex: number;
  lightIndex: number;
  outfitId: number;
  outfitCategory: OutfitCategory | 'all';
  postureId: number;
  shotPrefixIndex: number;
  isWildcardMode: boolean;
  bodyProfileMode?: BodyProfileMode;
  modelId?: MannequinModelId;
  includeMasterRef?: boolean;
  nailColorId?: string;
  footwearId?: string;
  neckItemId?: string;
  wristItemId?: string;
  legItemId?: string;
  extraSceneProps?: string[];
}

const MODEL_PROMPT_PROFILES: Record<MannequinModelId, string> = {
  realistic_woman: '1girl, solo, realistic adult woman, natural 170cm 7.5-head body proportions',
  realistic_muscular_male: '1boy, solo, realistic athletic muscular adult man, 185cm 8-head proportions',
  anime_female: '1girl, solo, anime illustration style female character, 165cm 7-head proportions',
  anime_basic_male: '1boy, solo, anime illustration style male character, 178cm 7.5-head proportions',
  child_toddler: '1boy, solo, young toddler boy character, cute 108cm 4.5-head proportions',
  child_toddler_f: '1girl, solo, young toddler girl character, cute 106cm 4.5-head proportions',
  child_elementary: '1boy, solo, elementary school boy character, 138cm 5.5-head proportions',
  child_elementary_f: '1girl, solo, elementary school girl character, 136cm 5.5-head proportions',
  teen_middle_m: '1boy, solo, middle school teenage boy, 158cm 6.3-head proportions',
  teen_middle_f: '1girl, solo, middle school teenage girl, 154cm 6.3-head proportions',
  teen_girl: '1girl, solo, high school teenage girl, slender 161cm 6.7-head proportions',
  teen_boy: '1boy, solo, high school teenage boy, 172cm 7-head proportions',
  college_female: '1girl, solo, young college student woman in her early 20s, 166cm 7.3-head proportions',
  college_male: '1boy, solo, young college student man in his early 20s, 177cm 7.5-head proportions',
  solo_female: '1girl, solo, stylish single woman in her 20s, 168cm 7.5-head proportions',
  solo_male: '1boy, solo, stylish single man in his 20s, 179cm 7.6-head proportions',
  office_female: '1girl, solo, professional office worker woman in her 30s, 167cm 7.4-head proportions',
  office_male: '1boy, solo, professional office worker man in his 30s, 178cm 7.5-head proportions',
  married_wife: '1girl, solo, mature married adult woman in her late 30s, 164cm 7.2-head proportions',
  married_husband: '1boy, solo, mature married adult man in his late 30s, 176cm 7.3-head proportions',
  elderly_grandpa: '1boy, solo, elderly senior grandfather, 164cm 6.5-head proportions',
  elderly_grandma: '1girl, solo, elderly senior grandmother, 152cm 6-head proportions',
  plus_size_body: '1girl, solo, curvy glamorous plus-size adult woman, 170cm full-figured proportions',
  heroic_tall: 'solo, tall 194cm 9-head runway fashion model proportions',
  chibi_male: 'solo, cute chibi SD 3-head deformed character, 95cm proportions',
  male_mannequin: '1boy, solo, standard 176cm 7.5-head anatomical proportions',
  procedural: 'solo, standard 175cm 7.5-head figure proportions',
};

function buildAccessoryAndPropTags(params: {
  nailColorId?: string;
  footwearId?: string;
  neckItemId?: string;
  wristItemId?: string;
  legItemId?: string;
  extraSceneProps?: string[];
}): string[] {
  const tags: string[] = [];
  const nail = NAIL_ITEMS.find((i) => i.id === params.nailColorId && i.id !== 'nail_none');
  if (nail && nail.promptEn) tags.push(nail.promptEn);

  const foot = FOOTWEAR_ITEMS.find((i) => i.id === params.footwearId && i.id !== 'foot_bare');
  if (foot && foot.promptEn) tags.push(foot.promptEn);

  const neck = NECK_ITEMS.find((i) => i.id === params.neckItemId && i.id !== 'neck_none');
  if (neck && neck.promptEn) tags.push(neck.promptEn);

  const wrist = WRIST_ITEMS.find((i) => i.id === params.wristItemId && i.id !== 'wrist_none');
  if (wrist && wrist.promptEn) tags.push(wrist.promptEn);

  const leg = LEG_ITEMS.find((i) => i.id === params.legItemId && i.id !== 'leg_none');
  if (leg && leg.promptEn) tags.push(leg.promptEn);

  if (params.extraSceneProps && params.extraSceneProps.length > 0) {
    params.extraSceneProps.forEach((propId) => {
      const prop = EXTRA_SCENE_PROPS.find((p) => p.id === propId);
      if (prop && prop.promptEn) tags.push(prop.promptEn);
    });
  }
  return tags;
}

function buildSubjectPrefix(params: PromptBuildParams): string {
  // 구버전 호환: bodyProfileMode가 지정되지 않았거나 includeMasterRef가 켜진 경우
  if (params.bodyProfileMode === undefined || params.includeMasterRef) {
    if (params.bodyProfileMode === 'free') {
      return MASTER_PREFIX.replace(
        /petite 155cm and 45-50kg short-stature compact Asian feminine physique with short delicate 155cm limb proportions,\s*/i,
        ''
      );
    }
    if (params.bodyProfileMode === 'mannequin' && params.modelId) {
      const meta = MANNEQUIN_MODELS.find((m) => m.id === params.modelId);
      const customProfile = meta
        ? `${meta.heightCm}cm (${meta.headRatio}) ${meta.gender} physique,`
        : '';
      return MASTER_PREFIX.replace(
        /petite 155cm and 45-50kg short-stature compact Asian feminine physique with short delicate 155cm limb proportions,/i,
        customProfile
      );
    }
    return MASTER_PREFIX;
  }

  if (params.bodyProfileMode === 'free') {
    return 'solo, single subject, 85mm portrait lens, sharp focus,';
  }

  if (params.bodyProfileMode === 'petite155') {
    return '1girl, solo, petite 155cm compact Asian feminine physique, 85mm portrait lens,';
  }

  const modelId = params.modelId || 'realistic_woman';
  const profile = MODEL_PROMPT_PROFILES[modelId] || MODEL_PROMPT_PROFILES.realistic_woman;
  return `${profile}, 85mm portrait lens,`;
}

function buildSubjectSuffix(params: PromptBuildParams): string {
  if (params.bodyProfileMode === undefined || params.includeMasterRef) {
    return MASTER_SUFFIX;
  }
  return ', sharp focus, natural anatomy, high-resolution studio lighting, strictly one single person only.';
}

function cleanReferenceBoilerplate(raw: string, keepRef: boolean): string {
  if (keepRef) return raw;
  return raw
    .replace(
      /^Completely replacing any original clothing from Picture 1 \(image1\) with a brand-new outfit and color,\s*(she has [^,]+,\s*)?(and is\s*)?/i,
      ''
    )
    .replace(
      /,?\s*keeping her bare female breasts[\s\S]*?from Picture 1 \(image1\)\s*clearly exposed/gi,
      ''
    )
    .replace(
      /^in a brand-new background environment completely different from Picture 1 \(image1\),\s*/i,
      ''
    )
    .replace(/,?\s*matching Picture 1 \(image1\)/gi, '')
    .replace(/,?\s*from Picture 1 \(image1\)/gi, '')
    .trim();
}

// 방안 A: 저장 & 연동 탭용 핵심 장면 태그 한 줄 요약기 (카메라·마네킹·복장·아이템·테마·조명)
export function buildCompactSceneTagSummary(params: {
  modelId: MannequinModelId;
  outfitId: number;
  themeId: SoloThemeId;
  envIndex: number;
  lightIndex: number;
  postureId: number;
  nailColorId?: string;
  footwearId?: string;
  neckItemId?: string;
  wristItemId?: string;
  legItemId?: string;
  extraSceneProps?: string[];
}): string {
  const subject = MODEL_PROMPT_PROFILES[params.modelId] || MODEL_PROMPT_PROFILES.realistic_woman;
  const outfit = params.outfitId > 0 ? findOutfitById(params.outfitId) : null;
  const theme = THEMES_DATA[params.themeId] || THEMES_DATA.alley_downtown_street;
  const posture = POSTURES_DATA.find((p) => p.id === params.postureId) || POSTURES_DATA[0];

  const outfitTag = outfit
    ? `wearing ${outfit.id >= 1000 ? outfit.text : outfit.nameEn.toLowerCase()}`
    : 'unclothed bare mannequin figure';
  const itemTags = buildAccessoryAndPropTags(params);
  const itemClause = itemTags.length > 0 ? `, ${itemTags.join(', ')}` : '';
  const themeTag = `${theme.titleEn.toLowerCase()} setting`;
  const lightRaw = theme.lightings[params.lightIndex] || theme.lightings[0] || '';
  const lightTag = lightRaw.replace(/^with\s+/i, '').split(',')[0].trim();

  return `full body shot, ${posture.fov}mm lens, ${subject}, ${outfitTag}${itemClause}, ${themeTag}, ${lightTag}, high-resolution studio quality`;
}

// 단일 확정 프롬프트 생성 (현재 3D 뷰포트 상태와 1:1 일치)
export function buildResolvedPrompt(params: PromptBuildParams): string {
  const keepRef = params.bodyProfileMode === undefined || Boolean(params.includeMasterRef);
  const outfit =
    params.outfitId === 0
      ? null
      : findOutfitById(params.outfitId) || OUTFITS_DATA[0];
  const posture = POSTURES_DATA.find((p) => p.id === params.postureId) || POSTURES_DATA[0];
  const theme = THEMES_DATA[params.themeId] || THEMES_DATA.alley_downtown_street;

  const shotPrefix = SHOT_PREFIXES[params.shotPrefixIndex] || posture.defaultShotPrefix;
  const envText = cleanReferenceBoilerplate(
    theme.environments[params.envIndex] || theme.environments[0],
    keepRef
  );
  const lightText = theme.lightings[params.lightIndex] || theme.lightings[0];

  const prefix = buildSubjectPrefix(params);
  const suffix = buildSubjectSuffix(params);
  const outfitClause = outfit ? `${cleanReferenceBoilerplate(outfit.text, keepRef)}, ` : '';

  const refClause = keepRef
    ? ', her bare breasts and flat hair-free stomach completely uncovered and her hairless lower pelvis matching Picture 1 (image1), face matching Picture 1 (image1)'
    : '';

  const fullPostureText = `${shotPrefix} ${posture.coreText}${refClause}`;

  return `${prefix} ${outfitClause}captured in a brand-new dynamic posture: ${fullPostureText}, set ${envText} ${lightText}${suffix}`;
}

// 다이나믹 와일드카드 프롬프트 생성 ({옵션1|옵션2|...} 구문 유지)
export function buildWildcardPrompt(params: PromptBuildParams): string {
  const theme = THEMES_DATA[params.themeId] || THEMES_DATA.alley_downtown_street;
  const posture = POSTURES_DATA.find((p) => p.id === params.postureId) || POSTURES_DATA[0];
  const shotPrefix = SHOT_PREFIXES[params.shotPrefixIndex] || posture.defaultShotPrefix;

  let outfitCandidates = OUTFITS_DATA;
  if (params.outfitCategory !== 'all') {
    outfitCandidates = OUTFITS_DATA.filter((o) => o.category === params.outfitCategory);
  }
  const outfitBlock = `{${outfitCandidates.map((o) => o.text).join('|')}}`;

  const prefix = buildSubjectPrefix(params);
  const suffix = buildSubjectSuffix(params);

  const refClause =
    params.bodyProfileMode === undefined || params.includeMasterRef
      ? ', her bare breasts and flat hair-free stomach completely uncovered and her hairless lower pelvis matching Picture 1 (image1), face matching Picture 1 (image1)'
      : '';

  const fullPostureText = `${shotPrefix} ${posture.coreText}${refClause}`;
  const envBlock = `{${theme.environments.join('|')}}`;
  const lightBlock = `{${theme.lightings.join('|')}}`;

  return `${prefix} ${outfitBlock}, captured in a brand-new dynamic posture: ${fullPostureText}, set ${envBlock} ${lightBlock}${suffix}`;
}

// 모드에 따라 최종 프롬프트 생성
export function buildThemeSoloPrompt(params: PromptBuildParams): string {
  return params.isWildcardMode ? buildWildcardPrompt(params) : buildResolvedPrompt(params);
}

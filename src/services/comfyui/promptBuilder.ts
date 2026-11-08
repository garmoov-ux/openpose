import { SoloThemeId, OutfitCategory } from '@/types/themeSolo';
import { MannequinModelId } from '@/types';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { MASTER_PREFIX, MASTER_SUFFIX, SHOT_PREFIXES } from '@/data/themesSolo/masterTemplate';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
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
}

const MODEL_PROMPT_PROFILES: Record<MannequinModelId, string> = {
  realistic_woman: '1girl, solo, realistic adult woman, natural 170cm 7.5-head body proportions',
  realistic_muscular_male: '1boy, solo, realistic athletic muscular adult man, 185cm 8-head proportions',
  anime_female: '1girl, solo, anime illustration style female character, 165cm 7-head proportions',
  anime_basic_male: '1boy, solo, anime illustration style male character, 178cm 7.5-head proportions',
  child_toddler: 'solo, young toddler child character, cute 108cm 4.5-head proportions',
  child_elementary: 'solo, elementary school child character, 138cm 5.5-head proportions',
  teen_girl: '1girl, solo, teenage girl, slender 158cm 6.5-head proportions',
  teen_boy: '1boy, solo, teenage boy, 166cm 6.8-head proportions',
  elderly_grandpa: '1boy, solo, elderly senior man, 164cm 6.5-head proportions',
  elderly_grandma: '1girl, solo, elderly senior woman, 152cm 6-head proportions',
  plus_size_body: '1girl, solo, curvy plus-size adult woman, 170cm full-figured proportions',
  heroic_tall: 'solo, tall 194cm 9-head runway fashion model proportions',
  chibi_male: 'solo, cute chibi SD 3-head deformed character, 95cm proportions',
  male_mannequin: '1boy, solo, standard 176cm 7.5-head anatomical proportions',
  procedural: 'solo, standard 175cm 7.5-head figure proportions',
};

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
      /^in a brand-new background environment completely different from Picture 1 \(image1\),\s*/i,
      ''
    )
    .replace(/,?\s*matching Picture 1 \(image1\)/gi, '')
    .trim();
}

// 단일 확정 프롬프트 생성 (현재 3D 뷰포트 상태와 1:1 일치)
export function buildResolvedPrompt(params: PromptBuildParams): string {
  const keepRef = params.bodyProfileMode === undefined || Boolean(params.includeMasterRef);
  const outfit =
    params.outfitId === 0
      ? null
      : OUTFITS_DATA.find((o) => o.id === params.outfitId) || OUTFITS_DATA[0];
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

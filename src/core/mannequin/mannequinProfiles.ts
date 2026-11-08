import { MannequinModelId } from '@/types';
import { OutfitItem } from '@/types/themeSolo';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { SPECIALIZED_OUTFITS } from './outfitZoneClassifier';

export { SPECIALIZED_OUTFITS };

export type MannequinOutfitProfileType =
  | 'adult_female'
  | 'adult_male'
  | 'youth_casual'
  | 'senior_classic'
  | 'art_mannequin';

export interface MannequinProfileConfig {
  modelId: MannequinModelId;
  outfitProfile: MannequinOutfitProfileType;
  profileTitleKo: string;
  profileDescKo: string;
  defaultOutfitId: number;
  defaultStandardPoseId: string;
  allowedPostureGroups: string[];
}

const ALL_FEMALE_POSTURE_GROUPS = [
  'standing',
  'seated_m',
  'lounging',
  'furniture_straddle',
  'v_split',
  'deep_m_squat',
  'rear_arch',
  'bolster_ride',
  'high_leg',
];

export const MANNEQUIN_PROFILES: Record<MannequinModelId, MannequinProfileConfig> = {
  realistic_woman: {
    modelId: 'realistic_woman',
    outfitProfile: 'adult_female',
    profileTitleKo: '성인 여성 전용 & 200종 콘셉트 의상',
    profileDescKo: '실사 여성 체형에 맞춘 전 카테고리 의상 및 100종 프리미엄 포즈 호환',
    defaultOutfitId: 1001,
    defaultStandardPoseId: 'confident-hip',
    allowedPostureGroups: ALL_FEMALE_POSTURE_GROUPS,
  },
  anime_female: {
    modelId: 'anime_female',
    outfitProfile: 'adult_female',
    profileTitleKo: '일러스트 여성 & 200종 콘셉트 의상',
    profileDescKo: '애니메이션 여성 체형에 맞춘 드레스·캐주얼·콘셉트 의상 및 포즈 호환',
    defaultOutfitId: 1002,
    defaultStandardPoseId: 'confident-hip',
    allowedPostureGroups: ALL_FEMALE_POSTURE_GROUPS,
  },
  plus_size_body: {
    modelId: 'plus_size_body',
    outfitProfile: 'adult_female',
    profileTitleKo: '볼륨 여성 체형 & 200종 콘셉트 의상',
    profileDescKo: '풍만한 볼륨 체형에 밀착되는 드레스·라운지 의상 및 전 포즈 호환',
    defaultOutfitId: 151,
    defaultStandardPoseId: 'confident-hip',
    allowedPostureGroups: ALL_FEMALE_POSTURE_GROUPS,
  },
  realistic_muscular_male: {
    modelId: 'realistic_muscular_male',
    outfitProfile: 'adult_male',
    profileTitleKo: '성인 남성 전용 스포츠·수트·액션 복장',
    profileDescKo: '근육형 남성 체형에 맞춘 트레이닝복·수트·컴뱃 하의 및 액션/기립 자세 전용',
    defaultOutfitId: 1011,
    defaultStandardPoseId: 'fighting-guard',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
  anime_basic_male: {
    modelId: 'anime_basic_male',
    outfitProfile: 'adult_male',
    profileTitleKo: '남성 캐릭터 전용 캐주얼·수트·액션 복장',
    profileDescKo: '웹툰·일러스트 남성 체형에 맞춘 셔츠·수트·스트리트 복장 및 기립/착석 자세',
    defaultOutfitId: 1012,
    defaultStandardPoseId: 'default-stand',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
  heroic_tall: {
    modelId: 'heroic_tall',
    outfitProfile: 'adult_male',
    profileTitleKo: '9등신 장신 모델 & 히어로 전용 복장',
    profileDescKo: '런웨이 수트 및 판타지 컴뱃 바디수트·아머 복장 및 역동적 액션 자세',
    defaultOutfitId: 1014,
    defaultStandardPoseId: 'confident-hip',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
  child_toddler: {
    modelId: 'child_toddler',
    outfitProfile: 'youth_casual',
    profileTitleKo: '유아(5세) 전용 키즈 캐주얼 복장',
    profileDescKo: '유아 체형에 맞는 멜빵바지·티셔츠 등 건전한 키즈 복장 및 일상 표준 자세 전용',
    defaultOutfitId: 1021,
    defaultStandardPoseId: 'wave-hello',
    allowedPostureGroups: ['standing'],
  },
  child_elementary: {
    modelId: 'child_elementary',
    outfitProfile: 'youth_casual',
    profileTitleKo: '초등 아동(10세) 전용 주니어 복장',
    profileDescKo: '아동 체형에 어울리는 스포티 캐주얼·체육복 및 활동적인 일상 자세 전용',
    defaultOutfitId: 1022,
    defaultStandardPoseId: 'running',
    allowedPostureGroups: ['standing', 'furniture_straddle'],
  },
  chibi_male: {
    modelId: 'chibi_male',
    outfitProfile: 'youth_casual',
    profileTitleKo: 'SD 3등신 캐릭터 전용 캐주얼 복장',
    profileDescKo: '데포르메 SD 체형에 어울리는 후드·반바지 세트 및 귀여운 액션/일상 자세 전용',
    defaultOutfitId: 1023,
    defaultStandardPoseId: 'dynamic-jump',
    allowedPostureGroups: ['standing'],
  },
  teen_girl: {
    modelId: 'teen_girl',
    outfitProfile: 'youth_casual',
    profileTitleKo: '10대 청소년 소녀 스쿨룩·캐주얼 복장',
    profileDescKo: '청소년 소녀 체형에 맞춘 교복 블레이저·원피스·체육복 및 학원물 일상 자세',
    defaultOutfitId: 1024,
    defaultStandardPoseId: 'sitting',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
  teen_boy: {
    modelId: 'teen_boy',
    outfitProfile: 'youth_casual',
    profileTitleKo: '10대 청소년 소년 스쿨룩·스포티 복장',
    profileDescKo: '청소년 소년 체형에 맞춘 스쿨 가디건·체육복·후드 및 활동적인 자세',
    defaultOutfitId: 1025,
    defaultStandardPoseId: 'running',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
  elderly_grandpa: {
    modelId: 'elderly_grandpa',
    outfitProfile: 'senior_classic',
    profileTitleKo: '시니어 남성(할아버지) 전용 가디건·정장',
    profileDescKo: '노년 남성 체형에 어울리는 단정한 가디건·정장·산책복 및 안정적인 기립/착석 자세',
    defaultOutfitId: 1031,
    defaultStandardPoseId: 'walking',
    allowedPostureGroups: ['standing', 'furniture_straddle'],
  },
  elderly_grandma: {
    modelId: 'elderly_grandma',
    outfitProfile: 'senior_classic',
    profileTitleKo: '시니어 여성(할머니) 전용 니트·롱스커트',
    profileDescKo: '노년 여성 체형에 어울리는 온화한 캐시미어 니트·롱스커트 및 편안한 착석/일상 자세',
    defaultOutfitId: 1032,
    defaultStandardPoseId: 'sitting',
    allowedPostureGroups: ['standing', 'furniture_straddle'],
  },
  male_mannequin: {
    modelId: 'male_mannequin',
    outfitProfile: 'art_mannequin',
    profileTitleKo: '미술 목각 교보재 (기본 무의상 조형 모드)',
    profileDescKo: '해부학 및 데생 연습을 위해 기본 의상 없이 순수 목각 관절 조형을 표시합니다',
    defaultOutfitId: 0,
    defaultStandardPoseId: 'default-stand',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
  procedural: {
    modelId: 'procedural',
    outfitProfile: 'art_mannequin',
    profileTitleKo: '스튜디오 구체 관절 피규어 (기본 무의상 모드)',
    profileDescKo: '관절 구와 원기둥 파츠의 회전 각도를 명확히 볼 수 있도록 기본 무의상으로 설정됩니다',
    defaultOutfitId: 0,
    defaultStandardPoseId: 'default-stand',
    allowedPostureGroups: ['standing', 'furniture_straddle', 'lounging'],
  },
};

export function getMannequinProfile(modelId: MannequinModelId): MannequinProfileConfig {
  return MANNEQUIN_PROFILES[modelId] || MANNEQUIN_PROFILES.realistic_woman;
}

export function findOutfitById(outfitId: number): OutfitItem | undefined {
  if (outfitId >= 1000) {
    return SPECIALIZED_OUTFITS.find((o) => o.id === outfitId);
  }
  return OUTFITS_DATA.find((o) => o.id === outfitId);
}

export function getOutfitsForMannequin(modelId: MannequinModelId): OutfitItem[] {
  const profile = getMannequinProfile(modelId);
  switch (profile.outfitProfile) {
    case 'adult_female':
      return [
        ...SPECIALIZED_OUTFITS.filter((o) => o.id === 1001 || o.id === 1002),
        ...OUTFITS_DATA,
      ];
    case 'adult_male':
      return SPECIALIZED_OUTFITS.filter((o) => o.id >= 1011 && o.id <= 1018);
    case 'youth_casual':
      return SPECIALIZED_OUTFITS.filter(
        (o) => (o.id >= 1021 && o.id <= 1026) || o.id === 1001 || o.id === 1002
      );
    case 'senior_classic':
      return SPECIALIZED_OUTFITS.filter((o) => o.id >= 1031 && o.id <= 1034);
    case 'art_mannequin':
      return [
        ...SPECIALIZED_OUTFITS.filter((o) => o.id >= 1011 && o.id <= 1016),
        ...SPECIALIZED_OUTFITS.filter((o) => o.id === 1001 || o.id === 1002),
      ];
  }
}

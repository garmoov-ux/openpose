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
  recommendedOutfitId: number;
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

function createProfile(
  modelId: MannequinModelId,
  outfitProfile: MannequinOutfitProfileType,
  profileTitleKo: string,
  profileDescKo: string,
  recommendedOutfitId: number,
  defaultStandardPoseId: string,
  allowedPostureGroups: string[]
): MannequinProfileConfig {
  return {
    modelId,
    outfitProfile,
    profileTitleKo,
    profileDescKo,
    defaultOutfitId: 0, // 기본은 무의상(Bare) 상태이며 테마&의상 선택 또는 전체 랜덤 시에만 착용
    recommendedOutfitId,
    defaultStandardPoseId,
    allowedPostureGroups,
  };
}

export const MANNEQUIN_PROFILES: Record<MannequinModelId, MannequinProfileConfig> = {
  realistic_woman: createProfile(
    'realistic_woman',
    'adult_female',
    '성인 여성 실사 (기본 무의상 · 200종 의상 호환)',
    '기본 무의상 마네킹이며 테마 & 의상 탭에서 란제리·비키니·드레스 및 바디 아이템 착용 가능',
    1,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  solo_female: createProfile(
    'solo_female',
    'adult_female',
    '20대 솔로 여성 (기본 무의상 · 200종 의상 호환)',
    '슬림 글래머 20대 솔로 여성 체형으로 전 카테고리 섹시·화보 의상 및 바디 아이템 착용 가능',
    5,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  college_female: createProfile(
    'college_female',
    'adult_female',
    '여자 대학생 21세 (기본 무의상 · 200종 의상 호환)',
    '20대 초반 여대생 체형으로 캐주얼·비키니·란제리·파티룩 및 전 포즈 호환',
    31,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  office_female: createProfile(
    'office_female',
    'adult_female',
    '직장인 여성 오피스 (기본 무의상 · 200종 의상 호환)',
    '커리어우먼 직장인 여성 체형으로 오피스룩·이브닝 드레스·란제리 및 하이힐 아이템 특화',
    121,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  married_wife: createProfile(
    'married_wife',
    'adult_female',
    '유부녀 · 기혼 여성 30대 (기본 무의상 · 200종 의상 호환)',
    '성숙한 볼륨 라인의 기혼 여성 체형으로 실크 슬립·가운·란제리·드레스 및 라운지 포즈 특화',
    91,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  plus_size_body: createProfile(
    'plus_size_body',
    'adult_female',
    '풍만한 글래머 여성 (기본 무의상 · 200종 의상 호환)',
    '하이볼륨 글래머 체형으로 바디콘 드레스·비키니·란제리 및 볼륨 포즈 호환',
    151,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  anime_female: createProfile(
    'anime_female',
    'adult_female',
    '애니메이션 성인 여성 (기본 무의상 · 200종 의상 호환)',
    '일러스트 여성 체형으로 전 카테고리 의상 및 포즈 호환',
    1002,
    'confident-hip',
    ALL_FEMALE_POSTURE_GROUPS
  ),
  realistic_muscular_male: createProfile(
    'realistic_muscular_male',
    'adult_male',
    '근육형 성인 남성 (기본 무의상 · 남성 전용 복장)',
    '성인 남성 체형으로 스포츠·수트·전술복 및 커플/액션 포즈 호환',
    1011,
    'fighting-guard',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  solo_male: createProfile(
    'solo_male',
    'adult_male',
    '20대 솔로 남성 (기본 무의상 · 남성 전용 복장)',
    '탄탄한 20대 솔로 남성 체형으로 캐주얼·수트·라운지웨어 및 화보/커플 포즈 호환',
    1013,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  college_male: createProfile(
    'college_male',
    'adult_male',
    '남자 대학생 21세 (기본 무의상 · 남성 전용 복장)',
    '활동적인 남대생 체형으로 캠퍼스 캐주얼·스포츠웨어 호환',
    1015,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  office_male: createProfile(
    'office_male',
    'adult_male',
    '직장인 남성 오피스 (기본 무의상 · 수트·비즈니스)',
    '비즈니스 수트와 셔츠 핏에 맞춘 30대 직장인 남성 체형',
    1012,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  married_husband: createProfile(
    'married_husband',
    'adult_male',
    '유부남 · 기혼 남성 30~40대 (기본 무의상 · 남성 복장)',
    '중후한 체격의 기혼 남성 체형으로 수트·라운지 가운·캐주얼 호환',
    1017,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  anime_basic_male: createProfile(
    'anime_basic_male',
    'adult_male',
    '애니메이션 남성 (기본 무의상 · 남성 복장)',
    '웹툰·일러스트 남성 체형',
    1012,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  heroic_tall: createProfile(
    'heroic_tall',
    'adult_male',
    '9등신 장신 모델 (기본 무의상 · 런웨이 복장)',
    '런웨이 및 판타지 장신 남성 체형',
    1014,
    'confident-hip',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  elderly_grandpa: createProfile(
    'elderly_grandpa',
    'senior_classic',
    '할아버지 · 시니어 남성 (기본 무의상 · 시니어 정장)',
    '노년 남성 체형으로 가디건·정장·산책복 호환',
    1031,
    'walking',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  elderly_grandma: createProfile(
    'elderly_grandma',
    'senior_classic',
    '할머니 · 시니어 여성 (기본 무의상 · 시니어 니트)',
    '노년 여성 체형으로 캐시미어 니트·롱스커트·트위드 정장 호환',
    1032,
    'sitting',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  teen_girl: createProfile(
    'teen_girl',
    'youth_casual',
    '고등학생 여 17세 (기본 무의상 · 스쿨룩·캐주얼)',
    '고등학생 소녀 체형으로 교복·체육복·일상 캐주얼 호환',
    1024,
    'sitting',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  teen_boy: createProfile(
    'teen_boy',
    'youth_casual',
    '고등학생 남 17세 (기본 무의상 · 스쿨룩·캐주얼)',
    '고등학생 소년 체형으로 스쿨 가디건·체육복·후드 호환',
    1025,
    'running',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  teen_middle_f: createProfile(
    'teen_middle_f',
    'youth_casual',
    '중학생 여 14세 (기본 무의상 · 주니어 스쿨룩)',
    '중학생 소녀 체형으로 주니어 교복·원피스·체육복 호환',
    1024,
    'wave-hello',
    ['standing', 'furniture_straddle']
  ),
  teen_middle_m: createProfile(
    'teen_middle_m',
    'youth_casual',
    '중학생 남 14세 (기본 무의상 · 주니어 캐주얼)',
    '중학생 소년 체형으로 주니어 스쿨룩·스포티 복장 호환',
    1025,
    'running',
    ['standing', 'furniture_straddle']
  ),
  child_elementary_f: createProfile(
    'child_elementary_f',
    'youth_casual',
    '초등학생 여 10세 (기본 무의상 · 아동 캐주얼)',
    '초등 여아 체형으로 아동 캐주얼·원피스 및 일상 자세 전용',
    1026,
    'wave-hello',
    ['standing']
  ),
  child_elementary: createProfile(
    'child_elementary',
    'youth_casual',
    '초등학생 남 10세 (기본 무의상 · 아동 캐주얼)',
    '초등 남아 체형으로 아동 스포티·체육복 및 일상 자세 전용',
    1022,
    'running',
    ['standing']
  ),
  child_toddler_f: createProfile(
    'child_toddler_f',
    'youth_casual',
    '유년 여아 5세 (기본 무의상 · 키즈 복장)',
    '유년 여아 체형으로 키즈 멜빵·티셔츠 및 일상 자세 전용',
    1021,
    'wave-hello',
    ['standing']
  ),
  child_toddler: createProfile(
    'child_toddler',
    'youth_casual',
    '유년 남아 5세 (기본 무의상 · 키즈 복장)',
    '유년 남아 체형으로 키즈 멜빵·티셔츠 및 일상 자세 전용',
    1021,
    'wave-hello',
    ['standing']
  ),
  chibi_male: createProfile(
    'chibi_male',
    'youth_casual',
    'SD 3등신 캐릭터 (기본 무의상 · 캐주얼)',
    '3등신 데포르메 캐릭터 체형',
    1023,
    'dynamic-jump',
    ['standing']
  ),
  male_mannequin: createProfile(
    'male_mannequin',
    'art_mannequin',
    '클래식 목각 교보재 (기본 무의상)',
    '해부학 및 데생 연습용 목각 마네킹',
    1011,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
  procedural: createProfile(
    'procedural',
    'art_mannequin',
    '구체 관절 피규어 (기본 무의상)',
    '기하 도형 구체 관절 마네킹',
    1001,
    'default-stand',
    ['standing', 'furniture_straddle', 'lounging']
  ),
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
        ...OUTFITS_DATA,
        ...SPECIALIZED_OUTFITS.filter((o) => o.id === 1001 || o.id === 1002),
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

import { MannequinModelInfo, MaterialStyle } from '../../types';

export const MANNEQUIN_MODELS: MannequinModelInfo[] = [
  {
    id: 'realistic_woman', name: '성인 여성 (실사형)', ageGroup: '20~30대 성인 여성',
    heightCm: 170, headRatio: '7.5등신 표준', category: 'realistic', lifeStage: 'model_art', gender: 'female',
    description: '고해상도 해부학적 비율과 섬세한 관절 구조를 갖춘 실사형 성인 여성 마네킹',
    file: '/models/realistic_woman_OP_IK.fbx', badge: '인기 기본', targetHeight: 1.72,
  },
  {
    id: 'realistic_muscular_male', name: '근육형 성인 남성', ageGroup: '20~30대 성인 남성',
    heightCm: 185, headRatio: '8등신 근육형', category: 'realistic', lifeStage: 'model_art', gender: 'male',
    description: '선명한 근육 윤곽과 역동적인 자세에 최적화된 성인 남성 마네킹',
    file: '/models/realistic_muscular_male_OP_IK.fbx', badge: '실사 남성', targetHeight: 1.85,
  },
  {
    id: 'solo_female', name: '솔로 여성 (20대)', ageGroup: '24~28세 솔로 여성',
    heightCm: 166, headRatio: '7.3등신 슬림글래머', category: 'age_body', lifeStage: 'young_adult', gender: 'female',
    description: '세련된 도시 라이프스타일 및 화보 연출에 최적화된 20대 솔로 여성 체형',
    file: '/models/realistic_woman_OP_IK.fbx', badge: '솔로 여성', targetHeight: 1.66,
    boneScales: { Spine: [0.95, 1.0, 0.96], Spine1: [1.04, 1.0, 1.06], LeftUpLeg: [0.98, 1.02, 0.98], RightUpLeg: [0.98, 1.02, 0.98] },
  },
  {
    id: 'solo_male', name: '솔로 남성 (20대)', ageGroup: '25~29세 솔로 남성',
    heightCm: 180, headRatio: '7.8등신 탄탄체형', category: 'age_body', lifeStage: 'young_adult', gender: 'male',
    description: '넓은 어깨와 슬림한 허리 라인을 갖춘 20대 솔로 남성 체형',
    file: '/models/realistic_muscular_male_OP_IK.fbx', badge: '솔로 남성', targetHeight: 1.8,
    boneScales: { Spine: [0.94, 1.0, 0.94], Spine1: [1.02, 1.0, 1.02] },
  },
  {
    id: 'college_female', name: '여자 대학생 (21세)', ageGroup: '20~23세 여대생',
    heightCm: 163, headRatio: '7등신 캠퍼스', category: 'age_body', lifeStage: 'young_adult', gender: 'female',
    description: '풋풋하고 산뜻한 비율의 20대 초반 여자 대학생 체형',
    file: '/models/anime_female_OP_IK.fbx', badge: '여대생', targetHeight: 1.63,
    boneScales: { Head: [1.02, 1.02, 1.02], Spine1: [1.02, 1.0, 1.03] },
  },
  {
    id: 'college_male', name: '남자 대학생 (21세)', ageGroup: '20~23세 남대생',
    heightCm: 177, headRatio: '7.5등신 캠퍼스', category: 'age_body', lifeStage: 'young_adult', gender: 'male',
    description: '자연스러운 캐주얼 핏과 활동적인 비율의 남자 대학생 체형',
    file: '/models/anime_basic_male_OP_IK.fbx', badge: '남대생', targetHeight: 1.77,
  },
  {
    id: 'office_female', name: '직장인 여성 (오피스)', ageGroup: '27~34세 직장인 여성',
    heightCm: 168, headRatio: '7.5등신 오피스핏', category: 'age_body', lifeStage: 'young_adult', gender: 'female',
    description: '정장 스커트와 하이힐 핏이 돋보이는 커리어우먼 직장인 여성 체형',
    file: '/models/realistic_woman_OP_IK.fbx', badge: '직장인 여', targetHeight: 1.68,
    boneScales: { Spine: [0.96, 1.02, 0.96], LeftUpLeg: [1.0, 1.03, 1.0], RightUpLeg: [1.0, 1.03, 1.0] },
  },
  {
    id: 'office_male', name: '직장인 남성 (오피스)', ageGroup: '28~36세 직장인 남성',
    heightCm: 179, headRatio: '7.6등신 수트핏', category: 'age_body', lifeStage: 'young_adult', gender: 'male',
    description: '비즈니스 수트와 셔츠 핏에 최적화된 직장인 남성 체형',
    file: '/models/male_mannequin_OP_IK.fbx', badge: '직장인 남', targetHeight: 1.79,
  },
  {
    id: 'married_wife', name: '유부녀 · 기혼 여성 (30대)', ageGroup: '32~42세 기혼 여성',
    heightCm: 164, headRatio: '7.2등신 성숙 글래머', category: 'age_body', lifeStage: 'married_senior', gender: 'female',
    description: '성숙하고 볼륨감 있는 골반·가슴 곡선을 지닌 기혼 여성(유부녀) 체형',
    file: '/models/realistic_woman_OP_IK.fbx', badge: '유부녀', targetHeight: 1.64,
    boneScales: { Spine: [1.06, 1.0, 1.08], Spine1: [1.12, 1.0, 1.15], LeftUpLeg: [1.08, 1.0, 1.1], RightUpLeg: [1.08, 1.0, 1.1] },
  },
  {
    id: 'married_husband', name: '유부남 · 기혼 남성 (30~40대)', ageGroup: '34~45세 기혼 남성',
    heightCm: 176, headRatio: '7.3등신 중후체형', category: 'age_body', lifeStage: 'married_senior', gender: 'male',
    description: '듬직한 흉곽과 중후한 체격을 지닌 기혼 남성(유부남) 체형',
    file: '/models/male_mannequin_OP_IK.fbx', badge: '유부남', targetHeight: 1.76,
    boneScales: { Spine: [1.08, 1.0, 1.1], Spine1: [1.06, 1.0, 1.08] },
  },
  {
    id: 'plus_size_body', name: '풍만한 글래머 여성', ageGroup: '성인 볼륨 여성',
    heightCm: 170, headRatio: '7등신 하이볼륨', category: 'age_body', lifeStage: 'married_senior', gender: 'female',
    description: '풍성한 상·하체 볼륨감과 육감적인 곡선미를 강조한 글래머 여성 체형',
    file: '/models/realistic_woman_OP_IK.fbx', badge: '볼륨 글래머', targetHeight: 1.7,
    boneScales: { Spine: [1.2, 1.0, 1.22], Spine1: [1.18, 1.0, 1.2], LeftUpLeg: [1.16, 1.0, 1.16], RightUpLeg: [1.16, 1.0, 1.16] },
  },
  {
    id: 'elderly_grandma', name: '할머니 (노년 여성)', ageGroup: '65세 이상 시니어 여',
    heightCm: 152, headRatio: '6등신 시니어 여', category: 'age_body', lifeStage: 'married_senior', gender: 'female',
    description: '아담한 신장과 온화한 노년기 체형 비율을 반영한 할머니 마네킹',
    file: '/models/realistic_woman_OP_IK.fbx', badge: '할머니', targetHeight: 1.52,
    boneScales: { Head: [1.1, 1.08, 1.1], Spine: [1.12, 0.92, 1.14], Spine1: [1.04, 0.94, 1.06] },
  },
  {
    id: 'elderly_grandpa', name: '할아버지 (노년 남성)', ageGroup: '65세 이상 시니어 남',
    heightCm: 164, headRatio: '6.5등신 시니어 남', category: 'age_body', lifeStage: 'married_senior', gender: 'male',
    description: '세월감이 느껴지는 안정적인 체형의 할아버지 마네킹',
    file: '/models/male_mannequin_OP_IK.fbx', badge: '할아버지', targetHeight: 1.63,
    boneScales: { Head: [1.08, 1.06, 1.08], Spine: [1.08, 0.94, 1.12], Spine1: [0.96, 0.94, 1.06] },
  },
  {
    id: 'teen_girl', name: '고등학생 여 (17세)', ageGroup: '17~19세 여고생',
    heightCm: 160, headRatio: '6.8등신 하이틴 여', category: 'age_body', lifeStage: 'youth', gender: 'female',
    description: '호리호리한 팔다리와 가벼운 골격의 고등학생 소녀 체형',
    file: '/models/anime_female_OP_IK.fbx', badge: '고등 여', targetHeight: 1.6,
    boneScales: { Head: [1.06, 1.06, 1.06], Spine1: [0.95, 0.97, 0.95] },
  },
  {
    id: 'teen_boy', name: '고등학생 남 (17세)', ageGroup: '17~19세 남고생',
    heightCm: 173, headRatio: '7등신 하이틴 남', category: 'age_body', lifeStage: 'youth', gender: 'male',
    description: '성장기 후반의 슬림하고 긴 팔다리를 가진 고등학생 소년 체형',
    file: '/models/anime_basic_male_OP_IK.fbx', badge: '고등 남', targetHeight: 1.73,
    boneScales: { Head: [1.05, 1.05, 1.05], Spine1: [0.96, 0.98, 0.96] },
  },
  {
    id: 'teen_middle_f', name: '중학생 여 (14세)', ageGroup: '13~15세 여중생',
    heightCm: 153, headRatio: '6.2등신 주니어 여', category: 'age_body', lifeStage: 'youth', gender: 'female',
    description: '성장기 초중반의 아담한 중학생 소녀 체형',
    file: '/models/anime_female_OP_IK.fbx', badge: '중학 여', targetHeight: 1.53,
    boneScales: { Head: [1.14, 1.14, 1.14], Spine: [0.93, 0.94, 0.93] },
  },
  {
    id: 'teen_middle_m', name: '중학생 남 (14세)', ageGroup: '13~15세 남중생',
    heightCm: 161, headRatio: '6.4등신 주니어 남', category: 'age_body', lifeStage: 'youth', gender: 'male',
    description: '활동적인 중학생 소년 표준 체형',
    file: '/models/anime_basic_male_OP_IK.fbx', badge: '중학 남', targetHeight: 1.61,
    boneScales: { Head: [1.12, 1.12, 1.12], Spine: [0.94, 0.95, 0.94] },
  },
  {
    id: 'child_elementary_f', name: '초등학생 여 (10세)', ageGroup: '8~11세 초등 여아',
    heightCm: 136, headRatio: '5.5등신 초등 여', category: 'age_body', lifeStage: 'youth', gender: 'female',
    description: '경쾌한 신체 비율의 초등학생 여자 아동 마네킹',
    file: '/models/anime_female_OP_IK.fbx', badge: '초등 여', targetHeight: 1.36,
    boneScales: { Head: [1.24, 1.24, 1.24], Spine: [0.92, 0.9, 0.92] },
  },
  {
    id: 'child_elementary', name: '초등학생 남 (10세)', ageGroup: '8~11세 초등 남아',
    heightCm: 138, headRatio: '5.5등신 초등 남', category: 'age_body', lifeStage: 'youth', gender: 'male',
    description: '성장기 초등학생 남자 아동 표준 마네킹',
    file: '/models/anime_basic_male_OP_IK.fbx', badge: '초등 남', targetHeight: 1.38,
    boneScales: { Head: [1.25, 1.25, 1.25], Spine: [0.95, 0.92, 0.95] },
  },
  {
    id: 'child_toddler_f', name: '유년 여아 (5세)', ageGroup: '4~6세 유년 여아',
    heightCm: 105, headRatio: '4.5등신 유년 여', category: 'age_body', lifeStage: 'youth', gender: 'female',
    description: '아담하고 귀여운 비율의 유년기 여자 어린이 체형',
    file: '/models/chibi_male_OP_IK.fbx', badge: '유년 여', targetHeight: 1.05,
    boneScales: { Head: [1.12, 1.12, 1.12], Spine: [1.0, 0.9, 1.02] },
  },
  {
    id: 'child_toddler', name: '유년 남아 (5세)', ageGroup: '4~6세 유년 남아',
    heightCm: 108, headRatio: '4.5등신 유년 남', category: 'age_body', lifeStage: 'youth', gender: 'male',
    description: '머리 비율이 크고 팔다리가 짧은 유년기 남자 어린이 체형',
    file: '/models/chibi_male_OP_IK.fbx', badge: '유년 남', targetHeight: 1.08,
    boneScales: { Head: [1.15, 1.15, 1.15], Spine: [1.05, 0.92, 1.08] },
  },
  {
    id: 'anime_female', name: '애니메이션 여성', ageGroup: '일러스트 여성',
    heightCm: 165, headRatio: '7등신 일러스트', category: 'anime', lifeStage: 'model_art', gender: 'female',
    description: '만화 및 일러스트레이션 창작에 최적화된 여성 마네킹',
    file: '/models/anime_female_OP_IK.fbx', badge: '애니 여성', targetHeight: 1.66,
  },
  {
    id: 'anime_basic_male', name: '애니메이션 남성', ageGroup: '일러스트 남성',
    heightCm: 178, headRatio: '7.5등신 웹툰', category: 'anime', lifeStage: 'model_art', gender: 'male',
    description: '웹툰, 표지 일러스트 스타일의 남성 마네킹',
    file: '/models/anime_basic_male_OP_IK.fbx', badge: '애니 남성', targetHeight: 1.78,
  },
  {
    id: 'heroic_tall', name: '장신 모델 (9등신)', ageGroup: '런웨이 · 판타지',
    heightCm: 194, headRatio: '9등신 장신', category: 'stylized', lifeStage: 'model_art', gender: 'male',
    description: '하이패션 런웨이 및 판타지 캐릭터용 장신 마네킹',
    file: '/models/male_mannequin_OP_IK.fbx', badge: '9등신 장신', targetHeight: 1.92,
    boneScales: { Head: [0.88, 0.88, 0.88], LeftUpLeg: [1.0, 1.08, 1.0], RightUpLeg: [1.0, 1.08, 1.0] },
  },
  {
    id: 'chibi_male', name: 'SD 3등신 캐릭터', ageGroup: 'SD 데포르메',
    heightCm: 95, headRatio: '3등신 SD', category: 'stylized', lifeStage: 'model_art', gender: 'neutral',
    description: '3등신 비율의 캐주얼 SD 캐릭터 마네킹',
    file: '/models/chibi_male_OP_IK.fbx', badge: 'SD 3등신', targetHeight: 1.15,
  },
  {
    id: 'male_mannequin', name: '클래식 목각 교보재', ageGroup: '미술 표준 교보재',
    heightCm: 176, headRatio: '7.5등신 교보재', category: 'stylized', lifeStage: 'model_art', gender: 'male',
    description: '미술 학원용 인체 교보재 비율 베이직 마네킹',
    file: '/models/male_mannequin_OP_IK.fbx', badge: '목각 교보재', targetHeight: 1.76,
  },
  {
    id: 'procedural', name: '구체 관절 피규어', ageGroup: '기하 도형 마네킹',
    heightCm: 175, headRatio: '7.5등신 도형', category: 'stylized', lifeStage: 'model_art', gender: 'neutral',
    description: '관절 구와 원기둥 파츠로 구성된 도형 마네킹',
    badge: '구체관절', targetHeight: 1.75,
  },
];

export interface MaterialOption {
  id: MaterialStyle;
  name: string;
  description: string;
  color: string;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: 'matte_white', name: '스튜디오 석고 화이트', description: '음영과 곡면을 선명하게 파악하는 석고 마감', color: '#f1f5f9' },
  { id: 'clay', name: '조소용 황토 점토', description: '조소용 점토 느낌의 브라운 마감', color: '#b08968' },
  { id: 'toon_outline', name: '만화풍 셀 셰이딩', description: '만화 채색 가이드 마감', color: '#e2e8f0' },
  { id: 'chrome', name: '다크 메탈릭', description: '하이라이트가 돋보이는 금속 마감', color: '#475569' },
];

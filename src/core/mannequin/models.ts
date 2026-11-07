import { MannequinModelInfo, MaterialStyle } from '../../types';

export const MANNEQUIN_MODELS: MannequinModelInfo[] = [
  {
    id: 'realistic_woman',
    name: '리얼리스틱 여성 (Realistic Woman)',
    category: 'realistic',
    gender: 'female',
    description: '고해상도 해부학적 비율과 섬세한 관절 구조를 갖춘 실사형 여성 마네킹',
    file: '/models/realistic_woman_OP_IK.fbx',
    badge: '인기 프리미엄',
  },
  {
    id: 'anime_female',
    name: '애니메이션 여성 (Anime Female)',
    category: 'anime',
    gender: 'female',
    description: '일본 서브컬처 및 일러스트레이션에 최적화된 슬림형 애니메이션 여성 모델',
    file: '/models/anime_female_OP_IK.fbx',
    badge: '추천 일러스트',
  },
  {
    id: 'realistic_muscular_male',
    name: '머슬 남성 (Muscular Male)',
    category: 'realistic',
    gender: 'male',
    description: '선명한 근육 윤곽과 역동적인 액션 포즈에 최적화된 근육형 남성 마네킹',
    file: '/models/realistic_muscular_male_OP_IK.fbx',
    badge: '액션 특화',
  },
  {
    id: 'anime_basic_male',
    name: '애니메이션 남성 (Anime Male)',
    category: 'anime',
    gender: 'male',
    description: '웹툰, 웹소설 표지, 소년 만화 스타일의 표준형 애니메이션 남성 모델',
    file: '/models/anime_basic_male_OP_IK.fbx',
    badge: '스탠다드',
  },
  {
    id: 'male_mannequin',
    name: '클래식 마네킹 (Classic Male)',
    category: 'realistic',
    gender: 'male',
    description: '전통적인 미술용 목각 마네킹 비율을 계승한 표준 3D 인체 피규어',
    file: '/models/male_mannequin_OP_IK.fbx',
    badge: '클래식',
  },
  {
    id: 'chibi_male',
    name: 'SD 치비 캐릭터 (Chibi SD)',
    category: 'stylized',
    gender: 'neutral',
    description: '2.5등신~3등신 귀여운 캐주얼 및 SD 캐릭터용 포즈 마네킹',
    file: '/models/chibi_male_OP_IK.fbx',
    badge: 'SD 캐릭터',
  },
  {
    id: 'procedural',
    name: '프로시저럴 스켈레톤 (기본)',
    category: 'procedural',
    gender: 'neutral',
    description: '즉각적인 반응성과 가벼운 렌더링을 제공하는 기하학적 관절 마네킹',
    badge: '초경량',
  },
];

export interface MaterialOption {
  id: MaterialStyle;
  name: string;
  description: string;
  color: string;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: 'matte_white',
    name: '스튜디오 매트 화이트',
    description: '음영과 곡면을 가장 선명하게 파악할 수 있는 스튜디오 석고 마감',
    color: '#f1f5f9',
  },
  {
    id: 'clay',
    name: '스컬프트 클레이',
    description: '부드러운 조소용 유토 점토 느낌의 매트 브라운 셰이딩',
    color: '#b08968',
  },
  {
    id: 'toon_outline',
    name: '셀 셰이딩 아웃라인',
    description: '만화풍 일러스트 및 라인아트 가이드에 적합한 투톤 외곽선 마감',
    color: '#e2e8f0',
  },
  {
    id: 'chrome',
    name: '다크 크롬 메탈릭',
    description: '반사광과 하이라이트가 돋보이는 하이엔드 메탈릭 사이버 마감',
    color: '#475569',
  },
];

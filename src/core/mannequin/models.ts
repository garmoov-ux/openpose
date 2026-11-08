import { MannequinModelInfo, MaterialStyle } from '../../types';

export const MANNEQUIN_MODELS: MannequinModelInfo[] = [
  {
    id: 'realistic_woman',
    name: '리얼리스틱 여성',
    category: 'realistic',
    gender: 'female',
    description: '고해상도 해부학적 비율과 섬세한 관절 구조를 갖춘 실사형 여성 마네킹',
    file: '/models/realistic_woman_OP_IK.fbx',
    badge: '인기 프리미엄',
  },
  {
    id: 'anime_female',
    name: '애니메이션 여성',
    category: 'anime',
    gender: 'female',
    description: '만화 및 일러스트레이션 창작에 최적화된 슬림형 여성 마네킹',
    file: '/models/anime_female_OP_IK.fbx',
    badge: '추천 일러스트',
  },
  {
    id: 'realistic_muscular_male',
    name: '근육형 남성',
    category: 'realistic',
    gender: 'male',
    description: '선명한 근육 윤곽과 역동적인 액션 자세에 최적화된 남성 마네킹',
    file: '/models/realistic_muscular_male_OP_IK.fbx',
    badge: '액션 특화',
  },
  {
    id: 'anime_basic_male',
    name: '애니메이션 남성',
    category: 'anime',
    gender: 'male',
    description: '웹툰, 표지 일러스트, 소년 만화 스타일의 표준형 남성 마네킹',
    file: '/models/anime_basic_male_OP_IK.fbx',
    badge: '표준 남성',
  },
  {
    id: 'male_mannequin',
    name: '클래식 마네킹',
    category: 'realistic',
    gender: 'male',
    description: '전통적인 미술용 인체 교보재 비율을 계승한 표준 마네킹',
    file: '/models/male_mannequin_OP_IK.fbx',
    badge: '클래식',
  },
  {
    id: 'chibi_male',
    name: '귀여운 소형 캐릭터',
    category: 'stylized',
    gender: 'neutral',
    description: '3등신 비율의 귀여운 캐주얼 및 데포르메 캐릭터용 마네킹',
    file: '/models/chibi_male_OP_IK.fbx',
    badge: '소형 캐릭터',
  },
  {
    id: 'procedural',
    name: '기본 관절 마네킹',
    category: 'procedural',
    gender: 'neutral',
    description: '관절 구와 입체 도형으로 구성된 즉각 반응형 미술 관절 마네킹',
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
    name: '조소용 황토 점토',
    description: '부드러운 조소용 점토 느낌의 따뜻한 브라운 마감',
    color: '#b08968',
  },
  {
    id: 'toon_outline',
    name: '만화풍 셀 셰이딩',
    description: '만화 및 일러스트 채색 가이드에 적합한 단정한 음영 마감',
    color: '#e2e8f0',
  },
  {
    id: 'chrome',
    name: '다크 메탈릭',
    description: '반사광과 하이라이트가 돋보이는 입체 금속 마감',
    color: '#475569',
  },
];

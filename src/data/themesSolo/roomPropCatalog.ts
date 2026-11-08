import { SoloThemeId } from '@/types/themeSolo';
import { THEMES_DATA } from './themesData';
import { translateEnvironmentItem } from './environmentTranslator';
import { EXTRA_ROOM_PROPS } from './roomPropCatalogExtra';
import { GENERATED_ROOM_PROPS } from './generatedRoomProps';
import type { CatalogPropMeshKind, CatalogPropMeshVariant } from '@/core/scene/catalogPropMeshFactory';

export type RoomPropCategory =
  | 'main_furniture'
  | 'sub_furniture'
  | 'bath_wellness'
  | 'adult_stage'
  | 'lighting_arch'
  | 'table_props';

export interface RoomPropCatalogItem {
  id: string;
  nameKo: string;
  category: RoomPropCategory;
  badge: string;
  colorHex: number;
  promptEn: string;
  defaultPos: [number, number, number];
  defaultRotY?: number;
  meshKind?: CatalogPropMeshKind;
  meshVariant?: CatalogPropMeshVariant;
  defaultScale?: number;
}

export interface RoomPropInstance {
  uid: string;
  propId: string;
  visible: boolean;
  position: [number, number, number];
  rotationX?: number;
  rotationY: number;
  rotationZ?: number;
  scale: number;
  customColorHex?: number;
}

export const ROOM_PROP_CATEGORIES: { id: RoomPropCategory | 'all'; label: string }[] = [
  { id: 'all', label: '전체 사물' },
  { id: 'adult_stage', label: '성인·기구·스테이지' },
  { id: 'main_furniture', label: '침대·소파·데스크' },
  { id: 'sub_furniture', label: '의자·거울·옷장' },
  { id: 'bath_wellness', label: '욕조·샤워·스파' },
  { id: 'lighting_arch', label: '조명·창문·러그' },
  { id: 'table_props', label: '테이블·소품·잔' },
];

export const ROOM_PROP_CATALOG: RoomPropCatalogItem[] = [
  // 1. 침대 · 소파 · 메인 가구 (main_furniture: 8종)
  { id: 'king_bed', nameKo: '킹사이즈 호텔 침대 & 헤드보드', category: 'main_furniture', badge: '침실 메인', colorHex: 0xf8fafc, promptEn: 'luxury king-size bed with tufted headboard and silk sheets', defaultPos: [0, 0, -0.58] },
  { id: 'canopy_frame', nameKo: '4주 캐노피 침대 커튼 프레임', category: 'main_furniture', badge: '캐노피', colorHex: 0xd97706, promptEn: 'four-poster canopy bed frame with sheer drapes', defaultPos: [0, 0, -0.58] },
  { id: 'round_bed', nameKo: '벨벳 원형 스위트 침대', category: 'main_furniture', badge: '스위트룸', colorHex: 0xbe123c, promptEn: 'plush round velvet suite bed', defaultPos: [0, 0, -0.52] },
  { id: 'velvet_sofa', nameKo: '체스터필드 벨벳 소파', category: 'main_furniture', badge: '살롱 메인', colorHex: 0x581c87, promptEn: 'tufted velvet chesterfield sofa couch', defaultPos: [0, 0, -0.52] },
  { id: 'modern_l_sofa', nameKo: '모던 라운지 패브릭 소파', category: 'main_furniture', badge: '거실 메인', colorHex: 0x334155, promptEn: 'low-profile modern lounge sectional sofa', defaultPos: [0, 0, -0.54] },
  { id: 'kitchen_island', nameKo: '대리석 아일랜드 식탁 & 바', category: 'main_furniture', badge: '다이닝·바', colorHex: 0xe2e8f0, promptEn: 'marble waterfall kitchen island bar counter', defaultPos: [0, 0, -0.58] },
  { id: 'ceo_desk', nameKo: '월넛 CEO 데스크 책상', category: 'main_furniture', badge: '오피스', colorHex: 0x451a03, promptEn: 'executive walnut office desk', defaultPos: [0, 0, -0.52] },
  { id: 'limo_seat', nameKo: 'VIP 리무진·전용기 가죽 시트', category: 'main_furniture', badge: 'VIP 시트', colorHex: 0x18181b, promptEn: 'plush leather VIP recliner lounge seat', defaultPos: [0, 0, -0.54] },

  // 2. 성인 · 무드 · 스테이지 기구 (adult_stage: 14종)
  { id: 'love_chaise', nameKo: 'S-커브 벨벳 탄트라 러브체어', category: 'adult_stage', badge: '성인 체어', colorHex: 0x9f1239, promptEn: 'ergonomic curved velvet chaise lounge sofa', defaultPos: [0, 0, -0.35] },
  { id: 'sybian_saddle', nameKo: '초강력 전동 새들 라이딩 머신', category: 'adult_stage', badge: '전동 머신', colorHex: 0xe11d48, promptEn: 'padded leather motorized saddle riding machine with chrome handle', defaultPos: [0, 0, -0.05] },
  { id: 'love_swing', nameKo: '천장 서스펜션 벨벳 러브 스윙 해먹', category: 'adult_stage', badge: '러브 스윙', colorHex: 0xdb2777, promptEn: 'suspended velvet sling love swing hanging from chrome chains', defaultPos: [0, 0, -0.18] },
  { id: 'spanking_bench', nameKo: '각도조절 스팽킹 & 본디지 패디드 호스', category: 'adult_stage', badge: '본디지 벤치', colorHex: 0x09090b, promptEn: 'angled black leather padded bondage spanking bench with restraint rings', defaultPos: [0, 0, -0.25] },
  { id: 'wedge_cushion', nameKo: '트라이앵글 체위 보조 골반 웻지 쿠션', category: 'adult_stage', badge: '체위 쿠션', colorHex: 0xbe123c, promptEn: 'ergonomic velvet angled wedge positioning cushion pillow', defaultPos: [0, 0, -0.18] },
  { id: 'floor_dildo_mount', nameKo: '플로어 석션 마운트 딜도 스탠드', category: 'adult_stage', badge: '자위 마운트', colorHex: 0xec4899, promptEn: 'glossy floor-mounted suction base silicone dildo stand', defaultPos: [0, 0, 0.02] },
  { id: 'silk_bolster', nameKo: '실크 원통 볼스터 바디쿠션', category: 'adult_stage', badge: '바디 쿠션', colorHex: 0xe11d48, promptEn: 'glossy crimson silk cylindrical bolster pillow', defaultPos: [0, 0, -0.15] },
  { id: 'pole_stage', nameKo: '크롬 폴댄스 포디움 스테이지', category: 'adult_stage', badge: '폴 스테이지', colorHex: 0xcbd5e1, promptEn: 'vertical chrome stage pole on glossy black podium', defaultPos: [0.22, 0, -0.18] },
  { id: 'neon_arch', nameKo: '네온 아치 라이트 프레임', category: 'adult_stage', badge: '네온 무드', colorHex: 0xf43f5e, promptEn: 'glowing magenta and cyan neon arch portal frame', defaultPos: [0, 0, -1.15] },
  { id: 'padded_bench', nameKo: '레더 패디드 포징 벤치 & 스트랩', category: 'adult_stage', badge: '레더 벤치', colorHex: 0x18181b, promptEn: 'black leather padded studio posing bench', defaultPos: [0, 0, -0.32] },
  { id: 'restraint_frame', nameKo: '세인트 앤드류 X-프레임 구속 스탠드', category: 'adult_stage', badge: 'X-프레임', colorHex: 0x94a3b8, promptEn: 'metallic chrome St Andrew cross restraint studio frame arch', defaultPos: [0, 0, -0.95] },
  { id: 'mirror_ceiling_panel', nameKo: '상부 미러 리플렉션 캐노피', category: 'adult_stage', badge: '미러 천장', colorHex: 0x38bdf8, promptEn: 'overhead reflective mirror ceiling canopy panel', defaultPos: [0, 2.35, -0.45] },
  { id: 'acrylic_partition', nameKo: '크리스탈 프리즘 미러 파티션 스크린', category: 'adult_stage', badge: '프리즘 미러', colorHex: 0x06b6d4, promptEn: 'translucent neon-lit acrylic mirror folding screen', defaultPos: [-0.95, 0, -0.88] },
  { id: 'velvet_ottoman', nameKo: '딥레드 벨벳 라운드 오토만', category: 'adult_stage', badge: '포징 오토만', colorHex: 0xbe123c, promptEn: 'tufted crimson velvet round ottoman cushion', defaultPos: [0.55, 0, -0.15] },

  // 3. 의자 · 거울 · 옷장 (sub_furniture: 11종)
  { id: 'vanity_mirror', nameKo: '헐리우드 조명 화장대 & 거울', category: 'sub_furniture', badge: '화장대', colorHex: 0xfef08a, promptEn: 'vanity table with glowing Hollywood bulb mirror', defaultPos: [-1.15, 0, -1.12] },
  { id: 'triptych_mirror', nameKo: '3면 접이식 피팅룸 거울', category: 'sub_furniture', badge: '3면 거울', colorHex: 0xfbbf24, promptEn: 'three-way folding dressing room mirror', defaultPos: [0, 0, -1.18] },
  { id: 'standing_mirror', nameKo: '골드 프레임 전신 거울', category: 'sub_furniture', badge: '전신 거울', colorHex: 0xf59e0b, promptEn: 'full-length gold-framed standing floor mirror', defaultPos: [1.32, 0, -0.78], defaultRotY: -0.42 },
  { id: 'wardrobe_closet', nameKo: '통유리 드레스룸 오픈 옷장', category: 'sub_furniture', badge: '드레스룸', colorHex: 0x78350f, promptEn: 'walk-in closet wardrobe with illuminated shelves', defaultPos: [-1.35, 0, -1.15] },
  { id: 'clothing_rack', nameKo: '골드 부티크 의상 행거', category: 'sub_furniture', badge: '의상 행거', colorHex: 0xfbbf24, promptEn: 'brass boutique garment rack with silk dresses', defaultPos: [1.35, 0, -1.02] },
  { id: 'velvet_stool', nameKo: '벨벳 화장대·포징 스툴 의자', category: 'sub_furniture', badge: '스툴 의자', colorHex: 0xe11d48, promptEn: 'plush velvet dressing stool', defaultPos: [-0.72, 0, -0.35] },
  { id: 'bar_stool', nameKo: '크롬 하이 바스툴 의자', category: 'sub_furniture', badge: '바 의자', colorHex: 0xcbd5e1, promptEn: 'high chrome bar stool chair', defaultPos: [-0.48, 0, -0.12] },
  { id: 'leather_chair', nameKo: '가죽 중역 오피스 암체어', category: 'sub_furniture', badge: '가죽 의자', colorHex: 0x0f172a, promptEn: 'tufted black leather executive armchair', defaultPos: [0, 0, -0.12] },
  { id: 'bookshelf_wall', nameKo: '클래식 원목 서재 책장', category: 'sub_furniture', badge: '서재 책장', colorHex: 0x451a03, promptEn: 'tall wooden library bookshelf wall', defaultPos: [-1.42, 0, -1.18] },
  { id: 'cafe_table_set', nameKo: '테라스 비스트로 테이블 & 체어', category: 'sub_furniture', badge: '카페 테이블', colorHex: 0xf8fafc, promptEn: 'round marble bistro table and cafe chair', defaultPos: [-0.95, 0, -0.48] },
  { id: 'street_bench', nameKo: '우드 슬랫 스트리트 벤치', category: 'sub_furniture', badge: '벤치', colorHex: 0x78350f, promptEn: 'wooden street park bench', defaultPos: [0, 0, -0.48] },

  // 4. 욕실 · 스파 · 피트니스 (bath_wellness: 7종)
  { id: 'hinoki_tub', nameKo: '히노끼 편백나무 온천 욕조', category: 'bath_wellness', badge: '온천 욕조', colorHex: 0xb45309, promptEn: 'Japanese hinoki cypress wooden hot spring bath tub', defaultPos: [0, 0, -0.52] },
  { id: 'jacuzzi_tub', nameKo: '화이트 마블 자쿠지 욕조', category: 'bath_wellness', badge: '자쿠지', colorHex: 0x38bdf8, promptEn: 'luxury white marble jacuzzi bathtub with warm water', defaultPos: [0, 0, -0.52] },
  { id: 'glass_shower', nameKo: '통유리 레인폴 샤워부스', category: 'bath_wellness', badge: '샤워부스', colorHex: 0x7dd3fc, promptEn: 'walk-in glass rainfall shower booth', defaultPos: [-0.95, 0, -0.88] },
  { id: 'massage_bed', nameKo: 'VIP 아로마 스파 마사지 베드', category: 'bath_wellness', badge: '스파 베드', colorHex: 0xfef3c7, promptEn: 'padded spa massage table bed with face cradle', defaultPos: [0, 0, -0.45] },
  { id: 'sunbed_lounger', nameKo: '티크 우드 리조트 선베드', category: 'bath_wellness', badge: '선베드', colorHex: 0x06b6d4, promptEn: 'teak wood poolside sunbed lounger with white cushion', defaultPos: [0, 0, -0.42] },
  { id: 'pilates_reformer', nameKo: '필라테스 리포머 & 캐딜락 기구', category: 'bath_wellness', badge: '필라테스', colorHex: 0xd97706, promptEn: 'wooden pilates reformer machine with straps', defaultPos: [0, 0, -0.42] },
  { id: 'ballet_barre', nameKo: '2단 우드 발레 바 & 전면거울', category: 'bath_wellness', badge: '발레 바', colorHex: 0xe2e8f0, promptEn: 'wooden ballet barre and studio mirror wall', defaultPos: [0, 0, -1.25] },

  // 5. 조명 · 창문 · 러그 · 건축 (lighting_arch: 8종)
  { id: 'wall_window_frame', nameKo: '파노라마 통창 & 시티뷰 프레임', category: 'lighting_arch', badge: '배경 창문', colorHex: 0x38bdf8, promptEn: 'floor-to-ceiling panoramic window frame', defaultPos: [0, 0, -1.55] },
  { id: 'shoji_screen', nameKo: '일본식 쇼지 격자 조명 병풍', category: 'lighting_arch', badge: '쇼지 병풍', colorHex: 0xfde68a, promptEn: 'warm backlit Japanese shoji paper lattice screen', defaultPos: [0, 0, -1.48] },
  { id: 'plush_rug', nameKo: '대형 실크 페르시안 플로어 러그', category: 'lighting_arch', badge: '바닥 러그', colorHex: 0x881337, promptEn: 'plush woven area rug carpet on the floor', defaultPos: [0, 0, -0.25] },
  { id: 'nightstand_lamp', nameKo: '협탁 사이드테이블 & 무드등', category: 'lighting_arch', badge: '협탁·무드등', colorHex: 0xf59e0b, promptEn: 'bedside nightstand table with warm glowing lamp', defaultPos: [-1.18, 0, -1.08] },
  { id: 'floor_lamp', nameKo: '골드 아치 플로어 스탠드 조명', category: 'lighting_arch', badge: '스탠드 조명', colorHex: 0xfbbf24, promptEn: 'tall brass floor standing lamp with warm shade', defaultPos: [1.38, 0, -1.08] },
  { id: 'ring_light', nameKo: '스튜디오 삼각대 LED 링라이트', category: 'lighting_arch', badge: '링라이트', colorHex: 0xfef08a, promptEn: 'studio tripod LED ring light', defaultPos: [-1.25, 0, 0.15] },
  { id: 'street_lamp', nameKo: '빈티지 주철 가로등 기둥', category: 'lighting_arch', badge: '가로등', colorHex: 0xfde047, promptEn: 'warm glowing vintage street lamp post', defaultPos: [1.28, 0, -0.95] },
  { id: 'tropical_plant', nameKo: '대형 몬스테라·야자 화분', category: 'lighting_arch', badge: '인테리어 화분', colorHex: 0x10b981, promptEn: 'lush indoor tropical palm plant in ceramic pot', defaultPos: [-1.38, 0, -0.65] },

  // 6. 테이블 · 소품 · 오브제 (table_props: 7종)
  { id: 'champagne_set', nameKo: '샴페인 플루트 잔 & 실버 아이스버킷', category: 'table_props', badge: '샴페인 세트', colorHex: 0xfbbf24, promptEn: 'silver champagne ice bucket stand and crystal flutes', defaultPos: [0.92, 0, -0.18] },
  { id: 'whiskey_decanter', nameKo: '크리스탈 위스키 디캔터 & 온더락 잔', category: 'table_props', badge: '위스키 세트', colorHex: 0xd97706, promptEn: 'crystal whiskey decanter and lowball glass on side table', defaultPos: [-0.88, 0, -0.22] },
  { id: 'perfume_cosmetics', nameKo: '골드 향수병 & 루비 립스틱 트레이', category: 'table_props', badge: '뷰티 트레이', colorHex: 0xf43f5e, promptEn: 'mirrored tray with crystal perfume bottles and ruby lipstick', defaultPos: [-0.82, 0, -0.52] },
  { id: 'aroma_candles', nameKo: '아로마 필라 캔들 & 오일 워머 세트', category: 'table_props', badge: '캔들 무드', colorHex: 0xf97316, promptEn: 'lit flickering aroma pillar candles and essential oil warmer', defaultPos: [0.78, 0, -0.45] },
  { id: 'rose_vase', nameKo: '크림슨 장미 부케 크리스탈 화병', category: 'table_props', badge: '장미 화병', colorHex: 0xe11d48, promptEn: 'crystal vase with fresh crimson red roses', defaultPos: [1.05, 0, -0.65] },
  { id: 'hinoki_bucket', nameKo: '히노끼 목욕 바가지 & 스파 타월', category: 'table_props', badge: '스파 소품', colorHex: 0xb45309, promptEn: 'wooden hinoki bath bucket and rolled white spa towels', defaultPos: [-0.75, 0, -0.15] },
  { id: 'coffee_bag', nameKo: '아이스 커피컵 & 디자이너 미니백', category: 'table_props', badge: '일상 소품', colorHex: 0x78350f, promptEn: 'iced coffee cup and leather designer handbag', defaultPos: [0.68, 0, -0.15] },
  ...EXTRA_ROOM_PROPS,
  ...GENERATED_ROOM_PROPS,
];

if (ROOM_PROP_CATALOG.length !== 500) {
  throw new Error(`Expected 500 room props, got ${ROOM_PROP_CATALOG.length}`);
}

ROOM_PROP_CATEGORIES.forEach((category) => {
  const count = category.id === 'all'
    ? ROOM_PROP_CATALOG.length
    : ROOM_PROP_CATALOG.filter((item) => item.category === category.id).length;
  category.label += ` (${count})`;
});

export function findRoomPropById(propId: string): RoomPropCatalogItem | undefined {
  return ROOM_PROP_CATALOG.find((item) => item.id === propId);
}

export const getRoomPropDef = findRoomPropById;

function makeInstance(propId: string, index: number, customPos?: [number, number, number], rotY = 0): RoomPropInstance {
  const meta = findRoomPropById(propId);
  return {
    uid: `${propId}_${index}`,
    propId,
    visible: true,
    position: customPos ? [...customPos] : meta ? [...meta.defaultPos] : [0, 0, -0.5],
    rotationY: rotY || meta?.defaultRotY || 0,
    scale: meta?.defaultScale ?? 1.0,
  };
}

export function getDefaultRoomPropsForTheme(themeId: SoloThemeId, envIndex: number): RoomPropInstance[] {
  const rawEnv = THEMES_DATA[themeId]?.environments[envIndex] || THEMES_DATA[themeId]?.environments[0] || '';
  const info = translateEnvironmentItem(rawEnv, envIndex, themeId);
  const ids: string[] = [];

  switch (info.furnitureKind) {
    case 'wardrobe_closet_bed':
      ids.push('king_bed', 'wardrobe_closet', 'standing_mirror', 'plush_rug', 'nightstand_lamp', 'silk_bolster', 'perfume_cosmetics', 'clothing_rack');
      break;
    case 'canopy_king_bed':
      ids.push('king_bed', 'canopy_frame', 'plush_rug', 'nightstand_lamp', 'floor_lamp', 'silk_bolster', 'champagne_set', 'rose_vase', 'aroma_candles');
      break;
    case 'round_mirror_bed':
      ids.push('round_bed', 'mirror_ceiling_panel', 'plush_rug', 'nightstand_lamp', 'love_chaise', 'silk_bolster', 'champagne_set', 'aroma_candles');
      break;
    case 'kitchen_island_bar':
    case 'rooftop_terrace_bar':
      ids.push('kitchen_island', 'bar_stool', 'wall_window_frame', 'floor_lamp', 'champagne_set', 'whiskey_decanter', 'rose_vase', 'tropical_plant');
      break;
    case 'glass_shower_booth':
      ids.push('glass_shower', 'jacuzzi_tub', 'vanity_mirror', 'hinoki_bucket', 'aroma_candles', 'perfume_cosmetics');
      break;
    case 'hinoki_onsen_bath':
    case 'tatami_shoji_room':
    case 'bathtub_jacuzzi':
      ids.push(info.furnitureKind === 'bathtub_jacuzzi' ? 'jacuzzi_tub' : 'hinoki_tub', 'shoji_screen', 'hinoki_bucket', 'aroma_candles', 'tropical_plant', 'whiskey_decanter');
      break;
    case 'velvet_sofa_salon':
      ids.push('velvet_sofa', 'plush_rug', 'wall_window_frame', 'standing_mirror', 'floor_lamp', 'velvet_ottoman', 'champagne_set', 'rose_vase', 'aroma_candles');
      break;
    case 'vanity_bulb_mirror':
    case 'triptych_mirror_pedestal':
      ids.push(info.furnitureKind === 'triptych_mirror_pedestal' ? 'triptych_mirror' : 'vanity_mirror', 'velvet_stool', 'clothing_rack', 'wardrobe_closet', 'plush_rug', 'ring_light', 'perfume_cosmetics', 'champagne_set');
      break;
    case 'sunbed_pool_deck':
      ids.push('sunbed_lounger', 'wall_window_frame', 'tropical_plant', 'cafe_table_set', 'champagne_set', 'hinoki_bucket');
      break;
    case 'pilates_reformer':
    case 'ballet_barre_mirror':
    case 'cadillac_trapeze':
    case 'gym_weight_rack':
    case 'sauna_cedar_bench':
      ids.push('pilates_reformer', 'ballet_barre', 'standing_mirror', 'padded_bench', 'ring_light', 'hinoki_bucket');
      break;
    case 'spa_massage_bed':
      ids.push('massage_bed', 'shoji_screen', 'silk_bolster', 'aroma_candles', 'hinoki_bucket', 'rose_vase', 'tropical_plant');
      break;
    case 'ceo_desk_chair':
    case 'library_bookshelves':
      ids.push('ceo_desk', 'leather_chair', 'bookshelf_wall', 'wall_window_frame', 'plush_rug', 'floor_lamp', 'whiskey_decanter', 'coffee_bag');
      break;
    case 'jet_oval_recliner':
      ids.push('limo_seat', 'jet_oval_window', 'jet_service_console', 'champagne_cart', 'plush_rug');
      break;
    case 'limo_jseat_bar':
      ids.push('limo_seat', 'onyx_limo_bar', 'champagne_set', 'neon_arch');
      break;
    case 'cafe_bench_table':
    case 'storefront_window':
    case 'spiral_stairs_steps':
    case 'street_railing_lamp':
      ids.push('street_bench', 'cafe_table_set', 'street_lamp', 'wall_window_frame', 'tropical_plant', 'coffee_bag');
      break;
    default:
      ids.push('love_chaise', 'pole_stage', 'neon_arch', 'mirror_ceiling_panel', 'standing_mirror', 'silk_bolster', 'champagne_set', 'aroma_candles');
      break;
  }

  const extraByKind: Partial<Record<typeof info.furnitureKind, string[]>> = {
    cafe_bench_table: ['storefront_facade', 'street_awning'],
    storefront_window: ['storefront_facade', 'street_awning'],
    spiral_stairs_steps: ['stone_steps'],
    street_railing_lamp: ['stone_steps', 'street_awning'],
    vanity_bulb_mirror: ['fitting_pedestal', 'makeup_case'],
    triptych_mirror_pedestal: ['fitting_pedestal', 'champagne_cart'],
    velvet_sofa_salon: ['rococo_fireplace', 'harpsichord'],
    wardrobe_closet_bed: ['chest_drawers', 'laundry_basket'],
    kitchen_island_bar: ['coffee_machine'],
    sunbed_pool_deck: ['beach_cabana', 'yacht_railing'],
    hinoki_onsen_bath: ['andon_lantern', 'bamboo_screen'],
    tatami_shoji_room: ['tea_table', 'andon_lantern'],
    pilates_reformer: ['pilates_mat', 'ladder_barrel'],
    ballet_barre_mirror: ['pilates_mat'],
    cadillac_trapeze: ['ladder_barrel'],
    gym_weight_rack: ['dumbbell_rack'],
    sauna_cedar_bench: ['sauna_heater'],
    spa_massage_bed: ['spa_oil_warmer', 'hammam_bench'],
    ceo_desk_chair: ['boardroom_table', 'drafting_table'],
    library_bookshelves: ['boardroom_table'],
  };
  ids.push(...(extraByKind[info.furnitureKind] ?? []));

  if (themeId === 'glasshouse_sunroom_lounge') ids.push('rattan_daybed', 'hanging_swing_sofa', 'planter_cluster');
  if (themeId === 'infinity_pool_yacht') ids.push('yacht_helm', 'tiki_bar');
  if (themeId === 'maldives_beach_villa') ids.push('bamboo_screen', 'tiki_bar');
  if (themeId === 'luxury_hotel_penthouse') ids.push('hotel_bar_cart');

  return [...new Set(ids)].map((id, idx) => makeInstance(id, idx));
}

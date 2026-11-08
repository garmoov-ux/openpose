export interface BodyAccessoryOption {
  id: string;
  nameKo: string;
  promptEn: string;
  colorHex: number;
  secondaryHex?: number;
}

export interface ExtraScenePropOption {
  id: string;
  nameKo: string;
  categoryKo: string;
  promptEn: string;
  colorHex: number;
}

// 1. 매니큐어 & 페디큐어 컬러 (9종)
export const NAIL_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '기본 네일 (미적용)', promptEn: 'natural clean fingernails and toenails', colorHex: 0xf1f5f9 },
  { id: 'ruby_red', nameKo: '글로시 루비 레드', promptEn: 'glossy ruby-red manicured fingernails and pedicured toenails', colorHex: 0xdc2626 },
  { id: 'jet_black', nameKo: '글로시 제트 블랙', promptEn: 'glossy jet-black manicured fingernails and pedicured toenails', colorHex: 0x09090b },
  { id: 'hot_pink', nameKo: '네온 핫핑크', promptEn: 'glossy hot-pink manicured fingernails and pedicured toenails', colorHex: 0xec4899 },
  { id: 'cobalt_blue', nameKo: '로열 코발트 블루', promptEn: 'glossy cobalt-blue manicured fingernails and pedicured toenails', colorHex: 0x2563eb },
  { id: 'emerald_green', nameKo: '에메랄드 그린', promptEn: 'glossy emerald-green manicured fingernails and pedicured toenails', colorHex: 0x059669 },
  { id: 'french_white', nameKo: '스노우 화이트', promptEn: 'glossy snow-white manicured fingernails and pedicured toenails', colorHex: 0xffffff },
  { id: 'gold_chrome', nameKo: '메탈릭 골드 크롬', promptEn: 'glossy metallic-gold manicured fingernails and pedicured toenails', colorHex: 0xfbbf24 },
  { id: 'electric_violet', nameKo: '일렉트릭 바이올렛', promptEn: 'glossy electric-violet manicured fingernails and pedicured toenails', colorHex: 0x7c3aed },
];

// 2. 신발 · 구두 · 스타킹 · 양말 · 맨발 (12종)
export const FOOTWEAR_ITEMS: BodyAccessoryOption[] = [
  { id: 'bare_feet', nameKo: '맨발 (Bare Feet)', promptEn: 'bare feet', colorHex: 0xf1f5f9 },
  { id: 'black_stiletto_mules', nameKo: '블랙 페이턴트 스틸레토 뮬', promptEn: 'sleek black patent open-toe stiletto mules', colorHex: 0x18181b, secondaryHex: 0xdc2626 },
  { id: 'ruby_stiletto_sandals', nameKo: '루비 레드 스트랩 스틸레토 힐', promptEn: 'ruby-red single-strap open-toe stiletto sandals', colorHex: 0xdc2626, secondaryHex: 0xfbbf24 },
  { id: 'clear_pvc_mules', nameKo: '투명 PVC 크리스탈 오픈토 힐', promptEn: 'clear PVC transparent crystal-strap open-toe stiletto mules', colorHex: 0xe0f2fe, secondaryHex: 0x94a3b8 },
  { id: 'white_ankle_stiletto', nameKo: '화이트 앵클스트랩 스틸레토', promptEn: 'white ankle-strap open-toe stiletto heels', colorHex: 0xffffff, secondaryHex: 0xe2e8f0 },
  { id: 'rose_gold_heels', nameKo: '로즈골드 메탈릭 샌들힐', promptEn: 'rose-gold metallic open-toe sandal heels', colorHex: 0xf472b6, secondaryHex: 0xfbbf24 },
  { id: 'nude_slingback_heels', nameKo: '누드 베이지 슬링백 하이힐', promptEn: 'nude-beige open-toe slingback stiletto heels', colorHex: 0xd6b49c, secondaryHex: 0x78350f },
  { id: 'black_sheer_stockings', nameKo: '블랙 시스루 니하이 스타킹 & 힐', promptEn: 'thigh-high sheer black lace-top stockings and black stiletto heels', colorHex: 0x18181b, secondaryHex: 0x3f3f46 },
  { id: 'white_bridal_stockings', nameKo: '화이트 브라이덜 레이스 스타킹 & 힐', promptEn: 'ivory sheer thigh-high stockings with delicate lace tops and peep-toe heels', colorHex: 0xf8fafc, secondaryHex: 0xe2e8f0 },
  { id: 'crimson_garter_stockings', nameKo: '크림슨 레이스 가터 & 블랙 스타킹', promptEn: 'crimson lace garter straps with sheer black thigh-high stockings and stiletto heels', colorHex: 0xbe123c, secondaryHex: 0x18181b },
  { id: 'thigh_high_boots', nameKo: '글로시 블랙 싸이하이 롱부츠', promptEn: 'glossy black patent thigh-high stiletto boots', colorHex: 0x09090b, secondaryHex: 0x27272a },
  { id: 'white_ankle_socks', nameKo: '화이트 프릴 발목 양말', promptEn: 'dainty white lace-trim ankle socks', colorHex: 0xffffff, secondaryHex: 0xf1f5f9 },
];

// 3. 목 · 쇄골 · 바디체인 아이템 (9종)
export const NECK_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '목 아이템 미착용', promptEn: '', colorHex: 0x94a3b8 },
  { id: 'gold_heart_pendant', nameKo: '18K 골드 하트 펜던트 목걸이', promptEn: 'dainty 18k gold heart pendant necklace on her collarbone', colorHex: 0xfbbf24, secondaryHex: 0xf43f5e },
  { id: 'diamond_solitaire', nameKo: '다이아몬드 솔리테어 목걸이', promptEn: 'sparkling diamond solitaire collarbone necklace', colorHex: 0xe2e8f0, secondaryHex: 0x38bdf8 },
  { id: 'black_velvet_choker', nameKo: '블랙 벨벳 오링(O-Ring) 초커', promptEn: 'black velvet choker with a polished silver center O-ring', colorHex: 0x18181b, secondaryHex: 0xe2e8f0 },
  { id: 'lace_ribbon_choker', nameKo: '시어 블랙 레이스 리본 초커', promptEn: 'delicate black Chantilly-lace choker necklace', colorHex: 0x27272a, secondaryHex: 0xbe123c },
  { id: 'gold_lariat_chain', nameKo: '골드 라리앗 Y-드롭 체인', promptEn: 'delicate 18k gold lariat drop necklace between her collarbones', colorHex: 0xf59e0b },
  { id: 'gold_body_chain', nameKo: '18K 골드 쇄골-웨이스트 바디체인', promptEn: 'delicate 18k gold body-chain draping from her collarbone to her narrow waist', colorHex: 0xfbbf24 },
  { id: 'pearl_collar', nameKo: '진주 레이어드 콜라 네크리스', promptEn: 'luminous ivory pearl collar necklace', colorHex: 0xfef3c7 },
  { id: 'leather_collar_ring', nameKo: '블랙 레더 골드링 초커', promptEn: 'sleek black leather collar choker with gold ring hardware', colorHex: 0x09090b, secondaryHex: 0xfbbf24 },
];

// 4. 손목 · 팔 아이템 (8종)
export const WRIST_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '손목 아이템 미착용', promptEn: '', colorHex: 0x94a3b8 },
  { id: 'gold_wrist_chain', nameKo: '18K 골드 슬림 리스트 체인', promptEn: 'thin 18k gold wrist chain bracelet', colorHex: 0xfbbf24 },
  { id: 'diamond_tennis_bracelet', nameKo: '실버 다이아 테니스 팔찌', promptEn: 'sparkling silver diamond tennis bracelet', colorHex: 0xe2e8f0 },
  { id: 'rose_gold_bangle', nameKo: '로즈골드 슬림 뱅글', promptEn: 'delicate rose-gold wrist bangle', colorHex: 0xf472b6 },
  { id: 'satin_ribbon_tie', nameKo: '크림슨 새틴 리본 손목 스트랩', promptEn: 'crimson satin ribbon wrist ties', colorHex: 0xe11d48 },
  { id: 'leather_wrist_cuff', nameKo: '블랙 레더 버클 리스트 커프', promptEn: 'sleek black leather wrist cuffs with silver buckles', colorHex: 0x18181b, secondaryHex: 0xe2e8f0 },
  { id: 'lace_wrist_cuff', nameKo: '샹틸리 레이스 손목 커프스', promptEn: 'sheer black lace wrist cuffs', colorHex: 0x27272a },
  { id: 'metal_luxury_watch', nameKo: '골드 메탈 드레스 워치', promptEn: 'slim gold luxury dress watch on her wrist', colorHex: 0xf59e0b },
];

// 5. 종아리 · 허벅지 · 발목 아이템 (9종)
export const LEG_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '다리·발목 아이템 미착용', promptEn: '', colorHex: 0x94a3b8 },
  { id: 'black_lace_garter', nameKo: '블랙 레이스 허벅지 가터 링', promptEn: 'delicate black floral-lace thigh garter ring', colorHex: 0x18181b, secondaryHex: 0xe11d48 },
  { id: 'red_satin_garter', nameKo: '루비 새틴 리본 허벅지 가터', promptEn: 'ruby-red satin ribbon thigh garter straps', colorHex: 0xdc2626 },
  { id: 'dual_hip_thigh_straps', nameKo: '더블 힙 & 허벅지 스트랩 링', promptEn: 'thin double elastic thigh and hip straps with gold adjuster rings', colorHex: 0x18181b, secondaryHex: 0xfbbf24 },
  { id: 'leather_harness_garter', nameKo: '블랙 레더 하네스 허벅지 가터', promptEn: 'black leather thigh harness garter straps with metal O-rings', colorHex: 0x09090b, secondaryHex: 0x94a3b8 },
  { id: 'calf_crisscross_ribbon', nameKo: '종아리 크리스크로스 새틴 스트랩', promptEn: 'crisscross black satin ribbon straps laced around her calves', colorHex: 0x18181b },
  { id: 'gold_chain_anklet', nameKo: '18K 골드 체인 발목 앵클릿', promptEn: 'dainty 18k gold chain anklet around her ankle', colorHex: 0xfbbf24 },
  { id: 'crystal_anklet', nameKo: '크리스탈 드롭 발목 앵클릿', promptEn: 'sparkling crystal-drop silver anklet', colorHex: 0x38bdf8 },
  { id: 'white_lace_garter', nameKo: '아이보리 브라이덜 레이스 가터', promptEn: 'ivory silk bridal-lace thigh garter with a satin bow', colorHex: 0xf8fafc },
];

// 6. 3D 공간 추가 소품 (12종 - 와일드카드 소품 및 스튜디오 오브제)
export const EXTRA_SCENE_PROPS: ExtraScenePropOption[] = [
  { id: 'champagne_set', nameKo: '샴페인 플루트 & 아이스버킷', categoryKo: '테이블·바', promptEn: 'a crystal champagne flute and silver ice bucket nearby', colorHex: 0xfbbf24 },
  { id: 'perfume_cosmetics', nameKo: '크리스탈 향수병 & 립스틱 트레이', categoryKo: '뷰티·화장대', promptEn: 'a crystal perfume atomizer and lipstick case nearby', colorHex: 0xf43f5e },
  { id: 'aroma_candles', nameKo: '골든 필라 캔들 & 오일 워머', categoryKo: '조명·스파', promptEn: 'glowing golden pillar candles and brass essential oil warmer nearby', colorHex: 0xf97316 },
  { id: 'velvet_stool', nameKo: '벨벳 포징 스툴 오토만', categoryKo: '가구·의자', promptEn: 'a plush tufted velvet posing stool nearby', colorHex: 0xbe123c },
  { id: 'standing_mirror', nameKo: '골드 프레임 전신 거울', categoryKo: '거울·화보', promptEn: 'a tall gilded full-length floor mirror nearby', colorHex: 0xe2e8f0 },
  { id: 'silk_bolster', nameKo: '실크 볼스터 원통 쿠션', categoryKo: '침구·쿠션', promptEn: 'a plush silk cylindrical bolster pillow nearby', colorHex: 0xe11d48 },
  { id: 'rose_vase', nameKo: '다크 레드 장미 크리스탈 화병', categoryKo: '플로럴·살롱', promptEn: 'a crystal vase of dark red roses nearby', colorHex: 0x9f1239 },
  { id: 'ring_light', nameKo: '스튜디오 링라이트 스탠드', categoryKo: '촬영·조명', promptEn: 'a studio ring-light stand casting catchlights nearby', colorHex: 0x38bdf8 },
  { id: 'coffee_bag', nameKo: '테이크아웃 커피 & 미니 크로스백', categoryKo: '스트리트', promptEn: 'a takeaway iced coffee cup and leather mini cross-body bag nearby', colorHex: 0xb45309 },
  { id: 'whiskey_decanter', nameKo: '위스키 디캔터 & 크리스탈 잔', categoryKo: '오피스·라운지', promptEn: 'a crystal whiskey decanter and tumbler on a tray nearby', colorHex: 0xd97706 },
  { id: 'hinoki_bucket', nameKo: '히노끼 나무 욕조통 & 스파 타월', categoryKo: '온천·욕실', promptEn: 'a wooden hinoki bath bucket and folded white spa towel nearby', colorHex: 0x92400e },
  { id: 'pole_stage', nameKo: '크롬 버티컬 폴 & 라이트 포디움', categoryKo: '스페셜 무대', promptEn: 'a polished chrome vertical stage pole and circular lit podium', colorHex: 0xcbd5e1 },
];

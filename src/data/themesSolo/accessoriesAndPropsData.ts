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

// 1. 매니큐어 & 페디큐어 컬러 (12종)
export const NAIL_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '네일 미착용 (기본)', promptEn: 'natural clean fingernails and toenails', colorHex: 0xf1f5f9 },
  { id: 'ruby_red', nameKo: '글로시 루비 레드', promptEn: 'glossy ruby-red manicured fingernails and pedicured toenails', colorHex: 0xdc2626 },
  { id: 'jet_black', nameKo: '글로시 제트 블랙', promptEn: 'glossy jet-black manicured fingernails and pedicured toenails', colorHex: 0x09090b },
  { id: 'hot_pink', nameKo: '네온 핫핑크', promptEn: 'glossy hot-pink manicured fingernails and pedicured toenails', colorHex: 0xec4899 },
  { id: 'cobalt_blue', nameKo: '로열 코발트 블루', promptEn: 'glossy cobalt-blue manicured fingernails and pedicured toenails', colorHex: 0x2563eb },
  { id: 'emerald_green', nameKo: '에메랄드 그린', promptEn: 'glossy emerald-green manicured fingernails and pedicured toenails', colorHex: 0x059669 },
  { id: 'french_white', nameKo: '스노우 화이트', promptEn: 'glossy snow-white manicured fingernails and pedicured toenails', colorHex: 0xffffff },
  { id: 'gold_chrome', nameKo: '메탈릭 골드 크롬', promptEn: 'glossy metallic-gold manicured fingernails and pedicured toenails', colorHex: 0xfbbf24 },
  { id: 'electric_violet', nameKo: '일렉트릭 바이올렛', promptEn: 'glossy electric-violet manicured fingernails and pedicured toenails', colorHex: 0x7c3aed },
  { id: 'burgundy_wine', nameKo: '딥 버건디 와인', promptEn: 'deep burgundy-wine manicured fingernails and pedicured toenails', colorHex: 0x881337 },
  { id: 'silver_mirror', nameKo: '실버 미러 스틸레토 네일', promptEn: 'long silver mirror chrome stiletto fingernails', colorHex: 0xcbd5e1 },
  { id: 'coral_peach', nameKo: '글로시 코랄 피치', promptEn: 'glossy coral-peach manicured fingernails and toenails', colorHex: 0xf97316 },
];

// 2. 신발 · 구두 · 스타킹 · 부츠 · 양말 · 맨발 (15종)
export const FOOTWEAR_ITEMS: BodyAccessoryOption[] = [
  { id: 'bare_feet', nameKo: '맨발 (미착용)', promptEn: 'bare feet', colorHex: 0xf1f5f9 },
  { id: 'black_stiletto_mules', nameKo: '블랙 페이턴트 스틸레토 뮬', promptEn: 'sleek black patent open-toe stiletto mules', colorHex: 0x18181b, secondaryHex: 0xdc2626 },
  { id: 'ruby_stiletto_sandals', nameKo: '루비 레드 스트랩 스틸레토 힐', promptEn: 'ruby-red single-strap open-toe stiletto sandals', colorHex: 0xdc2626, secondaryHex: 0xfbbf24 },
  { id: 'clear_pvc_mules', nameKo: '투명 PVC 크리스탈 오픈토 힐', promptEn: 'clear PVC transparent crystal-strap open-toe stiletto mules', colorHex: 0xe0f2fe, secondaryHex: 0x94a3b8 },
  { id: 'white_ankle_stiletto', nameKo: '화이트 앵클스트랩 스틸레토', promptEn: 'white ankle-strap open-toe stiletto heels', colorHex: 0xffffff, secondaryHex: 0xe2e8f0 },
  { id: 'rose_gold_heels', nameKo: '로즈골드 메탈릭 샌들힐', promptEn: 'rose-gold metallic open-toe sandal heels', colorHex: 0xf472b6, secondaryHex: 0xfbbf24 },
  { id: 'nude_slingback_heels', nameKo: '누드 베이지 슬링백 하이힐', promptEn: 'nude-beige open-toe slingback stiletto heels', colorHex: 0xd6b49c, secondaryHex: 0x78350f },
  { id: 'black_sheer_stockings', nameKo: '블랙 시스루 니하이 스타킹 & 힐', promptEn: 'thigh-high sheer black lace-top stockings and black stiletto heels', colorHex: 0x18181b, secondaryHex: 0x3f3f46 },
  { id: 'white_bridal_stockings', nameKo: '화이트 브라이덜 레이스 스타킹 & 힐', promptEn: 'ivory sheer thigh-high stockings with delicate lace tops and peep-toe heels', colorHex: 0xf8fafc, secondaryHex: 0xe2e8f0 },
  { id: 'crimson_garter_stockings', nameKo: '크림슨 레이스 가터 & 블랙 스타킹', promptEn: 'crimson lace garter straps with sheer black thigh-high stockings and stiletto heels', colorHex: 0xbe123c, secondaryHex: 0x18181b },
  { id: 'fishnet_thigh_stockings', nameKo: '블랙 피쉬넷 망사 가터 스타킹 & 힐', promptEn: 'sexy black fishnet thigh-high stockings with garter straps and extreme stiletto heels', colorHex: 0x09090b, secondaryHex: 0xe11d48 },
  { id: 'thigh_high_boots', nameKo: '글로시 블랙 싸이하이 롱부츠', promptEn: 'glossy black patent thigh-high stiletto boots', colorHex: 0x09090b, secondaryHex: 0x27272a },
  { id: 'crimson_latex_boots', nameKo: '크림슨 라텍스 페티시 롱부츠', promptEn: 'glossy crimson latex thigh-high platform fetish boots', colorHex: 0xdc2626, secondaryHex: 0x09090b },
  { id: 'ballet_lace_heels', nameKo: '코르셋 레이스업 스틸레토 부츠', promptEn: 'lace-up corset fetish stiletto high-heel ankle boots', colorHex: 0x27272a, secondaryHex: 0xf43f5e },
  { id: 'white_ankle_socks', nameKo: '화이트 프릴 발목 양말', promptEn: 'dainty white lace-trim ankle socks', colorHex: 0xffffff, secondaryHex: 0xf1f5f9 },
];

// 3. 목 · 쇄골 · 초커 · 리쉬 아이템 (12종)
export const NECK_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '목 아이템 미착용', promptEn: '', colorHex: 0x94a3b8 },
  { id: 'gold_heart_pendant', nameKo: '18K 골드 하트 펜던트 목걸이', promptEn: 'dainty 18k gold heart pendant necklace on her collarbone', colorHex: 0xfbbf24, secondaryHex: 0xf43f5e },
  { id: 'diamond_solitaire', nameKo: '다이아몬드 솔리테어 목걸이', promptEn: 'sparkling diamond solitaire collarbone necklace', colorHex: 0xe2e8f0, secondaryHex: 0x38bdf8 },
  { id: 'black_velvet_choker', nameKo: '블랙 벨벳 오링(O-Ring) 초커', promptEn: 'black velvet choker with a polished silver center O-ring', colorHex: 0x18181b, secondaryHex: 0xe2e8f0 },
  { id: 'lace_ribbon_choker', nameKo: '시어 블랙 레이스 리본 초커', promptEn: 'delicate black Chantilly-lace choker necklace', colorHex: 0x27272a, secondaryHex: 0xbe123c },
  { id: 'gold_lariat_chain', nameKo: '골드 라리앗 Y-드롭 체인', promptEn: 'delicate 18k gold lariat drop necklace between her collarbones', colorHex: 0xf59e0b },
  { id: 'gold_body_chain', nameKo: '18K 골드 쇄골-웨이스트 바디체인', promptEn: 'delicate 18k gold body-chain draping from her collarbone to her narrow waist', colorHex: 0xfbbf24 },
  { id: 'pearl_collar', nameKo: '진주 레이어드 콜라 네크리스', promptEn: 'luminous ivory pearl collar necklace', colorHex: 0xfef3c7 },
  { id: 'leather_collar_ring', nameKo: '블랙 레더 골드링 본디지 초커', promptEn: 'sleek black leather collar choker with gold ring hardware', colorHex: 0x09090b, secondaryHex: 0xfbbf24 },
  { id: 'studded_spike_choker', nameKo: '크롬 스터드 가죽 스파이크 초커', promptEn: 'studded black leather spike bondage collar choker', colorHex: 0x18181b, secondaryHex: 0xcbd5e1 },
  { id: 'collar_chain_leash', nameKo: 'O-링 가죽 초커 & 메탈 체인 리쉬(목줄)', promptEn: 'black leather O-ring collar with a polished chrome chain leash hanging down', colorHex: 0x09090b, secondaryHex: 0x38bdf8 },
  { id: 'crimson_satin_collar', nameKo: '크림슨 벨벳 패들락(자물쇠) 초커', promptEn: 'crimson velvet collar choker with a small gold heart padlock', colorHex: 0xbe123c, secondaryHex: 0xfbbf24 },
];

// 4. 손목 · 팔 · 수갑 커프스 아이템 (12종)
export const WRIST_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '손목 아이템 미착용', promptEn: '', colorHex: 0x94a3b8 },
  { id: 'gold_wrist_chain', nameKo: '18K 골드 슬림 리스트 체인', promptEn: 'thin 18k gold wrist chain bracelet', colorHex: 0xfbbf24 },
  { id: 'diamond_tennis_bracelet', nameKo: '실버 다이아 테니스 팔찌', promptEn: 'sparkling silver diamond tennis bracelet', colorHex: 0xe2e8f0 },
  { id: 'rose_gold_bangle', nameKo: '로즈골드 슬림 뱅글', promptEn: 'delicate rose-gold wrist bangle', colorHex: 0xf472b6 },
  { id: 'satin_ribbon_tie', nameKo: '크림슨 새틴 리본 손목 결박 스트랩', promptEn: 'crimson satin ribbon wrist restraint ties', colorHex: 0xe11d48 },
  { id: 'leather_wrist_cuff', nameKo: '블랙 레더 버클 본디지 커프', promptEn: 'sleek black leather wrist cuffs with silver buckles', colorHex: 0x18181b, secondaryHex: 0xe2e8f0 },
  { id: 'lace_wrist_cuff', nameKo: '샹틸리 레이스 손목 커프스', promptEn: 'sheer black lace wrist cuffs', colorHex: 0x27272a },
  { id: 'metal_luxury_watch', nameKo: '골드 메탈 드레스 워치', promptEn: 'slim gold luxury dress watch on her wrist', colorHex: 0xf59e0b },
  { id: 'chrome_handcuffs', nameKo: '크롬 메탈 체인 수갑 커프스', promptEn: 'polished chrome metal handcuffs on her wrists with connecting chain', colorHex: 0xcbd5e1, secondaryHex: 0x64748b },
  { id: 'plush_velvet_cuffs', nameKo: '핑크 퍼(Fur) 벨벳 구속 커프스', promptEn: 'plush hot-pink fur-lined velvet bondage wrist cuffs', colorHex: 0xec4899, secondaryHex: 0xf43f5e },
  { id: 'latex_opera_gloves', nameKo: '글로시 블랙 라텍스 롱 글러브', promptEn: 'glossy black latex elbow-length opera gloves', colorHex: 0x09090b, secondaryHex: 0x3f3f46 },
  { id: 'sheer_mesh_gloves', nameKo: '시스루 블랙 메쉬 핑거리스 글러브', promptEn: 'sheer black mesh fingerless long gloves', colorHex: 0x27272a },
];

// 5. 허벅지 · 가터 · 종아리 · 발목 커프스 아이템 (12종)
export const LEG_ITEMS: BodyAccessoryOption[] = [
  { id: 'none', nameKo: '다리·발목 아이템 미착용', promptEn: '', colorHex: 0x94a3b8 },
  { id: 'black_lace_garter', nameKo: '블랙 레이스 허벅지 가터 링', promptEn: 'delicate black floral-lace thigh garter ring', colorHex: 0x18181b, secondaryHex: 0xe11d48 },
  { id: 'red_satin_garter', nameKo: '루비 새틴 리본 허벅지 가터', promptEn: 'ruby-red satin ribbon thigh garter straps', colorHex: 0xdc2626 },
  { id: 'dual_hip_thigh_straps', nameKo: '더블 힙 & 허벅지 가터 스트랩 링', promptEn: 'thin double elastic thigh and hip straps with gold adjuster rings', colorHex: 0x18181b, secondaryHex: 0xfbbf24 },
  { id: 'leather_harness_garter', nameKo: '블랙 레더 하네스 허벅지 가터', promptEn: 'black leather thigh harness garter straps with metal O-rings', colorHex: 0x09090b, secondaryHex: 0x94a3b8 },
  { id: 'calf_crisscross_ribbon', nameKo: '종아리 크리스크로스 새틴 스트랩', promptEn: 'crisscross black satin ribbon straps laced around her calves', colorHex: 0x18181b },
  { id: 'gold_chain_anklet', nameKo: '18K 골드 체인 발목 앵클릿', promptEn: 'dainty 18k gold chain anklet around her ankle', colorHex: 0xfbbf24 },
  { id: 'crystal_anklet', nameKo: '크리스탈 드롭 발목 앵클릿', promptEn: 'sparkling crystal-drop silver anklet', colorHex: 0x38bdf8 },
  { id: 'white_lace_garter', nameKo: '아이보리 브라이덜 레이스 가터', promptEn: 'ivory silk bridal-lace thigh garter with a satin bow', colorHex: 0xf8fafc },
  { id: 'leather_ankle_cuffs', nameKo: '블랙 레더 발목 구속 커프스 & 체인', promptEn: 'black leather ankle restraint cuffs with metal D-rings', colorHex: 0x09090b, secondaryHex: 0xcbd5e1 },
  { id: 'crimson_thigh_harness', nameKo: '크림슨 풀 레그 케이지 가터 하네스', promptEn: 'crimson strapping full-thigh cage garter harness', colorHex: 0xbe123c, secondaryHex: 0xfbbf24 },
  { id: 'pearl_thigh_chain', nameKo: '진주 & 골드 드롭 허벅지 체인', promptEn: 'luminous pearl and gold drop thigh chain garter', colorHex: 0xfef3c7, secondaryHex: 0xfbbf24 },
];

// 6. 성인용 자위기구 · 남성용/여성용 초강력 토이 · 섹시 페티시 · BDSM 기구 (21종)
export const TOY_SPECIAL_ITEMS: BodyAccessoryOption[] = [
  { id: 'toy_none', nameKo: '성인·스페셜 기구 미착용', promptEn: '', colorHex: 0x94a3b8 },
  // 여성용 / 공용 초강력 바이브레이터 & 딜도 & 플러그 (10종)
  { id: 'toy_magic_wand', nameKo: '[여성/공용] 초강력 대형 매직 완드 마사지기', promptEn: 'holding a large high-power cord-free magic wand massager vibrator with spherical silicone head', colorHex: 0xec4899, secondaryHex: 0xf8fafc },
  { id: 'toy_rabbit_vibe', nameKo: '[여성용] 듀얼 모터 래빗 바이브레이터', promptEn: 'ergonomic dual-stimulation silicone rabbit vibrator in rose-pink', colorHex: 0xf43f5e, secondaryHex: 0xfbbf24 },
  { id: 'toy_remote_egg', nameKo: '[여성용] 무선 리모컨 러브 에그 바이브레이터', promptEn: 'glossy wireless remote-controlled vibrating love egg with retrieval cord', colorHex: 0xdb2777, secondaryHex: 0x38bdf8 },
  { id: 'toy_suction_rose', nameKo: '[여성용] 초강력 로즈 클리 석션 자극기', promptEn: 'crimson silicone rose-shaped clitoral air-pulse suction stimulator', colorHex: 0xe11d48, secondaryHex: 0xfbbf24 },
  { id: 'toy_glass_wand', nameKo: '[여성/공용] 크리스탈 커브드 글래스 딜도 완드', promptEn: 'sculpted clear borosilicate crystal curved glass dildo wand', colorHex: 0x38bdf8, secondaryHex: 0xe0f2fe },
  { id: 'toy_real_dildo', nameKo: '[여성/공용] 석션컵 실리콘 리얼리스틱 딜도', promptEn: 'contoured silicone realistic dildo with suction-cup base', colorHex: 0xf472b6, secondaryHex: 0xbe123c },
  { id: 'toy_double_dildo', nameKo: '[커플/여성] 더블 엔디드 양방향 플렉시블 딜도', promptEn: 'long flexible double-ended silicone dildo', colorHex: 0x9333ea, secondaryHex: 0xec4899 },
  { id: 'toy_anal_beads', nameKo: '[공용] 그라데이션 실리콘 애널 비즈 스트링', promptEn: 'graduated glossy silicone anal beads string with pull ring', colorHex: 0x7c3aed, secondaryHex: 0xc084fc },
  { id: 'toy_jewel_plug', nameKo: '[공용] 루비 크리스탈 메탈 주얼 애널 플러그', promptEn: 'polished chrome metal butt plug set with a faceted ruby crystal jewel base', colorHex: 0xe11d48, secondaryHex: 0xe2e8f0 },
  { id: 'toy_foxtail_plug', nameKo: '[섹시/페티시] 플러피 폭스테일(여우꼬리) 플러그', promptEn: 'plush faux-fur foxtail plug attachment', colorHex: 0xf97316, secondaryHex: 0xffffff },
  // 남성용 초강력 자위기구 & 인핸서 (4종)
  { id: 'toy_male_stroker', nameKo: '[남성용] 초강력 전동 오토 스트로커 컵 (사이버 챔버)', promptEn: 'high-tech matte-black motorized automatic male stroker cup with LED ring', colorHex: 0x18181b, secondaryHex: 0x06b6d4 },
  { id: 'toy_male_twin_ring', nameKo: '[남성용] 듀얼 진동 스태미나 트윈 링', promptEn: 'black silicone dual-vibrating stamina enhancer ring', colorHex: 0x09090b, secondaryHex: 0x3b82f6 },
  { id: 'toy_male_prostate', nameKo: '[남성용] 인체공학 커브드 전립선 바이브 마사지기', promptEn: 'ergonomic curved black silicone prostate massager vibrator', colorHex: 0x1e293b, secondaryHex: 0x38bdf8 },
  { id: 'toy_strapon_set', nameKo: '[커플/페깅] 가죽 스트랩온 하네스 & 실리콘 딜도 세트', promptEn: 'black leather adjustable strap-on pelvic harness with O-ring and silicone attachment', colorHex: 0x09090b, secondaryHex: 0xe11d48 },
  // 섹시 페티시 · BDSM 바디 기구 & 소품 (6종)
  { id: 'toy_nipple_clamp', nameKo: '[페티시] 18K 골드 체인 니플 클램프 세트', promptEn: 'delicate gold chain nipple clamps draped across the chest', colorHex: 0xfbbf24, secondaryHex: 0xe11d48 },
  { id: 'toy_body_harness', nameKo: '[페티시] 전신 블랙 레더 본디지 케이지 하네스', promptEn: 'full-body black leather bondage cage straps harness with chrome O-rings', colorHex: 0x09090b, secondaryHex: 0xcbd5e1 },
  { id: 'toy_lace_blindfold', nameKo: '[BDSM] 블랙 새틴 & 레이스 아이마스크 (안대)', promptEn: 'sensual black satin and Chantilly lace blindfold eye mask', colorHex: 0x18181b, secondaryHex: 0xbe123c },
  { id: 'toy_ball_gag', nameKo: '[BDSM] 레더 스트랩 크림슨 실리콘 볼 개그', promptEn: 'crimson silicone ball gag with black leather buckle head-strap', colorHex: 0xdc2626, secondaryHex: 0x09090b },
  { id: 'toy_riding_crop', nameKo: '[BDSM] 블랙 레더 승마 크롭 채찍 (손 파지)', promptEn: 'holding a sleek braided black leather riding crop whip', colorHex: 0x18181b, secondaryHex: 0xd97706 },
  { id: 'toy_spank_paddle', nameKo: '[BDSM] 크롬 스터드 가죽 스팽킹 패들 (손 파지)', promptEn: 'holding a studded black leather spanking paddle', colorHex: 0x09090b, secondaryHex: 0xe11d48 },
];

// 7. 3D 공간 추가 소품 (12종 - 와일드카드 소품 및 스튜디오 오브제)
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

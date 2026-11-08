import { SoloThemeId } from '@/types/themeSolo';

export type StageFurnitureKind =
  | 'cafe_bench_table'
  | 'street_railing_lamp'
  | 'storefront_window'
  | 'spiral_stairs_steps'
  | 'rooftop_terrace_bar'
  | 'vanity_bulb_mirror'
  | 'triptych_mirror_pedestal'
  | 'velvet_sofa_salon'
  | 'canopy_king_bed'
  | 'round_mirror_bed'
  | 'wardrobe_closet_bed'
  | 'kitchen_island_bar'
  | 'bathtub_jacuzzi'
  | 'glass_shower_booth'
  | 'sunbed_pool_deck'
  | 'hinoki_onsen_bath'
  | 'tatami_shoji_room'
  | 'pilates_reformer'
  | 'ballet_barre_mirror'
  | 'cadillac_trapeze'
  | 'ceo_desk_chair'
  | 'library_bookshelves'
  | 'jet_oval_recliner'
  | 'limo_jseat_bar'
  | 'sauna_cedar_bench'
  | 'gym_weight_rack'
  | 'spa_massage_bed'
  | 'elevator_stair_special';

export interface TranslatedEnvironmentInfo {
  index: number;
  titleKo: string;
  propsKo: string;
  furnitureKind: StageFurnitureKind;
  hasMirror: boolean;
  hasWater: boolean;
  hasPlants: boolean;
  hasNeon: boolean;
}

const KEYWORD_RULES: Array<{
  pattern: RegExp;
  titleKo: string;
  propsKo: string;
  furnitureKind: StageFurnitureKind;
}> = [
  { pattern: /kitchen|refrigerator|coffee maker|island counter/i, titleKo: '대리석 아일랜드 홈 키친', propsKo: '아일랜드 식탁·바스툴·커피머신', furnitureKind: 'kitchen_island_bar' },
  { pattern: /shower booth|shower enclosure|rainfall deck shower|waterfall shower|rain-shower/i, titleKo: '통유리 샤워부스 & 워터폴', propsKo: '유리 파티션·샤워헤드·타일벤치', furnitureKind: 'glass_shower_booth' },
  { pattern: /hinoki|rotenburo|onsen|cypress.*bath|cedarwood.*bath|barrel soaking/i, titleKo: '히노끼 노천 온천탕 & 정원', propsKo: '편백 욕조·온천수·정원석·대나무', furnitureKind: 'hinoki_onsen_bath' },
  { pattern: /tatami|chabudai|shoji|kumiko|futon|engawa/i, titleKo: '전통 다다미 스위트 & 쇼지창', propsKo: '다다미 마루·좌탁·격자창·행등', furnitureKind: 'tatami_shoji_room' },
  { pattern: /bathtub|jacuzzi|plunge pool|hot-spring|rock-pool|soaking tub/i, titleKo: '프라이빗 자쿠지 & 스톤 욕조', propsKo: '대리석 욕조·수면·수전·캔들', furnitureKind: 'bathtub_jacuzzi' },
  { pattern: /cadillac trapeze|tower wall unit|smith-machine|cable-machine/i, titleKo: '캐딜락 트라페즈 & 타워 기구', propsKo: '크롬 캐딜락 프레임·매트·바', furnitureKind: 'cadillac_trapeze' },
  { pattern: /reformer|wunda chair|ladder barrel|spine-corrector|vaulting box/i, titleKo: '원목 리포머 & 기구 필라테스', propsKo: '리포머 캐리지·숄더블록·풋바', furnitureKind: 'pilates_reformer' },
  { pattern: /ballet barre|dance floor|stretching|yoga|posture clinic/i, titleKo: '전면 거울 & 우드 발레 바', propsKo: '2단 원목 발레바·전면거울·매트', furnitureKind: 'ballet_barre_mirror' },
  { pattern: /sauna|salt-brick|hemlock-wood|red-cedar wooden bench/i, titleKo: '핀란드식 적삼목 건식 사우나', propsKo: '2단 편백 벤치·사우나 스토브·나무통', furnitureKind: 'sauna_cedar_bench' },
  { pattern: /weight bench|bench press|dumbbell|crunch bench|hyperextension|gym/i, titleKo: 'VIP 웨이트 벤치 & 덤벨 랙', propsKo: '인클라인 벤치·크롬 덤벨랙·거울', furnitureKind: 'gym_weight_rack' },
  { pattern: /massage|aromatherapy|hammam|therapy table|contouring bed|examination bed/i, titleKo: '아로마 테라피 베드 & 캔들룸', propsKo: '테라피 베드·볼스터·오일워머·캔들', furnitureKind: 'spa_massage_bed' },
  { pattern: /round black-silk bed|ceiling mirror|love-hotel/i, titleKo: '원형 실크 침대 & 천장 미러룸', propsKo: '원형 베드·상부 미러·네온 링', furnitureKind: 'round_mirror_bed' },
  { pattern: /three-way dressing mirror|fitting pedestal|fitting booth|full-length.*mirror/i, titleKo: '3면 전신 거울 & 피팅 포디움', propsKo: '3면 폴딩거울·원형 포디움·커튼', furnitureKind: 'triptych_mirror_pedestal' },
  { pattern: /vanity|makeup|perfume|dressing table|powder room/i, titleKo: '할리우드 조명 거울 화장대', propsKo: '볼전구 거울·화장대·벨벳 스툴·향수', furnitureKind: 'vanity_bulb_mirror' },
  { pattern: /wardrobe|closet|garment rack|chest of drawers|dresser/i, titleKo: '오픈 옷장 & 드레스룸 침실', propsKo: '오픈 옷장·행거·침대·서랍장', furnitureKind: 'wardrobe_closet_bed' },
  { pattern: /bookshelves|library|study/i, titleKo: '마호가니 서재 & 북쉘프 코너', propsKo: '대형 원목 책장·도서·가죽 체어', furnitureKind: 'library_bookshelves' },
  { pattern: /executive desk|mahogany desk|boardroom table|drafting table|credenza|ceo/i, titleKo: 'CEO 이그제큐티브 데스크 & 뷰', propsKo: '마호가니 데스크·가죽체어·통유리창', furnitureKind: 'ceo_desk_chair' },
  { pattern: /oval.*window|private-jet|private jet|gulfstream|boeing|sky-suite|sky-bed/i, titleKo: '전용기 오벌 창가 & VIP 리클라이너', propsKo: '오벌 기내창·가죽 리클라이너·월넛 테이블', furnitureKind: 'jet_oval_recliner' },
  { pattern: /limousine|j-seat|maybach|starlight headliner|suv rear/i, titleKo: '리무진 J-시트 & 스타라이트 바', propsKo: '퀼팅 가죽시트·오닉스 샴페인바·네온', furnitureKind: 'limo_jseat_bar' },
  { pattern: /elevator|laundromat|stairwell|night train|speakeasy|recording/i, titleKo: '미드나잇 시크릿 부스 & 스페셜', propsKo: '메탈 프레임·글라스 부스·네온 라이트', furnitureKind: 'elevator_stair_special' },
  { pattern: /spiral staircase|stone stoop|step|staircase|bridge parapet/i, titleKo: '주철 나선형 계단 & 스톤 테라스', propsKo: '층계 단상·주철 난간·벽돌 아치', furnitureKind: 'spiral_stairs_steps' },
  { pattern: /rooftop|skyline|balustrade|overlook|champagne bar|onyx bar|wet-bar|night bar|tiki-counter|swim-up bar/i, titleKo: '루프탑 스카이 바 & 테라스 난간', propsKo: '백라이트 바 카운터·바스툴·유리난간', furnitureKind: 'rooftop_terrace_bar' },
  { pattern: /storefront|diner window|shopfront|mural|facade|shelter/i, titleKo: '빈티지 쇼윈도 & 네온 스트리트', propsKo: '아치 쇼윈도·네온사인·가로등·벽돌벽', furnitureKind: 'storefront_window' },
  { pattern: /café|cafe|bistro|espresso|wooden.*bench|patio|courtyard/i, titleKo: '유럽풍 노천 카페 벤치 & 테라스', propsKo: '원목 슬랫 벤치·비스트로 테이블·가로등', furnitureKind: 'cafe_bench_table' },
  { pattern: /sundeck|sunbed|sun-lounger|sun-pad|cabana|overwater|beach|lagoon|rattan daybed|swing-sofa|swing-bed/i, titleKo: '선베드 카바나 & 라군 데크', propsKo: '티크 선베드·카바나 프레임·수면 데크', furnitureKind: 'sunbed_pool_deck' },
  { pattern: /sofa|couch|chaise|settee|divan|ottoman|fireplace|harpsichord/i, titleKo: '앤틱 벨벳 소파 & 대리석 살롱', propsKo: '체스터필드 소파·대리석 기둥·사이드테이블', furnitureKind: 'velvet_sofa_salon' },
  { pattern: /canopy bed|four-poster|king-size.*bed|ebony bed|stateroom bed|bed|mattress|duvet|bedroom/i, titleKo: '프라이빗 캐노피 베드 & 무드등', propsKo: '침대 프레임·볼스터 쿠션·협탁 램프', furnitureKind: 'canopy_king_bed' },
];

const FEATURE_TOKENS: Array<[RegExp, string]> = [
  [/wrought-iron spiral staircase/i, '주철 나선형 계단'],
  [/wrought-iron cafe railing/i, '주철 카페 난간'],
  [/vintage storefront window/i, '빈티지 쇼윈도'],
  [/stone stoop step/i, '돌계단 포치'],
  [/bistro string lights/i, '비스트로 스트링 조명 데크'],
  [/neon-lit backstreet/i, '네온 쇼핑 뒷골목'],
  [/rooftop parking deck/i, '루프탑 스카이라인 데크'],
  [/mural art lane/i, '다운타운 벽화 골목'],
  [/glass shelter/i, '모던 글라스 쉘터'],
  [/retro neon diner/i, '레트로 네온 다이너'],
  [/lantern-lit wooden shopfront/i, '등불 목조 상점 골목'],
  [/stone bridge parapet/i, '수변 돌다리 난간'],
  [/marble facade/i, '명품 부티크 대리석 파사드'],
  [/espresso bar/i, '골목 에스프레소 바 벤치'],
  [/cobblestone arcade/i, '코블스톤 아케이드 길'],
  [/concrete feature wall/i, '모던 콘크리트 디자인월'],
  [/rooftop terrace alley bar/i, '루프탑 벽돌 테라스 바'],
  [/street awning pillar/i, '다운타운 어닝 기둥'],
  [/three-way dressing mirrors/i, '3면 전신거울 피팅 단상'],
  [/hollywood bulb vanity/i, '할리우드 볼전구 화장대'],
  [/crystal perfume decanters/i, '크리스탈 향수 진열대'],
  [/parisian haute-couture/i, '파리 오트쿠튀르 살롱'],
  [/boucle lounge sofa/i, '크림 부클레 소파 살롱'],
  [/champagne cart/i, '샴페인 카트 & 플로럴 부스'],
  [/round black-silk bed/i, '원형 블랙실크 침대 & 천장거울'],
  [/underground parking/i, '심야 지하주차장 리무진 시트'],
  [/elevator cab/i, '초고층 미러 엘리베이터 부스'],
  [/emergency stairwell/i, '미드나잇 비상계단 랜딩'],
  [/unmanned laundromat/i, '심야 24시 코인 세탁방'],
  [/casino vip lounge/i, '레드벨벳 카지노 VIP 부스'],
  [/night train compartment/i, '1등석 야간열차 침대칸'],
  [/suv rear cargo/i, '해안 전망대 SUV 차박 매트리스'],
  [/home cinema/i, '프라이빗 홈 시네마 라운지'],
  [/recording and streaming/i, '방음 스트리밍 스튜디오 부스'],
  [/speakeasy/i, '시크릿 스피크이지 벨벳 백룸'],
  [/korean-style vanity/i, '한국식 좌식 화장대 & 매트리스'],
  [/laundry basket/i, '원목 옷장 & 런드리 바스켓'],
  [/rolling clothes rack/i, '이동식 행거 & 스튜디오 침실'],
  [/shoe rack/i, '오픈 옷장 & 슈즈랙 코너'],
  [/walk-in closet/i, '워크인 클로젯 & 수납 벤치'],
  [/sliding-door wardrobe/i, '슬라이딩 옷장 & 침대 엣지'],
  [/chest of drawers/i, '우드 서랍장 & 전신거울 침실'],
  [/metal garment rack/i, '메탈 행거 & 오픈 클로젯'],
  [/tilted full-length floor mirror/i, '틸트 전신거울 & 드레스룸'],
  [/ajar wooden bedroom door/i, '반쯤 열린 방문 너머 침실'],
  [/half-open bedroom doorway/i, '도어웨이 프레임 드레스룸'],
  [/marble kitchen island/i, '대리석 아일랜드 식탁 & 냉장고'],
  [/sink counter and dining table/i, '싱크 카운터 & 다이닝 주방'],
  [/coffee maker/i, '커피머신 & 펜던트 홈바 카운터'],
  [/clear water and light soap foam/i, '거품 목욕 홈 배스텁 & 타일'],
  [/glass-partitioned home bathroom/i, '투명 유리 파티션 홈 샤워부스'],
  [/bathroom vanity counter/i, '글로잉 미러 욕실 세면대 카운터'],
  [/harpsichord/i, '앤틱 하프시코드 & 로코코 살롱'],
  [/marble fireplace/i, '대리석 벽난로 & 벨벳 살롱'],
  [/boiserie wall/i, '금장 부아제리 패널 & 벽등 살롱'],
  [/canopy bed/i, '4주 캐노피 베드 & 실크 드레이프'],
  [/rattan daybed/i, '빅토리안 글라스하우스 라탄 데이베드'],
  [/swing-sofa|swing-bed/i, '아치 유리온실 행잉 스윙소파'],
  [/waterfall pond/i, '보태니컬 실내 폭포 & 스톤 벤치'],
  [/reflecting pool/i, '온실 리플렉팅 풀 & 스톤 엣지'],
  [/overwater bungalow/i, '몰디브 수상 방갈로 티크 선데크'],
  [/powder-white maldives/i, '몰디브 화이트샌드 캐노피 베드'],
  [/driftwood lounge bench/i, '산호 모래톱 드리프트우드 벤치'],
  [/timber jetty walkway/i, '에메랄드 라군 우드 제티 워크웨이'],
  [/glass-floor spa pavilion/i, '수상 글라스 플로어 스파 파빌리온'],
  [/hinoki cypress wood bath/i, '히노끼 편백 노천탕 테라스'],
  [/tatami master suite/i, '전통 다다미 마스터 스위트 & 쇼지'],
  [/rotenburo rock bath/i, '대나무 정원 노천 암석탕'],
  [/engawa veranda/i, '단풍 정원 뷰 히노끼 엔가와 마루'],
  [/chabudai table/i, '다다미 다실 & 칠기 차부다이 좌탁'],
  [/andon lantern/i, '안돈 등불 목조 료칸 회랑'],
  [/kumiko wooden lattice/i, '쿠미코 세공 격자창 다실 코너'],
  [/reformer carriage/i, '화이트 가죽 리포머 & 미러 스튜디오'],
  [/cadillac trapeze bed/i, '크롬 캐딜락 트라페즈 베드'],
  [/spine-corrector barrel/i, '스파인 코렉터 바렐 & 메이플 플로어'],
  [/wunda chair/i, '필라테스 운다 체어 & 스프링 기구'],
  [/ladder barrel/i, '래더 바렐 & 1:1 리포머 스튜디오'],
  [/walnut executive desk/i, '월넛 CEO 데스크 & 스카이라인'],
  [/mahogany bookshelves/i, '백라이트 마호가니 서재 책장'],
  [/chesterfield sofa/i, '블랙 가죽 체스터필드 VIP 소파'],
  [/boardroom table/i, '펜트하우스 대리석 보드룸 테이블'],
  [/whiskey decanter/i, 'CEO 오피스 크리스탈 위스키 바'],
  [/gulfstream/i, '걸프스트림 전용기 크림 가죽 시트'],
  [/oval private-jet/i, '구름 위 오벌 전용기 창가 라운지'],
  [/boeing business jet/i, '보잉 비즈니스 제트 스카이 디반'],
  [/burr-walnut fold-out/i, '전용기 월넛 폴딩 다이닝 테이블'],
  [/maybach-pullman/i, '마이바흐 풀만 리무진 VIP 슬리퍼 시트'],
  [/starlight headliner/i, '스타라이트 천장 & 리무진 라운지'],
  [/black-onyx champagne bar/i, '리무진 블랙 오닉스 샴페인 바'],
  [/incline weight bench/i, 'VIP 프라이빗 짐 인클라인 웨이트 벤치'],
  [/red-cedar wooden bench/i, '2단 적삼목 건식 사우나 벤치'],
  [/cable-machine frame/i, '크롬 케이블 머신 피트니스 부스'],
  [/chrome dumbbells/i, '크롬 덤벨 랙 & 러버 플로어'],
  [/salt-brick wall/i, '히말라야 솔트브릭 건식 사우나'],
  [/smith-machine bar/i, '프라이빗 스미스 머신 트레이닝 존'],
  [/hammam/i, '블랙 마블 하맘 & 오일 테라피 베드'],
  [/thai-style silk floor/i, '오리엔탈 실크 플로어 마사지 매트'],
  [/travertine stone/i, '트라버틴 스톤 캔들 마사지 단상'],
];

const MODIFIER_WORDS: Array<[RegExp, string]> = [
  [/vanity mirror|vanity table|vanity counter|vanity desk/i, '화장대 미러'],
  [/open wardrobe|open closet|wardrobe|closet/i, '오픈 옷장'],
  [/unmade.*bed|rumpled.*bed|bedroom bed|queen bed|king bed/i, '침대'],
  [/full-length.*mirror|standing.*mirror|floor mirror/i, '전신거울'],
  [/velvet stool|cushioned stool|posing stool/i, '벨벳 스툴'],
  [/chaise lounge|fainting couch|daybed/i, '데이베드 소파'],
  [/window bench|windowsill|window ledge/i, '윈도우 벤치'],
  [/marble counter|marble rim|marble ledge/i, '대리석 카운터'],
  [/sunbed|sundeck|sun-lounger/i, '선베드 데크'],
  [/jacuzzi|bathtub|hot-spring|onsen/i, '배스 & 자쿠지'],
  [/shower/i, '샤워 부스'],
];

export function translateEnvironmentItem(
  envText: string,
  index: number,
  themeId: SoloThemeId
): TranslatedEnvironmentInfo {
  const matchedRule = KEYWORD_RULES.find((r) => r.pattern.test(envText)) || {
    titleKo: '프라이빗 스튜디오 라운지',
    propsKo: '라운지 벤치·조명 프레임·오브제',
    furnitureKind: 'street_railing_lamp' as StageFurnitureKind,
  };

  let specificTitle = '';
  for (const [regex, label] of FEATURE_TOKENS) {
    if (regex.test(envText)) {
      specificTitle = label;
      break;
    }
  }

  if (!specificTitle) {
    const foundMods: string[] = [];
    for (const [regex, mod] of MODIFIER_WORDS) {
      if (regex.test(envText) && !foundMods.includes(mod)) {
        foundMods.push(mod);
        if (foundMods.length === 2) break;
      }
    }
    specificTitle = foundMods.length >= 2 ? `${foundMods[0]} & ${foundMods[1]} 세트` : matchedRule.titleKo;
  }

  return {
    index,
    titleKo: `${String(index + 1).padStart(2, '0')}. ${specificTitle}`,
    propsKo: matchedRule.propsKo,
    furnitureKind:
      themeId === 'alley_downtown_street' && matchedRule.furnitureKind === 'street_railing_lamp'
        ? 'street_railing_lamp'
        : matchedRule.furnitureKind,
    hasMirror: /mirror/i.test(envText),
    hasWater: /pool|water|bath|jacuzzi|onsen|lagoon|ocean|sea|canal|waterfall/i.test(envText),
    hasPlants: /palm|monstera|fern|botanical|garden|orchid|bamboo|jasmine|olive|banana-leaf|hibiscus/i.test(envText),
    hasNeon: /neon|cyber|love-hotel|starlight|led/i.test(envText),
  };
}

export function translateLightingItem(lightText: string, index: number): string {
  if (/golden hour|sunset/i.test(lightText)) return `${index + 1}. 골든아워 석양 & 웜 림라이트`;
  if (/smartphone camera flash|ring-light/i.test(lightText)) return `${index + 1}. 다이렉트 카메라 플래시 & 링라이트`;
  if (/neon|magenta|cyber-noir/i.test(lightText)) return `${index + 1}. 네온 마젠타 & 사이버 무드광`;
  if (/candlelight|candelabra/i.test(lightText)) return `${index + 1}. 골든 캔들라이트 & 샹들리에`;
  if (/vanity.*bulb|mirror/i.test(lightText)) return `${index + 1}. 화장대 전면 웜 LED 글로우`;
  if (/morning|sunbeams|daylight|sunshine/i.test(lightText)) return `${index + 1}. 맑은 아침 자연광 & 선빔`;
  if (/twilight|evening|night|midnight/i.test(lightText)) return `${index + 1}. 트와일라잇 나이트 & 앰버 무드등`;
  if (/sauna|steam|mist/i.test(lightText)) return `${index + 1}. 스팀 미스트 & 소프트 확산광`;
  return `${index + 1}. 스튜디오 시네마틱 앰비언트 조명`;
}

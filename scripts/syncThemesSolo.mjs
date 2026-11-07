import fs from 'fs';
import path from 'path';

const SOURCE_DIR = 'F:/prompt/themes_solo';
const TARGET_DIR = path.resolve('src/data/themesSolo');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const THEME_NAMES_KO = {
  alley_downtown_street: { titleKo: '골목 & 다운타운 스트리트', descKo: '햇살 드는 벽돌 골목, 네온 조명과 노천 카페 테라스' },
  backstage_fitting_lounge: { titleKo: '백스테이지 피팅 라운지', descKo: '런웨이 뒤편의 벨벳 커튼, 조명 거울과 럭셔리 드레스룸' },
  extreme_high_tension_special: { titleKo: '익스트림 하이텐션 스페셜', descKo: '드라마틱한 네온과 강렬한 앰비언트 라이트의 특별 공간' },
  glasshouse_sunroom_lounge: { titleKo: '글라스하우스 선룸 라운지', descKo: '전면 통유리창으로 쏟아지는 햇살과 보태니컬 온실' },
  gothic_rococo_salon: { titleKo: '고딕 로코코 살롱', descKo: '화려한 샹들리에와 앤틱 벨벳 소파가 있는 고전 살롱' },
  house_indoor_room: { titleKo: '하우스 인도어 룸', descKo: '포근한 침실, 모던 거실, 대리석 주방 등 실내 프라이빗 공간' },
  infinity_pool_yacht: { titleKo: '인피니티 풀 & 요트', descKo: '에메랄드빛 바다, 럭셔리 요트 갑판과 프라이빗 풀' },
  luxury_hotel_penthouse: { titleKo: '럭셔리 호텔 펜트하우스', descKo: '초고층 도심 파노라마 스카이라인과 5성급 펜트하우스 스위트' },
  maldives_beach_villa: { titleKo: '몰디브 비치 빌라', descKo: '수상 방갈로 선데크와 백사장, 열대 야자수가 있는 휴양지' },
  onsen_ryokan_spa: { titleKo: '온천 료칸 스파', descKo: '히노끼 편백나무 욕조와 다다미방, 전통 온천 힐링 공간' },
  pilates_mirror_studio: { titleKo: '필라테스 미러 스튜디오', descKo: '전면 거울 벽과 원목 리포머 기구가 있는 모던 스튜디오' },
  private_ceo_office: { titleKo: '프라이빗 CEO 오피스', descKo: '도심 뷰 전면 유리창, 최고급 가죽 소파와 마호가니 데스크' },
  private_jet_cabin: { titleKo: '프라이빗 제트 기내', descKo: '구름 위 전용기 가죽 리클라이너 좌석과 프라이빗 캐빈' },
  private_stretch_limousine: { titleKo: '프라이빗 스트레치 리무진', descKo: '스타라이트 천장 조명과 샴페인 바가 있는 VIP 리무진 내부' },
  vip_aroma_oil_spa: { titleKo: 'VIP 아로마 오일 스파', descKo: '은은한 캔들 불빛과 실크 쿠션이 놓인 럭셔리 테라피 룸' },
  vip_gym_sauna_suite: { titleKo: 'VIP 짐 & 사우나 스위트', descKo: '프라이빗 웨이트 룸과 편백나무 핀란드식 건식 사우나' },
};

const SHOT_PREFIXES = [
  'Close cowboy shot right in front of the close camera',
  'Close medium-full shot right in front of the close camera',
  'Close cowboy shot at close 0.6m portrait range',
  'Close medium-full shot at close 0.6m portrait range',
  'Ultra-close 0.5m cowboy shot right in front of the close 0.5m camera',
  'Ultra-close 0.5m cowboy shot at ultra-close 0.5m portrait range',
  'Ultra-close 0.5m cowboy shot in intimate close front-facing view',
  "Ultra-close 0.5m cowboy shot within arm's reach of the close lens",
];

const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.txt'));

// 1. 공통 마스터 프리픽스 / 서픽스 추출
const sampleContent = fs.readFileSync(path.join(SOURCE_DIR, files[0]), 'utf8');
const sampleMatches = [...sampleContent.matchAll(/\{([^{}]+)\}/g)];

const masterPrefix = sampleContent.slice(0, sampleMatches[0].index).trim();
const masterSuffix = sampleContent.slice(sampleMatches[3].index + sampleMatches[3][0].length).trim();

// 2. 의상 200종 추출
const outfitsRaw = sampleMatches[0][1].split('|');
function getOutfitCategory(idx) {
  if (idx < 30) return { cat: 'lingerie', label: '란제리 세트' };
  if (idx < 60) return { cat: 'micro_bikini', label: '마이크로 비키니 & 모노키니' };
  if (idx < 80) return { cat: 'body_jewelry', label: '바디 주얼리 & 올 누드' };
  if (idx < 100) return { cat: 'crop_hotpants', label: '크롭탑 & 마이크로 핫팬츠' };
  if (idx < 125) return { cat: 'top_only', label: '상의 단독 착용 (하의 실종)' };
  if (idx < 150) return { cat: 'topless_bottom', label: '상의 탈의 (탑리스) & 하의' };
  if (idx < 175) return { cat: 'costume_dress', label: '테마 코스튬 & 드레스' };
  return { cat: 'color_contrast', label: '보색 배색 투피스' };
}

function extractOutfitName(text) {
  const m = text.match(/is wearing (.*?)(, glossy|, keeping|with her)/i);
  if (m) {
    let name = m[1].replace(/^(a|an|only a|only an)\s+/i, '').trim();
    return name.slice(0, 50);
  }
  if (text.includes('She is nude and naked')) return '올 누드 & 골드 주얼리';
  return '커스텀 스타일링';
}

const outfitList = outfitsRaw.map((text, idx) => {
  const { cat, label } = getOutfitCategory(idx);
  const nameEn = extractOutfitName(text);
  return {
    id: idx + 1,
    category: cat,
    categoryLabelKo: label,
    nameEn: nameEn,
    nameKo: `${label} #${(idx % 25) + 1} (${nameEn.slice(0, 30)}...)`,
    text: text.trim(),
  };
});

// 3. 포즈 300종에서 고유 100종 코어 포즈 추출
const posturesRaw = sampleMatches[1][1].split('|');
const uniquePostureMap = new Map();

posturesRaw.forEach((fullText) => {
  let matchedPrefix = '';
  let core = fullText;
  for (const pfx of SHOT_PREFIXES) {
    if (fullText.startsWith(pfx)) {
      matchedPrefix = pfx;
      core = fullText.slice(pfx.length).trim();
      break;
    }
  }

  const anatomyIdx = core.indexOf(', her bare breasts');
  const pureCore = anatomyIdx !== -1 ? core.slice(0, anatomyIdx).trim() : core;

  if (!uniquePostureMap.has(pureCore)) {
    uniquePostureMap.set(pureCore, {
      defaultShotPrefix: matchedPrefix || SHOT_PREFIXES[0],
      pureCore,
    });
  }
});

const corePostureArray = Array.from(uniquePostureMap.values());
function getPostureGroup(idx) {
  if (idx < 15) return { group: 'seated_m', labelKo: '좌식 & M자 & 무릎 꿇기', height: 0.85, dist: 1.8, fov: 28 };
  if (idx < 25) return { group: 'standing', labelKo: '기립 & 콘트라포스토', height: 1.05, dist: 2.3, fov: 28 };
  if (idx < 35) return { group: 'lounging', labelKo: '쿠션 리클라이닝 & 사이드 라잉', height: 0.75, dist: 1.9, fov: 28 };
  if (idx < 50) return { group: 'furniture_straddle', labelKo: '가구 모서리 & 체어 스트래들', height: 0.90, dist: 1.9, fov: 28 };
  if (idx < 60) return { group: 'v_split', labelKo: '초근접 0.5m V-스플릿 & 레그 리프트', height: 0.75, dist: 1.5, fov: 26 };
  if (idx < 70) return { group: 'deep_m_squat', labelKo: '초근접 0.5m 딥 M-스쿼트 & 프로그', height: 0.70, dist: 1.5, fov: 26 };
  if (idx < 80) return { group: 'rear_arch', labelKo: '초근접 0.5m 3/4 캣아치 & 잭나이프', height: 0.80, dist: 1.6, fov: 26 };
  if (idx < 90) return { group: 'bolster_ride', labelKo: '초근접 0.5m 볼스터 라이딩 & 보우아치', height: 0.85, dist: 1.5, fov: 26 };
  return { group: 'high_leg', labelKo: '초근접 0.5m 가구 위 하이 레그프롭', height: 0.90, dist: 1.5, fov: 26 };
}

const postureItems = corePostureArray.map((item, idx) => {
  const g = getPostureGroup(idx);
  return {
    id: idx + 1,
    labelKo: `[포즈 ${String(idx + 1).padStart(3, '0')}] ${g.labelKo} #${(idx % 15) + 1}`,
    coreText: item.pureCore,
    defaultShotPrefix: item.defaultShotPrefix,
    targetHeight: g.height,
    cameraDistance: g.dist,
    fov: g.fov,
    group: g.group,
  };
});

// 4. 16개 테마 메타데이터 및 배경/조명 데이터 추출
const themesData = {};
for (const file of files) {
  const themeId = file.replace('.txt', '');
  const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
  const matches = [...content.matchAll(/\{([^{}]+)\}/g)];
  const envs = matches[2][1].split('|').map((s) => s.trim());
  const lights = matches[3][1].split('|').map((s) => s.trim());

  const meta = THEME_NAMES_KO[themeId] || { titleKo: themeId, descKo: '' };
  themesData[themeId] = {
    id: themeId,
    titleEn: themeId.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    titleKo: meta.titleKo,
    descriptionKo: meta.descKo,
    environments: envs,
    lightings: lights,
  };
}

// 5. JSON 및 TS 파일 분리 생성
// 5.1 masterTemplate.ts
fs.writeFileSync(
  path.join(TARGET_DIR, 'masterTemplate.ts'),
  `export const MASTER_PREFIX = ${JSON.stringify(masterPrefix)};\n\nexport const MASTER_SUFFIX = ${JSON.stringify(masterSuffix)};\n\nexport const SHOT_PREFIXES = ${JSON.stringify(SHOT_PREFIXES, null, 2)} as const;\n`
);

// 5.2 outfitsData.json & outfitsData.ts
fs.writeFileSync(path.join(TARGET_DIR, 'outfitsData.json'), JSON.stringify(outfitList));
fs.writeFileSync(
  path.join(TARGET_DIR, 'outfitsData.ts'),
  `import { OutfitItem } from '@/types/themeSolo';\nimport rawData from './outfitsData.json';\n\nexport const OUTFITS_DATA: OutfitItem[] = rawData as OutfitItem[];\n`
);

// 5.3 posturesTextData.json & posturesTextData.ts
fs.writeFileSync(path.join(TARGET_DIR, 'posturesTextData.json'), JSON.stringify(postureItems));
fs.writeFileSync(
  path.join(TARGET_DIR, 'posturesTextData.ts'),
  `import { PostureCoreItem } from '@/types/themeSolo';\nimport rawData from './posturesTextData.json';\n\nexport const POSTURES_DATA: PostureCoreItem[] = rawData as PostureCoreItem[];\n`
);

// 5.4 themesData.json & themesData.ts
fs.writeFileSync(path.join(TARGET_DIR, 'themesData.json'), JSON.stringify(themesData));
fs.writeFileSync(
  path.join(TARGET_DIR, 'themesData.ts'),
  `import { SoloThemeId, SoloThemeInfo } from '@/types/themeSolo';\nimport rawData from './themesData.json';\n\nexport const THEMES_DATA: Record<SoloThemeId, SoloThemeInfo> = rawData as Record<SoloThemeId, SoloThemeInfo>;\n`
);

// 5.5 index.ts
fs.writeFileSync(
  path.join(TARGET_DIR, 'index.ts'),
  `export * from './masterTemplate';\nexport * from './outfitsData';\nexport * from './posturesTextData';\nexport * from './themesData';\n`
);

console.log('Successfully generated JSON and clean TS modules!');

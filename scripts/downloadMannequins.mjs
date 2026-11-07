import fs from 'fs';
import path from 'path';

const MODELS_DIR = path.resolve('public/models');
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

const MODELS = [
  {
    id: 'anime_female',
    name: '애니메이션 슬림 여성 (Anime Female)',
    filename: 'anime_female_OP_IK.fbx',
    url: 'https://posemy.art/app/assets/models/anime_female_OP_IK.fbx',
  },
  {
    id: 'realistic_woman',
    name: '리얼리스틱 여성 (Realistic Woman)',
    filename: 'realistic_woman_OP_IK.fbx',
    url: 'https://posemy.art/app/assets/models/realistic_woman_OP_IK.fbx',
  },
  {
    id: 'realistic_muscular_male',
    name: '머슬 피트니스 남성 (Muscular Male)',
    filename: 'realistic_muscular_male_OP_IK.fbx',
    url: 'https://posemy.art/app/assets/models/realistic_muscular_male_OP_IK.fbx',
  },
  {
    id: 'anime_basic_male',
    name: '애니메이션 슬림 남성 (Anime Male)',
    filename: 'anime_basic_male_OP_IK.fbx',
    url: 'https://posemy.art/app/assets/models/anime_basic_male_OP_IK.fbx',
  },
  {
    id: 'male_mannequin',
    name: '아티스트 조인트 인형 (Artist Mannequin)',
    filename: 'male_mannequin_OP_IK.fbx',
    url: 'https://posemy.art/app/assets/models/male_mannequin_OP_IK.fbx',
  },
  {
    id: 'chibi_male',
    name: 'SD 치비 캐릭터 (Chibi Character)',
    filename: 'chibi_male_OP_IK.fbx',
    url: 'https://posemy.art/app/assets/models/chibi_male_OP_IK.fbx',
  },
];

async function downloadFile(model) {
  const destPath = path.join(MODELS_DIR, model.filename);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`[Already Exists] ${model.name} (${fs.statSync(destPath).size} bytes)`);
    return;
  }

  console.log(`Downloading ${model.name} from ${model.url}...`);
  try {
    const res = await fetch(model.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) {
      console.warn(`Failed to download ${model.name}: ${res.status} ${res.statusText}`);
      return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`[Saved] ${model.filename} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`Error downloading ${model.name}:`, err);
  }
}

async function run() {
  for (const m of MODELS) {
    await downloadFile(m);
  }
  console.log('All model downloads complete!');
}

run();

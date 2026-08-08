import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { generateGardenImage } from '../server/garden-image-service.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'generated/v04-water-stand-placement');
const DEFAULT_SOURCE = '/Users/yasudashinya/Downloads/IMG_4858.JPG';
const RUN_COUNT = Number(process.argv[2] || 20);

function loadEnv() {
  const envPath = resolve(PROJECT_ROOT, '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  });
}

function mimeType(filePath) {
  const extension = extname(filePath).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.webp') return 'image/webp';
  return 'image/png';
}

function fileToDataUrl(filePath) {
  const buffer = readFileSync(filePath);
  return `data:${mimeType(filePath)};base64,${buffer.toString('base64')}`;
}

function dataUrlToBuffer(dataUrl) {
  const match = /^data:[^;]+;base64,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('generated image is not a base64 data URL');
  return Buffer.from(match[1], 'base64');
}

const waterStandReference = {
  product_id: 'WATER-STAND-SCENE-REFERENCE',
  product_name: '立水栓 ガーデンパン施工イメージ',
  category: '立水栓',
  main_image: 'images/g20-material/water-stand-reference/water-stand-full-column-pan.jpg',
  ai_reference_images: [
    'images/g20-material/water-stand-reference/water-stand-two-faucet-detail.jpg',
    'images/g20-material/water-stand-reference/water-stand-square-pan-detail.jpg',
  ],
  size: '庭用立水栓とガーデンパン',
  color: 'ダークグレー角柱、ブラック水栓、ダークグレー角型パン',
  ai_features: [
    '細身の角柱型水栓柱',
    '柱上部に黒い主蛇口',
    '柱下部に黒い補助蛇口',
    '低く厚みのある四角形のガーデンパン',
    'ガーデンパンは深さがあり内側もダークグレー',
    '落ち着いたダークグレー系の庭水まわり',
  ],
  ai_prompt: '参照画像の立水栓とガーデンパンの形を優先してください。細身の角柱、上部の黒い主蛇口、下部の黒い補助蛇口、低く厚みのある角型ガーデンパンを商品特徴として再現してください。丸い水鉢、陶器風の鉢、白い受け皿、装飾的な水栓柱にはしないでください。',
};

function buildPayload(sourcePath) {
  return {
    scene: '庭',
    concept: '庭で過ごす時間を豊かにする外構空間',
    selected_items: ['立水栓'],
    placements: {},
    prompt: [
      'Version0.4 配置傾向分析用。',
      'アップロードされた庭写真をもとに、参照商品の立水栓とガーデンパンを自然に追加した完成イメージを作成してください。',
      '今回は配置品質の観察が目的です。',
      '配置場所は指定しません。',
      '既存の建物、窓、外壁、敷地形状、カメラアングルをできるだけ維持してください。',
      '選択していない商品や素材を追加しないでください。',
    ].join(' '),
    source_image: {
      name: basename(sourcePath),
      data_url: fileToDataUrl(sourcePath),
    },
    reference_products: [waterStandReference],
  };
}

async function main() {
  loadEnv();
  const sourcePath = resolve(process.argv[3] || DEFAULT_SOURCE);
  if (!existsSync(sourcePath)) {
    throw new Error(`source image not found: ${sourcePath}`);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const log = {
    version: '0.4',
    purpose: 'Water stand placement tendency analysis. No placement rules added.',
    source_image: sourcePath,
    product: waterStandReference,
    run_count: RUN_COUNT,
    started_at: new Date().toISOString(),
    runs: [],
  };

  for (let index = 1; index <= RUN_COUNT; index += 1) {
    const startedAt = Date.now();
    const payload = buildPayload(sourcePath);
    const result = await generateGardenImage(payload);
    const elapsedMs = Date.now() - startedAt;
    const outputName = `water-stand-placement-${String(index).padStart(2, '0')}.png`;
    const outputPath = resolve(OUTPUT_DIR, outputName);

    if (result.status === 200 && result.body && result.body.image_url) {
      writeFileSync(outputPath, dataUrlToBuffer(result.body.image_url));
      log.runs.push({
        index,
        status: result.status,
        output: outputPath,
        elapsed_ms: elapsedMs,
        generation_time_ms: result.body.generation_time_ms,
        model: result.body.model,
        reference_products_used: result.body.reference_products_used || [],
      });
      console.log(`[${index}/${RUN_COUNT}] ok ${outputName} ${elapsedMs}ms`);
    } else {
      log.runs.push({
        index,
        status: result.status,
        elapsed_ms: elapsedMs,
        error: result.body && (result.body.message || result.body.error),
      });
      console.log(`[${index}/${RUN_COUNT}] failed ${result.status} ${JSON.stringify(result.body)}`);
    }

    writeFileSync(resolve(OUTPUT_DIR, 'run-log.json'), JSON.stringify(log, null, 2));
  }

  log.finished_at = new Date().toISOString();
  writeFileSync(resolve(OUTPUT_DIR, 'run-log.json'), JSON.stringify(log, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateGardenImage } from '../server/garden-image-service.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'generated/v04-american-fence-placement');
const DEFAULT_SOURCE = '/Users/yasudashinya/Downloads/IMG_4858.JPG';
const RUN_COUNT = Number(process.argv[2] || 10);

function loadEnv() {
  const envPath = resolve(PROJECT_ROOT, '.env');
  if (!existsSync(envPath)) return;

  readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] == null) process.env[key] = value;
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

const americanFenceReference = {
  product_id: 'OOC-AMERICAN-FENCE-REFERENCE',
  product_name: 'Only One American fence',
  category: 'アメリカンフェンス',
  image_url: 'images/g20-material/american-fence/onlyone-american-fence-reference.jpg',
  size: '900×900系フェンスを組み合わせる想定',
  color: 'シルバー',
  features: [
    'シルバーの丸パイプフレーム',
    'チェーンリンク金網',
    '角が丸いパネル形状',
    '縦横に連結できる支柱構成',
    'ドッグランや庭の仕切りに合う抜け感',
  ],
};

function buildPayload(sourcePath) {
  return {
    scene: '庭',
    concept: '庭をアメリカンフェンスで囲う',
    selected_items: ['アメリカンフェンス'],
    placements: {},
    prompt: [
      'Version0.4 アメリカンフェンス配置傾向分析用。',
      'アップロードされた庭写真をもとに、庭をアメリカンフェンスで囲った完成イメージを作成してください。',
      '今回は配置傾向の観察が目的です。',
      '具体的な配置位置、囲い方、形状は指定しません。',
      '既存の建物、窓、外壁、敷地形状、カメラアングルをできるだけ維持してください。',
      '選択していない商品や素材を追加しないでください。',
    ].join(' '),
    source_image: {
      name: basename(sourcePath),
      data_url: fileToDataUrl(sourcePath),
    },
    reference_products: [americanFenceReference],
  };
}

async function main() {
  loadEnv();
  const sourcePath = resolve(process.argv[3] || DEFAULT_SOURCE);
  if (!existsSync(sourcePath)) throw new Error(`source image not found: ${sourcePath}`);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const log = {
    version: '0.4',
    purpose: 'American fence placement tendency analysis. No placement rules added.',
    source_image: sourcePath,
    product: americanFenceReference,
    run_count: RUN_COUNT,
    started_at: new Date().toISOString(),
    runs: [],
  };

  for (let index = 1; index <= RUN_COUNT; index += 1) {
    const startedAt = Date.now();
    const result = await generateGardenImage(buildPayload(sourcePath));
    const elapsedMs = Date.now() - startedAt;
    const outputName = `american-fence-placement-${String(index).padStart(2, '0')}.png`;
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

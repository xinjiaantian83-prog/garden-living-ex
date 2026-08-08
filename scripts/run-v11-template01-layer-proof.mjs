import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateGardenImage } from '../server/garden-image-service.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'generated/v11-template01-layer-proof');
const BEFORE_IMAGE = resolve(PROJECT_ROOT, 'images/templates/template01/template01-before.jpg');
const TURF_IMAGE = resolve(PROJECT_ROOT, 'images/templates/template01/template01-turf-after.jpg');

const OUTPUTS = {
  soilPizza: resolve(OUTPUT_DIR, 'composition-01-soil-pizza.jpg'),
  turfFence: resolve(OUTPUT_DIR, 'composition-02-turf-fence.jpg'),
  turfTileFurniture: resolve(OUTPUT_DIR, 'composition-03-turf-tile-furniture.jpg'),
};

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
  const match = /^data:[^;]+;base64,(.*)$/s.exec(dataUrl || '');
  if (!match) throw new Error('generated image is not a base64 data URL');
  return Buffer.from(match[1], 'base64');
}

function writeGeneratedJpeg(dataUrl, outputPath) {
  const tempPng = `${outputPath}.tmp.png`;
  writeFileSync(tempPng, dataUrlToBuffer(dataUrl));
  try {
    execFileSync('/usr/bin/sips', ['-s', 'format', 'jpeg', tempPng, '--out', outputPath], {
      stdio: 'ignore',
    });
  } catch (error) {
    writeFileSync(outputPath, readFileSync(tempPng));
  } finally {
    try {
      unlinkSync(tempPng);
    } catch {
      // ignore cleanup failure
    }
  }
}

const sharedPreserveRules = [
  'Template01の建物、窓、基礎、境界フェンス、隣家、空、カメラ構図、画角を維持してください。',
  '選択された商品以外は追加しないでください。',
  '人物、犬、植栽、照明、ガビオン、立水栓、サウナ、装飾品は追加しないでください。',
  '完成後の営業提案画像として、お客様にそのまま見せられる自然な施工写真にしてください。',
];

const jobs = [
  {
    key: 'soilPizza',
    outputPath: OUTPUTS.soilPizza,
    sourcePath: BEFORE_IMAGE,
    selectedItems: ['ピザ窯'],
    references: [
      {
        product_id: 'OOC-PIZZA-EG3-AB-PK',
        product_name: 'アンティークブリックス ピザ窯',
        category: 'ピザ窯',
        main_image: 'images/g20-material/pizza-oven/antique-bricks-pizza-oven-eg3-ab-pk.jpg',
        ai_reference_images: [
          'images/g20-material/pizza-oven/antique-bricks-pizza-oven-eg3-ab-pk-door-detail.jpg',
          'images/g20-material/pizza-oven/antique-bricks-pizza-oven-eg3-ab-pk-wood-storage-detail.jpg',
        ],
        ai_features: ['レンガ積み', 'アーチ形状', '黒い鉄扉', '薪置きスペース', '家庭用屋外ピザ窯'],
        ai_prompt: '参照画像のレンガ色、アーチ扉、薪置き部を保ち、掃き出し窓をふさがない庭奥側へ小さめから中程度の現実的なサイズで施工済みのように配置する。',
      },
    ],
    prompt: [
      '土のBefore庭に、ピザ窯だけを自然に施工してください。',
      '地面は土のまま維持し、人工芝、タイルデッキ、フェンス、家具を追加しないでください。',
      'ピザ窯は家庭用の屋外ピザ窯として現実的なサイズで、庭の奥側または右奥側に自然に接地させてください。',
      'ピザ窯を画面手前へ巨大に配置しないでください。掃き出し窓や建物を隠さないでください。',
      '土の庭とピザ窯の接地影を自然にしてください。',
      ...sharedPreserveRules,
    ].join('\n'),
  },
  {
    key: 'turfFence',
    outputPath: OUTPUTS.turfFence,
    sourcePath: TURF_IMAGE,
    selectedItems: ['人工芝', 'アメリカンフェンス'],
    references: [
      {
        product_id: 'OOC-AMERICAN-FENCE',
        product_name: 'Only One American fence',
        category: 'アメリカンフェンス',
        main_image: 'images/g20-material/american-fence/onlyone-american-fence-reference.jpg',
        ai_reference_images: [
          'images/g20-material/american-fence-placement-reference/american-fence-dogrun-enclosure.jpg',
          'images/g20-material/american-fence-placement-reference/american-fence-dog-gate.jpg',
        ],
        ai_features: ['溶融亜鉛メッキ', '丸パイプフレーム', '金網メッシュ', '支柱', '庭用フェンス'],
        ai_prompt: '参照画像の銀色丸パイプ、金網メッシュ、支柱構成を保ち、庭の奥側または左側の境界に沿って自然に施工する。画面手前に広告的に並べない。',
      },
    ],
    prompt: [
      '確定済みの人工芝After画像を土台に、アメリカンフェンスだけを追加してください。',
      '人工芝は現在のまま維持してください。',
      'アメリカンフェンスは庭の奥または左側境界に沿って、既存境界と馴染むように施工してください。',
      'フェンスを画面最前面へ大きく配置しないでください。庭の使用スペースを塞がないでください。',
      'タイルデッキ、ピザ窯、家具、ガビオン、立水栓は追加しないでください。',
      ...sharedPreserveRules,
    ].join('\n'),
  },
  {
    key: 'turfTileFurniture',
    outputPath: OUTPUTS.turfTileFurniture,
    sourcePath: TURF_IMAGE,
    selectedItems: ['人工芝', 'タイルデッキ', 'ガーデンファニチャー'],
    references: [],
    prompt: [
      '確定済みの人工芝After画像を土台に、タイルデッキとガーデンファニチャーだけを追加してください。',
      '人工芝は可能な限り維持し、庭全体をタイルへ変えないでください。',
      'タイルデッキは掃き出し窓前に接続する1段タイプで、300×300角タイル風にしてください。',
      'タイル色は自然なベージュ、グレージュ、淡いグレー系で、OnlyOneClub系の庭商品に合う落ち着いた色にしてください。',
      'ガーデンファニチャーはタイルデッキ上に自然に置き、テーブルとチェア程度のシンプルな構成にしてください。',
      'ピザ窯、フェンス、ガビオン、立水栓、植栽、照明、人物、犬は追加しないでください。',
      ...sharedPreserveRules,
    ].join('\n'),
  },
];

function buildPayload(job) {
  return {
    scene: 'Template01 標準的な建売住宅の裏庭',
    concept: 'Garden Living展示場1号 レイヤー合成実証',
    selected_items: job.selectedItems,
    placements: {},
    image_model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
    prompt: job.prompt,
    source_image: {
      data_url: fileToDataUrl(job.sourcePath),
      mime_type: mimeType(job.sourcePath),
      name: job.sourcePath.endsWith('template01-before.jpg') ? 'template01-before.jpg' : 'template01-turf-after.jpg',
    },
    reference_products: job.references,
  };
}

async function runJob(job) {
  const startedAt = Date.now();
  const result = await generateGardenImage(buildPayload(job), {
    env: {
      ...process.env,
      OPENAI_IMAGE_SIZE: '1536x1024',
      OPENAI_IMAGE_QUALITY: process.env.OPENAI_IMAGE_QUALITY || 'medium',
      OPENAI_IMAGE_TIMEOUT_MS: process.env.OPENAI_IMAGE_TIMEOUT_MS || '120000',
    },
  });
  const elapsedMs = Date.now() - startedAt;
  if (result.status !== 200 || !result.body?.image_url) {
    throw new Error(JSON.stringify({
      key: job.key,
      status: result.status,
      message: result.body?.message,
      error: result.body?.error,
    }, null, 2));
  }
  writeGeneratedJpeg(result.body.image_url, job.outputPath);
  return {
    key: job.key,
    output_path: job.outputPath,
    elapsed_ms: elapsedMs,
    provider_time_ms: result.body.generation_time_ms,
    references_used: result.body.reference_products_used || [],
  };
}

async function main() {
  loadEnv();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  [BEFORE_IMAGE, TURF_IMAGE].forEach((filePath) => {
    if (!existsSync(filePath)) throw new Error(`Required image not found: ${filePath}`);
  });

  const results = [];
  for (const job of jobs) {
    console.log(`Generating ${job.key}...`);
    const result = await runJob(job);
    results.push(result);
    console.log(JSON.stringify(result, null, 2));
  }

  writeFileSync(resolve(OUTPUT_DIR, 'run-log.json'), JSON.stringify({
    generated_at: new Date().toISOString(),
    before_image: BEFORE_IMAGE,
    turf_image: TURF_IMAGE,
    outputs: OUTPUTS,
    results,
  }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});

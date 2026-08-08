import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { generateGardenImage } from '../server/garden-image-service.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const SOURCE = resolve(PROJECT_ROOT, 'images/templates/template01/template01-before.jpg');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'generated/v09-template01-turf');
const FINAL_OUTPUT = resolve(PROJECT_ROOT, 'images/templates/template01/template01-turf-after.jpg');
const RUN_COUNT = Math.min(5, Math.max(1, Number(process.argv[2] || 3)));

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

function buildPayload() {
  return {
    scene: 'Template01 標準的な建売住宅の裏庭',
    concept: 'Garden Living展示場1号の人工芝施工後テンプレート',
    selected_items: ['人工芝'],
    placements: {},
    image_model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
    prompt: [
      'Template01の正式Before画像を、人工芝施工後の固定After素材へ編集してください。',
      '露出している土の庭部分だけを、自然で現実的な高品質人工芝へ変更してください。',
      '住宅、外壁、窓、基礎、コンクリートステップ、既存コンクリート、境界フェンス、隣家、空、カメラ構図、画角は維持してください。',
      '芝は自然な緑で、蛍光グリーンにしないでください。',
      '芝丈、密度、色ムラ、光と影、遠近感、地面の勾配を実施工写真として自然にしてください。',
      '建物基礎、ステップ、既存コンクリート、境界へ芝を被せないでください。',
      '端部は現実的な施工ラインにしてください。',
      '芝の継ぎ目や四角いタイル状パターン、平面的な緑色の塗りつぶしを出さないでください。',
      'タイルデッキ、フェンス、ピザ窯、ガーデンファニチャー、植栽、飛び石、砂利、照明、人物、犬、装飾品は絶対に追加しないでください。',
      'Before画像とのビフォーアフター比較が成立するように、建物や庭の形を別物にしないでください。',
    ].join('\n'),
    source_image: {
      data_url: fileToDataUrl(SOURCE),
      mime_type: 'image/jpeg',
      name: 'template01-before.jpg',
    },
  };
}

async function main() {
  loadEnv();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!existsSync(SOURCE)) throw new Error(`Before image not found: ${SOURCE}`);

  const results = [];
  for (let index = 1; index <= RUN_COUNT; index += 1) {
    const startedAt = Date.now();
    const result = await generateGardenImage(buildPayload());
    const elapsedMs = Date.now() - startedAt;
    if (result.status !== 200 || !result.body?.image_url) {
      console.error(JSON.stringify({
        index,
        status: result.status,
        message: result.body?.message,
        error: result.body?.error,
      }, null, 2));
      continue;
    }
    const outputPath = resolve(OUTPUT_DIR, `generation-${String(index).padStart(2, '0')}.jpg`);
    writeFileSync(outputPath, dataUrlToBuffer(result.body.image_url));
    results.push({
      index,
      outputPath,
      elapsedMs,
      providerTimeMs: result.body.generation_time_ms,
    });
    console.log(JSON.stringify(results[results.length - 1]));
  }

  if (!results.length) throw new Error('No successful turf after image generated.');

  // The first successful generation is treated as the selected fixed template.
  const selected = results[0];
  writeFileSync(FINAL_OUTPUT, readFileSync(selected.outputPath));
  writeFileSync(resolve(OUTPUT_DIR, 'run-log.json'), JSON.stringify({
    source: SOURCE,
    final_output: FINAL_OUTPUT,
    selected_generation: selected,
    results,
  }, null, 2));
  console.log(JSON.stringify({
    selected: selected.outputPath,
    final_output: FINAL_OUTPUT,
    count: results.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});

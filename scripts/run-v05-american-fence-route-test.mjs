import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { generateGardenImage } from '../server/garden-image-service.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'generated/v05-american-fence-route');
const DEFAULT_SOURCE = '/Users/yasudashinya/Downloads/IMG_4858.JPG';
const RUN_COUNT = Number(process.argv[2] || 5);

const ROUTE = {
  start: { x: 0.1, y: 0.58 },
  end: { x: 0.88, y: 0.56 },
};

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
  return `data:${mimeType(filePath)};base64,${readFileSync(filePath).toString('base64')}`;
}

function dataUrlToBuffer(dataUrl) {
  const match = /^data:[^;]+;base64,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('generated image is not a base64 data URL');
  return Buffer.from(match[1], 'base64');
}

function copySourceForRoutePicker(sourcePath) {
  const outputPath = resolve(OUTPUT_DIR, 'source.jpg');
  const result = spawnSync('python3', [
    '-c',
    [
      'from PIL import Image',
      'import sys',
      'Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], quality=92)',
    ].join('\n'),
    sourcePath,
    outputPath,
  ], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`source copy failed: ${result.stderr || result.stdout}`);
  }
  return outputPath;
}

function createRouteInstructionImage(sourcePath, outputPath, route) {
  const result = spawnSync('python3', [
    '-c',
    [
      'from PIL import Image, ImageDraw, ImageFont',
      'import sys',
      'source, output, sx, sy, ex, ey = sys.argv[1:7]',
      'img = Image.open(source).convert("RGBA")',
      'w, h = img.size',
      'sx, sy, ex, ey = map(float, (sx, sy, ex, ey))',
      'p1 = (int(sx * w), int(sy * h))',
      'p2 = (int(ex * w), int(ey * h))',
      'overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))',
      'draw = ImageDraw.Draw(overlay)',
      'line_width = max(8, int(min(w, h) * 0.012))',
      'draw.line([p1, p2], fill=(210, 42, 31, 220), width=line_width)',
      'for label, point in (("START", p1), ("END", p2)):',
      '    r = max(16, int(min(w, h) * 0.026))',
      '    draw.ellipse((point[0]-r, point[1]-r, point[0]+r, point[1]+r), fill=(210, 42, 31, 235), outline=(255,255,255,245), width=max(3, line_width//3))',
      '    draw.text((point[0]+r+8, point[1]-r), label, fill=(210,42,31,245))',
      'out = Image.alpha_composite(img, overlay).convert("RGB")',
      'out.save(output, quality=92)',
    ].join('\n'),
    sourcePath,
    outputPath,
    String(route.start.x),
    String(route.start.y),
    String(route.end.x),
    String(route.end.y),
  ], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`route image failed: ${result.stderr || result.stdout}`);
  }
  return outputPath;
}

function createContactSheet(imagePaths, outputPath) {
  const result = spawnSync('python3', [
    '-c',
    [
      'from PIL import Image, ImageDraw',
      'import sys, math',
      'output = sys.argv[1]',
      'paths = sys.argv[2:]',
      'thumb_w, thumb_h = 420, 282',
      'cols = 5',
      'rows = math.ceil(len(paths) / cols)',
      'sheet = Image.new("RGB", (thumb_w * cols, (thumb_h + 34) * rows), (18, 18, 18))',
      'draw = ImageDraw.Draw(sheet)',
      'for i, path in enumerate(paths):',
      '    img = Image.open(path).convert("RGB")',
      '    img.thumbnail((thumb_w, thumb_h), Image.LANCZOS)',
      '    x = (i % cols) * thumb_w',
      '    y = (i // cols) * (thumb_h + 34) + 34',
      '    bg = Image.new("RGB", (thumb_w, thumb_h), (245, 242, 236))',
      '    bg.paste(img, ((thumb_w - img.width)//2, (thumb_h - img.height)//2))',
      '    sheet.paste(bg, (x, y))',
      '    draw.text((x + 8, y - 28), f"{i+1:02d}", fill=(255,255,255))',
      'sheet.save(output)',
    ].join('\n'),
    outputPath,
    ...imagePaths,
  ], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`contact sheet failed: ${result.stderr || result.stdout}`);
  }
  return outputPath;
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
  ],
};

function routePrompt(route) {
  return [
    'Version0.5 アメリカンフェンス配置指定UI 最小検証用。',
    'アップロードされた元の庭写真をもとに、アメリカンフェンスを施工済みの完成イメージとして生成してください。',
    '別添の指示画像には赤い線とSTART/ENDが描かれています。',
    'この赤い線をフェンスの設置ルートとして厳守してください。',
    `始点の正規化座標は x=${route.start.x}, y=${route.start.y}、終点の正規化座標は x=${route.end.x}, y=${route.end.y} です。`,
    'フェンスはSTARTからENDまでの直線ルートに沿わせてください。',
    '指定線以外の場所へフェンスを追加しないでください。',
    '庭の手前へ勝手に移動しないでください。',
    'ゲートを勝手に追加しないでください。',
    '人工芝、植栽、舗装、タイル、砂利、家具、人、犬、装飾などを追加しないでください。',
    '赤い線、START、ENDの文字や目印は最終画像には残さないでください。',
    '元の庭写真の建物、窓、外壁、敷地形状、カメラアングル、地面の状態を可能な限り維持してください。',
  ].join(' ');
}

function buildPayload(sourcePath, instructionPath) {
  const instructionImageUrl = instructionPath.replace(`${PROJECT_ROOT}/`, '');
  return {
    scene: '庭',
    concept: '指定ルートに沿ったアメリカンフェンス配置検証',
    selected_items: ['アメリカンフェンス'],
    placements: {},
    prompt: routePrompt(ROUTE),
    source_image: {
      name: basename(sourcePath),
      data_url: fileToDataUrl(sourcePath),
    },
    reference_products: [
      {
        product_id: 'ROUTE-INSTRUCTION-IMAGE',
        product_name: 'フェンス設置ルート指示画像',
        category: '配置指示',
        image_url: instructionImageUrl,
        ai_prompt: '赤い線をフェンスの設置ルートとして扱う。赤線やSTART/END表示は最終画像に残さない。',
      },
      americanFenceReference,
    ],
  };
}

async function main() {
  loadEnv();
  const sourcePath = resolve(process.argv[3] || DEFAULT_SOURCE);
  if (!existsSync(sourcePath)) throw new Error(`source image not found: ${sourcePath}`);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const routeInstructionPath = resolve(OUTPUT_DIR, 'route-instruction.jpg');
  copySourceForRoutePicker(sourcePath);
  createRouteInstructionImage(sourcePath, routeInstructionPath, ROUTE);

  const log = {
    version: '0.5',
    purpose: 'American fence route instruction minimal validation. One straight route only.',
    source_image: sourcePath,
    route: ROUTE,
    route_instruction_image: routeInstructionPath,
    product: americanFenceReference,
    run_count: RUN_COUNT,
    started_at: new Date().toISOString(),
    runs: [],
  };

  const outputs = [];
  for (let index = 1; index <= RUN_COUNT; index += 1) {
    const startedAt = Date.now();
    const result = await generateGardenImage(buildPayload(sourcePath, routeInstructionPath));
    const elapsedMs = Date.now() - startedAt;
    const outputName = `american-fence-route-${String(index).padStart(2, '0')}.png`;
    const outputPath = resolve(OUTPUT_DIR, outputName);

    if (result.status === 200 && result.body && result.body.image_url) {
      writeFileSync(outputPath, dataUrlToBuffer(result.body.image_url));
      outputs.push(outputPath);
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

  if (outputs.length) {
    createContactSheet(outputs, resolve(OUTPUT_DIR, 'contact-sheet.png'));
  }

  log.finished_at = new Date().toISOString();
  writeFileSync(resolve(OUTPUT_DIR, 'run-log.json'), JSON.stringify(log, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

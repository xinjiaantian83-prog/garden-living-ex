import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { generateGardenImage } from '../server/garden-image-service.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const DEFAULT_SOURCE = '/Users/yasudashinya/Downloads/IMG_4858.JPG';
const TARGET = process.argv[2] || 'tile-deck';
const RUN_COUNT = Number(process.argv[3] || 5);

const CONFIGS = {
  'tile-deck': {
    outputDir: 'generated/v05-tile-deck-area',
    productId: 'GL-REFERENCE-TILE-DECK',
    productName: 'タイルデッキ',
    selectedItem: 'タイルデッキ',
    referenceFile: 'tile-deck-reference.png',
    instructionFile: 'tile-deck-area-instruction.jpg',
    outputPrefix: 'tile-deck-area',
    referenceKind: 'tile',
    prompt: [
      'Version0.5 タイルデッキ 面指定 最小検証用。',
      'アップロードされた元の庭写真をもとに、指定範囲内へタイルデッキを施工済みの完成イメージとして生成してください。',
      '別添の指示画像には赤い半透明の四角形範囲が描かれています。',
      'この赤い指定範囲をタイルデッキの施工範囲として厳守してください。',
      '指定範囲外へタイルを広げないでください。',
      '建物の掃き出し窓と自然につながるようにしてください。',
      '勝手に階段、手すり、植栽、家具、フェンス、照明を追加しないでください。',
      '庭全体を舗装しないでください。',
      'タイル目地と方向を不自然に変えないでください。',
      'デッキ高さを極端に高くしないでください。',
      '赤い指定範囲、点、文字、目印は最終画像には残さないでください。',
      '元写真の構図、建物、窓、外壁、敷地形状、地面の状態を可能な限り維持してください。',
    ],
    features: [
      'ベージュからグレージュ系の屋外タイル',
      '整った直線目地',
      '掃き出し窓に自然につながる低めのデッキ',
      '日本住宅の庭に合う落ち着いた質感',
    ],
  },
  'artificial-turf': {
    outputDir: 'generated/v05-artificial-turf-area',
    productId: 'GL-REFERENCE-ARTIFICIAL-TURF',
    productName: '人工芝',
    selectedItem: '人工芝',
    referenceFile: 'artificial-turf-reference.png',
    instructionFile: 'artificial-turf-area-instruction.jpg',
    outputPrefix: 'artificial-turf-area',
    referenceKind: 'turf',
    prompt: [
      'Version0.5 人工芝 面指定 最小検証用。',
      'アップロードされた元の庭写真をもとに、指定範囲内だけを人工芝施工済みの完成イメージとして生成してください。',
      '別添の指示画像には赤い半透明の四角形範囲が描かれています。',
      'この赤い指定範囲を人工芝の施工範囲として厳守してください。',
      '指定範囲外へ人工芝を広げないでください。',
      '建物、掃き出し窓、基礎、既存地面の範囲感を可能な限り維持してください。',
      '勝手にタイル、植栽、家具、フェンス、犬、人、遊具を追加しないでください。',
      '庭全体を人工芝にしないでください。',
      '人工芝は鮮やかすぎない自然な緑にしてください。',
      '赤い指定範囲、点、文字、目印は最終画像には残さないでください。',
      '元写真の構図、建物、窓、外壁、敷地形状を可能な限り維持してください。',
    ],
    features: [
      '自然な緑の人工芝',
      '短すぎず長すぎない芝丈',
      '庭の地面に施工されたグラウンドカバー',
      '日本住宅の庭になじむ落ち着いた色',
    ],
  },
};

const CONFIG = CONFIGS[TARGET];
if (!CONFIG) {
  console.error(`Unknown target: ${TARGET}. Use ${Object.keys(CONFIGS).join(' or ')}`);
  process.exit(1);
}

const OUTPUT_DIR = resolve(PROJECT_ROOT, CONFIG.outputDir);
const AREA = [
  { x: 0.12, y: 0.60 },
  { x: 0.88, y: 0.58 },
  { x: 0.91, y: 0.88 },
  { x: 0.08, y: 0.91 },
];

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

function runPython(lines, args) {
  const result = spawnSync('python3', ['-c', lines.join('\n'), ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'python failed');
  }
}

function copySourceForAreaPicker(sourcePath) {
  const outputPath = resolve(OUTPUT_DIR, 'source.jpg');
  runPython([
    'from PIL import Image',
    'import sys',
    'Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], quality=92)',
  ], [sourcePath, outputPath]);
  return outputPath;
}

function createProductReference(outputPath, kind) {
  runPython([
    'from PIL import Image, ImageDraw, ImageFilter',
    'import sys, random',
    'output, kind = sys.argv[1:3]',
    'img = Image.new("RGB", (900, 600), (242, 238, 228))',
    'draw = ImageDraw.Draw(img)',
    'if kind == "tile":',
    '    tile = 90',
    '    base = (205, 195, 176)',
    '    draw.rectangle((0, 0, 900, 600), fill=base)',
    '    for x in range(0, 901, tile): draw.line((x, 0, x, 600), fill=(150, 142, 128), width=3)',
    '    for y in range(0, 601, tile): draw.line((0, y, 900, y), fill=(150, 142, 128), width=3)',
    '    for y in range(0, 600, tile):',
    '        for x in range(0, 900, tile):',
    '            shade = 6 if ((x//tile + y//tile) % 2) else -4',
    '            draw.rectangle((x+4, y+4, min(x+tile-4,899), min(y+tile-4,599)), outline=(base[0]+shade, base[1]+shade, base[2]+shade), width=2)',
    '    draw.text((32, 32), "TILE DECK REFERENCE", fill=(80, 72, 64))',
    'else:',
    '    draw.rectangle((0, 0, 900, 600), fill=(92, 135, 82))',
    '    for i in range(1800):',
    '        x = random.randint(0, 899); y = random.randint(0, 599)',
    '        c = random.choice([(78,126,67), (105,153,92), (68,112,58), (125,166,104)])',
    '        draw.line((x, y, x+random.randint(-3,3), y-random.randint(4,12)), fill=c, width=1)',
    '    img = img.filter(ImageFilter.SMOOTH_MORE)',
    '    draw = ImageDraw.Draw(img)',
    '    draw.text((32, 32), "ARTIFICIAL TURF REFERENCE", fill=(235, 245, 225))',
    'img.save(output)',
  ], [outputPath, kind]);
  return outputPath;
}

function createAreaInstructionImage(sourcePath, outputPath, area) {
  runPython([
    'from PIL import Image, ImageDraw',
    'import sys',
    'source, output = sys.argv[1:3]',
    'coords = list(map(float, sys.argv[3:11]))',
    'img = Image.open(source).convert("RGBA")',
    'w, h = img.size',
    'points = [(int(coords[i] * w), int(coords[i+1] * h)) for i in range(0, 8, 2)]',
    'overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))',
    'draw = ImageDraw.Draw(overlay)',
    'line_width = max(8, int(min(w, h) * 0.012))',
    'draw.polygon(points, fill=(210, 42, 31, 76), outline=(210, 42, 31, 235))',
    'draw.line(points + [points[0]], fill=(210, 42, 31, 235), width=line_width, joint="curve")',
    'for index, point in enumerate(points, start=1):',
    '    r = max(14, int(min(w, h) * 0.022))',
    '    draw.ellipse((point[0]-r, point[1]-r, point[0]+r, point[1]+r), fill=(210, 42, 31, 235), outline=(255,255,255,245), width=max(3, line_width//3))',
    '    draw.text((point[0]+r+8, point[1]-r), f"P{index}", fill=(210,42,31,245))',
    'out = Image.alpha_composite(img, overlay).convert("RGB")',
    'out.save(output, quality=92)',
  ], [
    sourcePath,
    outputPath,
    ...area.flatMap((point) => [String(point.x), String(point.y)]),
  ]);
  return outputPath;
}

function createContactSheet(imagePaths, outputPath) {
  runPython([
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
  ], [outputPath, ...imagePaths]);
  return outputPath;
}

function areaText(area) {
  return area.map((point, index) => `P${index + 1}: x=${point.x}, y=${point.y}`).join(' / ');
}

function buildPayload(sourcePath, instructionPath, referencePath) {
  const instructionImageUrl = instructionPath.replace(`${PROJECT_ROOT}/`, '');
  const referenceImageUrl = referencePath.replace(`${PROJECT_ROOT}/`, '');
  return {
    scene: '庭',
    concept: `${CONFIG.productName}の面指定配置検証`,
    selected_items: [CONFIG.selectedItem],
    placements: {},
    prompt: [
      ...CONFIG.prompt,
      `指定範囲の正規化座標: ${areaText(AREA)}`,
    ].join(' '),
    source_image: {
      name: basename(sourcePath),
      data_url: fileToDataUrl(sourcePath),
    },
    reference_products: [
      {
        product_id: `${CONFIG.productId}-AREA-INSTRUCTION`,
        product_name: `${CONFIG.productName} 指定範囲画像`,
        category: '配置指示',
        image_url: instructionImageUrl,
        ai_prompt: '赤い半透明の四角形範囲を施工範囲として扱う。赤い範囲や点の表示は最終画像に残さない。',
      },
      {
        product_id: CONFIG.productId,
        product_name: CONFIG.productName,
        category: CONFIG.productName,
        image_url: referenceImageUrl,
        ai_features: CONFIG.features,
        ai_prompt: `${CONFIG.productName}の素材感と施工面の見え方を参考にする。`,
      },
    ],
  };
}

async function main() {
  loadEnv();
  const sourcePath = resolve(process.argv[4] || DEFAULT_SOURCE);
  if (!existsSync(sourcePath)) throw new Error(`source image not found: ${sourcePath}`);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  copySourceForAreaPicker(sourcePath);
  const instructionPath = resolve(OUTPUT_DIR, CONFIG.instructionFile);
  const referencePath = resolve(OUTPUT_DIR, CONFIG.referenceFile);
  createAreaInstructionImage(sourcePath, instructionPath, AREA);
  createProductReference(referencePath, CONFIG.referenceKind);

  const log = {
    version: '0.5-area',
    target: TARGET,
    purpose: `${CONFIG.productName} area instruction minimal validation.`,
    source_image: sourcePath,
    area: AREA,
    instruction_image: instructionPath,
    reference_image: referencePath,
    run_count: RUN_COUNT,
    started_at: new Date().toISOString(),
    runs: [],
  };

  const outputs = [];
  for (let index = 1; index <= RUN_COUNT; index += 1) {
    const startedAt = Date.now();
    const result = await generateGardenImage(buildPayload(sourcePath, instructionPath, referencePath));
    const elapsedMs = Date.now() - startedAt;
    const outputName = `${CONFIG.outputPrefix}-${String(index).padStart(2, '0')}.png`;
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

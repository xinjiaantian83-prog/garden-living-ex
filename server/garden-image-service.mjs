import { readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_MODEL = 'gpt-image-1';
const DEFAULT_SIZE = '1024x1024';
const DEFAULT_QUALITY = 'medium';
const OPENAI_IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits';
const __dirname = dirname(fileURLToPath(import.meta.url));
const AI_SPEC_PATH = resolve(__dirname, '../json/ai-product-specs.json');
const PROJECT_ROOT = resolve(__dirname, '..');

function jsonResponse(status, body) {
  return { status, body };
}

function normalizeErrorMessage(status, code, fallback) {
  if (code === 'missing_api_key') {
    return '画像生成APIキーが未設定です。サーバー側の環境変数 OPENAI_API_KEY を設定してください。';
  }
  if (status === 401 || status === 403) {
    return '画像生成APIの認証に失敗しました。APIキー設定を確認してください。';
  }
  if (status === 408 || code === 'timeout') {
    return '画像生成APIがタイムアウトしました。時間をおいて再試行してください。';
  }
  if (status === 429) {
    return '画像生成APIの利用制限に達しました。時間をおいて再試行してください。';
  }
  if (status >= 500) {
    return '画像生成API側で一時的な問題が発生しています。時間をおいて再試行してください。';
  }
  return fallback || '画像生成に失敗しました。入力内容を確認して再試行してください。';
}

function dataUrlToBlob(dataUrl) {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(String(dataUrl || ''));
  if (!match) {
    throw new Error('source_image.data_url is invalid');
  }
  const mimeType = match[1] || 'image/png';
  const isBase64 = Boolean(match[2]);
  const data = match[3] || '';
  const buffer = isBase64 ? Buffer.from(data, 'base64') : Buffer.from(decodeURIComponent(data), 'utf8');
  return new Blob([buffer], { type: mimeType });
}

function mimeTypeFromPath(filePath) {
  const extension = extname(String(filePath || '')).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.gif') return 'image/gif';
  return 'image/png';
}

async function referenceImageToBlob(referenceProduct) {
  const imageUrl = referenceProduct && referenceProduct.image_url;
  if (!imageUrl) {
    throw new Error('reference image_url is empty');
  }
  if (String(imageUrl).startsWith('data:')) {
    return dataUrlToBlob(imageUrl);
  }
  if (/^https?:\/\//.test(String(imageUrl))) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`reference image fetch failed: ${response.status}`);
    }
    return response.blob();
  }

  const localPath = resolve(PROJECT_ROOT, String(imageUrl).replace(/^\/+/, ''));
  if (!localPath.startsWith(PROJECT_ROOT)) {
    throw new Error('reference image path is outside project');
  }
  const buffer = readFileSync(localPath);
  return new Blob([buffer], { type: mimeTypeFromPath(localPath) });
}

function referenceImageEntries(referenceProduct) {
  const urls = [];
  const mainImage = referenceProduct && (referenceProduct.main_image || referenceProduct.image_url);
  if (mainImage) urls.push({ image_url: mainImage, image_role: 'main' });

  const aiReferenceImages = Array.isArray(referenceProduct && referenceProduct.ai_reference_images)
    ? referenceProduct.ai_reference_images
    : [];
  aiReferenceImages.forEach((imageUrl, index) => {
    if (imageUrl && !urls.some((entry) => entry.image_url === imageUrl)) {
      urls.push({ image_url: imageUrl, image_role: `ai_reference_${index + 1}` });
    }
  });

  return urls.slice(0, 3).map((entry) => ({
    ...referenceProduct,
    image_url: entry.image_url,
    image_role: entry.image_role,
  }));
}

function placementText(payload) {
  const placements = payload.placements || {};
  const items = Array.isArray(payload.selected_items) ? payload.selected_items : [];
  if (!items.length) return '選択商品は未指定です。必要な外構要素を自然に提案してください。';

  return items.map((item) => {
    const areas = Array.isArray(placements[item]) ? placements[item] : [];
    if (!areas.length) return `${item}: 配置はおまかせ`;
    return `${item}: 配置エリア ${areas.join(', ')}`;
  }).join('\n');
}

function loadAiSpecs() {
  try {
    const data = JSON.parse(readFileSync(AI_SPEC_PATH, 'utf8'));
    return Array.isArray(data.specs) ? data.specs : [];
  } catch (error) {
    console.warn('[Garden Image Service] ai spec load failed:', error && error.message);
    return [];
  }
}

const AI_PRODUCT_SPECS = loadAiSpecs();

const PRODUCT_PROMPT_GUIDES = [
  {
    match: ['人工芝'],
    text: [
      '人工芝専用指示:',
      '- 既存の庭土・芝生部分だけを、施工済みの高品質な人工芝へ自然に置き換える',
      '- 建物、外壁、窓、フェンス、既存の水栓、植栽、敷石、段差はできる限り維持する',
      '- 人工芝の色は鮮やかすぎない自然なグリーンにする',
      '- 芝目、影、地面の起伏を写真の光に合わせる',
      '- 不要な家具、犬、人、遊具を勝手に追加しない',
    ],
  },
  {
    match: ['タイルデッキ'],
    text: [
      'タイルデッキ専用指示:',
      '- 建物に接する掃き出し窓や庭の一部へ、現実的な高さのタイルデッキを施工した状態にする',
      '- タイルは日本住宅に合うベージュ、グレージュ、淡いグレー系で上品にする',
      '- 既存窓、外壁、基礎、建物形状は変更しない',
      '- デッキの端部、段差、目地、影を施工写真として自然に表現する',
      '- 庭全体を巨大なテラスへ変えず、配置エリア内に収める',
    ],
  },
  {
    match: ['ピザ窯'],
    text: [
      'ピザ窯専用指示:',
      '- ピザ窯は庭に施工された屋外用ピザ窯として、現実的なサイズで配置する',
      '- 既存構造物、窓、外壁、植栽、フェンスは変更しない',
      '- ピザ窯は地面やデッキに自然に接地させ、浮かせない',
      '- 大きすぎる暖炉や小屋にしない。家庭用の屋外ピザ窯として表現する',
      '- 火や煙を派手に出さず、完成後の施工写真らしく落ち着かせる',
    ],
  },
  {
    match: ['フェンス', '目隠しフェンス', 'エコモックフェンス', 'アメリカンフェンス'],
    text: [
      'フェンス専用指示:',
      '- フェンスは敷地境界や指定エリアに沿って、外構工事として施工済みの状態にする',
      '- 既存の建物、庭の形状、カメラ位置は維持する',
      '- 目隠しフェンスの場合は圧迫感を出しすぎず、住宅外観に合う高さと色にする',
      '- アメリカンフェンスの場合は金属メッシュと支柱を自然なスケールで表現する',
      '- フェンスが建物や窓を不自然に貫通しないようにする',
    ],
  },
  {
    match: ['カーポート'],
    text: [
      'カーポート専用指示:',
      '- カーポートは駐車場または車を置ける舗装スペースに、施工済みの屋根構造として配置する',
      '- 柱、屋根、梁は日本住宅向けの現実的なアルミ外構として表現する',
      '- 建物の屋根や外壁を勝手に変更しない',
      '- 庭の中央に無理に建てず、車の出入りが成立する位置に収める',
      '- 選択された台数、サイズ、柱高さに合わせ、過度に大型化しない',
      '- 人工芝、植栽、タイル、土間コンクリートの打ち替え、フェンス、照明、門柱など、選択されていない外構要素を追加しない',
      '- 既存の床面、擁壁、側溝、階段、周囲の建物、既存植栽は、カーポート施工に直接干渉しない限り維持する',
    ],
  },
];

function productSpecificPrompt(payload) {
  const items = Array.isArray(payload.selected_items) ? payload.selected_items : [];
  const guides = PRODUCT_PROMPT_GUIDES.filter((guide) => (
    items.some((item) => guide.match.some((keyword) => String(item).includes(keyword)))
  ));
  const guideText = guides.map((guide) => guide.text.join('\n')).join('\n\n');
  const aiSpec = AI_PRODUCT_SPECS.find((spec) => spec.ai_spec_id === payload.ai_spec_id);
  const exterior = payload.exterior_product || {};
  const aiSpecText = aiSpec ? [
    'AI商品仕様書:',
    `- 商品: ${aiSpec.ai_name || exterior.product_name || payload.product_id || '未指定'}`,
    `- product_id: ${aiSpec.product_id || payload.product_id || '未指定'}`,
    `- variant_id: ${payload.variant_id || '未指定'}`,
    exterior.size ? `- サイズ: ${exterior.size}` : '',
    exterior.height ? `- 柱高さ: ${exterior.height}` : '',
    exterior.body_color ? `- 本体色: ${exterior.body_color}` : '',
    exterior.roof_material ? `- 屋根材: ${exterior.roof_material}` : '',
    exterior.drainage_direction ? `- 水下方向: ${exterior.drainage_direction}` : '',
    '',
    '商品らしさ:',
    ...(Array.isArray(aiSpec.product_identity) ? aiSpec.product_identity.map((line) => `- ${line}`) : []),
    ...(Array.isArray(aiSpec.visual_features) ? aiSpec.visual_features.map((line) => `- ${line}`) : []),
    '',
    '現場保持:',
    ...(Array.isArray(aiSpec.must_keep_site) ? aiSpec.must_keep_site.map((line) => `- ${line}`) : []),
    '',
    '配置ルール:',
    ...(Array.isArray(aiSpec.placement_rules) ? aiSpec.placement_rules.map((line) => `- ${line}`) : []),
    '',
    '避けること:',
    ...(Array.isArray(aiSpec.avoid) ? aiSpec.avoid.map((line) => `- ${line}`) : []),
    '',
    aiSpec.default_prompt_addition || '',
  ].filter(Boolean).join('\n') : '';
  return [guideText, aiSpecText].filter(Boolean).join('\n\n');
}

function referenceProductsPrompt(payload) {
  const references = Array.isArray(payload.reference_products) ? payload.reference_products : [];
  if (!references.length) return '';

  return [
    '参照商品画像:',
    ...references.map((product, index) => {
      const features = Array.isArray(product.ai_features)
        ? product.ai_features.join('、')
        : (Array.isArray(product.features) ? product.features.join('、') : '');
      return [
        `${index + 1}. ${product.product_name || product.product_id || '商品'}`,
        product.product_id ? `product_id: ${product.product_id}` : '',
        product.category ? `カテゴリ: ${product.category}` : '',
        product.size ? `寸法: ${product.size}` : '',
        product.color ? `色: ${product.color}` : '',
        features ? `主要特徴: ${features}` : '',
        product.ai_prompt ? `商品専用指示: ${product.ai_prompt}` : '',
      ].filter(Boolean).join(' / ');
    }),
    '参照商品画像の形状、色、素材、ディテール、装飾の特徴を最優先で維持して、選択商品の完成イメージに反映してください。',
  ].join('\n');
}

function buildOpenAIGardenPrompt(payload) {
  return [
    'あなたは日本住宅の外構施工写真を作る専門の画像編集AIです。',
    '入力された庭写真を元に、選択された外構・庭アイテムを「置いただけ」ではなく、実際に施工完了した状態として自然に反映してください。',
    '',
    `シーン: ${payload.scene || '庭まわり'}`,
    `コンセプト: ${payload.concept || '庭で過ごす時間を豊かにする外構空間'}`,
    '選択商品と配置:',
    placementText(payload),
    '',
    'ユーザー生成プロンプト:',
    payload.prompt || '',
    '',
    referenceProductsPrompt(payload),
    '',
    productSpecificPrompt(payload),
    '',
    '必須制約:',
    '- 写真全体を作り直さず、選択商品の施工範囲だけを編集する',
    '- 構図、焦点距離、トリミング、カメラ位置を変えない',
    '- 選択されていない商品、素材、植栽、床仕上げを新しく追加しない',
    '- 既存の土間コンクリート、アスファルト、砂利、芝、植栽などの床面や外構を、指示がない限り別素材へ変更しない',
    '- 既存建物は変更しない',
    '- 既存窓・玄関・屋根形状は維持する',
    '- 敷地形状を維持する',
    '- 写真のカメラアングルを維持する',
    '- 既存のフェンス、門扉、看板、水栓、植栽、庭石、照明、ペットは、選択商品の施工に直接干渉しない限り維持する',
    '- 現実に施工可能な配置にする',
    '- 日本住宅として自然に見せる',
    '- 外構専門業者が施工したような完成度にする',
    '- 違和感のあるオブジェクトを追加しない',
    '- 選択商品以外を勝手に増やさない',
    '- 人、犬、家具、装飾、小物を新しく追加しない',
    '- 建物を勝手に豪邸へ変更しない',
    '- 昼写真は昼のまま、夜写真は夜のまま維持する',
    '- 質感をリアルにする',
    '- 完成後の施工写真のような品質にする',
    '',
    '最優先品質:',
    '画質の派手さより、自然さ・施工現実性・既存写真とのなじみを優先してください。',
  ].join('\n');
}

async function callOpenAIImageEdit(payload, env = process.env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, {
      error: { code: 'missing_api_key' },
      message: normalizeErrorMessage(500, 'missing_api_key'),
    });
  }

  const image = payload.source_image || {};
  const sourceBlob = dataUrlToBlob(image.data_url);
  const referenceProducts = Array.isArray(payload.reference_products) ? payload.reference_products : [];
  const referenceBlobs = [];
  for (const referenceProduct of referenceProducts) {
    const imageEntries = referenceImageEntries(referenceProduct);
    for (const imageEntry of imageEntries) {
      try {
        const blob = await referenceImageToBlob(imageEntry);
        referenceBlobs.push({ product: imageEntry, blob });
      } catch (error) {
        console.warn('[Garden Image Service] reference image skipped:', imageEntry && imageEntry.product_id, imageEntry && imageEntry.image_url, error && error.message);
      }
    }
  }
  const formData = new FormData();
  const model = env.OPENAI_IMAGE_MODEL || payload.image_model || DEFAULT_MODEL;
  const size = env.OPENAI_IMAGE_SIZE || DEFAULT_SIZE;
  const quality = env.OPENAI_IMAGE_QUALITY || DEFAULT_QUALITY;
  const prompt = buildOpenAIGardenPrompt(payload);

  formData.append('model', model);
  if (referenceBlobs.length) {
    formData.append('image[]', sourceBlob, image.name || 'garden-photo.png');
    referenceBlobs.forEach((reference, index) => {
      const productId = reference.product.product_id || `reference-${index + 1}`;
      formData.append('image[]', reference.blob, `${productId}.png`);
    });
  } else {
    formData.append('image', sourceBlob, image.name || 'garden-photo.png');
  }
  formData.append('prompt', prompt);
  formData.append('size', size);
  formData.append('quality', quality);

  const startedAt = Date.now();
  const timeoutMs = Number(env.OPENAI_IMAGE_TIMEOUT_MS || 120000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(OPENAI_IMAGE_EDIT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
      signal: controller.signal,
    });
    const generationTimeMs = Date.now() - startedAt;
    const data = await response.json().catch(() => ({}));

    // TODO: Generation logging
    // generationTimeMs, response status, model, usage metadata, provider errors,
    // and successful generation IDs can be stored here for future product analytics.

    if (!response.ok) {
      const apiMessage = data.error && data.error.message ? data.error.message : '';
      return jsonResponse(response.status, {
        error: data.error || { code: 'openai_error' },
        message: normalizeErrorMessage(response.status, data.error && data.error.code, apiMessage),
      });
    }

    const imageBase64 = data.data && data.data[0] && data.data[0].b64_json;
    const imageUrl = data.data && data.data[0] && data.data[0].url;
    if (!imageBase64 && !imageUrl) {
      return jsonResponse(502, {
        error: { code: 'missing_image' },
        message: '画像生成APIの応答から生成画像を取得できませんでした。',
      });
    }

    return jsonResponse(200, {
      provider: 'openai',
      model,
      generation_time_ms: generationTimeMs,
      reference_products_used: referenceBlobs.map((reference) => ({
        product_id: reference.product.product_id || '',
        product_name: reference.product.product_name || '',
        image_url: reference.product.image_url || '',
        image_role: reference.product.image_role || '',
      })),
      image_url: imageBase64 ? `data:image/png;base64,${imageBase64}` : imageUrl,
      message: 'AIが完成イメージを生成しました。',
    });
  } catch (error) {
    const isTimeout = error && error.name === 'AbortError';
    return jsonResponse(isTimeout ? 408 : 500, {
      error: { code: isTimeout ? 'timeout' : 'request_failed' },
      message: normalizeErrorMessage(isTimeout ? 408 : 500, isTimeout ? 'timeout' : 'request_failed', error && error.message),
    });
  } finally {
    clearTimeout(timeout);
  }
}

function validateGardenPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'リクエスト形式が正しくありません。';
  }
  if (!payload.source_image || !payload.source_image.data_url) {
    return '元画像が送信されていません。庭写真またはサンプル庭を選択してください。';
  }
  if (!payload.prompt) {
    return 'AI生成用プロンプトが空です。';
  }
  return '';
}

export async function generateGardenImage(payload, options = {}) {
  const validationError = validateGardenPayload(payload);
  if (validationError) {
    return jsonResponse(400, {
      error: { code: 'invalid_request' },
      message: validationError,
    });
  }

  const provider = options.provider || process.env.IMAGE_PROVIDER || 'openai';
  if (provider !== 'openai') {
    return jsonResponse(501, {
      error: { code: 'provider_not_implemented' },
      message: '指定された画像生成プロバイダはまだ実装されていません。',
    });
  }

  return callOpenAIImageEdit(payload, options.env || process.env);
}

export async function handleGenerateGardenImageRequest(payload, options = {}) {
  return generateGardenImage(payload, options);
}

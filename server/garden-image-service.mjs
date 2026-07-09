const DEFAULT_MODEL = 'gpt-image-1';
const DEFAULT_SIZE = '1024x1024';
const DEFAULT_QUALITY = 'medium';
const OPENAI_IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits';

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
    '必須制約:',
    '- 既存建物は変更しない',
    '- 既存窓・玄関・屋根形状は維持する',
    '- 敷地形状を維持する',
    '- 写真のカメラアングルを維持する',
    '- 現実に施工可能な配置にする',
    '- 日本住宅として自然に見せる',
    '- 外構専門業者が施工したような完成度にする',
    '- 違和感のあるオブジェクトを追加しない',
    '- 選択商品以外を勝手に増やさない',
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
  const formData = new FormData();
  const model = env.OPENAI_IMAGE_MODEL || payload.image_model || DEFAULT_MODEL;
  const size = env.OPENAI_IMAGE_SIZE || DEFAULT_SIZE;
  const quality = env.OPENAI_IMAGE_QUALITY || DEFAULT_QUALITY;
  const prompt = buildOpenAIGardenPrompt(payload);

  formData.append('model', model);
  formData.append('image', sourceBlob, image.name || 'garden-photo.png');
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

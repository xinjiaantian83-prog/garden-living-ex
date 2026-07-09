import { handleGenerateGardenImageRequest } from '../server/garden-image-service.mjs';

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://gardenliving-ex.net';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      error: { code: 'method_not_allowed' },
      message: 'POSTでリクエストしてください。',
    });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const result = await handleGenerateGardenImageRequest(payload);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(400).json({
      error: { code: 'invalid_json' },
      message: 'リクエストJSONを読み込めませんでした。',
    });
  }
}

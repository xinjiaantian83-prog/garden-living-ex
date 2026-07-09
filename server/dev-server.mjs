import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleGenerateGardenImageRequest } from './garden-image-service.mjs';

const rootDir = fileURLToPath(new URL('../dist/', import.meta.url));
const projectDir = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 3008);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

async function loadLocalEnv() {
  try {
    const envText = await readFile(join(projectDir, '.env'), 'utf8');
    envText.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
      const index = trimmed.indexOf('=');
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && process.env[key] === undefined) process.env[key] = value;
    });
  } catch (error) {
    // Local .env is optional. Production should use platform environment variables.
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function handleApi(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, {
      error: { code: 'method_not_allowed' },
      message: 'POSTでリクエストしてください。',
    });
    return;
  }

  try {
    const payload = JSON.parse(await readBody(req) || '{}');
    const result = await handleGenerateGardenImageRequest(payload);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 400, {
      error: { code: 'invalid_json' },
      message: 'リクエストJSONを読み込めませんでした。',
    });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = normalize(join(rootDir, pathname));

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
    });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

await loadLocalEnv();

const server = createServer((req, res) => {
  if ((req.url || '').startsWith('/api/generate-garden-image')) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Garden Living dev server: http://localhost:${port}`);
});

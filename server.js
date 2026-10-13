const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 10000);
const VERSION = process.env.EXTENSION_VERSION || '6.1.0';
const PATCH_FILE = path.join(__dirname, 'patches', 'quality-upload.js');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

function send(res, status, data, type='application/json; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body='';
    req.on('data', chunk => { body += chunk; if (body.length > 32_000) { reject(new Error('body too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('invalid JSON')); } });
    req.on('error', reject);
  });
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true, service: 'xuqingxinnocent-api' });
  if (req.method === 'GET' && url.pathname === '/api/version') return send(res, 200, { name: 'XUQINGXINNOCENT EXT', version: VERSION });
  if (req.method === 'GET' && url.pathname === '/api/checkup') {
    // Safe default: do not remotely block or disable the extension.
    return send(res, 200, { ok: true, blocked: false, version: VERSION, updateAvailable: false, message: 'Self-hosted API is online. Extension protocol compatibility must be verified before connecting.' });
  }
  if (req.method === 'GET' && url.pathname === '/api/patch') {
    if (!fs.existsSync(PATCH_FILE)) return send(res, 503, { ok: false, error: 'quality_upload_patch_missing', message: 'Add an authorized, reviewed quality-upload.js source file before enabling remote script delivery.' });
    return send(res, 200, fs.readFileSync(PATCH_FILE, 'utf8'), 'text/javascript; charset=utf-8');
  }
  if (req.method === 'POST' && url.pathname === '/api/admin/status') {
    if (!ADMIN_TOKEN || req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) return send(res, 401, { ok: false, error: 'unauthorized' });
    try {
      const body = await readBody(req);
      if (typeof body.blocked !== 'boolean') return send(res, 400, { ok: false, error: 'blocked_boolean_required' });
      // Intentionally do not implement remote blocking in this starter.
      return send(res, 409, { ok: false, error: 'remote_blocking_not_enabled', message: 'Remote blocking is intentionally disabled in the starter template.' });
    } catch (e) { return send(res, 400, { ok: false, error: e.message }); }
  }
  return send(res, 404, { ok: false, error: 'not_found' });
});
server.listen(PORT, '0.0.0.0', () => console.log(`Xuqingxinnocent API listening on ${PORT}`));

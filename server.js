/**
 * Banke Bihari Pujan Samagri — Node.js backend.
 *
 * IMPORTANT: This uses ONLY Node's built-in modules (http, crypto, fs, path).
 * No "npm install" step needed — just run: node server.js
 *
 * Same API as the Python version, so the frontend in public/ works
 * without any changes. See README.md for setup and deployment.
 */
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret-before-going-live';

const ORDER_STAGES = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');
// All files (HTML/CSS/JS + server.js) live together in one folder for easy
// mobile upload — so we block server-only files from being served over HTTP.
const PUBLIC_DIR = __dirname;
const BLOCKED_FILES = new Set(['server.js', 'seed.js', 'package.json', '.env', '.env.example', '.gitignore', 'README.md']);

const SEED_PRODUCTS = require('./seed');

// ---------------- simple JSON file database ----------------
function readDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { users: [], products: [], orders: [], nextOrderNumber: 1001 };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeDB(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function seedIfEmpty() {
  const data = readDB();
  if (data.products.length === 0) {
    data.products = SEED_PRODUCTS.map((p) => ({ id: crypto.randomUUID(), ...p }));
    writeDB(data);
    console.log(`Seeded ${data.products.length} sample products.`);
  }
}
seedIfEmpty();

// ---------------- password hashing (built-in crypto, no bcrypt needed) ----------------
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(check));
}

// ---------------- signed cookie sessions (no session store needed) ----------------
function sign(value) {
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
  return `${value}.${sig}`;
}
function unsign(signed) {
  if (!signed) return null;
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return value;
}
function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const [k, ...v] = part.trim().split('=');
    out[k] = decodeURIComponent(v.join('='));
  });
  return out;
}
function getSession(req) {
  const cookies = parseCookies(req);
  const raw = unsign(cookies.session);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function setSessionCookie(res, sessionObj) {
  const value = sign(JSON.stringify(sessionObj));
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  res.setHeader('Set-Cookie', `session=${encodeURIComponent(value)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
}
function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0');
}

// ---------------- request helpers ----------------
function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}
function readJSONBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}
function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function nowISO() { return new Date().toISOString(); }

// NOTE: no real SMS provider wired up yet. OTP is returned in the response
// and printed to the console so you can test. Before going live, plug in a
// provider (MSG91 / Twilio / Gupshup) here and stop returning devOtp.
function sendOtp(phone, otp) {
  console.log(`[OTP] ${phone} -> ${otp}  (wire up a real SMS provider here before going live)`);
}

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, otp, otpExpires, ...rest } = u;
  return rest;
}

// ---------------- static file serving ----------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};
function serveStatic(req, res, pathname) {
  let filePath = pathname === '/' ? '/index.html' : pathname;
  const cleanName = filePath.replace(/^\/+/, '');
  if (BLOCKED_FILES.has(cleanName) || cleanName.startsWith('.') || cleanName.includes('..')) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const full = path.join(PUBLIC_DIR, filePath);
  if (!full.startsWith(PUBLIC_DIR)) { res.writeHead(403); res.end(); return; }
  fs.readFile(full, (err, content) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(full);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

// ---------------- routing ----------------
const routes = []; // { method, pattern: RegExp, keys: [], handler }

function route(method, pattern, handler) {
  const keys = [];
  const regexStr = pattern.replace(/:[^/]+/g, (m) => { keys.push(m.slice(1)); return '([^/]+)'; });
  routes.push({ method, regex: new RegExp(`^${regexStr}$`), keys, handler });
}

function requireLogin(session) {
  return !!session.userId;
}
function requireAdmin(session) {
  return !!session.isAdmin;
}

// ---- AUTH ----
route('POST', '/api/signup', async (req, res, params, session) => {
  const body = await readJSONBody(req);
  const { name, phone, password, address = '' } = body;
  if (!name || !phone || !password) return sendJSON(res, 400, { error: 'नाम, फ़ोन नंबर और पासवर्ड ज़रूरी है' });
  if (!/^\d{10}$/.test(phone)) return sendJSON(res, 400, { error: 'सही 10 अंकों का मोबाइल नंबर डालें' });

  const data = readDB();
  if (data.users.some((u) => u.phone === phone)) {
    return sendJSON(res, 409, { error: 'इस नंबर से पहले से खाता बना हुआ है, लॉगिन करें' });
  }
  const otp = genOtp();
  const user = {
    id: crypto.randomUUID(), name, phone, address,
    passwordHash: hashPassword(password),
    verified: false, otp, otpExpires: new Date(Date.now() + 10 * 60000).toISOString(),
    createdAt: nowISO()
  };
  data.users.push(user);
  writeDB(data);
  sendOtp(phone, otp);
  sendJSON(res, 200, { ok: true, message: 'OTP भेज दिया गया', devOtp: otp });
});

route('POST', '/api/verify-otp', async (req, res, params, session) => {
  const { phone, otp } = await readJSONBody(req);
  const data = readDB();
  const user = data.users.find((u) => u.phone === phone);
  if (!user) return sendJSON(res, 404, { error: 'खाता नहीं मिला' });
  if (user.verified) return sendJSON(res, 200, { ok: true, message: 'पहले से verified है' });
  if (!user.otp || new Date() > new Date(user.otpExpires)) {
    return sendJSON(res, 400, { error: 'OTP की समय सीमा समाप्त हो गई, दोबारा भेजें' });
  }
  if (user.otp !== otp) return sendJSON(res, 400, { error: 'गलत OTP' });

  user.verified = true;
  delete user.otp; delete user.otpExpires;
  writeDB(data);
  setSessionCookie(res, { userId: user.id });
  sendJSON(res, 200, { ok: true, user: publicUser(user) });
});

route('POST', '/api/resend-otp', async (req, res) => {
  const { phone } = await readJSONBody(req);
  const data = readDB();
  const user = data.users.find((u) => u.phone === phone);
  if (!user) return sendJSON(res, 404, { error: 'खाता नहीं मिला' });
  if (user.verified) return sendJSON(res, 200, { ok: true, message: 'पहले से verified है' });
  const otp = genOtp();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60000).toISOString();
  writeDB(data);
  sendOtp(phone, otp);
  sendJSON(res, 200, { ok: true, message: 'नया OTP भेजा गया', devOtp: otp });
});

route('POST', '/api/login', async (req, res) => {
  const { phone, password } = await readJSONBody(req);
  const data = readDB();
  const user = data.users.find((u) => u.phone === phone);
  if (!user || !verifyPassword(password || '', user.passwordHash)) {
    return sendJSON(res, 401, { error: 'गलत नंबर या पासवर्ड' });
  }
  if (!user.verified) {
    return sendJSON(res, 403, { error: 'पहले OTP से नंबर verify करें', needsVerification: true, phone: user.phone });
  }
  setSessionCookie(res, { userId: user.id });
  sendJSON(res, 200, { ok: true, user: publicUser(user) });
});

route('POST', '/api/logout', async (req, res) => {
  clearSessionCookie(res);
  sendJSON(res, 200, { ok: true });
});

route('GET', '/api/me', async (req, res, params, session) => {
  if (!session.userId) return sendJSON(res, 200, { user: null });
  const data = readDB();
  const user = data.users.find((u) => u.id === session.userId);
  sendJSON(res, 200, { user: publicUser(user) });
});

// ---- PRODUCTS ----
route('GET', '/api/products', async (req, res, params, session, query) => {
  const data = readDB();
  let products = data.products;
  if (query.category) products = products.filter((p) => p.category === query.category);
  if (query.q) {
    const needle = query.q.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(needle));
  }
  sendJSON(res, 200, { products });
});

route('GET', '/api/categories', async (req, res) => {
  const data = readDB();
  const cats = [...new Set(data.products.map((p) => p.category))];
  sendJSON(res, 200, { categories: cats });
});

// ---- ORDERS ----
route('POST', '/api/orders', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const body = await readJSONBody(req);
  const { items, customerName, phone, address, paymentMethod = 'COD' } = body;
  if (!items || !items.length) return sendJSON(res, 400, { error: 'कार्ट खाली है' });
  if (!customerName || !phone || !address) return sendJSON(res, 400, { error: 'नाम, फ़ोन और पता ज़रूरी है' });

  const data = readDB();
  let total = 0;
  const resolvedItems = [];
  for (const it of items) {
    const product = data.products.find((p) => p.id === it.productId);
    if (!product) return sendJSON(res, 400, { error: 'invalid product in cart' });
    const qty = Math.max(1, parseInt(it.qty || 1, 10));
    total += product.price * qty;
    resolvedItems.push({ productId: product.id, name: product.name, price: product.price, qty });
  }
  const orderNumber = data.nextOrderNumber || 1001;
  data.nextOrderNumber = orderNumber + 1;
  const order = {
    id: crypto.randomUUID(), orderNumber, userId: session.userId,
    items: resolvedItems, total, customerName, phone, address, paymentMethod,
    status: ORDER_STAGES[0],
    statusHistory: [{ status: ORDER_STAGES[0], at: nowISO() }],
    createdAt: nowISO()
  };
  data.orders.push(order);
  writeDB(data);
  sendJSON(res, 200, { ok: true, order });
});

route('GET', '/api/orders', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const data = readDB();
  const mine = data.orders.filter((o) => o.userId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  sendJSON(res, 200, { orders: mine, stages: ORDER_STAGES });
});

route('GET', '/api/orders/:id', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const data = readDB();
  const order = data.orders.find((o) => o.id === params.id && o.userId === session.userId);
  if (!order) return sendJSON(res, 404, { error: 'ऑर्डर नहीं मिला' });
  sendJSON(res, 200, { order, stages: ORDER_STAGES });
});

// ---- ADMIN ----
route('POST', '/api/admin/login', async (req, res, params, session, query, setSess) => {
  const { password } = await readJSONBody(req);
  if (password !== ADMIN_PASSWORD) return sendJSON(res, 401, { error: 'गलत admin password' });
  setSessionCookie(res, { ...session, isAdmin: true });
  sendJSON(res, 200, { ok: true });
});

route('POST', '/api/admin/logout', async (req, res, params, session) => {
  setSessionCookie(res, { ...session, isAdmin: false });
  sendJSON(res, 200, { ok: true });
});

route('GET', '/api/admin/orders', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const data = readDB();
  const orders = [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  sendJSON(res, 200, { orders, stages: ORDER_STAGES });
});

route('PUT', '/api/admin/orders/:id/status', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const { status } = await readJSONBody(req);
  if (!ORDER_STAGES.includes(status)) return sendJSON(res, 400, { error: 'invalid status' });
  const data = readDB();
  const order = data.orders.find((o) => o.id === params.id);
  if (!order) return sendJSON(res, 404, { error: 'not found' });
  order.status = status;
  order.statusHistory.push({ status, at: nowISO() });
  writeDB(data);
  sendJSON(res, 200, { ok: true, order });
});

route('GET', '/api/admin/products', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const data = readDB();
  sendJSON(res, 200, { products: data.products });
});

route('POST', '/api/admin/products', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const body = await readJSONBody(req);
  const { name, category, price, mrp, emoji } = body;
  if (!name || !category || !price) return sendJSON(res, 400, { error: 'नाम, category, price ज़रूरी है' });
  const data = readDB();
  const product = { id: crypto.randomUUID(), name, category, price: Number(price), mrp: Number(mrp || price), emoji: emoji || '🪔' };
  data.products.push(product);
  writeDB(data);
  sendJSON(res, 200, { ok: true, product });
});

route('PUT', '/api/admin/products/:id', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const body = await readJSONBody(req);
  const data = readDB();
  const product = data.products.find((p) => p.id === params.id);
  if (!product) return sendJSON(res, 404, { error: 'not found' });
  Object.assign(product, body);
  writeDB(data);
  sendJSON(res, 200, { ok: true, product });
});

route('DELETE', '/api/admin/products/:id', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const data = readDB();
  data.products = data.products.filter((p) => p.id !== params.id);
  writeDB(data);
  sendJSON(res, 200, { ok: true });
});

// ---------------- server ----------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const query = Object.fromEntries(url.searchParams.entries());
  const session = getSession(req);

  if (pathname.startsWith('/api/')) {
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const match = pathname.match(r.regex);
      if (!match) continue;
      const params = {};
      r.keys.forEach((key, i) => { params[key] = decodeURIComponent(match[i + 1]); });
      try {
        await r.handler(req, res, params, session, query);
      } catch (err) {
        console.error(err);
        sendJSON(res, 500, { error: 'server error' });
      }
      return;
    }
    return sendJSON(res, 404, { error: 'not found' });
  }

  if (req.method === 'GET') return serveStatic(req, res, pathname);
  res.writeHead(405); res.end();
});

server.listen(PORT, () => {
  console.log(`Banke Bihari store running: http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html  (password: ${ADMIN_PASSWORD})`);
});

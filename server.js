/**
 * Banke Bihari Pujan Samagri — Node.js backend.
 *
 * Data lives in Turso (hosted SQLite) — see db.js and README.md for setup.
 * This file only needs Node's built-in http/crypto/fs/path modules; the
 * one real dependency is @libsql/client (used inside db.js) which Render
 * installs automatically from package.json during its build step.
 */
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const db = require('./db');

const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
if (IS_PRODUCTION && (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12 || !SESSION_SECRET || SESSION_SECRET.length < 32)) {
  throw new Error('Production requires ADMIN_PASSWORD (12+ chars) and SESSION_SECRET (32+ chars). Set them as environment variables.');
}

const ORDER_STAGES = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

// Delivery is restricted to Bhind district only. Every pincode in Bhind
// district starts with "477" (confirmed against India Post data — Bhind
// city itself is 477001). If you ever want to expand delivery to a
// neighbouring district, just add more allowed prefixes here.
const ALLOWED_PINCODE_PREFIXES = ['477'];
function isDeliverablePincode(pincode) {
  if (!pincode || !/^\d{6}$/.test(pincode)) return false;
  return ALLOWED_PINCODE_PREFIXES.some((prefix) => pincode.startsWith(prefix));
}

// All files (HTML/CSS/JS + server.js) live together in one folder for easy
// mobile upload — so we block server-only files from being served over HTTP.
const PUBLIC_DIR = __dirname;
const BLOCKED_FILES = new Set([
  'server.js', 'db.js', 'seed.js', 'puja-templates-seed.js', 'package.json', 'package-lock.json',
  '.env', '.env.example', '.gitignore', 'README.md'
]);

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
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (IS_PRODUCTION) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}
function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  setSecurityHeaders(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
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
async function sendOtp(phone, otp) {
  const webhook = process.env.SMS_WEBHOOK_URL;
  if (!webhook) {
    if (IS_PRODUCTION) throw new Error('SMS_WEBHOOK_URL is required in production');
    console.log(`[DEV OTP] ${phone} -> ${otp}`);
    return;
  }
  const response = await fetch(webhook, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.SMS_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_TOKEN}` } : {}) },
    body: JSON.stringify({ phone, otp, app: 'Banke Bihari Pujan Samagri' })
  });
  if (!response.ok) throw new Error(`SMS provider returned ${response.status}`);
}

// Maps a raw SQL user row (snake_case) to the camelCase shape the rest of
// the app expects, and strips fields that should never reach the browser.
function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id, name: row.name, phone: row.phone, address: row.address,
    verified: !!row.verified, createdAt: row.created_at,
    passwordHash: row.password_hash, otp: row.otp, otpExpires: row.otp_expires
  };
}
function publicUser(row) {
  const u = mapUser(row);
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
    setSecurityHeaders(res);
    const cacheable = ['.css','.js','.png','.jpg','.svg','.webp','.ico'].includes(ext);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cacheable ? 'public, max-age=86400' : 'no-cache' });
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
route('POST', '/api/signup', async (req, res) => {
  const body = await readJSONBody(req);
  const { name, phone, password, address = '' } = body;
  if (!name || !phone || !password) return sendJSON(res, 400, { error: 'नाम, फ़ोन नंबर और पासवर्ड ज़रूरी है' });
  if (!/^\d{10}$/.test(phone)) return sendJSON(res, 400, { error: 'सही 10 अंकों का मोबाइल नंबर डालें' });

  const existing = await db.getUserByPhone(phone);
  if (existing) return sendJSON(res, 409, { error: 'इस नंबर से पहले से खाता बना हुआ है, लॉगिन करें' });

  const otp = genOtp();
  await db.createUser({
    id: crypto.randomUUID(), name, phone, address,
    passwordHash: hashPassword(password),
    otp, otpExpires: new Date(Date.now() + 10 * 60000).toISOString(),
    createdAt: nowISO()
  });
  await sendOtp(phone, otp);
  sendJSON(res, 200, { ok: true, message: 'OTP भेज दिया गया' });
});

route('POST', '/api/verify-otp', async (req, res) => {
  const { phone, otp } = await readJSONBody(req);
  const row = await db.getUserByPhone(phone);
  const user = mapUser(row);
  if (!user) return sendJSON(res, 404, { error: 'खाता नहीं मिला' });
  if (user.verified) return sendJSON(res, 200, { ok: true, message: 'पहले से verified है' });
  if (!user.otp || new Date() > new Date(user.otpExpires)) {
    return sendJSON(res, 400, { error: 'OTP की समय सीमा समाप्त हो गई, दोबारा भेजें' });
  }
  if (user.otp !== otp) return sendJSON(res, 400, { error: 'गलत OTP' });

  await db.verifyUserById(user.id);
  setSessionCookie(res, { userId: user.id });
  sendJSON(res, 200, { ok: true, user: publicUser({ ...row, verified: 1 }) });
});

route('POST', '/api/resend-otp', async (req, res) => {
  const { phone } = await readJSONBody(req);
  const row = await db.getUserByPhone(phone);
  if (!row) return sendJSON(res, 404, { error: 'खाता नहीं मिला' });
  if (row.verified) return sendJSON(res, 200, { ok: true, message: 'पहले से verified है' });
  const otp = genOtp();
  const otpExpires = new Date(Date.now() + 10 * 60000).toISOString();
  await db.setUserOtp(row.id, otp, otpExpires);
  await sendOtp(phone, otp);
  sendJSON(res, 200, { ok: true, message: 'नया OTP भेजा गया' });
});

route('POST', '/api/login', async (req, res) => {
  const { phone, password } = await readJSONBody(req);
  const row = await db.getUserByPhone(phone);
  if (!row || !verifyPassword(password || '', row.password_hash)) {
    return sendJSON(res, 401, { error: 'गलत नंबर या पासवर्ड' });
  }
  if (!row.verified) {
    return sendJSON(res, 403, { error: 'पहले OTP से नंबर verify करें', needsVerification: true, phone: row.phone });
  }
  setSessionCookie(res, { userId: row.id });
  sendJSON(res, 200, { ok: true, user: publicUser(row) });
});

route('POST', '/api/logout', async (req, res) => {
  clearSessionCookie(res);
  sendJSON(res, 200, { ok: true });
});

route('POST', '/api/forgot-password', async (req, res) => {
  const { phone } = await readJSONBody(req);
  if (!phone) return sendJSON(res, 400, { error: 'मोबाइल नंबर डालें' });
  const row = await db.getUserByPhone(phone);
  // Same response whether or not the number exists, so someone probing
  // random numbers can't use this to find out which ones have accounts.
  if (!row) return sendJSON(res, 200, { ok: true, message: 'अगर यह नंबर रजिस्टर है, तो OTP भेज दिया गया है' });
  const otp = genOtp();
  const otpExpires = new Date(Date.now() + 10 * 60000).toISOString();
  await db.setUserOtp(row.id, otp, otpExpires);
  await sendOtp(phone, otp);
  sendJSON(res, 200, { ok: true, message: 'OTP भेज दिया गया' });
});

route('POST', '/api/reset-password', async (req, res) => {
  const { phone, otp, newPassword } = await readJSONBody(req);
  if (!phone || !otp || !newPassword) return sendJSON(res, 400, { error: 'सभी जानकारी ज़रूरी है' });
  if (newPassword.length < 4) return sendJSON(res, 400, { error: 'पासवर्ड कम से कम 4 अक्षर का हो' });
  const row = await db.getUserByPhone(phone);
  if (!row) return sendJSON(res, 404, { error: 'खाता नहीं मिला' });
  if (!row.otp || new Date() > new Date(row.otp_expires)) {
    return sendJSON(res, 400, { error: 'OTP की समय सीमा समाप्त हो गई, दोबारा भेजें' });
  }
  if (row.otp !== otp) return sendJSON(res, 400, { error: 'गलत OTP' });

  await db.resetPassword(row.id, hashPassword(newPassword));
  setSessionCookie(res, { userId: row.id });
  sendJSON(res, 200, { ok: true, message: 'पासवर्ड बदल दिया गया' });
});

route('GET', '/api/me', async (req, res, params, session) => {
  if (!session.userId) return sendJSON(res, 200, { user: null });
  const row = await db.getUserById(session.userId);
  sendJSON(res, 200, { user: publicUser(row) });
});

// ---- PRODUCTS ----
route('GET', '/api/products', async (req, res, params, session, query) => {
  const products = await db.getProducts({ category: query.category, q: query.q });
  sendJSON(res, 200, { products });
});

// Lightweight name-only list for the search-suggestions dropdown — kept
// separate from /api/products so the autocomplete stays fast even if the
// catalog grows to hundreds of items.
route('GET', '/api/products/suggest', async (req, res, params, session, query) => {
  const needle = (query.q || '').trim();
  if (!needle) return sendJSON(res, 200, { suggestions: [] });
  const rows = await db.suggestProducts(needle);
  sendJSON(res, 200, { suggestions: rows.map((r) => ({ id: r.id, name: r.name, category: r.category })) });
});

route('GET', '/api/categories', async (req, res) => {
  const categories = await db.getCategories();
  sendJSON(res, 200, { categories });
});

// Same-category "related products" — no need for a recommendation engine
// at this catalog size, category match already gives sensible results.
route('GET', '/api/products/related', async (req, res, params, session, query) => {
  const categories = (query.categories || '').split(',').filter(Boolean);
  const exclude = (query.exclude || '').split(',').filter(Boolean);
  const products = await db.getRelatedProducts(categories, exclude);
  sendJSON(res, 200, { products });
});

// ---- REVIEWS ----
route('GET', '/api/reviews', async (req, res, params, session, query) => {
  const productId = query.productId;
  if (!productId) return sendJSON(res, 400, { error: 'productId ज़रूरी है' });
  const reviews = await db.getReviewsByProduct(productId);
  sendJSON(res, 200, { reviews });
});

route('POST', '/api/reviews', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'रिव्यू देने के लिए लॉगिन ज़रूरी है' });
  const body = await readJSONBody(req);
  const { productId, rating, comment = '' } = body;
  const ratingNum = Number(rating);
  if (!productId || !ratingNum || ratingNum < 1 || ratingNum > 5) {
    return sendJSON(res, 400, { error: '1 से 5 के बीच रेटिंग चुनें' });
  }
  const product = await db.getProductById(productId);
  if (!product) return sendJSON(res, 404, { error: 'प्रोडक्ट नहीं मिला' });
  const userRow = await db.getUserById(session.userId);

  const review = {
    id: crypto.randomUUID(), productId, userId: session.userId,
    userName: userRow ? userRow.name : 'ग्राहक', rating: ratingNum, comment,
    createdAt: nowISO()
  };
  await db.upsertReview(review);
  sendJSON(res, 200, { ok: true, review });
});

// ---- WISHLIST ----
route('GET', '/api/wishlist', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const products = await db.getWishlistProducts(session.userId);
  sendJSON(res, 200, { products });
});

route('POST', '/api/wishlist/:id', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const added = await db.toggleWishlist(session.userId, params.id);
  const wishlist = await db.getWishlistProductIds(session.userId);
  sendJSON(res, 200, { ok: true, added, wishlist });
});

// ---- ORDERS ----
route('POST', '/api/orders', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const body = await readJSONBody(req);
  const { items, customerName, phone, address, pincode, paymentMethod = 'COD' } = body;
  if (!items || !items.length) return sendJSON(res, 400, { error: 'कार्ट खाली है' });
  if (!customerName || !phone || !address) return sendJSON(res, 400, { error: 'नाम, फ़ोन और पता ज़रूरी है' });

  // Delivery is Bhind-only for now — checked server-side so it can't be
  // bypassed even if someone edits the page.
  if (!isDeliverablePincode(pincode)) {
    return sendJSON(res, 400, {
      error: 'माफ़ कीजिए, अभी हम सिर्फ़ भिंड (पिनकोड 477XXX) में ही डिलीवरी करते हैं। सही पिनकोड डालें या दुकान से खुद ले जाएं।'
    });
  }

  // Validate every item's stock before writing anything.
  let total = 0;
  const resolvedItems = [];
  for (const it of items) {
    const product = await db.getProductById(it.productId);
    if (!product) return sendJSON(res, 400, { error: 'invalid product in cart' });
    const qty = Math.max(1, parseInt(it.qty || 1, 10));
    if ((product.stock ?? 0) < qty) {
      return sendJSON(res, 400, { error: `"${product.name}" में सिर्फ़ ${product.stock ?? 0} बचे हैं` });
    }
    total += product.price * qty;
    resolvedItems.push({ productId: product.id, name: product.name, price: product.price, qty });
  }

  const orderNumber = await db.getNextOrderNumber();
  const order = {
    id: crypto.randomUUID(), orderNumber, userId: session.userId,
    total, customerName, phone, address, pincode, paymentMethod,
    status: ORDER_STAGES[0], createdAt: nowISO()
  };
  try {
    await db.createOrderTx(order, resolvedItems);
  } catch (err) {
    console.error(err);
    return sendJSON(res, 400, { error: 'ऑर्डर पूरा नहीं हो सका, स्टॉक बदल गया हो सकता है — दोबारा कोशिश करें' });
  }
  order.items = resolvedItems;
  sendJSON(res, 200, { ok: true, order });
});

route('GET', '/api/orders', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const orders = await db.getOrdersByUser(session.userId);
  sendJSON(res, 200, { orders, stages: ORDER_STAGES });
});

route('GET', '/api/orders/:id', async (req, res, params, session) => {
  if (!requireLogin(session)) return sendJSON(res, 401, { error: 'लॉगिन ज़रूरी है' });
  const order = await db.getOrderById(params.id, session.userId);
  if (!order) return sendJSON(res, 404, { error: 'ऑर्डर नहीं मिला' });
  sendJSON(res, 200, { order, stages: ORDER_STAGES });
});

// ---- PUJA SAMAGRI GENERATOR ----
route('GET', '/api/puja-templates', async (req, res) => {
  const templates = await db.getPujaTemplates();
  sendJSON(res, 200, { templates });
});

route('GET', '/api/puja-templates/:id/generate', async (req, res, params, session, query) => {
  const template = await db.getPujaTemplateById(params.id);
  if (!template) return sendJSON(res, 404, { error: 'यह पूजा टेम्पलेट नहीं मिला' });
  const guestCount = Math.max(1, parseInt(query.guests || '1', 10));

  const items = [];
  for (const item of template.items) {
    const qty = Math.round((item.baseQty + item.perGuestQty * guestCount) * 100) / 100;
    const product = await db.findProductByNameMatch(item.matchName);
    items.push({
      label: item.label, qty, unit: item.unit,
      product: product ? { id: product.id, name: product.name, price: product.price, stock: product.stock } : null
    });
  }
  sendJSON(res, 200, { template: { id: template.id, nameHi: template.nameHi, description: template.description, note: template.note }, guestCount, items });
});

// Optional AI-assisted suggestions for a puja NOT in the curated list —
// only works if the shop owner has added an OPENAI_API_KEY or
// ANTHROPIC_API_KEY environment variable. Never linked to real cart items
// (AI-suggested item names won't reliably match the catalog), always
// shown as a "confirm with your shop" suggestion, not a final list.
route('POST', '/api/puja-ai-suggest', async (req, res) => {
  const { description, guestCount } = await readJSONBody(req);
  if (!description) return sendJSON(res, 400, { error: 'पूजा का विवरण डालें' });

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!openaiKey && !anthropicKey) {
    return sendJSON(res, 200, {
      ok: false,
      message: 'यह पूजा हमारी सूची में नहीं है। कृपया दुकान पर WhatsApp/कॉल करें — हम आपको बता देंगे।'
    });
  }

  const prompt = `Ek Hindu pooja/ritual ka naam ya vivaran diya gaya hai: "${description}". Mehmano ki sankhya: ${guestCount || 'nahi bataya'}.
Is pooja ke liye aam taur par lagne wali pooja samagri (physical items) ki ek list JSON array format mein do.
Har item: {"label": "hindi mein item ka naam", "qty": number, "unit": "hindi mein unit jaise ग्राम/पीस/पैकेट"}.
Sirf JSON array return karo, koi aur text nahi. Agar tumhe pooja type samajh na aaye to khaali array [] return karo.`;

  try {
    let items = [];
    if (openaiKey) {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
      const data = await r.json();
      const text = data.choices?.[0]?.message?.content || '[]';
      items = JSON.parse(text.replace(/```json|```/g, '').trim());
    } else if (anthropicKey) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await r.json();
      const text = data.content?.[0]?.text || '[]';
      items = JSON.parse(text.replace(/```json|```/g, '').trim());
    }
    sendJSON(res, 200, { ok: true, items, aiGenerated: true });
  } catch (err) {
    console.error('AI suggest error:', err.message);
    sendJSON(res, 200, {
      ok: false,
      message: 'AI सुझाव अभी उपलब्ध नहीं है। कृपया दुकान पर WhatsApp/कॉल करें।'
    });
  }
});

route('POST', '/api/admin/login', async (req, res, params, session) => {
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
  const orders = await db.getAllOrders();
  sendJSON(res, 200, { orders, stages: ORDER_STAGES });
});

route('PUT', '/api/admin/orders/:id/status', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const { status } = await readJSONBody(req);
  if (!ORDER_STAGES.includes(status)) return sendJSON(res, 400, { error: 'invalid status' });
  await db.updateOrderStatus(params.id, status, nowISO());
  const order = await db.getOrderById(params.id);
  if (!order) return sendJSON(res, 404, { error: 'not found' });
  sendJSON(res, 200, { ok: true, order });
});

route('GET', '/api/admin/products', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const products = await db.getProducts({});
  sendJSON(res, 200, { products });
});

route('POST', '/api/admin/products', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const body = await readJSONBody(req);
  const { name, category, price, mrp, stock, emoji, image } = body;
  if (!name || !category || !price) return sendJSON(res, 400, { error: 'नाम, category, price ज़रूरी है' });
  const product = {
    id: crypto.randomUUID(), name, category, price: Number(price), mrp: Number(mrp || price),
    stock: stock !== undefined ? Number(stock) : 50, emoji: emoji || '🪔', image: image || null
  };
  await db.createProduct(product);
  sendJSON(res, 200, { ok: true, product });
});

route('PUT', '/api/admin/products/:id', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const body = await readJSONBody(req);
  await db.updateProduct(params.id, body);
  const product = await db.getProductById(params.id);
  if (!product) return sendJSON(res, 404, { error: 'not found' });
  sendJSON(res, 200, { ok: true, product });
});

route('DELETE', '/api/admin/products/:id', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  await db.deleteProduct(params.id);
  sendJSON(res, 200, { ok: true });
});

// ---- ADMIN: PUJA TEMPLATES ----
route('GET', '/api/admin/puja-templates', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const templates = await db.getPujaTemplates();
  const full = [];
  for (const t of templates) full.push(await db.getPujaTemplateById(t.id));
  sendJSON(res, 200, { templates: full });
});

route('POST', '/api/admin/puja-templates', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const body = await readJSONBody(req);
  const { nameHi, description, note, items } = body;
  if (!nameHi || !items || !Array.isArray(items)) return sendJSON(res, 400, { error: 'नाम और items ज़रूरी हैं' });
  const id = crypto.randomUUID();
  await db.createPujaTemplate({ id, nameHi, description, note, items });
  sendJSON(res, 200, { ok: true, id });
});

route('PUT', '/api/admin/puja-templates/:id', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  const body = await readJSONBody(req);
  await db.updatePujaTemplate(params.id, body);
  sendJSON(res, 200, { ok: true });
});

route('DELETE', '/api/admin/puja-templates/:id', async (req, res, params, session) => {
  if (!requireAdmin(session)) return sendJSON(res, 401, { error: 'Admin login required' });
  await db.deletePujaTemplate(params.id);
  sendJSON(res, 200, { ok: true });
});

// ---- PUBLIC CONFIG (safe, non-secret values the frontend needs) ----
route('GET', '/api/config', async (req, res) => {
  sendJSON(res, 200, {
    upiId: process.env.UPI_ID || '',
    upiName: process.env.UPI_NAME || 'Banke Bihari Pujan Samagri',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '918839800902',
    aiEnabled: !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY)
  });
});

// ---------------- server ----------------
const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url.split('?')[0] === '/health') {
    return sendJSON(res, 200, { ok: true, service: 'banke-bihari-store', time: nowISO() });
  }
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

// Schema must exist before we accept traffic, so we wait for it here
// instead of racing the first incoming request against table creation.
db.initSchema()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Banke Bihari store running: http://localhost:${PORT}`);
      console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
    console.error('Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set correctly.');
    process.exit(1);
  });

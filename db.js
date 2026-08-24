/**
 * Database layer — Turso (hosted SQLite / libSQL).
 *
 * Replaces the old JSON-file storage. Render's free plan wipes local files
 * on every restart/redeploy/spin-down, so data must live somewhere that
 * survives that — Turso's free tier does, permanently, at no cost.
 *
 * Needs two environment variables (set these in Render → Environment):
 *   TURSO_DATABASE_URL   e.g. libsql://your-db-name.turso.io
 *   TURSO_AUTH_TOKEN     the token Turso gives you for that database
 *
 * See README.md for how to create these on turso.tech.
 */
const { createClient } = require('@libsql/client');
const crypto = require('crypto');
const SEED_PRODUCTS = require('./seed');
const PUJA_TEMPLATES_SEED = require('./puja-templates-seed');

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('');
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN.');
  console.error('   Set these as environment variables (see README.md) before starting the server.');
  console.error('');
}

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT UNIQUE NOT NULL,
    address TEXT, password_hash TEXT NOT NULL, verified INTEGER DEFAULT 0,
    otp TEXT, otp_expires TEXT, created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
    price REAL NOT NULL, mrp REAL, stock INTEGER DEFAULT 0, emoji TEXT, image TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, order_number INTEGER NOT NULL, user_id TEXT NOT NULL,
    total REAL NOT NULL, customer_name TEXT NOT NULL, phone TEXT NOT NULL,
    address TEXT NOT NULL, pincode TEXT, payment_method TEXT,
    status TEXT NOT NULL, created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL,
    product_id TEXT NOT NULL, name TEXT NOT NULL, price REAL NOT NULL, qty INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS order_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL,
    status TEXT NOT NULL, at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY, product_id TEXT NOT NULL, user_id TEXT NOT NULL,
    user_name TEXT, rating INTEGER NOT NULL, comment TEXT,
    created_at TEXT NOT NULL, updated_at TEXT,
    UNIQUE(product_id, user_id)
  )`,
  `CREATE TABLE IF NOT EXISTS wishlist (
    user_id TEXT NOT NULL, product_id TEXT NOT NULL, PRIMARY KEY (user_id, product_id)
  )`,
  `CREATE TABLE IF NOT EXISTS puja_templates (
    id TEXT PRIMARY KEY, name_hi TEXT NOT NULL, description TEXT,
    note TEXT, items TEXT NOT NULL
  )`
];

async function initSchema() {
  for (const stmt of SCHEMA) {
    await client.execute(stmt);
  }
  const countRes = await client.execute('SELECT COUNT(*) as cnt FROM products');
  const count = Number(countRes.rows[0].cnt);
  if (count === 0) {
    for (const p of SEED_PRODUCTS) {
      await client.execute({
        sql: 'INSERT INTO products (id,name,category,price,mrp,stock,emoji,image) VALUES (?,?,?,?,?,?,?,?)',
        args: [crypto.randomUUID(), p.name, p.category, p.price, p.mrp, p.stock ?? 50, p.emoji || '🪔', p.image || null]
      });
    }
    console.log(`Seeded ${SEED_PRODUCTS.length} sample products into Turso.`);
  }

  const pujaCountRes = await client.execute('SELECT COUNT(*) as cnt FROM puja_templates');
  const pujaCount = Number(pujaCountRes.rows[0].cnt);
  if (pujaCount === 0) {
    for (const t of PUJA_TEMPLATES_SEED) {
      await client.execute({
        sql: 'INSERT INTO puja_templates (id,name_hi,description,note,items) VALUES (?,?,?,?,?)',
        args: [t.id, t.nameHi, t.description || '', t.note || '', JSON.stringify(t.items)]
      });
    }
    console.log(`Seeded ${PUJA_TEMPLATES_SEED.length} puja templates into Turso.`);
  }
}

// ---------------- USERS ----------------
async function getUserByPhone(phone) {
  const res = await client.execute({ sql: 'SELECT * FROM users WHERE phone = ?', args: [phone] });
  return res.rows[0] || null;
}
async function getUserById(id) {
  const res = await client.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] });
  return res.rows[0] || null;
}
async function createUser(u) {
  await client.execute({
    sql: `INSERT INTO users (id,name,phone,address,password_hash,verified,otp,otp_expires,created_at)
          VALUES (?,?,?,?,?,?,?,?,?)`,
    args: [u.id, u.name, u.phone, u.address || '', u.passwordHash, 0, u.otp, u.otpExpires, u.createdAt]
  });
}
async function setUserOtp(id, otp, otpExpires) {
  await client.execute({ sql: 'UPDATE users SET otp=?, otp_expires=? WHERE id=?', args: [otp, otpExpires, id] });
}
async function verifyUserById(id) {
  await client.execute({ sql: 'UPDATE users SET verified=1, otp=NULL, otp_expires=NULL WHERE id=?', args: [id] });
}
async function resetPassword(id, passwordHash) {
  await client.execute({
    sql: 'UPDATE users SET password_hash=?, otp=NULL, otp_expires=NULL WHERE id=?',
    args: [passwordHash, id]
  });
}
async function updateUser(id, fields) {
  const sets = []; const args = [];
  if (fields.name !== undefined) { sets.push('name=?'); args.push(fields.name); }
  if (fields.address !== undefined) { sets.push('address=?'); args.push(fields.address); }
  if (!sets.length) return;
  args.push(id);
  await client.execute({ sql: `UPDATE users SET ${sets.join(', ')} WHERE id=?`, args });
}

// ---------------- PRODUCTS ----------------
// products + their rating aggregate, computed with a LEFT JOIN so a
// product with zero reviews still comes back with reviewCount 0.
const PRODUCTS_WITH_RATING_SQL = `
  SELECT p.*, COALESCE(r.cnt, 0) as reviewCount, COALESCE(r.avg_rating, 0) as avgRating
  FROM products p
  LEFT JOIN (SELECT product_id, COUNT(*) as cnt, AVG(rating) as avg_rating FROM reviews GROUP BY product_id) r
    ON r.product_id = p.id
`;
function mapProductRow(row) {
  return {
    id: row.id, name: row.name, category: row.category,
    price: row.price, mrp: row.mrp, stock: row.stock, emoji: row.emoji, image: row.image,
    reviewCount: Number(row.reviewCount), avgRating: Math.round(Number(row.avgRating) * 10) / 10,
    inStock: row.stock > 0
  };
}
async function getProducts({ category, q } = {}) {
  let sql = PRODUCTS_WITH_RATING_SQL;
  const conditions = []; const args = [];
  if (category) { conditions.push('p.category = ?'); args.push(category); }
  if (q) { conditions.push('LOWER(p.name) LIKE ?'); args.push(`%${q.toLowerCase()}%`); }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  const res = await client.execute({ sql, args });
  return res.rows.map(mapProductRow);
}
async function getProductById(id) {
  const res = await client.execute({ sql: 'SELECT * FROM products WHERE id=?', args: [id] });
  return res.rows[0] || null;
}
async function getCategories() {
  const res = await client.execute('SELECT DISTINCT category FROM products');
  return res.rows.map((r) => r.category);
}
async function suggestProducts(q) {
  const res = await client.execute({
    sql: 'SELECT id, name, category FROM products WHERE LOWER(name) LIKE ? LIMIT 8',
    args: [`%${q.toLowerCase()}%`]
  });
  return res.rows;
}
async function getRelatedProducts(categories, excludeIds) {
  if (!categories.length) return [];
  const placeholders = categories.map(() => '?').join(',');
  const excludeClause = excludeIds.length ? ` AND p.id NOT IN (${excludeIds.map(() => '?').join(',')})` : '';
  const sql = `${PRODUCTS_WITH_RATING_SQL} WHERE p.category IN (${placeholders})${excludeClause} ORDER BY RANDOM() LIMIT 4`;
  const res = await client.execute({ sql, args: [...categories, ...excludeIds] });
  return res.rows.map(mapProductRow);
}
async function createProduct(p) {
  await client.execute({
    sql: 'INSERT INTO products (id,name,category,price,mrp,stock,emoji,image) VALUES (?,?,?,?,?,?,?,?)',
    args: [p.id, p.name, p.category, p.price, p.mrp, p.stock, p.emoji, p.image || null]
  });
}
async function updateProduct(id, fields) {
  const map = { name: 'name', category: 'category', price: 'price', mrp: 'mrp', stock: 'stock', emoji: 'emoji', image: 'image' };
  const sets = []; const args = [];
  for (const key of Object.keys(fields)) {
    if (map[key]) { sets.push(`${map[key]}=?`); args.push(fields[key]); }
  }
  if (!sets.length) return;
  args.push(id);
  await client.execute({ sql: `UPDATE products SET ${sets.join(', ')} WHERE id=?`, args });
}
async function decrementStock(id, qty) {
  await client.execute({ sql: 'UPDATE products SET stock = stock - ? WHERE id=?', args: [qty, id] });
}
async function deleteProduct(id) {
  await client.execute({ sql: 'DELETE FROM products WHERE id=?', args: [id] });
}

// ---------------- PUJA TEMPLATES ----------------
function mapTemplateRow(row) {
  return {
    id: row.id, nameHi: row.name_hi, description: row.description,
    note: row.note, items: JSON.parse(row.items)
  };
}
async function getPujaTemplates() {
  const res = await client.execute('SELECT id, name_hi, description FROM puja_templates');
  return res.rows.map((r) => ({ id: r.id, nameHi: r.name_hi, description: r.description }));
}
async function getPujaTemplateById(id) {
  const res = await client.execute({ sql: 'SELECT * FROM puja_templates WHERE id=?', args: [id] });
  return res.rows[0] ? mapTemplateRow(res.rows[0]) : null;
}
async function createPujaTemplate(t) {
  await client.execute({
    sql: 'INSERT INTO puja_templates (id,name_hi,description,note,items) VALUES (?,?,?,?,?)',
    args: [t.id, t.nameHi, t.description || '', t.note || '', JSON.stringify(t.items)]
  });
}
async function updatePujaTemplate(id, fields) {
  const sets = []; const args = [];
  if (fields.nameHi !== undefined) { sets.push('name_hi=?'); args.push(fields.nameHi); }
  if (fields.description !== undefined) { sets.push('description=?'); args.push(fields.description); }
  if (fields.note !== undefined) { sets.push('note=?'); args.push(fields.note); }
  if (fields.items !== undefined) { sets.push('items=?'); args.push(JSON.stringify(fields.items)); }
  if (!sets.length) return;
  args.push(id);
  await client.execute({ sql: `UPDATE puja_templates SET ${sets.join(', ')} WHERE id=?`, args });
}
async function deletePujaTemplate(id) {
  await client.execute({ sql: 'DELETE FROM puja_templates WHERE id=?', args: [id] });
}
// Finds one real catalog product whose name contains matchName — used to
// link a generated checklist item to something the customer can actually
// add to cart. Returns null if nothing matches (item stays text-only).
async function findProductByNameMatch(matchName) {
  if (!matchName) return null;
  const res = await client.execute({
    sql: 'SELECT id, name, price, category, stock FROM products WHERE LOWER(name) LIKE ? LIMIT 1',
    args: [`%${matchName.toLowerCase()}%`]
  });
  return res.rows[0] || null;
}

// ---------------- ORDERS ----------------
async function getNextOrderNumber() {
  const res = await client.execute('SELECT COALESCE(MAX(order_number),1000)+1 as next FROM orders');
  return Number(res.rows[0].next);
}
// Creates the order + its items + its first status-history row together.
// If anything fails partway, the transaction rolls back so stock/orders
// never end up half-written.
async function createOrderTx(order, items) {
  const tx = await client.transaction('write');
  try {
    await tx.execute({
      sql: `INSERT INTO orders (id,order_number,user_id,total,customer_name,phone,address,pincode,payment_method,status,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      args: [order.id, order.orderNumber, order.userId, order.total, order.customerName, order.phone,
             order.address, order.pincode, order.paymentMethod, order.status, order.createdAt]
    });
    for (const it of items) {
      await tx.execute({
        sql: 'INSERT INTO order_items (order_id,product_id,name,price,qty) VALUES (?,?,?,?,?)',
        args: [order.id, it.productId, it.name, it.price, it.qty]
      });
      await tx.execute({
        sql: 'UPDATE products SET stock = stock - ? WHERE id=? AND stock >= ?',
        args: [it.qty, it.productId, it.qty]
      });
    }
    await tx.execute({
      sql: 'INSERT INTO order_status_history (order_id,status,at) VALUES (?,?,?)',
      args: [order.id, order.status, order.createdAt]
    });
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}
async function getOrderItems(orderId) {
  const res = await client.execute({ sql: 'SELECT * FROM order_items WHERE order_id=?', args: [orderId] });
  return res.rows.map((r) => ({ productId: r.product_id, name: r.name, price: r.price, qty: r.qty }));
}
async function getOrderStatusHistory(orderId) {
  const res = await client.execute({ sql: 'SELECT status, at FROM order_status_history WHERE order_id=? ORDER BY id', args: [orderId] });
  return res.rows;
}
function mapOrderRow(row) {
  return {
    id: row.id, orderNumber: row.order_number, userId: row.user_id, total: row.total,
    customerName: row.customer_name, phone: row.phone, address: row.address, pincode: row.pincode,
    paymentMethod: row.payment_method, status: row.status, createdAt: row.created_at
  };
}
async function getOrdersByUser(userId) {
  const res = await client.execute({ sql: 'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC', args: [userId] });
  const orders = res.rows.map(mapOrderRow);
  for (const o of orders) o.items = await getOrderItems(o.id);
  return orders;
}
async function getOrderById(id, userId) {
  const args = userId ? [id, userId] : [id];
  const sql = userId ? 'SELECT * FROM orders WHERE id=? AND user_id=?' : 'SELECT * FROM orders WHERE id=?';
  const res = await client.execute({ sql, args });
  if (!res.rows[0]) return null;
  const order = mapOrderRow(res.rows[0]);
  order.items = await getOrderItems(order.id);
  return order;
}
async function getAllOrders() {
  const res = await client.execute('SELECT * FROM orders ORDER BY created_at DESC');
  const orders = res.rows.map(mapOrderRow);
  for (const o of orders) o.items = await getOrderItems(o.id);
  return orders;
}
async function updateOrderStatus(id, status, at) {
  await client.execute({ sql: 'UPDATE orders SET status=? WHERE id=?', args: [status, id] });
  await client.execute({ sql: 'INSERT INTO order_status_history (order_id,status,at) VALUES (?,?,?)', args: [id, status, at] });
}

// ---------------- REVIEWS ----------------
async function getReviewsByProduct(productId) {
  const res = await client.execute({
    sql: 'SELECT * FROM reviews WHERE product_id=? ORDER BY created_at DESC', args: [productId]
  });
  return res.rows.map((r) => ({
    id: r.id, productId: r.product_id, userId: r.user_id, userName: r.user_name,
    rating: r.rating, comment: r.comment, createdAt: r.created_at
  }));
}
async function upsertReview(review) {
  const existing = await client.execute({
    sql: 'SELECT id FROM reviews WHERE product_id=? AND user_id=?',
    args: [review.productId, review.userId]
  });
  if (existing.rows[0]) {
    await client.execute({
      sql: 'UPDATE reviews SET rating=?, comment=?, updated_at=? WHERE id=?',
      args: [review.rating, review.comment, review.createdAt, existing.rows[0].id]
    });
    return existing.rows[0].id;
  }
  await client.execute({
    sql: `INSERT INTO reviews (id,product_id,user_id,user_name,rating,comment,created_at)
          VALUES (?,?,?,?,?,?,?)`,
    args: [review.id, review.productId, review.userId, review.userName, review.rating, review.comment, review.createdAt]
  });
  return review.id;
}

// ---------------- WISHLIST ----------------
async function getWishlistProductIds(userId) {
  const res = await client.execute({ sql: 'SELECT product_id FROM wishlist WHERE user_id=?', args: [userId] });
  return res.rows.map((r) => r.product_id);
}
async function getWishlistProducts(userId) {
  const ids = await getWishlistProductIds(userId);
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const res = await client.execute({
    sql: `${PRODUCTS_WITH_RATING_SQL} WHERE p.id IN (${placeholders})`, args: ids
  });
  return res.rows.map(mapProductRow);
}
async function toggleWishlist(userId, productId) {
  const existing = await client.execute({
    sql: 'SELECT 1 FROM wishlist WHERE user_id=? AND product_id=?', args: [userId, productId]
  });
  if (existing.rows[0]) {
    await client.execute({ sql: 'DELETE FROM wishlist WHERE user_id=? AND product_id=?', args: [userId, productId] });
    return false;
  }
  await client.execute({ sql: 'INSERT INTO wishlist (user_id,product_id) VALUES (?,?)', args: [userId, productId] });
  return true;
}

module.exports = {
  initSchema,
  getUserByPhone, getUserById, createUser, setUserOtp, verifyUserById, updateUser, resetPassword,
  getProducts, getProductById, getCategories, suggestProducts, getRelatedProducts,
  createProduct, updateProduct, decrementStock, deleteProduct,
  getNextOrderNumber, createOrderTx, getOrdersByUser, getOrderById, getAllOrders, updateOrderStatus,
  getReviewsByProduct, upsertReview,
  getWishlistProductIds, getWishlistProducts, toggleWishlist,
  getPujaTemplates, getPujaTemplateById, createPujaTemplate, updatePujaTemplate, deletePujaTemplate, findProductByNameMatch
};

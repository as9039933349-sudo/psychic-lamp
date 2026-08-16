const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("X-Frame-Options","SAMEORIGIN");
  res.setHeader("Referrer-Policy","strict-origin-when-cross-origin");
  next();
});


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Banke Bihari Pooja Samagri API" }));

app.get("/api/products", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p LEFT JOIN categories c ON c.id=p.category_id
       WHERE p.active=true ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Database error" }); }
});

app.post("/api/orders", async (req, res) => {
  const { customer, items, payment_method = "COD", delivery_charge = 0 } = req.body;
  if (!customer?.name || !customer?.phone || !customer?.address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Customer details and cart items are required." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let subtotal = 0;
    const checkedItems = [];
    for (const item of items) {
      const r = await client.query(
        "SELECT id, name, price, stock FROM products WHERE id=$1 AND active=true FOR UPDATE",
        [item.product_id]
      );
      if (!r.rows.length) throw new Error(`Product ${item.product_id} not found`);
      const p = r.rows[0];
      const qty = Math.max(1, Number(item.quantity || 1));
      if (p.stock < qty) throw new Error(`${p.name}: insufficient stock`);
      subtotal += Number(p.price) * qty;
      checkedItems.push({ ...p, quantity: qty });
    }

    const total = subtotal + Number(delivery_charge || 0);
    const order = await client.query(
      `INSERT INTO orders
       (customer_name, customer_phone, customer_address, payment_method, payment_status, order_status, subtotal, delivery_charge, total)
       VALUES ($1,$2,$3,$4,'pending','new',$5,$6,$7) RETURNING id, created_at`,
      [customer.name, customer.phone, customer.address, payment_method, subtotal, delivery_charge, total]
    );

    for (const p of checkedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.rows[0].id, p.id, p.name, p.price, p.quantity]
      );
      await client.query("UPDATE products SET stock=stock-$1 WHERE id=$2", [p.quantity, p.id]);
    }

    await client.query("COMMIT");
    res.status(201).json({ order_id: order.rows[0].id, total, created_at: order.rows[0].created_at });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});

app.get("/api/orders", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Database error" }); }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const allowed = ["new", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid status" });
  try {
    const { rows } = await pool.query(
      "UPDATE orders SET order_status=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
      [req.body.status, req.params.id]
    );
    await pool.query(
      "INSERT INTO order_tracking(order_id,status,note) VALUES($1,$2,$3)",
      [req.params.id, req.body.status, req.body.note || ""]
    );
    if (!rows.length) return res.status(404).json({ error: "Order not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: "Database error" }); }
});

app.post("/api/admin/products", async (req, res) => {
  const { category_id, name, description = "", price, stock = 0, image_url = "" } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "Name and price are required." });
  try {
    const { rows } = await pool.query(
      `INSERT INTO products(category_id,name,description,price,stock,image_url)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [category_id || null, name, description, price, stock, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: "Database error" }); }
});

app.get("/api/kits", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT k.id, k.name, k.description, k.fixed_price,
             COALESCE(json_agg(json_build_object('product_id',p.id,'name',p.name,'price',p.price,'quantity',ki.quantity))
             FILTER (WHERE p.id IS NOT NULL), '[]') AS items
      FROM pooja_kits k
      LEFT JOIN pooja_kit_items ki ON ki.kit_id=k.id
      LEFT JOIN products p ON p.id=ki.product_id
      WHERE k.active=true
      GROUP BY k.id ORDER BY k.id DESC`);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Database error" }); }
});

app.get("/api/orders/:id/track", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT status,note,created_at FROM order_tracking WHERE order_id=$1 ORDER BY created_at ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Database error" }); }
});


app.patch("/api/admin/products/:id", async (req, res) => {
  const { name, description, price, stock, image_url, active, category_id } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE products SET
       name=COALESCE($1,name), description=COALESCE($2,description),
       price=COALESCE($3,price), stock=COALESCE($4,stock),
       image_url=COALESCE($5,image_url), active=COALESCE($6,active),
       category_id=COALESCE($7,category_id), updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name,description,price,stock,image_url,active,category_id,req.params.id]
    );
    if (!rows.length) return res.status(404).json({error:"Product not found"});
    res.json(rows[0]);
  } catch(e){res.status(500).json({error:"Database error"});}
});

app.delete("/api/admin/products/:id", async (req,res)=>{
  try {
    await pool.query("UPDATE products SET active=false, updated_at=NOW() WHERE id=$1",[req.params.id]);
    res.json({ok:true});
  } catch(e){res.status(500).json({error:"Database error"});}
});

app.get("/api/admin/stats", async (_req,res)=>{
  try{
    const [orders,sales,products] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM orders"),
      pool.query("SELECT COALESCE(SUM(total),0)::numeric AS total FROM orders WHERE order_status<>'cancelled'"),
      pool.query("SELECT COUNT(*)::int AS count FROM products WHERE active=true")
    ]);
    res.json({orders:orders.rows[0].count,sales:sales.rows[0].total,products:products.rows[0].count});
  }catch(e){res.status(500).json({error:"Database error"});}
});


app.post("/api/orders/:id/cancel", async (req,res)=>{
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const q=await client.query(
      "SELECT id,order_status FROM orders WHERE id=$1 FOR UPDATE",
      [req.params.id]
    );
    if(!q.rows.length){ await client.query("ROLLBACK"); return res.status(404).json({error:"Order not found"}); }
    const status=q.rows[0].order_status;
    if(["delivered","cancelled","out_for_delivery"].includes(status)){
      await client.query("ROLLBACK");
      return res.status(400).json({error:"इस stage पर order cancel नहीं किया जा सकता।"});
    }
    const order=await client.query(
      "UPDATE orders SET order_status='cancelled', updated_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    await client.query(
      "INSERT INTO order_tracking(order_id,status,note) VALUES($1,'cancelled',$2)",
      [req.params.id, req.body?.reason || "Customer requested cancellation"]
    );
    await client.query(
      `UPDATE products p SET stock=p.stock+oi.quantity
       FROM order_items oi
       WHERE oi.order_id=$1 AND oi.product_id=p.id`,
      [req.params.id]
    );
    await client.query("COMMIT");
    res.json(order.rows[0]);
  }catch(e){
    await client.query("ROLLBACK");
    res.status(500).json({error:"Could not cancel order"});
  }finally{client.release();}
});


// ---- Production-oriented APIs ----
function auth(req,res,next){
  const token=(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
  try{ if(!token) throw new Error(); req.user=jwt.verify(token,process.env.JWT_SECRET); next(); }
  catch(e){ return res.status(401).json({error:"Unauthorized"}); }
}
function adminAuth(req,res,next){
  if(req.user?.role!=="admin") return res.status(403).json({error:"Admin only"});
  next();
}
app.post("/api/auth/register", async (req,res)=>{
  const {name,phone,email,password}=req.body||{};
  if(!name||!phone||!password) return res.status(400).json({error:"Name, phone and password required"});
  try{
    const hash=await bcrypt.hash(password,12);
    const q=await pool.query("INSERT INTO users(name,phone,email,password_hash) VALUES($1,$2,$3,$4) RETURNING id,name,phone,email",[name,phone,email||null,hash]);
    const token=jwt.sign({id:q.rows[0].id,role:"customer"},process.env.JWT_SECRET,{expiresIn:"30d"});
    res.json({user:q.rows[0],token});
  }catch(e){res.status(400).json({error:"Phone may already be registered"});}
});
app.post("/api/auth/login", async (req,res)=>{
  const {phone,password}=req.body||{};
  try{
    const q=await pool.query("SELECT * FROM users WHERE phone=$1",[phone]);
    if(!q.rows.length || !(await bcrypt.compare(password,q.rows[0].password_hash))) return res.status(401).json({error:"Invalid login"});
    const role=q.rows[0].phone===process.env.ADMIN_PHONE?"admin":"customer";
    const token=jwt.sign({id:q.rows[0].id,role},process.env.JWT_SECRET,{expiresIn:"30d"});
    res.json({token,user:{id:q.rows[0].id,name:q.rows[0].name,phone:q.rows[0].phone,role}});
  }catch(e){res.status(500).json({error:"Login failed"});}
});

app.get("/api/me/orders",auth,async(req,res)=>{
  try{
    const q=await pool.query("SELECT * FROM orders WHERE customer_phone=(SELECT phone FROM users WHERE id=$1) ORDER BY created_at DESC",[req.user.id]);
    res.json(q.rows);
  }catch(e){res.status(500).json({error:"Could not load orders"});}
});

app.post("/api/me/reorder/:id",auth,async(req,res)=>{
  try{
    const q=await pool.query("SELECT product_id,quantity FROM order_items WHERE order_id=$1",[req.params.id]);
    res.json({items:q.rows});
  }catch(e){res.status(500).json({error:"Could not reorder"});}
});

app.get("/api/products/:id/related",async(req,res)=>{
  try{
    const q=await pool.query(`SELECT p.* FROM products p WHERE p.category_id=(SELECT category_id FROM products WHERE id=$1) AND p.id<>$1 AND p.active=true ORDER BY p.id DESC LIMIT 8`,[req.params.id]);
    res.json(q.rows);
  }catch(e){res.status(500).json({error:"Database error"});}
});

app.get("/api/products/:id/reviews",async(req,res)=>{
  try{
    const q=await pool.query(`SELECT r.rating,r.title,r.body,r.created_at,u.name FROM reviews r LEFT JOIN users u ON u.id=r.user_id WHERE r.product_id=$1 AND r.approved=true ORDER BY r.created_at DESC`,[req.params.id]);
    res.json(q.rows);
  }catch(e){res.status(500).json({error:"Database error"});}
});
app.post("/api/products/:id/reviews",auth,async(req,res)=>{
  const {rating,title,body,order_id}=req.body||{};
  if(!rating || rating<1 || rating>5) return res.status(400).json({error:"Rating 1-5 required"});
  try{
    const q=await pool.query("INSERT INTO reviews(product_id,user_id,order_id,rating,title,body) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",[req.params.id,req.user.id,order_id||null,rating,title||null,body||null]);
    res.json({ok:true,review:q.rows[0]});
  }catch(e){res.status(500).json({error:"Review failed"});}
});

app.get("/api/delivery/quote",async(req,res)=>{
  const {pincode,area,total}=req.query;
  try{
    const q=await pool.query("SELECT * FROM delivery_zones WHERE active=true AND (pincode=$1 OR area ILIKE $2) LIMIT 1",[pincode||"",`%${area||""}%`]);
    if(!q.rows.length) return res.json({charge:50,zone:"Bhind default",message:"Flat Bhind delivery charge"});
    const z=q.rows[0], charge=(z.free_above && Number(total)>=Number(z.free_above))?0:Number(z.charge);
    res.json({charge,zone:z.name});
  }catch(e){res.status(500).json({error:"Delivery quote failed"});}
});

app.post("/api/coupons/validate",async(req,res)=>{
  const {code,subtotal}=req.body||{};
  try{
    const q=await pool.query("SELECT * FROM coupons WHERE UPPER(code)=UPPER($1) AND active=true AND (expires_at IS NULL OR expires_at>NOW()) LIMIT 1",[code||""]);
    if(!q.rows.length) return res.status(400).json({error:"Invalid/expired coupon"});
    const c=q.rows[0]; if(Number(subtotal)<Number(c.min_order)) return res.status(400).json({error:`Minimum order ₹${c.min_order}`});
    let discount=c.discount_type==="percent"?Number(subtotal)*Number(c.discount_value)/100:Number(c.discount_value);
    if(c.max_discount) discount=Math.min(discount,Number(c.max_discount));
    res.json({valid:true,discount:Number(discount.toFixed(2)),coupon:c.code});
  }catch(e){res.status(500).json({error:"Coupon validation failed"});}
});

app.post("/api/payments/create",async(req,res)=>{
  const {order_id,amount}=req.body||{};
  // Configure a real provider through environment variables. Never trust client-side payment confirmation.
  if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
    return res.status(503).json({error:"Payment gateway credentials are not configured"});
  try{
    const Razorpay=require("razorpay");
    const rz=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
    const order=await rz.orders.create({amount:Math.round(Number(amount)*100),currency:"INR",receipt:`bb-${order_id}`});
    await pool.query("INSERT INTO payment_transactions(order_id,provider,provider_payment_id,amount,status) VALUES($1,'razorpay',$2,$3,'created')",[order_id,order.id,amount]);
    res.json({provider:"razorpay",order});
  }catch(e){res.status(500).json({error:"Payment order creation failed"});}
});

app.post("/api/payments/webhook",express.raw({type:"application/json"}),async(req,res)=>{
  // Verify Razorpay webhook signature before changing payment/order status.
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
  if(!secret) return res.status(503).end();
  const signature=req.headers["x-razorpay-signature"];
  const expected=crypto.createHmac("sha256",secret).update(req.body).digest("hex");
  if(!signature || !crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected))) return res.status(400).end();
  try{
    const event=JSON.parse(req.body.toString());
    const entity=event.payload?.payment?.entity;
    if(entity?.id){
      await pool.query("UPDATE payment_transactions SET status=$1,raw_event=$2 WHERE provider_payment_id=$3",[entity.status||event.event,event,entity.order_id]);
    }
    res.json({ok:true});
  }catch(e){res.status(400).end();}
});

app.get("/api/admin/low-stock",async(req,res)=>{
  try{const q=await pool.query("SELECT id,name,stock FROM products WHERE active=true AND stock<=5 ORDER BY stock ASC");res.json(q.rows);}
  catch(e){res.status(500).json({error:"Database error"});}
});


// ---- WhatsApp Cloud API ----
// Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_API_VERSION in backend/.env.
// Never expose the access token in frontend JavaScript.
async function sendWhatsAppText(to, body){
  const token=process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId=process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version=process.env.WHATSAPP_API_VERSION || "v23.0";
  if(!token || !phoneId) throw new Error("WhatsApp Cloud API credentials are not configured");
  const r=await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`,{
    method:"POST",
    headers:{"Authorization":`Bearer ${token}`,"Content-Type":"application/json"},
    body:JSON.stringify({messaging_product:"whatsapp",to:String(to),type:"text",text:{body}})
  });
  const data=await r.json();
  if(!r.ok) throw new Error(data?.error?.message || "WhatsApp API error");
  return data;
}

app.post("/api/whatsapp/send-order", async(req,res)=>{
  const {phone,message}=req.body||{};
  if(!phone || !message) return res.status(400).json({error:"phone and message required"});
  try{
    const data=await sendWhatsAppText(phone,message);
    res.json({ok:true,data});
  }catch(e){res.status(503).json({error:e.message});}
});

app.post("/api/whatsapp/order-notification/:id", async(req,res)=>{
  try{
    const q=await pool.query(`SELECT id,customer_name,customer_phone,total,order_status FROM orders WHERE id=$1`,[req.params.id]);
    if(!q.rows.length) return res.status(404).json({error:"Order not found"});
    const o=q.rows[0];
    const msg=`🛕 Banke Bihari Pooja Samagri\nOrder #${o.id}\nStatus: ${o.order_status}\nAmount: ₹${o.total}\n\nDhanyavaad!`;
    const data=await sendWhatsAppText(o.customer_phone,msg);
    res.json({ok:true,data});
  }catch(e){res.status(503).json({error:e.message});}
});


app.get("/api/orders/:id/invoice", async (req,res)=>{
  try{
    const q=await pool.query(`SELECT o.*, oi.product_id, oi.quantity, oi.unit_price, p.name
      FROM orders o JOIN order_items oi ON oi.order_id=o.id
      JOIN products p ON p.id=oi.product_id WHERE o.id=$1 ORDER BY oi.id`,[req.params.id]);
    if(!q.rows.length) return res.status(404).send("Order not found");
    const o=q.rows[0];
    const rows=q.rows.map(x=>`<tr><td>${String(x.name).replace(/[<>]/g,"")}</td><td>${x.quantity}</td><td>₹${x.unit_price}</td><td>₹${Number(x.unit_price)*Number(x.quantity)}</td></tr>`).join("");
    res.type("html").send(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice #${o.id}</title>
    <style>body{font-family:Arial;max-width:800px;margin:30px auto;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}@media print{button{display:none}}</style></head>
    <body><button onclick="print()">Print / Save PDF</button><h1>Banke Bihari Pooja Samagri</h1>
    <p>Invoice #${o.id}<br>Customer: ${String(o.customer_name).replace(/[<>]/g,"")}<br>Phone: ${String(o.customer_phone).replace(/[<>]/g,"")}<br>Address: ${String(o.customer_address||"").replace(/[<>]/g,"")}</p>
    <table><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>${rows}</table>
    <h2>Total: ₹${o.total}</h2><p>Delivery charge: ₹50</p></body></html>`);
  }catch(e){res.status(500).send("Invoice error");}
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`API running on port ${process.env.PORT || 3000}`)
);

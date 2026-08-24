# Banke Bihari Pujan Samagri — Store (now with a real database)

## ⚠️ Sabse zaroori baat pehle

Render ka **free plan filesystem ko "ephemeral" rakhta hai** — matlab site
jab bhi restart hoti hai (naya code deploy, ya 15 min inactivity ke baad
"so kar" jaagna), **local files delete ho jaati hain**. Isse pehle
`data/db.json` file mein saara data (orders, users) is wajah se already
kho raha tha.

Isliye ab database **Turso** (free, hosted SQLite) mein rakha jaata hai —
ye Render ke restart se prabhavit nahi hota, data hamesha safe rehta hai.

## Maine kya test kiya, aur kya nahi

- **SQL schema aur saari queries maine offline test ki hain** (Node ke
  built-in SQLite se) — logic 100% sahi hai: users, products, orders,
  stock deduction, reviews, wishlist, sab kaam karte verify kiya.
- **Turso se live connection maine khud test nahi kiya** — mere paas
  is environment mein internet access nahi hai. Code Turso ki official
  library (`@libsql/client`) ke documented tarike se likha hai, lekin
  agar deploy karte waqt koi error aaye, screenshot bhej dena, saath
  mein debug kar lenge.

## Step 1 — Turso account banao (phone se, web par)

1. **turso.tech** kholo, "Sign up" karo (GitHub se sign in kar sakte ho —
   wahi wala account jo pehle bana tha)
2. Dashboard mein **"Create Database"** (ya "New Database") button dabao
3. Database ka koi naam do (jaise `banke-bihari-db`), create kar do
4. Database create hone ke baad uske detail page par jao — wahan
   **"Connect"** ya **"Create Token"** jaisa option milega:
   - **Database URL** copy karo (`libsql://...` se shuru hoga)
   - **Auth Token generate karo** aur usse bhi copy kar lo

Ye 2 cheezein (URL aur Token) safe kahin note kar lo — agle step mein
chahiye honge.

## Step 2 — Render mein environment variables add karo

Apni Render service ke **Environment** tab mein jaake ye 2 naye variables
add karo (purane `ADMIN_PASSWORD` aur `SESSION_SECRET` waise hi rehne
do):

```
TURSO_DATABASE_URL = (jo URL copy kiya tha)
TURSO_AUTH_TOKEN   = (jo token copy kiya tha)
```

## Step 3 — Render ki Build Command badlo

⚠️ **Ye zaroori hai** — pehle Build Command khaali thi (kyunki koi
dependency nahi thi). Ab ek real dependency hai (`@libsql/client`), to
Render ki **Settings → Build Command** mein likho:

```
npm install
```

(Start Command wahi rahega: `node server.js`)

## Step 4 — Code update karo aur deploy karo

Is folder ki saari files GitHub repo mein purani files ki jagah replace
kar do (jaisa pehle karte aa rahe ho), phir Render khud naya build +
deploy chalayega.

Pehli baar deploy hone par server khud table banayega (products,
users, orders, reviews, wishlist) aur 21 sample products bhi apne aap
add ho jaayenge — kuch manually karne ki zaroorat nahi.

## ⚠️ Purana data

Render ka free filesystem pehle se hi restart hote hi data uda raha
tha, isliye jo bhi test orders/users pehle bana rakhe the, wo pehle se
hi gayab ho chuke honge. Turso lagne ke baad, ab jo bhi order/signup
hoga, wo **hamesha ke liye safe rahega** — chahe site kitni baar bhi
restart ho.

## Baaki sab kuch pehle jaisa hi hai

- Amazon-style storefront, login/OTP, cart, checkout
- Reviews, wishlist, search suggestions, related products
- Bhind-only delivery (pincode 477XXX check)
- Admin panel `/admin.html` (password wahi `ADMIN_PASSWORD` wala)
- Hindi/English switch

## Production checklist (pehle jaisa hi)
- [ ] SMS provider jodo taaki OTP asli mein customers ke phone par jaaye
- [ ] `ADMIN_PASSWORD` aur `SESSION_SECRET` strong values pe set karo
- [ ] Real payment gateway (Razorpay) ke liye business KYC
- [ ] Apne saare 200+ products real photos/price ke saath daalo

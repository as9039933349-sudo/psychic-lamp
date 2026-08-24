let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem('cart') || '[]');
let CURRENT_USER = null;
let CURRENT_REVIEW_PRODUCT = null;
let SELECTED_STARS = 0;
let WISHLIST_IDS = [];

// ---------------- LANGUAGE ----------------
const I18N = {
  hi: {
    allCategories: 'सभी श्रेणियां', searchPh: 'पूजा सामग्री खोजें...', wishlistNav: '❤️ Wishlist',
    loginNav: '👤 Login', cart: 'कार्ट', home: 'होम',
    deliveryNotice: '🚚 अभी हम सिर्फ़ भिंड (पिनकोड 477XXX) में ही डिलीवरी करते हैं',
    heroEyebrow: 'शुभ पूजा • शुद्ध सामग्री • भरोसेमंद सेवा',
    heroTitle1: 'हर पूजा की सामग्री,', heroTitle2: 'एक ही जगह',
    heroDesc: 'Banke Bihari Pujan Samagri से पूजा की जरूरी सामग्री घर बैठे मंगाइए। ऑर्डर करें, ट्रैक करें, भरोसे के साथ।',
    shopNow: 'अभी खरीदें →', poojaSamagri: 'पूजा सामग्री',
    fastDelivery: 'तेज़ डिलीवरी', fastDeliverySub: 'भिंड में ही',
    orderTracking: 'ऑर्डर ट्रैकिंग', orderTrackingSub: 'लाइव स्टेटस देखें',
    codAvailable: 'COD उपलब्ध', support: 'सहायता',
    featuredProducts: 'खास प्रोडक्ट्स', featuredProductsSub: 'पूजा के लिए चुनिंदा सामग्री',
    aboutDesc: 'आपकी पूजा को पूर्ण बनाने के लिए गुणवत्तापूर्ण पूजा सामग्री उपलब्ध कराने का हमारा प्रयास है।',
    yourCart: 'आपका कार्ट', total: 'कुल', proceedCheckout: 'चेकआउट करें',
    checkout: 'चेकआउट', deliveryNoticeShort: 'डिलीवरी सिर्फ़ भिंड (पिनकोड 477XXX) में उपलब्ध है',
    fullName: 'पूरा नाम', mobileNumber: 'मोबाइल नंबर', fullAddress: 'पूरा डिलीवरी पता',
    pincode: 'पिनकोड (477XXX)', placeOrder: 'ऑर्डर करें',
    reviews: 'रिव्यू', submitReview: 'रिव्यू सबमिट करें', reviewCommentPh: 'अपना अनुभव लिखें (वैकल्पिक)',
    footerAbout: 'हमारे बारे में', footerAccount: 'मेरा खाता', footerWishlist: '❤️ Wishlist',
    footerCategories: 'श्रेणियां', footerDelivery: 'डिलीवरी', footerDeliveryText: 'सिर्फ़ भिंड (477XXX) में',
    footerCod: 'Cash on Delivery उपलब्ध', footerContact: 'सम्पर्क', footerTagline: 'श्रद्धा से सेवा तक',
    addToCart: 'Add to Cart', outOfStock: 'स्टॉक में नहीं', onlyLeft: 'सिर्फ़ {n} बचे हैं', inStock: 'स्टॉक में है',
    relatedTitle: 'आपको ये भी पसंद आ सकता है'
  },
  en: {
    allCategories: 'All Categories', searchPh: 'Search pooja items...', wishlistNav: '❤️ Wishlist',
    loginNav: '👤 Login', cart: 'Cart', home: 'Home',
    deliveryNotice: '🚚 We currently deliver only within Bhind (pincode 477XXX)',
    heroEyebrow: 'Sacred Pooja • Pure Ingredients • Trusted Service',
    heroTitle1: 'Everything for your pooja,', heroTitle2: 'in one place',
    heroDesc: 'Order everything you need for your pooja from Banke Bihari Pujan Samagri. Order, track, and trust us with your rituals.',
    shopNow: 'Shop Now →', poojaSamagri: 'Pooja Samagri',
    fastDelivery: 'Fast Delivery', fastDeliverySub: 'Within Bhind only',
    orderTracking: 'Order Tracking', orderTrackingSub: 'See live status',
    codAvailable: 'COD Available', support: 'Support',
    featuredProducts: 'Featured Products', featuredProductsSub: 'Handpicked items for your pooja',
    aboutDesc: 'We are committed to providing quality pooja samagri to make your worship complete.',
    yourCart: 'Your Cart', total: 'Total', proceedCheckout: 'Proceed to Checkout',
    checkout: 'Checkout', deliveryNoticeShort: 'Delivery available only within Bhind (pincode 477XXX)',
    fullName: 'Full Name', mobileNumber: 'Mobile Number', fullAddress: 'Full delivery address',
    pincode: 'Pincode (477XXX)', placeOrder: 'Place Order',
    reviews: 'Reviews', submitReview: 'Submit Review', reviewCommentPh: 'Share your experience (optional)',
    footerAbout: 'About Us', footerAccount: 'My Account', footerWishlist: '❤️ Wishlist',
    footerCategories: 'Categories', footerDelivery: 'Delivery', footerDeliveryText: 'Bhind (477XXX) only',
    footerCod: 'Cash on Delivery available', footerContact: 'Contact', footerTagline: 'From devotion to service',
    addToCart: 'Add to Cart', outOfStock: 'Out of Stock', onlyLeft: 'Only {n} left', inStock: 'In Stock',
    relatedTitle: 'You might also like'
  }
};
let LANG = localStorage.getItem('lang') || 'hi';

function t(key) { return (I18N[LANG] && I18N[LANG][key]) || key; }

function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
  const hiBtn = document.getElementById('langHi'), enBtn = document.getElementById('langEn');
  if (hiBtn && enBtn) {
    hiBtn.classList.toggle('active', LANG === 'hi');
    enBtn.classList.toggle('active', LANG === 'en');
  }
  renderProducts();
}
function setLang(lang) {
  LANG = lang;
  localStorage.setItem('lang', lang);
  applyLang();
}

// ---------------- CART ----------------
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(CART));
  updateCartCount();
}
function updateCartCount() {
  const count = CART.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

async function loadMe() {
  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    CURRENT_USER = data.user;
    const link = document.getElementById('accountLink');
    if (link) link.textContent = CURRENT_USER ? `👤 ${CURRENT_USER.name.split(' ')[0]}` : t('loginNav');
    if (CURRENT_USER) loadWishlist();
  } catch (e) { /* ignore */ }
}

async function loadWishlist() {
  if (!CURRENT_USER) { WISHLIST_IDS = []; return; }
  try {
    const res = await fetch('/api/wishlist');
    const data = await res.json();
    WISHLIST_IDS = (data.products || []).map((p) => p.id);
    renderProducts();
  } catch (e) { /* ignore */ }
}

async function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  if (!CURRENT_USER) { window.location.href = '/login.html'; return; }
  const res = await fetch(`/api/wishlist/${productId}`, { method: 'POST' });
  const data = await res.json();
  if (data.added) WISHLIST_IDS.push(productId);
  else WISHLIST_IDS = WISHLIST_IDS.filter((id) => id !== productId);
  renderProducts();
}

// ---------------- SEARCH SUGGESTIONS ----------------
let suggestTimer = null;
function onSearchInput() {
  clearTimeout(suggestTimer);
  const q = document.getElementById('search').value.trim();
  if (!q) { hideSuggestions(); return; }
  suggestTimer = setTimeout(async () => {
    const res = await fetch('/api/products/suggest?q=' + encodeURIComponent(q));
    const data = await res.json();
    showSuggestions(data.suggestions || []);
  }, 200);
}
function showSuggestions(items) {
  const box = document.getElementById('suggestBox');
  if (!items.length) { hideSuggestions(); return; }
  box.innerHTML = items.map((it) =>
    `<div class="sItem" onclick="pickSuggestion('${it.id}', '${it.name.replace(/'/g, "\\'")}')">${it.name} <small>${it.category}</small></div>`
  ).join('');
  box.classList.add('show');
}
function hideSuggestions() {
  const box = document.getElementById('suggestBox');
  if (box) { box.classList.remove('show'); box.innerHTML = ''; }
}
function pickSuggestion(id, name) {
  document.getElementById('search').value = name;
  hideSuggestions();
  loadProducts();
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.searchWrap')) hideSuggestions();
});

async function loadCategories() {
  const res = await fetch('/api/categories');
  const data = await res.json();
  const sel = document.getElementById('category');
  const nav = document.getElementById('catNav');
  if (sel) {
    data.categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', loadProducts);
  }
  if (nav) {
    data.categories.forEach((c) => {
      const a = document.createElement('a');
      a.href = '#products';
      a.textContent = c;
      a.onclick = () => { filterCat(c); document.querySelector('#products').scrollIntoView({behavior:'smooth'}); };
      nav.appendChild(a);
    });
  }
}

function filterCat(cat) {
  const sel = document.getElementById('category');
  if (sel) sel.value = cat;
  loadProducts();
}

async function loadProducts() {
  const cat = document.getElementById('category')?.value || '';
  const q = document.getElementById('search')?.value || '';
  const params = new URLSearchParams();
  if (cat) params.set('category', cat);
  if (q) params.set('q', q);
  const res = await fetch('/api/products?' + params.toString());
  const data = await res.json();
  PRODUCTS = data.products;
  renderProducts();
}

// silent background refresh so stock numbers stay current without the
// user needing to reload — practical stand-in for a full realtime feed
function startStockPolling() {
  setInterval(async () => {
    if (document.hidden) return;
    try {
      const cat = document.getElementById('category')?.value || '';
      const q = document.getElementById('search')?.value || '';
      const params = new URLSearchParams();
      if (cat) params.set('category', cat);
      if (q) params.set('q', q);
      const res = await fetch('/api/products?' + params.toString());
      const data = await res.json();
      PRODUCTS = data.products;
      renderProducts();
    } catch (e) { /* ignore */ }
  }, 20000);
}

function stockBadge(p) {
  if (p.stock <= 0) return `<div class="stockBadge out">${t('outOfStock')}</div>`;
  if (p.stock <= 5) return `<div class="stockBadge low">${t('onlyLeft').replace('{n}', p.stock)}</div>`;
  return `<div class="stockBadge ok">${t('inStock')}</div>`;
}

function starsDisplay(p) {
  if (!p.reviewCount) return '';
  const full = Math.round(p.avgRating);
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
  return `<div class="stars" onclick="openReviewModal('${p.id}', '${p.name.replace(/'/g, "\\'")}')">${stars} <span class="count">${p.avgRating} (${p.reviewCount})</span></div>`;
}

function renderProducts() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map((p) => `
    <div class="card">
      <div class="wishBtn ${WISHLIST_IDS.includes(p.id) ? 'active' : ''}" onclick="toggleWishlist('${p.id}', event)">${WISHLIST_IDS.includes(p.id) ? '❤️' : '🤍'}</div>
      <div class="pic">${p.image ? `<img src="${p.image}" alt="${p.name}">` : (p.emoji || '🪔')}</div>
      <div class="info">
        <div class="cat">${p.category}</div>
        <div class="name">${p.name}</div>
        ${starsDisplay(p)}
        <div class="price">₹${p.price}${p.mrp && p.mrp > p.price ? `<span class="old">₹${p.mrp}</span>` : ''}</div>
        ${stockBadge(p)}
        <button class="add" onclick="addToCart('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>${t('addToCart')}</button>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const existing = CART.find((i) => i.productId === productId);
  const currentQty = existing ? existing.qty : 0;
  if (product && currentQty + 1 > product.stock) { alert(t('outOfStock')); return; }
  if (existing) existing.qty += 1;
  else CART.push({ productId, qty: 1 });
  saveCart();
  renderCart();
}

function changeQty(productId, delta) {
  const item = CART.find((i) => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) CART = CART.filter((i) => i.productId !== productId);
  saveCart();
  renderCart();
}

function cartTotal() {
  return CART.reduce((sum, i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

async function renderCart() {
  const box = document.getElementById('cartItems');
  if (!box) return;
  if (CART.length === 0) {
    box.innerHTML = '<p style="text-align:center;color:#888;padding:20px 0">कार्ट खाली है</p>';
    document.getElementById('cartRelated').innerHTML = '';
  } else {
    box.innerHTML = CART.map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.productId);
      if (!p) return '';
      return `
        <div class="cartRow">
          <div class="pic">${p.image ? `<img src="${p.image}" alt="">` : (p.emoji || '🪔')}</div>
          <div style="flex:1">
            <div>${p.name}</div>
            <div class="qty">
              <button onclick="changeQty('${p.id}',-1)">−</button>
              <span>${i.qty}</span>
              <button onclick="changeQty('${p.id}',1)">+</button>
            </div>
          </div>
          <b>₹${p.price * i.qty}</b>
        </div>`;
    }).join('');
    loadRelatedForCart();
  }
  document.getElementById('cartTotal').textContent = '₹' + cartTotal();
}

async function loadRelatedForCart() {
  const cartProducts = CART.map((i) => PRODUCTS.find((p) => p.id === i.productId)).filter(Boolean);
  const categories = [...new Set(cartProducts.map((p) => p.category))];
  const exclude = cartProducts.map((p) => p.id);
  if (!categories.length) return;
  const params = new URLSearchParams();
  params.set('categories', categories.join(','));
  params.set('exclude', exclude.join(','));
  const res = await fetch('/api/products/related?' + params.toString());
  const data = await res.json();
  const wrap = document.getElementById('cartRelated');
  if (!data.products || !data.products.length) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <div class="relatedWrap">
      <h4>${t('relatedTitle')}</h4>
      <div class="relatedRow">
        ${data.products.map((p) => `
          <div class="rCard" onclick="addToCart('${p.id}'); renderCart();">
            <div class="pic">${p.emoji || '🪔'}</div>
            <b>${p.name}</b>
            <div>₹${p.price}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function openCart() {
  renderCart();
  document.getElementById('cartModal').style.display = 'block';
}
function closeCart() { document.getElementById('cartModal').style.display = 'none'; }

function openCheckout() {
  if (CART.length === 0) { alert('कार्ट खाली है'); return; }
  closeCart();
  const notice = document.getElementById('checkoutLoginNotice');
  if (!CURRENT_USER) {
    notice.innerHTML = `<div class="notice">तेज़ ऑर्डर ट्रैकिंग के लिए <a href="/login.html">लॉगिन</a> करें, या बिना लॉगिन के भी ऑर्डर कर सकते हैं।</div>`;
  } else {
    notice.innerHTML = '';
    document.getElementById('customerName').value = CURRENT_USER.name || '';
    document.getElementById('phone').value = CURRENT_USER.phone || '';
    document.getElementById('address').value = CURRENT_USER.address || '';
  }
  document.getElementById('checkoutModal').style.display = 'block';
}
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

// ---------------- REVIEWS ----------------
function openReviewModal(productId, productName) {
  CURRENT_REVIEW_PRODUCT = productId;
  SELECTED_STARS = 0;
  document.getElementById('reviewProductName').textContent = productName;
  document.getElementById('reviewComment').value = '';
  updateStarInput();
  const loginNotice = document.getElementById('reviewLoginNotice');
  const form = document.getElementById('reviewForm');
  if (!CURRENT_USER) {
    loginNotice.innerHTML = `<div class="notice">रिव्यू देने के लिए <a href="/login.html">लॉगिन</a> करें।</div>`;
    form.style.display = 'none';
  } else {
    loginNotice.innerHTML = '';
    form.style.display = 'block';
  }
  loadReviews(productId);
  document.getElementById('reviewModal').style.display = 'block';
}
function closeReviewModal() { document.getElementById('reviewModal').style.display = 'none'; }

function updateStarInput() {
  document.querySelectorAll('#starInput span').forEach((el) => {
    el.classList.toggle('filled', Number(el.dataset.v) <= SELECTED_STARS);
  });
}

async function loadReviews(productId) {
  const res = await fetch('/api/reviews?productId=' + productId);
  const data = await res.json();
  const box = document.getElementById('reviewsList');
  if (!data.reviews.length) {
    box.innerHTML = '<p style="color:#888;text-align:center;padding:10px 0">अभी तक कोई रिव्यू नहीं</p>';
    return;
  }
  box.innerHTML = data.reviews.map((r) => `
    <div class="reviewRow">
      <div class="rName">${r.userName}</div>
      <div class="rStars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      ${r.comment ? `<div class="rComment">${r.comment}</div>` : ''}
    </div>`).join('');
}

async function submitReview() {
  if (!CURRENT_USER || !CURRENT_REVIEW_PRODUCT) return;
  if (SELECTED_STARS < 1) { alert('कृपया स्टार रेटिंग चुनें'); return; }
  const res = await fetch('/api/reviews', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: CURRENT_REVIEW_PRODUCT, rating: SELECTED_STARS,
      comment: document.getElementById('reviewComment').value
    })
  });
  if (res.ok) {
    loadReviews(CURRENT_REVIEW_PRODUCT);
    loadProducts();
  }
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.12 });
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  loadMe();
  loadCategories();
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  loadProducts();
  updateCartCount();
  startStockPolling();

  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.addEventListener('input', onSearchInput);

  const starInput = document.getElementById('starInput');
  if (starInput) {
    starInput.querySelectorAll('span').forEach((el) => {
      el.addEventListener('click', () => { SELECTED_STARS = Number(el.dataset.v); updateStarInput(); });
    });
  }

  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const resultBox = document.getElementById('orderResult');
      resultBox.innerHTML = '';

      if (!CURRENT_USER) {
        resultBox.innerHTML = `<div class="error">ऑर्डर ट्रैक करने के लिए पहले <a href="/login.html">लॉगिन/साइनअप</a> करें।</div>`;
        return;
      }

      const pincode = document.getElementById('pincode').value.trim();
      if (!/^477\d{3}$/.test(pincode)) {
        resultBox.innerHTML = `<div class="error">माफ़ कीजिए, अभी हम सिर्फ़ भिंड (पिनकोड 477XXX) में ही डिलीवरी करते हैं।</div>`;
        return;
      }

      const items = CART.map((i) => ({ productId: i.productId, qty: i.qty }));
      const body = {
        items,
        customerName: document.getElementById('customerName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        pincode,
        paymentMethod: document.getElementById('paymentMethod').value
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        resultBox.innerHTML = `<div class="error">${data.error || 'कुछ गलत हो गया'}</div>`;
        return;
      }
      CART = [];
      saveCart();
      renderOrderSuccess(data.order, body.paymentMethod);
      form.reset();
    });
  }
});

let APP_CONFIG = { upiId: '', upiName: 'Banke Bihari Pujan Samagri', whatsappNumber: '918839800902' };
fetch('/api/config').then((r) => r.json()).then((c) => { APP_CONFIG = c; }).catch(() => {});

function toggleUpiBox() {
  const method = document.getElementById('paymentMethod').value;
  const box = document.getElementById('upiBox');
  if (box) box.style.display = method === 'UPI' ? 'block' : 'none';
}

function renderOrderSuccess(order, paymentMethod) {
  const resultBox = document.getElementById('orderResult');
  let html = `<div class="notice">✅ ऑर्डर #${order.orderNumber} सफलतापूर्वक हुआ! <a href="/account.html">यहां ट्रैक करें</a></div>`;

  if (paymentMethod === 'UPI' && APP_CONFIG.upiId) {
    const upiLink = `upi://pay?pa=${encodeURIComponent(APP_CONFIG.upiId)}&pn=${encodeURIComponent(APP_CONFIG.upiName)}&am=${order.total}&cu=INR&tn=${encodeURIComponent('Order #' + order.orderNumber)}`;
    html += `<a href="${upiLink}" style="display:block;text-align:center;background:#0f9d58;color:white;padding:12px;border-radius:7px;text-decoration:none;font-weight:bold;margin-top:10px">💳 UPI से ₹${order.total} भुगतान करें</a>`;
  }

  const waText = `नमस्ते, मेरा ऑर्डर #${order.orderNumber} है (₹${order.total}). कृपया confirm करें।`;
  const waLink = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  html += `<a href="${waLink}" style="display:block;text-align:center;background:#25D366;color:white;padding:12px;border-radius:7px;text-decoration:none;font-weight:bold;margin-top:10px">💬 WhatsApp पर Order Confirm करें</a>`;

  resultBox.innerHTML = html;
}

// ---------------- PWA: install to home screen ----------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'inline-flex';
});

async function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'none';
}

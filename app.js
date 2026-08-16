let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem('cart') || '[]');
let CURRENT_USER = null;

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
    if (link) {
      link.textContent = CURRENT_USER ? `👤 ${CURRENT_USER.name.split(' ')[0]}` : '👤 Login';
    }
  } catch (e) { /* ignore */ }
}

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

function renderProducts() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map((p) => `
    <div class="card">
      <div class="pic">${p.image ? `<img src="${p.image}" alt="${p.name}">` : (p.emoji || '🪔')}</div>
      <div class="info">
        <div class="cat">${p.category}</div>
        <div class="name">${p.name}</div>
        <div class="price">₹${p.price}${p.mrp && p.mrp > p.price ? `<span class="old">₹${p.mrp}</span>` : ''}</div>
        <button class="add" onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const existing = CART.find((i) => i.productId === productId);
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

function renderCart() {
  const box = document.getElementById('cartItems');
  if (!box) return;
  if (CART.length === 0) {
    box.innerHTML = '<p style="text-align:center;color:#888;padding:20px 0">कार्ट खाली है</p>';
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
  }
  document.getElementById('cartTotal').textContent = '₹' + cartTotal();
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

document.addEventListener('DOMContentLoaded', () => {
  loadMe();
  loadCategories();
  loadProducts();
  updateCartCount();

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

      const items = CART.map((i) => ({ productId: i.productId, qty: i.qty }));
      const body = {
        items,
        customerName: document.getElementById('customerName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
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
      resultBox.innerHTML = `<div class="notice">✅ ऑर्डर #${data.order.orderNumber} सफलतापूर्वक हुआ! <a href="/account.html">यहां ट्रैक करें</a></div>`;
      form.reset();
    });
  }
});

const STAGES = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('loginMsg');
  const res = await fetch('/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: document.getElementById('adminPassword').value })
  });
  const data = await res.json();
  if (!res.ok) { msg.innerHTML = `<div class="error">${data.error}</div>`; return; }
  showDashboard();
});

async function adminLogout() {
  await fetch('/api/admin/logout', { method: 'POST' });
  document.getElementById('loginBox').style.display = 'block';
  document.getElementById('dashBox').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('dashBox').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'inline-block';
  loadOrders();
  loadProducts();
}

function showTab(tab) {
  document.getElementById('ordersTab').style.display = tab === 'orders' ? 'block' : 'none';
  document.getElementById('productsTab').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('tabOrders').className = tab === 'orders' ? 'active' : '';
  document.getElementById('tabProducts').className = tab === 'products' ? 'active' : '';
}

async function loadOrders() {
  const res = await fetch('/api/admin/orders');
  if (res.status === 401) { adminLogout(); return; }
  const data = await res.json();
  const body = document.getElementById('ordersBody');
  body.innerHTML = data.orders.map((o) => `
    <tr>
      <td>#${o.orderNumber}</td>
      <td>${o.customerName}</td>
      <td>${o.phone}</td>
      <td>₹${o.total}</td>
      <td><span class="pill">${o.status}</span></td>
      <td>
        <select onchange="updateStatus('${o.id}', this.value)">
          ${STAGES.map((s) => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:#888">कोई ऑर्डर नहीं</td></tr>';
}

async function updateStatus(orderId, status) {
  await fetch(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  loadOrders();
}

async function loadProducts() {
  const res = await fetch('/api/admin/products');
  const data = await res.json();
  const body = document.getElementById('productsBody');
  body.innerHTML = data.products.map((p) => `
    <tr>
      <td>${p.emoji || ''} ${p.name}</td>
      <td>${p.category}</td>
      <td>₹${p.price}</td>
      <td>₹${p.mrp || '-'}</td>
      <td><button onclick="deleteProduct('${p.id}')" style="color:#b91c1c;border:0;background:none;cursor:pointer">Delete</button></td>
    </tr>
  `).join('');
}

async function addProduct() {
  const body = {
    name: document.getElementById('pName').value,
    category: document.getElementById('pCategory').value,
    price: document.getElementById('pPrice').value,
    mrp: document.getElementById('pMrp').value
  };
  if (!body.name || !body.category || !body.price) { alert('नाम, category और price ज़रूरी है'); return; }
  const res = await fetch('/api/admin/products', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  if (res.ok) {
    document.getElementById('pName').value = '';
    document.getElementById('pCategory').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pMrp').value = '';
    loadProducts();
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

// check if already logged in as admin
(async () => {
  const res = await fetch('/api/admin/orders');
  if (res.ok) showDashboard();
})();

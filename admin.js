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
  document.getElementById('pujaTab').style.display = tab === 'puja' ? 'block' : 'none';
  document.getElementById('tabOrders').className = tab === 'orders' ? 'active' : '';
  document.getElementById('tabProducts').className = tab === 'products' ? 'active' : '';
  document.getElementById('tabPuja').className = tab === 'puja' ? 'active' : '';
  if (tab === 'puja') loadPujaTemplates();
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
      <td>${p.reviewCount ? `⭐ ${p.avgRating} (${p.reviewCount})` : '—'}</td>
      <td><input type="number" value="${p.stock ?? 0}" style="width:70px;padding:6px" onchange="updateStock('${p.id}', this.value)"></td>
      <td><button onclick="deleteProduct('${p.id}')" style="color:#b91c1c;border:0;background:none;cursor:pointer">Delete</button></td>
    </tr>
  `).join('');
}

async function updateStock(id, stock) {
  await fetch(`/api/admin/products/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: Number(stock) })
  });
}

async function addProduct() {
  const body = {
    name: document.getElementById('pName').value,
    category: document.getElementById('pCategory').value,
    price: document.getElementById('pPrice').value,
    mrp: document.getElementById('pMrp').value,
    stock: document.getElementById('pStock').value || 50,
    image: document.getElementById('pImage').value || null
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
    document.getElementById('pStock').value = '50';
    loadProducts();
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

// ---------------- PUJA TEMPLATES ----------------
async function loadPujaTemplates() {
  const res = await fetch('/api/admin/puja-templates');
  const data = await res.json();
  const box = document.getElementById('pujaList');
  box.innerHTML = data.templates.map((t) => `
    <div class="genCard" style="background:#fafaf9;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b>${t.nameHi}</b>
        <button onclick="deletePujaTemplate('${t.id}')" style="color:#b91c1c;border:0;background:none;cursor:pointer">Delete</button>
      </div>
      <p style="font-size:12px;color:#64748b;margin:4px 0">${t.description || ''}</p>
      <textarea id="note_${t.id}" placeholder="Note (customer को दिखेगा)" style="width:100%;margin:6px 0;padding:8px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px">${t.note || ''}</textarea>
      <table class="adminTable" style="font-size:12px">
        <thead><tr><th>Label</th><th>Base Qty</th><th>Per Guest</th><th>Unit</th><th>Match Name</th></tr></thead>
        <tbody id="items_${t.id}">
          ${t.items.map((it, i) => `
            <tr>
              <td><input value="${it.label}" data-f="label" style="width:110px;padding:4px"></td>
              <td><input value="${it.baseQty}" type="number" data-f="baseQty" style="width:60px;padding:4px"></td>
              <td><input value="${it.perGuestQty}" type="number" step="0.01" data-f="perGuestQty" style="width:60px;padding:4px"></td>
              <td><input value="${it.unit}" data-f="unit" style="width:60px;padding:4px"></td>
              <td><input value="${it.matchName || ''}" data-f="matchName" style="width:90px;padding:4px"></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <button style="margin-top:8px;background:#e2e8f0;color:#111;border:0;padding:8px 14px;border-radius:6px;cursor:pointer" onclick="addItemRow('${t.id}')">+ Item Row</button>
      <button class="primary" style="margin-top:8px" onclick="savePujaTemplate('${t.id}')">💾 Save Changes</button>
    </div>
  `).join('');
}

function addItemRow(templateId) {
  const tbody = document.getElementById(`items_${templateId}`);
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input value="" data-f="label" style="width:110px;padding:4px"></td>
    <td><input value="1" type="number" data-f="baseQty" style="width:60px;padding:4px"></td>
    <td><input value="0" type="number" step="0.01" data-f="perGuestQty" style="width:60px;padding:4px"></td>
    <td><input value="पीस" data-f="unit" style="width:60px;padding:4px"></td>
    <td><input value="" data-f="matchName" style="width:90px;padding:4px"></td>`;
  tbody.appendChild(tr);
}

function collectItemsFromTable(templateId) {
  const rows = document.querySelectorAll(`#items_${templateId} tr`);
  const items = [];
  rows.forEach((row) => {
    const get = (f) => row.querySelector(`[data-f="${f}"]`).value;
    items.push({
      label: get('label'), baseQty: Number(get('baseQty')), perGuestQty: Number(get('perGuestQty')),
      unit: get('unit'), matchName: get('matchName') || null
    });
  });
  return items;
}

async function savePujaTemplate(id) {
  const items = collectItemsFromTable(id);
  const note = document.getElementById(`note_${id}`).value;
  const res = await fetch(`/api/admin/puja-templates/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, note })
  });
  if (res.ok) alert('Saved ✅');
}

async function deletePujaTemplate(id) {
  if (!confirm('Delete this puja template?')) return;
  await fetch(`/api/admin/puja-templates/${id}`, { method: 'DELETE' });
  loadPujaTemplates();
}

async function addPujaTemplate() {
  const nameHi = document.getElementById('ptName').value;
  const description = document.getElementById('ptDescription').value;
  if (!nameHi) { alert('पूजा का नाम डालें'); return; }
  const res = await fetch('/api/admin/puja-templates', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nameHi, description, note: '', items: [] })
  });
  if (res.ok) {
    document.getElementById('ptName').value = '';
    document.getElementById('ptDescription').value = '';
    loadPujaTemplates();
  }
}

// check if already logged in as admin
(async () => {
  const res = await fetch('/api/admin/orders');
  if (res.ok) showDashboard();
})();

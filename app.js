// Banke Bihari storefront API helper.
// Connect this to the existing design's product list/cart UI.
const API_BASE = window.API_BASE || "http://localhost:3000/api";

async function loadProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Products could not be loaded");
  return res.json();
}
async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Order failed");
  return data;
}
async function trackOrder(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/track`);
  if (!res.ok) throw new Error("Tracking unavailable");
  return res.json();
}

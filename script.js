// ===== Inventory Management System =====
const STORAGE_KEY = "stockroom_products";
const LOW_STOCK_LIMIT = 5; // stock at or below this number counts as "low"

// ----- State -----
let products = loadProducts();

// ----- DOM elements -----
const form = document.getElementById("productForm");
const idInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const tableBody = document.getElementById("productTable");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filterCategory");
const categoryList = document.getElementById("categoryList");
const alertBanner = document.getElementById("alertBanner");
const toast = document.getElementById("toast");

// ----- Storage -----
function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    showToast("Could not save data. Storage may be full or blocked.", true);
  }
}

// ----- Helpers -----
function formatMoney(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Escape text so user input can never be run as HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getStatus(stock) {
  if (stock === 0) return { label: "Out of stock", css: "badge-out" };
  if (stock <= LOW_STOCK_LIMIT) return { label: "Low stock", css: "badge-low" };
  return { label: "In stock", css: "badge-ok" };
}

let toastTimer;
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = "toast show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ----- Validation -----
function setError(input, message) {
  document.getElementById(input.id + "Error").textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  return !message;
}

function validateForm() {
  const name = nameInput.value.trim();
  const category = categoryInput.value.trim();
  const price = priceInput.value;
  const stock = stockInput.value;

  // Duplicate check (ignores the product currently being edited)
  const duplicate = products.some(
    (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== idInput.value
  );

  const results = [
    setError(nameInput, !name ? "Enter a product name." : duplicate ? "This product already exists." : ""),
    setError(categoryInput, category ? "" : "Enter a category."),
    setError(priceInput, price === "" || Number(price) < 0 ? "Enter a price of 0 or more." : ""),
    setError(stockInput, stock === "" || Number(stock) < 0 || !Number.isInteger(Number(stock))
      ? "Enter a whole number of 0 or more." : ""),
  ];
  return results.every(Boolean);
}

// ----- Add / edit / delete -----
function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) {
    showToast("Please fix the highlighted fields.", true);
    return;
  }

  const data = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    price: Number(priceInput.value),
    stock: Number(stockInput.value),
  };

  if (idInput.value) {
    const product = products.find((p) => p.id === idInput.value);
    Object.assign(product, data);
    showToast(`"${data.name}" updated.`);
  } else {
    products.push({ id: Date.now().toString(), ...data });
    showToast(`"${data.name}" added.`);
  }

  saveProducts();
  resetForm();
  render();
}

function startEdit(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  idInput.value = product.id;
  nameInput.value = product.name;
  categoryInput.value = product.category;
  priceInput.value = product.price;
  stockInput.value = product.stock;
  formTitle.textContent = "Edit product";
  submitBtn.textContent = "Save changes";
  cancelBtn.hidden = false;
  nameInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
  products = products.filter((p) => p.id !== id);
  saveProducts();
  if (idInput.value === id) resetForm();
  render();
  showToast(`"${product.name}" deleted.`);
}

function resetForm() {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Add product";
  submitBtn.textContent = "Add product";
  cancelBtn.hidden = true;
  [nameInput, categoryInput, priceInput, stockInput].forEach((input) => setError(input, ""));
}

// ----- Rendering -----
function getFilteredProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const category = filterSelect.value;
  return products.filter(
    (p) => p.name.toLowerCase().includes(term) && (category === "all" || p.category === category)
  );
}

function renderDashboard() {
  const units = products.reduce((sum, p) => sum + p.stock, 0);
  const value = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowItems = products.filter((p) => p.stock <= LOW_STOCK_LIMIT);

  document.getElementById("statProducts").textContent = products.length;
  document.getElementById("statUnits").textContent = units;
  document.getElementById("statValue").textContent = formatMoney(value);
  document.getElementById("statLow").textContent = lowItems.length;

  if (lowItems.length > 0) {
    const names = lowItems.map((p) => p.name).join(", ");
    alertBanner.textContent = `Low-stock alert: ${names} ${lowItems.length === 1 ? "needs" : "need"} restocking.`;
    alertBanner.hidden = false;
  } else {
    alertBanner.hidden = true;
  }
}

function renderCategories() {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const current = filterSelect.value;

  filterSelect.innerHTML = '<option value="all">All categories</option>';
  categoryList.innerHTML = "";
  categories.forEach((c) => {
    filterSelect.innerHTML += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
    categoryList.innerHTML += `<option value="${escapeHtml(c)}"></option>`;
  });
  filterSelect.value = categories.includes(current) ? current : "all";
}

function renderTable() {
  const list = getFilteredProducts();
  tableBody.innerHTML = list.map((p) => {
    const status = getStatus(p.stock);
    return `
      <tr class="${p.stock <= LOW_STOCK_LIMIT ? "low-row" : ""}">
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td class="num">${formatMoney(p.price)}</td>
        <td class="num">${p.stock}</td>
        <td><span class="badge ${status.css}">${status.label}</span></td>
        <td class="actions-cell">
          <button class="btn btn-small" data-action="edit" data-id="${p.id}">Edit</button>
          <button class="btn btn-small btn-danger" data-action="delete" data-id="${p.id}">Delete</button>
        </td>
      </tr>`;
  }).join("");

  if (list.length === 0) {
    emptyState.textContent = products.length === 0
      ? "No products yet. Add your first product using the form."
      : "No products match your search or filter.";
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }
}

function render() {
  renderCategories();
  renderTable();
  renderDashboard();
}

// ----- Events -----
form.addEventListener("submit", handleSubmit);
cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderTable);
filterSelect.addEventListener("change", renderTable);

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit") startEdit(button.dataset.id);
  if (button.dataset.action === "delete") deleteProduct(button.dataset.id);
});

// ----- Start -----
render();

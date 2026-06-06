// Admin password (change this!)
const ADMIN_PW = 'kamene2024';

// Storage key
const STORAGE_KEY = 'kg_products';

// State
let products = [];
let editingId = null;

// DOM refs
const loginBox = document.getElementById('loginBox');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const productForm = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const fName = document.getElementById('fName');
const fCategory = document.getElementById('fCategory');
const fPrice = document.getElementById('fPrice');
const fImage = document.getElementById('fImage');
const fDescription = document.getElementById('fDescription');
const productList = document.getElementById('productList');
const prodCount = document.getElementById('prodCount');
const toastAdmin = document.getElementById('toastAdmin');

function toast(msg) {
  toastAdmin.textContent = msg;
  toastAdmin.classList.add('show');
  clearTimeout(toastAdmin._t);
  toastAdmin._t = setTimeout(() => toastAdmin.classList.remove('show'), 2500);
}

// Load products
function loadProducts() {
  try {
    products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { products = []; }
}

// Save products
function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Render product list
function renderProducts() {
  if (!productList) return;
  if (products.length === 0) {
    productList.innerHTML = '<div class="empty-state">No products yet. Add your first one above.</div>';
    prodCount.textContent = '0';
    return;
  }
  prodCount.textContent = products.length;
  productList.innerHTML = products.map((p, i) => {
    const sizes = p.sizes ? Object.entries(p.sizes).filter(([, v]) => v > 0).map(([s, v]) => `${s}:${v}`).join(', ') : 'N/A';
    return `<div class="prod-item">
      <img src="${p.image || 'assets/images/logo.png'}" alt="${p.name}" onerror="this.src='assets/images/logo.png'">
      <div class="info">
        <strong>${p.name}</strong>
        <span>${p.category} · KES ${(+p.price).toLocaleString()} · Sizes: ${sizes}</span>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editProduct(${i})"><i class="fas fa-pen"></i></button>
        <button class="btn-danger" onclick="deleteProduct(${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

// Get sizes from form
function getSizes() {
  const sizes = {};
  document.querySelectorAll('.size-input').forEach(inp => {
    sizes[inp.dataset.size] = Math.max(0, parseInt(inp.value) || 0);
  });
  return sizes;
}

// Set sizes in form
function setSizes(sizes) {
  document.querySelectorAll('.size-input').forEach(inp => {
    inp.value = (sizes && sizes[inp.dataset.size]) || 0;
  });
}

// Reset form
function resetForm() {
  productForm.reset();
  setSizes({});
  editingId = null;
  formTitle.textContent = 'Add Product';
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
  cancelBtn.classList.add('hidden');
  document.querySelectorAll('.size-input').forEach(in => in.value = '0');
}

// Edit product
function editProduct(index) {
  const p = products[index];
  if (!p) return;
  editingId = index;
  fName.value = p.name || '';
  fCategory.value = p.category || 'Apparel';
  fPrice.value = p.price || '';
  fImage.value = p.image || '';
  fDescription.value = p.description || '';
  setSizes(p.sizes || {});
  formTitle.textContent = 'Edit Product';
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
  cancelBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete product
function deleteProduct(index) {
  if (!confirm('Delete this product?')) return;
  products.splice(index, 1);
  saveProducts();
  renderProducts();
  toast('Product deleted');
}

// Save form
function handleSubmit(e) {
  e.preventDefault();
  const name = fName.value.trim();
  const price = fPrice.value.trim();
  if (!name || !price) { toast('Name and price are required'); return; }

  const product = {
    name,
    category: fCategory.value,
    price,
    image: fImage.value.trim() || 'assets/images/logo.png',
    description: fDescription.value.trim(),
    sizes: getSizes(),
  };

  if (editingId !== null) {
    products[editingId] = product;
    toast('Product updated');
  } else {
    products.push(product);
    toast('Product added');
  }

  saveProducts();
  renderProducts();
  resetForm();
}

// Login
function login() {
  if (passwordInput.value === ADMIN_PW) {
    loginBox.classList.add('hidden');
    dashboard.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginError.style.display = 'none';
    passwordInput.value = '';
    loadProducts();
    renderProducts();
  } else {
    loginError.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Logout
function logout() {
  dashboard.classList.add('hidden');
  loginBox.classList.remove('hidden');
  logoutBtn.classList.add('hidden');
  passwordInput.value = '';
  loginError.style.display = 'none';
}

// Events
loginBtn.addEventListener('click', login);
passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
logoutBtn.addEventListener('click', logout);
productForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', resetForm);

// Init
loadProducts();

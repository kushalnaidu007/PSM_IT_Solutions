'use strict';

const API_PRODUCTS = '/api/admin/products';
const API_UPLOAD = '/api/admin/upload';

const CATEGORIES = [
  { value: 'phones', label: 'Phones' },
  { value: 'other-devices', label: 'Other devices' },
  { value: 'tablets', label: 'Tablets' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'consoles', label: 'Consoles' },
  { value: 'accessories', label: 'Accessories' },
];

const MAX_SLOTS = 5;
const MIN_IMAGES = 3;

// ── State ────────────────────────────────────────────────────────────────────

let token = '';
let allProducts = [];
const slotFiles = new Array(MAX_SLOTS).fill(null);    // File objects
const slotPreviews = new Array(MAX_SLOTS).fill(null); // data: URLs for display

// ── DOM refs ─────────────────────────────────────────────────────────────────

const loginScreen   = document.getElementById('login-screen');
const adminApp      = document.getElementById('admin-app');
const loginForm     = document.getElementById('login-form');
const loginPassword = document.getElementById('login-password');
const loginError    = document.getElementById('login-error');
const loginBtn      = document.getElementById('login-btn');

const productGrid   = document.getElementById('product-grid');
const filterStatus  = document.getElementById('filter-status');
const filterCat     = document.getElementById('filter-category');

const formModal     = document.getElementById('product-form-modal');
const productForm   = document.getElementById('product-form');
const pfName        = document.getElementById('pf-name');
const pfCategory    = document.getElementById('pf-category');
const formError     = document.getElementById('form-error');
const imgSlotsEl    = document.getElementById('img-slots');
const formSaveBtn   = document.getElementById('form-save');

const confirmModal  = document.getElementById('confirm-modal');
const confirmNameEl = document.getElementById('confirm-name');

// ── Auth ─────────────────────────────────────────────────────────────────────

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const showAdmin = () => {
  loginScreen.classList.add('hidden');
  adminApp.classList.remove('hidden');
  loadProducts();
};

const showLogin = () => {
  token = '';
  sessionStorage.removeItem('adminToken');
  adminApp.classList.add('hidden');
  loginScreen.classList.remove('hidden');
};

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const pwd = loginPassword.value.trim();
  if (!pwd) return;
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in…';
  try {
    const res = await fetch(API_PRODUCTS, { headers: { Authorization: `Bearer ${pwd}` } });
    if (res.ok) {
      token = pwd;
      sessionStorage.setItem('adminToken', token);
      showAdmin();
    } else {
      loginError.textContent = 'Incorrect password.';
    }
  } catch {
    loginError.textContent = 'Could not connect. Please try again.';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign in';
  }
});

document.getElementById('logout-btn').addEventListener('click', showLogin);

// Re-use saved session
const savedToken = sessionStorage.getItem('adminToken');
if (savedToken) { token = savedToken; showAdmin(); }

// ── Product list ─────────────────────────────────────────────────────────────

const loadProducts = async () => {
  productGrid.innerHTML = '<p>Loading products…</p>';
  try {
    const res = await fetch(API_PRODUCTS, { headers: authHeaders() });
    if (res.status === 401) { showLogin(); return; }
    const data = await res.json();
    allProducts = data.products || [];
    renderGrid();
  } catch {
    productGrid.innerHTML = '<p>Failed to load products. Check your connection.</p>';
  }
};

const renderGrid = () => {
  const statusFilter = filterStatus.value;
  const catFilter    = filterCat.value;

  const filtered = allProducts.filter((p) => {
    if (statusFilter === 'active'   && p.archived)  return false;
    if (statusFilter === 'archived' && !p.archived) return false;
    if (catFilter && p.category !== catFilter)       return false;
    return true;
  });

  if (!filtered.length) {
    productGrid.innerHTML = '<p>No products match the current filters.</p>';
    return;
  }

  productGrid.innerHTML = '';
  filtered.forEach((p) => {
    const card = document.createElement('div');
    card.className = `prod-card${p.archived ? ' archived' : ''}`;

    const img = document.createElement('img');
    img.className = 'prod-card-img';
    img.src = (p.imgs && p.imgs[0]) || 'assets/hero-accessories.jpg';
    img.alt = p.name;
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'prod-card-body';

    const name = document.createElement('div');
    name.className = 'prod-card-name';
    name.textContent = p.name;

    const meta = document.createElement('div');
    meta.className = 'prod-card-meta';

    const catTag = document.createElement('span');
    catTag.className = 'tag cat';
    catTag.textContent = CATEGORIES.find((c) => c.value === p.category)?.label || p.category;

    const statusTag = document.createElement('span');
    statusTag.className = `tag ${p.archived ? 'arch' : 'live'}`;
    statusTag.textContent = p.archived ? 'Archived' : 'Live';

    meta.appendChild(catTag);
    meta.appendChild(statusTag);
    body.appendChild(name);
    body.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'prod-card-actions';

    const archBtn = document.createElement('button');
    archBtn.className = 'button ghost small';
    archBtn.textContent = p.archived ? 'Restore' : 'Archive';
    archBtn.addEventListener('click', () => toggleArchive(p));

    const delBtn = document.createElement('button');
    delBtn.className = 'button small';
    delBtn.style.cssText = 'background:rgba(211,47,47,0.08);color:#d32f2f;border-color:rgba(211,47,47,0.2);';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => openConfirmDelete(p));

    actions.appendChild(archBtn);
    actions.appendChild(delBtn);

    card.appendChild(img);
    card.appendChild(body);
    card.appendChild(actions);
    productGrid.appendChild(card);
  });
};

filterStatus.addEventListener('change', renderGrid);
filterCat.addEventListener('change', renderGrid);

// ── Archive toggle ────────────────────────────────────────────────────────────

const toggleArchive = async (product) => {
  try {
    const res = await fetch(API_PRODUCTS, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ id: product.id, archived: !product.archived }),
    });
    if (res.status === 401) { showLogin(); return; }
    const updated = await res.json();
    const idx = allProducts.findIndex((p) => p.id === product.id);
    if (idx !== -1) allProducts[idx] = updated;
    renderGrid();
    showToast(`"${updated.name}" ${updated.archived ? 'archived' : 'restored'}.`);
  } catch {
    showToast('Failed to update product.', 'error');
  }
};

// ── Delete ────────────────────────────────────────────────────────────────────

let deletePendingId = null;

const openConfirmDelete = (product) => {
  deletePendingId = product.id;
  confirmNameEl.textContent = product.name;
  confirmModal.classList.remove('hidden');
};

document.getElementById('confirm-cancel').addEventListener('click', () => {
  confirmModal.classList.add('hidden');
  deletePendingId = null;
});

document.getElementById('confirm-delete').addEventListener('click', async () => {
  if (!deletePendingId) return;
  confirmModal.classList.add('hidden');
  try {
    const res = await fetch(`${API_PRODUCTS}?id=${encodeURIComponent(deletePendingId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { showLogin(); return; }
    const name = allProducts.find((p) => p.id === deletePendingId)?.name || 'Product';
    allProducts = allProducts.filter((p) => p.id !== deletePendingId);
    renderGrid();
    showToast(`"${name}" deleted.`);
  } catch {
    showToast('Failed to delete product.', 'error');
  } finally {
    deletePendingId = null;
  }
});

// ── Add product form ──────────────────────────────────────────────────────────

const openAddModal = () => {
  document.getElementById('modal-title').textContent = 'Add product';
  productForm.reset();
  formError.textContent = '';
  slotFiles.fill(null);
  slotPreviews.fill(null);
  renderSlots();
  formModal.classList.remove('hidden');
  pfName.focus();
};

const closeModal = () => {
  formModal.classList.add('hidden');
  slotFiles.fill(null);
  slotPreviews.fill(null);
};

document.getElementById('add-product-btn').addEventListener('click', openAddModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
formModal.addEventListener('click', (e) => { if (e.target === formModal) closeModal(); });

// ── Image slots ───────────────────────────────────────────────────────────────

const renderSlots = () => {
  imgSlotsEl.innerHTML = '';
  for (let i = 0; i < MAX_SLOTS; i++) {
    const slot = document.createElement('div');
    slot.className = 'img-slot';

    if (slotPreviews[i]) {
      const preview = document.createElement('img');
      preview.src = slotPreviews[i];
      preview.alt = `Image ${i + 1}`;
      slot.appendChild(preview);

      const rmBtn = document.createElement('button');
      rmBtn.className = 'slot-remove';
      rmBtn.type = 'button';
      rmBtn.setAttribute('aria-label', `Remove image ${i + 1}`);
      rmBtn.textContent = '×';
      rmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        slotFiles[i] = null;
        slotPreviews[i] = null;
        renderSlots();
      });
      slot.appendChild(rmBtn);
    } else {
      const ph = document.createElement('div');
      ph.className = 'img-slot-placeholder';
      const isRequired = i < MIN_IMAGES;

      const plus = document.createElement('div');
      plus.className = 'slot-plus';
      plus.textContent = '+';

      const lbl = document.createElement('div');
      lbl.className = 'slot-label';
      lbl.textContent = `Image ${i + 1}`;

      ph.appendChild(plus);
      ph.appendChild(lbl);

      if (!isRequired) {
        const opt = document.createElement('div');
        opt.className = 'slot-opt';
        opt.textContent = 'optional';
        ph.appendChild(opt);
      }
      slot.appendChild(ph);

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.setAttribute('aria-label', `Image ${i + 1}${isRequired ? ' (required)' : ' (optional)'}`);
      fileInput.addEventListener('change', (e) => handleSlotFile(i, e.target.files[0]));
      slot.appendChild(fileInput);
    }

    imgSlotsEl.appendChild(slot);
  }
};

const handleSlotFile = (idx, file) => {
  if (!file) return;
  if (file.size > 15 * 1024 * 1024) {
    formError.textContent = 'Each image must be under 15MB before upload.';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    slotPreviews[idx] = e.target.result;
    slotFiles[idx] = file;
    formError.textContent = '';
    // Remove required-empty highlight if present
    const slots = imgSlotsEl.children;
    if (slots[idx]) slots[idx].classList.remove('required-empty');
    renderSlots();
  };
  reader.readAsDataURL(file);
};

renderSlots();

// ── Image resize + upload ────────────────────────────────────────────────────

const resizeImage = (file, maxDim = 1600) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return resolve(null);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width  = Math.max(1, Math.round(width  * scale));
      height = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve({
        base64: canvas.toDataURL('image/jpeg', 0.85).split(',')[1],
        type: 'image/jpeg',
      });
    };
    img.onerror = (err) => { URL.revokeObjectURL(objectUrl); reject(err); };
    img.src = objectUrl;
  });

const uploadImage = async (file, idx) => {
  const resized = await resizeImage(file);
  if (!resized) throw new Error('Could not process image');
  const res = await fetch(API_UPLOAD, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name: `img-${idx + 1}-${file.name}`, type: resized.type, data: resized.base64 }),
  });
  if (res.status === 401) { showLogin(); throw new Error('Unauthorised'); }
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Upload failed'); }
  return (await res.json()).url;
};

// ── Form submit ──────────────────────────────────────────────────────────────

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const name     = pfName.value.trim();
  const category = pfCategory.value;

  if (!name) { formError.textContent = 'Product name is required.'; pfName.focus(); return; }
  if (!category) { formError.textContent = 'Please select a category.'; pfCategory.focus(); return; }

  const filledCount = slotFiles.filter(Boolean).length;
  if (filledCount < MIN_IMAGES) {
    formError.textContent = `Please upload at least ${MIN_IMAGES} images.`;
    const slots = imgSlotsEl.children;
    for (let i = 0; i < MIN_IMAGES; i++) {
      if (!slotFiles[i]) slots[i]?.classList.add('required-empty');
    }
    return;
  }

  formSaveBtn.disabled = true;

  try {
    const urls = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      if (!slotFiles[i]) continue;
      formSaveBtn.textContent = `Uploading image ${urls.length + 1} of ${filledCount}…`;
      urls.push(await uploadImage(slotFiles[i], i));
    }

    formSaveBtn.textContent = 'Saving…';
    const res = await fetch(API_PRODUCTS, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ category, name, imgs: urls }),
    });
    if (res.status === 401) { showLogin(); return; }
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Save failed'); }

    allProducts.push(await res.json());
    renderGrid();
    closeModal();
    showToast(`"${name}" added successfully!`, 'success');
  } catch (err) {
    formError.textContent = `Error: ${err.message}`;
    console.error(err);
  } finally {
    formSaveBtn.disabled = false;
    formSaveBtn.textContent = 'Save product';
  }
});

// ── CSV import ───────────────────────────────────────────────────────────────

document.getElementById('import-csv-btn').addEventListener('click', async () => {
  if (!confirm(
    'Import all products from the existing products.csv?\n\n' +
    'Products with the same name and category will be skipped.'
  )) return;

  const btn = document.getElementById('import-csv-btn');
  btn.disabled = true;
  btn.textContent = 'Importing…';

  try {
    const res = await fetch('/assets/products.csv');
    if (!res.ok) throw new Error('Could not fetch products.csv');
    const text = await res.text();

    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) throw new Error('CSV has no data rows');

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const catIdx  = headers.indexOf('category');
    const nameIdx = headers.indexOf('name');
    const imgIdxs = ['img1', 'img2', 'img3', 'img4', 'img5']
      .map((k) => headers.indexOf(k))
      .filter((i) => i >= 0);

    if (catIdx === -1 || nameIdx === -1) throw new Error('CSV is missing category or name columns');

    const base = window.location.origin;
    const products = [];

    lines.slice(1).forEach((line) => {
      const cols     = line.split(',');
      const category = (cols[catIdx]  || '').trim();
      const name     = (cols[nameIdx] || '').trim();
      const imgs = imgIdxs
        .map((i) => (cols[i] || '').trim())
        .filter(Boolean)
        .map((path) => (path.startsWith('http') ? path : `${base}/${path}`));

      if (category && name && imgs.length > 0) products.push({ category, name, imgs });
    });

    if (!products.length) throw new Error('No valid products found in CSV');

    const seedRes = await fetch('/api/admin/seed', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ products }),
    });
    if (seedRes.status === 401) { showLogin(); return; }
    if (!seedRes.ok) throw new Error('Seed API error: ' + (await seedRes.text()));

    const { imported, skipped } = await seedRes.json();
    await loadProducts();
    showToast(
      `Imported ${imported} product${imported !== 1 ? 's' : ''}` +
      (skipped ? ` — ${skipped} already existed` : '') + '.',
      'success'
    );
  } catch (err) {
    showToast(`Import failed: ${err.message}`, 'error');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = '↑ Import from CSV';
  }
});

// ── Toast ─────────────────────────────────────────────────────────────────────

const showToast = (message, type = 'success') => {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 320);
  }, 3200);
};

document.addEventListener('DOMContentLoaded', async () => {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const deviceSelect = document.getElementById('device-type');
  const issueSelect = document.getElementById('issue');
  const quoteForm = document.getElementById('quote-form');
  const issuePhotos = document.getElementById('issue-photos');
  const issueDescription = document.getElementById('issue-description');
  const photoList = document.getElementById('photo-list');
  const customerPhone = document.getElementById('customer-phone');
  const customerEmail = document.getElementById('customer-email');
  const whatsappFab = document.getElementById('whatsapp-fab');
  const whatsappModal = document.getElementById('whatsapp-modal');
  const whatsappClose = document.getElementById('whatsapp-close');
  const whatsappForm = document.getElementById('whatsapp-form');
  const whatsappMessage = document.getElementById('whatsapp-message');
  const whatsappNumber = '447741438569';
  const buyGrid = document.getElementById('buy-grid');
  const productModal = document.getElementById('product-modal');
  const productClose = document.getElementById('product-close');
  const productList = document.getElementById('product-list');
  const productDetailModal = document.getElementById('product-detail-modal');
  const productDetailClose = document.getElementById('product-detail-close');
  const productDetailContent = document.getElementById('product-detail-content');
  const termsModal = document.getElementById('terms-modal');
  const termsClose = document.getElementById('terms-close');
  const termsOpen = document.getElementById('buy-terms-open');
  const termsContent = document.getElementById('terms-content');
  const reviewsGrid = document.getElementById('reviews-grid');
  const reviewsLoading = document.getElementById('reviews-loading');

  // Form options data
  let devices = [];
  let issues = [];

  const defaultDevices = [
    { id: 'iphone', label: 'iPhone', icon: '📱' },
    { id: 'ipad', label: 'iPad', icon: '📲' },
    { id: 'macbook', label: 'MacBook', icon: '💻' },
    { id: 'apple-watch', label: 'Apple Watch', icon: '⌚' },
    { id: 'android-phone-samsung', label: 'Android phone (Samsung)', icon: '📱' },
    { id: 'android-phone-pixel', label: 'Android phone (Pixel)', icon: '📱' },
    { id: 'android-phone-oneplus', label: 'Android phone (OnePlus)', icon: '📱' },
    { id: 'android-phone-xiaomi', label: 'Android phone (Xiaomi)', icon: '📱' },
    { id: 'android-phone-oppo', label: 'Android phone (Oppo)', icon: '📱' },
    { id: 'android-phone-other', label: 'Other Android', icon: '📱' },
    { id: 'android-tablet', label: 'Android tablet', icon: '📲' },
    { id: 'windows-laptop', label: 'Windows laptop', icon: '💻' },
    { id: 'console', label: 'Gaming Console', icon: '🎮' },
    { id: 'smartwatch', label: 'Smartwatch', icon: '⌚' },
    { id: 'other', label: 'Other', icon: '🧰' }
  ];

  const defaultIssues = [
    { id: 'screen', label: 'Screen cracked', icon: '🪟' },
    { id: 'battery', label: 'Battery draining', icon: '🔋' },
    { id: 'water', label: 'Water damage', icon: '💧' },
    { id: 'charging', label: 'Charging port / power', icon: '⚡' },
    { id: 'camera', label: 'Camera / audio', icon: '📸' },
    { id: 'data', label: 'Data recovery', icon: '💾' },
    { id: 'other', label: 'Other issue', icon: '🧰' }
  ];

  const parseFormOptions = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return { devices: [], issues: [] };
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const getIdx = (name) => headers.indexOf(name);
    const idx = {
      kind: getIdx('kind'),
      deviceId: getIdx('device_id'),
      deviceLabel: getIdx('device_label'),
      deviceIcon: getIdx('device_icon'),
      issueId: getIdx('issue_id'),
      issueLabel: getIdx('issue_label'),
      issueIcon: getIdx('issue_icon')
    };
    const deviceMap = new Map();
    const issuesArr = [];

    lines.slice(1).forEach((line) => {
      const cols = line.split(',');
      const kind = (cols[idx.kind] || '').trim().toLowerCase();
      if (kind === 'device') {
        const dId = (cols[idx.deviceId] || '').trim();
        const dLabel = (cols[idx.deviceLabel] || '').trim();
        const dIcon = (cols[idx.deviceIcon] || '').trim() || '📱';
        if (!dId || !dLabel) return;
        if (!deviceMap.has(dId)) {
          deviceMap.set(dId, { id: dId, label: dLabel, icon: dIcon });
        }
      } else if (kind === 'issue') {
        const issueId = (cols[idx.issueId] || '').trim();
        const issueLabel = (cols[idx.issueLabel] || '').trim();
        const issueIcon = (cols[idx.issueIcon] || '').trim() || '🛠️';
        if (issueId && issueLabel) {
          issuesArr.push({ id: issueId, label: issueLabel, icon: issueIcon });
        }
      }
    });

    return { devices: Array.from(deviceMap.values()), issues: issuesArr };
  };

  const loadFormOptions = async () => {
    try {
      const csvRes = await fetch('assets/form-options.csv');
      if (csvRes.ok) {
        const csvText = await csvRes.text();
        const parsed = parseFormOptions(csvText);
        if (parsed.devices.length && parsed.issues.length) {
          devices = parsed.devices;
          issues = parsed.issues;
          return;
        }
      }
      devices = defaultDevices;
      issues = defaultIssues;
    } catch (e) {
      console.error('Form options load failed, using defaults', e);
      devices = defaultDevices;
      issues = defaultIssues;
    }
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName.toLowerCase() === 'a') {
        navLinks.classList.remove('open');
      }
    });
  }

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach((i) => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  if (deviceSelect && issueSelect) {
    await loadFormOptions();

    const buildOptions = (select, placeholder, options) => {
      select.innerHTML = '';
      const placeholderOption = document.createElement('option');
      placeholderOption.textContent = placeholder;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      select.appendChild(placeholderOption);

      options.forEach(({ value, label }) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = label;
        select.appendChild(opt);
      });
      select.disabled = options.length === 0;
    };

    const updateSummary = () => {};

    buildOptions(
      deviceSelect,
      'Select a device type',
      devices.map((device) => ({ value: device.id, label: `${device.icon} ${device.label}` }))
    );
    buildOptions(
      issueSelect,
      'Select an issue',
      issues.map((issue) => ({ value: issue.id, label: `${issue.icon} ${issue.label}` }))
    );
    issueSelect.disabled = true;

    deviceSelect.addEventListener('change', () => {
      const selectedDevice = devices.find((device) => device.id === deviceSelect.value);
      issueSelect.disabled = !selectedDevice;
      updateSummary();
    });

    issueSelect.addEventListener('change', updateSummary);

    const selectedPhotos = [];

    const renderPhotoChips = () => {
      if (!photoList) return;
      photoList.innerHTML = '';
      selectedPhotos.forEach((file, index) => {
        const chip = document.createElement('div');
        chip.className = 'photo-chip';
        chip.textContent = file.name;
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation(); // prevent opening file dialog via label
          selectedPhotos.splice(index, 1);
          const dt = new DataTransfer();
          selectedPhotos.forEach((f) => dt.items.add(f));
          issuePhotos.files = dt.files;
          renderPhotoChips();
        });
        chip.appendChild(removeBtn);
        photoList.appendChild(chip);
      });
    };

    if (issuePhotos) {
      issuePhotos.addEventListener('change', (event) => {
        const files = Array.from(event.target.files || []);
        let combined = [...selectedPhotos, ...files];
        if (combined.length > 3) {
          alert('Please upload a maximum of 3 images.');
          combined = combined.slice(0, 3);
        }
        selectedPhotos.splice(0, selectedPhotos.length, ...combined);
        const dt = new DataTransfer();
        selectedPhotos.forEach((file) => dt.items.add(file));
        issuePhotos.files = dt.files;
        renderPhotoChips();
      });
    }

    quoteForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      updateSummary();
      const deviceText = deviceSelect?.selectedOptions?.[0]?.textContent?.trim() || 'N/A';
      const seriesText = seriesSelect?.selectedOptions?.[0]?.textContent?.trim() || 'N/A';
      const modelText = modelSelect?.selectedOptions?.[0]?.textContent?.trim() || 'N/A';
      const issueText = issueSelect?.selectedOptions?.[0]?.textContent?.trim() || 'N/A';
      const descText = issueDescription?.value?.trim() || 'N/A';
      const phoneText = customerPhone?.value?.trim() || '';
      const emailText = customerEmail?.value?.trim() || '';

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const phoneDigits = phoneText.replace(/\D/g, '');
      const uniqueDigits = new Set(phoneDigits.split(''));

      if (phoneDigits.length < 10 || phoneDigits.length > 15 || uniqueDigits.size < 3) {
        alert('Please enter a valid phone number (10-15 digits).');
        customerPhone?.focus();
        return;
      }
      if (!emailRegex.test(emailText)) {
        alert('Please enter a valid email address.');
        customerEmail?.focus();
        return;
      }

      const resizeImage = (file, maxDim = 1600) =>
        new Promise((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            return resolve(null);
          }
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          img.onload = () => {
            let { width, height } = img;
            const scale = Math.min(1, maxDim / Math.max(width, height));
            width = Math.max(1, Math.round(width * scale));
            height = Math.max(1, Math.round(height * scale));
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // high quality
            URL.revokeObjectURL(objectUrl);
            const base64 = dataUrl.split(',')[1];
            resolve({ name: file.name, type: 'image/jpeg', data: base64 });
          };
          img.onerror = (e) => {
            URL.revokeObjectURL(objectUrl);
            reject(e);
          };
          img.src = objectUrl;
        });

      let attachments = [];
      try {
        const oversized = selectedPhotos.find((f) => f.size > 2 * 1024 * 1024);
        if (oversized) {
          alert('Each photo must be under 2MB. Please remove or choose smaller files.');
          return;
        }
        attachments = (
          await Promise.all(selectedPhotos.map((file) => resizeImage(file)))
        ).filter(Boolean);
      } catch (e) {
        console.error('Failed to read attachments', e);
        alert('Could not read attached photos. Please try again.');
        return;
      }

      const payload = {
        device: deviceText,
        series: seriesText,
        model: modelText,
        issue: issueText,
        description: descText,
        phone: phoneText,
        email: emailText,
        attachments
      };

      try {
        const response = await fetch('/api/send-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Failed to send');
        }
        alert('Thanks! Your request was sent. We will contact you shortly.');
      } catch (err) {
        alert('Could not send your request. Please try again.');
        console.error(err);
      }
    });
  }

  // WhatsApp modal chat
  const openWhatsAppModal = () => {
    if (!whatsappModal) return;
    whatsappModal.classList.add('active');
    whatsappModal.setAttribute('aria-hidden', 'false');
    whatsappMessage?.focus();
  };

  const closeWhatsAppModal = () => {
    if (!whatsappModal) return;
    whatsappModal.classList.remove('active');
    whatsappModal.setAttribute('aria-hidden', 'true');
  };

  whatsappFab?.addEventListener('click', (event) => {
    event.preventDefault();
    openWhatsAppModal();
  });

  whatsappClose?.addEventListener('click', (event) => {
    event.preventDefault();
    closeWhatsAppModal();
  });

  whatsappModal?.addEventListener('click', (event) => {
    if (event.target === whatsappModal) {
      closeWhatsAppModal();
    }
  });

  whatsappForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const msg = (whatsappMessage?.value || '').trim();
    const fallback = 'Hi, I need help with my device repair.';
    const encoded = encodeURIComponent(msg || fallback);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
    closeWhatsAppModal();
  });

  // Buy modal with product listings
  let products = {};

  const parseCsvProducts = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return {};
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const categoryIdx = headers.indexOf('category');
    const nameIdx = headers.indexOf('name');
    const img1Idx = headers.indexOf('img1');
    const img2Idx = headers.indexOf('img2');
    const img3Idx = headers.indexOf('img3');
    if (categoryIdx === -1 || nameIdx === -1) return {};
    const map = {};
    lines.slice(1).forEach((line) => {
      const cols = line.split(',');
      const category = (cols[categoryIdx] || '').trim();
      const name = (cols[nameIdx] || '').trim();
      const imgs = [img1Idx, img2Idx, img3Idx]
        .map((idx) => (idx >= 0 ? (cols[idx] || '').trim() : ''))
        .filter(Boolean);
      if (!category || !name || imgs.length === 0) return;
      if (!map[category]) map[category] = [];
      map[category].push({ name, imgs });
    });
    return map;
  };

  const loadProducts = async () => {
    try {
      // Try CSV first for easy editing
      const csvRes = await fetch('assets/products.csv');
      if (csvRes.ok) {
        const csvText = await csvRes.text();
        const parsed = parseCsvProducts(csvText);
        if (Object.keys(parsed).length > 0) {
          products = parsed;
          return;
        }
      }
      // Fallback to JSON
      const res = await fetch('assets/products.json');
      if (!res.ok) throw new Error('Failed to load products JSON');
      products = await res.json();
    } catch (e) {
      console.error('Product load failed, using fallback', e);
      products = {
        phones: [
          { name: 'iPhone 15 Pro', imgs: ['assets/hero-phone.jpg', 'assets/hero-phone.jpg', 'assets/hero-phone.jpg'] },
          { name: 'Samsung Galaxy S24', imgs: ['assets/hero-phone.jpg', 'assets/hero-phone.jpg', 'assets/hero-phone.jpg'] },
          { name: 'Google Pixel 8 Pro', imgs: ['assets/hero-phone.jpg', 'assets/hero-phone.jpg', 'assets/hero-phone.jpg'] }
        ],
        tablets: [
          { name: 'iPad Pro 12.9"', imgs: ['assets/hero-tablet.jpg', 'assets/hero-tablet.jpg', 'assets/hero-tablet.jpg'] },
          { name: 'Galaxy Tab S9', imgs: ['assets/hero-tablet.jpg', 'assets/hero-tablet.jpg', 'assets/hero-tablet.jpg'] },
          { name: 'Lenovo Tab P series', imgs: ['assets/hero-tablet.jpg', 'assets/hero-tablet.jpg', 'assets/hero-tablet.jpg'] }
        ],
        laptops: [
          { name: 'MacBook Air M2', imgs: ['assets/hero-laptop.jpg', 'assets/hero-laptop.jpg', 'assets/hero-laptop.jpg'] },
          { name: 'MacBook Pro 14"', imgs: ['assets/hero-laptop.jpg', 'assets/hero-laptop.jpg', 'assets/hero-laptop.jpg'] },
          { name: 'Windows Ultrabook', imgs: ['assets/hero-laptop.jpg', 'assets/hero-laptop.jpg', 'assets/hero-laptop.jpg'] }
        ],
        watches: [
          { name: 'Apple Watch Series 9', imgs: ['assets/hero-watch.jpg', 'assets/hero-watch.jpg', 'assets/hero-watch.jpg'] },
          { name: 'Galaxy Watch6', imgs: ['assets/hero-watch.jpg', 'assets/hero-watch.jpg', 'assets/hero-watch.jpg'] },
          { name: 'Fitbit Versa 4', imgs: ['assets/hero-watch.jpg', 'assets/hero-watch.jpg', 'assets/hero-watch.jpg'] }
        ],
        'other-devices': [
          { name: 'PlayStation 5', imgs: ['assets/hero-accessories.jpg', 'assets/hero-accessories.jpg', 'assets/hero-accessories.jpg'] },
          { name: 'Xbox Series X', imgs: ['assets/hero-accessories.jpg', 'assets/hero-accessories.jpg', 'assets/hero-accessories.jpg'] },
          { name: 'Accessories bundle', imgs: ['assets/hero-accessories.jpg', 'assets/hero-accessories.jpg', 'assets/hero-accessories.jpg'] }
        ]
      };
    }
  };

  const openProductModal = (category) => {
    if (!productModal || !productList) return;
    const items = products[category] || [];
    productList.innerHTML = '';
    items.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'product-item';
      const imgSrc = (item.imgs && item.imgs[0]) || 'assets/hero-accessories.jpg';
      div.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}" loading="lazy">
        <div class="product-name">${item.name}</div>
      `;
      div.addEventListener('click', () => openProductDetail(item));
      productList.appendChild(div);
    });
    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
  };

  const openProductDetail = (item) => {
    if (!productDetailModal || !productDetailContent) return;
    const imgs = item.imgs && item.imgs.length ? item.imgs : ['assets/hero-accessories.jpg'];
    productDetailContent.innerHTML = `
      <div class="product-gallery-main">
        <img id="detail-main-img" src="${imgs[0]}" alt="${item.name}" loading="lazy">
      </div>
      <div class="product-thumbs" id="detail-thumbs">
        ${imgs.map((src, i) => `<img src="${src}" data-idx="${i}" class="${i === 0 ? 'active' : ''}" alt="${item.name}" loading="lazy">`).join('')}
      </div>
      <div class="product-name">${item.name}</div>
    `;
    const mainImg = document.getElementById('detail-main-img');
    const thumbs = Array.from(document.querySelectorAll('#detail-thumbs img'));
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.getAttribute('src');
      });
    });
    productDetailModal.classList.add('active');
    productDetailModal.setAttribute('aria-hidden', 'false');
  };

  const closeProductModal = () => {
    if (!productModal) return;
    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
  };

  const closeProductDetailModal = () => {
    if (!productDetailModal) return;
    productDetailModal.classList.remove('active');
    productDetailModal.setAttribute('aria-hidden', 'true');
  };

  buyGrid?.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');
    if (!card) return;
    const category = card.getAttribute('data-category');
    openProductModal(category);
  });

  productClose?.addEventListener('click', (event) => {
    event.preventDefault();
    closeProductModal();
  });

  productDetailClose?.addEventListener('click', (event) => {
    event.preventDefault();
    closeProductDetailModal();
  });

  productModal?.addEventListener('click', (event) => {
    if (event.target === productModal) {
      closeProductModal();
    }
  });

  productDetailModal?.addEventListener('click', (event) => {
    if (event.target === productDetailModal) {
      closeProductDetailModal();
    }
  });

  termsOpen?.addEventListener('click', (event) => {
    event.preventDefault();
    termsModal?.classList.add('active');
    termsModal?.setAttribute('aria-hidden', 'false');
  });

  const closeTermsModal = () => {
    if (!termsModal) return;
    termsModal.classList.remove('active');
    termsModal.setAttribute('aria-hidden', 'true');
  };

  termsClose?.addEventListener('click', (event) => {
    event.preventDefault();
    closeTermsModal();
  });

  termsModal?.addEventListener('click', (event) => {
    if (event.target === termsModal) {
      closeTermsModal();
    }
  });

  // Load terms content from file for owner-friendly updates
  const loadTerms = async () => {
    if (!termsContent) return;
    try {
      const res = await fetch('assets/terms.txt');
      if (!res.ok) throw new Error('Failed to load terms');
      const text = await res.text();
      const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
      termsContent.innerHTML = paragraphs.map((p) => `<p>${p.replace(/\n/g, ' ')}</p>`).join('');
    } catch (e) {
      console.error('Could not load terms content', e);
      termsContent.innerHTML = '<p>Terms are temporarily unavailable. Please contact us for details.</p>';
    }
  };

  loadTerms();

  loadProducts();

  // Load manual reviews from CSV
  const loadReviews = async () => {
    if (!reviewsGrid) return;
    try {
      const res = await fetch('assets/reviews.csv');
      if (!res.ok) throw new Error('Failed to load reviews');
      const text = await res.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        reviewsGrid.innerHTML = '<p>No reviews available right now.</p>';
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const idx = {
        author: headers.indexOf('author'),
        rating: headers.indexOf('rating'),
        text: headers.indexOf('text'),
        meta: headers.indexOf('meta'),
      };
      const parsed = lines.slice(1).map((line) => {
        const cols = line.split(',');
        const author = (cols.shift() || '').trim();
        const rating = (cols.shift() || '').trim();
        const meta = cols.length > 1 ? (cols.pop() || '').trim() : '';
        const reviewText = cols.join(',').trim();
        return { author, rating, reviewText, meta };
      });

      const cleanReviews = parsed.filter((r) => r.author || r.reviewText);
      if (!cleanReviews.length) {
        reviewsGrid.innerHTML = '<p>No reviews available right now.</p>';
        return;
      }

      const reviewsPerPage = 3;
      let page = 0;

      const renderReviews = () => {
        reviewsGrid.classList.add('fade');
        reviewsGrid.innerHTML = '';
        for (let i = 0; i < Math.min(reviewsPerPage, cleanReviews.length); i++) {
          const rev = cleanReviews[(page * reviewsPerPage + i) % cleanReviews.length];
          const card = document.createElement('article');
          card.className = 'card testimonial';
          card.innerHTML = `
            <div class="quote">“</div>
            <p>${rev.reviewText || 'No review text provided.'}</p>
            <div class="author">
              <div class="avatar">${(rev.author || 'A').slice(0, 2).toUpperCase()}</div>
              <div>
                <div class="name">${rev.author || 'Anonymous'}</div>
                <div class="meta">Rating: ${rev.rating || 'N/A'} ★${rev.meta ? ' • ' + rev.meta : ''}</div>
              </div>
            </div>
          `;
          reviewsGrid.appendChild(card);
        }
        setTimeout(() => reviewsGrid.classList.remove('fade'), 300);
        page = (page + 1) % Math.max(1, Math.ceil(cleanReviews.length / reviewsPerPage));
      };

      renderReviews();
      if (cleanReviews.length > reviewsPerPage) {
        setInterval(renderReviews, 5000);
      }
    } catch (e) {
      if (reviewsGrid) {
        reviewsGrid.innerHTML = '<p>Could not load reviews right now.</p>';
      }
      console.error(e);
    }
  };

  loadReviews();
});

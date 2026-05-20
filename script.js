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
  const phoneError = document.getElementById('phone-error');
  const emailError = document.getElementById('email-error');
  const formStatus = document.getElementById('form-status');
  const quoteSubmit = document.getElementById('quote-submit');
  const whatsappFab = document.getElementById('whatsapp-fab');
  const whatsappModal = document.getElementById('whatsapp-modal');
  const whatsappClose = document.getElementById('whatsapp-close');
  const whatsappForm = document.getElementById('whatsapp-form');
  const whatsappMessage = document.getElementById('whatsapp-message');
  const whatsappNumber = '447799229333';
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

  const escapeHtml = (str) => String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const sanitizeAssetUrl = (url) =>
    typeof url === 'string' && /^assets\//.test(url) ? url : 'assets/hero-accessories.jpg';

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
          if (formStatus) {
            formStatus.textContent = 'Maximum 3 photos allowed — extras were removed.';
            formStatus.className = 'form-status error';
          }
          combined = combined.slice(0, 3);
        } else if (formStatus) {
          formStatus.className = 'form-status';
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

      if (phoneError) phoneError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (formStatus) formStatus.className = 'form-status';

      const deviceText = deviceSelect?.selectedOptions?.[0]?.textContent?.trim() || 'N/A';
      const issueText = issueSelect?.selectedOptions?.[0]?.textContent?.trim() || 'N/A';
      const descText = issueDescription?.value?.trim() || 'N/A';
      const phoneText = customerPhone?.value?.trim() || '';
      const emailText = customerEmail?.value?.trim() || '';

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const phoneDigits = phoneText.replace(/\D/g, '');
      const uniqueDigits = new Set(phoneDigits.split(''));

      if (phoneDigits.length < 10 || phoneDigits.length > 15 || uniqueDigits.size < 3) {
        if (phoneError) phoneError.textContent = 'Please enter a valid phone number (10–15 digits).';
        customerPhone?.focus();
        return;
      }
      if (!emailRegex.test(emailText)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
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
          if (formStatus) {
            formStatus.textContent = 'Each photo must be under 2MB. Please remove or choose a smaller file.';
            formStatus.className = 'form-status error';
          }
          return;
        }
        attachments = (
          await Promise.all(selectedPhotos.map((file) => resizeImage(file)))
        ).filter(Boolean);
      } catch (e) {
        console.error('Failed to read attachments', e);
        if (formStatus) {
          formStatus.textContent = 'Could not read attached photos. Please try again.';
          formStatus.className = 'form-status error';
        }
        return;
      }

      const payload = {
        device: deviceText,
        issue: issueText,
        description: descText,
        phone: phoneText,
        email: emailText,
        attachments
      };

      if (quoteSubmit) {
        quoteSubmit.disabled = true;
        quoteSubmit.textContent = 'Sending…';
      }

      try {
        const response = await fetch('/api/send-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Failed to send');
        }
        if (formStatus) {
          formStatus.textContent = 'Thanks! Your request was sent. We will contact you shortly.';
          formStatus.className = 'form-status success';
        }
        quoteForm?.reset();
        selectedPhotos.splice(0);
        renderPhotoChips();
      } catch (err) {
        if (formStatus) {
          formStatus.textContent = 'Could not send your request. Please try again.';
          formStatus.className = 'form-status error';
        }
        console.error(err);
      } finally {
        if (quoteSubmit) {
          quoteSubmit.disabled = false;
          quoteSubmit.textContent = 'Get my tailored quote';
        }
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
      // Try Vercel Blob-backed API first (populated via admin panel)
      const apiRes = await fetch('/api/products');
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (Object.keys(apiData).length > 0) {
          products = apiData;
          return;
        }
      }
    } catch (e) {
      // API unavailable — fall through to CSV
    }

    try {
      // CSV fallback
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
    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'product-item';
      const imgSrc = sanitizeAssetUrl((item.imgs && item.imgs[0]) || 'assets/hero-accessories.jpg');
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = item.name;
      img.loading = 'lazy';
      const nameDiv = document.createElement('div');
      nameDiv.className = 'product-name';
      nameDiv.textContent = item.name;
      div.appendChild(img);
      div.appendChild(nameDiv);
      div.addEventListener('click', () => openProductDetail(item));
      productList.appendChild(div);
    });
    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
  };

  const openProductDetail = (item) => {
    if (!productDetailModal || !productDetailContent) return;
    const rawImgs = item.imgs && item.imgs.length ? item.imgs : ['assets/hero-accessories.jpg'];
    const imgs = rawImgs.map(sanitizeAssetUrl);

    productDetailContent.innerHTML = '';

    const galleryMain = document.createElement('div');
    galleryMain.className = 'product-gallery-main';
    const mainImg = document.createElement('img');
    mainImg.src = imgs[0];
    mainImg.alt = item.name;
    mainImg.loading = 'lazy';
    galleryMain.appendChild(mainImg);

    const thumbsDiv = document.createElement('div');
    thumbsDiv.className = 'product-thumbs';
    const thumbEls = imgs.map((src, i) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.dataset.idx = i;
      thumb.className = i === 0 ? 'active' : '';
      thumb.alt = item.name;
      thumb.loading = 'lazy';
      return thumb;
    });
    thumbEls.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbEls.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.getAttribute('src');
      });
      thumbsDiv.appendChild(thumb);
    });

    const nameDiv = document.createElement('div');
    nameDiv.className = 'product-name';
    nameDiv.textContent = item.name;

    productDetailContent.appendChild(galleryMain);
    productDetailContent.appendChild(thumbsDiv);
    productDetailContent.appendChild(nameDiv);

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

  const openTermsModal = (event) => {
    event.preventDefault();
    termsModal?.classList.add('active');
    termsModal?.setAttribute('aria-hidden', 'false');
  };

  termsOpen?.addEventListener('click', openTermsModal);
  document.getElementById('footer-terms-link')?.addEventListener('click', openTermsModal);

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
      termsContent.innerHTML = '';
      paragraphs.forEach((p) => {
        const el = document.createElement('p');
        el.textContent = p.replace(/\n/g, ' ');
        termsContent.appendChild(el);
      });
    } catch (e) {
      console.error('Could not load terms content', e);
      termsContent.innerHTML = '<p>Terms are temporarily unavailable. Please contact us for details.</p>';
    }
  };

  loadTerms();

  loadProducts();

  const renderReviewCards = (cleanReviews) => {
    if (!reviewsGrid) return;
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

        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.textContent = '"';

        const reviewP = document.createElement('p');
        reviewP.textContent = rev.reviewText || 'No review text provided.';

        const authorDiv = document.createElement('div');
        authorDiv.className = 'author';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = (rev.author || 'A').slice(0, 2).toUpperCase();

        const authorInfo = document.createElement('div');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name';
        nameDiv.textContent = rev.author || 'Anonymous';
        const metaDiv = document.createElement('div');
        metaDiv.className = 'meta';
        metaDiv.textContent = `Rating: ${rev.rating || 'N/A'} ★${rev.meta ? ' • ' + rev.meta : ''}`;

        authorInfo.appendChild(nameDiv);
        authorInfo.appendChild(metaDiv);
        authorDiv.appendChild(avatarDiv);
        authorDiv.appendChild(authorInfo);

        card.appendChild(quoteDiv);
        card.appendChild(reviewP);
        card.appendChild(authorDiv);
        reviewsGrid.appendChild(card);
      }
      setTimeout(() => reviewsGrid.classList.remove('fade'), 300);
      page = (page + 1) % Math.max(1, Math.ceil(cleanReviews.length / reviewsPerPage));
    };

    renderReviews();
    if (cleanReviews.length > reviewsPerPage) {
      setInterval(renderReviews, 5000);
    }
  };

  // Load reviews — tries Google Places API first, falls back to CSV
  const loadReviews = async () => {
    if (!reviewsGrid) return;
    try {
      // Try the live Google Places API endpoint
      const apiRes = await fetch('/api/reviews');
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mapped = data.reviews.map((r) => ({
            author: r.author,
            rating: String(r.rating),
            reviewText: r.text,
            meta: r.relativeTime || ''
          }));
          if (reviewsLoading) reviewsLoading.remove();
          renderReviewCards(mapped);
          return;
        }
      }
    } catch (e) {
      // API unavailable — fall through to CSV
    }

    // CSV fallback
    try {
      const res = await fetch('assets/reviews.csv');
      if (!res.ok) throw new Error('Failed to load reviews');
      const text = await res.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        reviewsGrid.innerHTML = '<p>No reviews available right now.</p>';
        return;
      }
      const parsed = lines.slice(1).map((line) => {
        const cols = line.split(',');
        const author = (cols.shift() || '').trim();
        const rating = (cols.shift() || '').trim();
        const meta = cols.length > 1 ? (cols.pop() || '').trim() : '';
        const reviewText = cols.join(',').trim();
        return { author, rating, reviewText, meta };
      });

      const cleanReviews = parsed.filter((r) => r.author || r.reviewText);
      if (reviewsLoading) reviewsLoading.remove();
      renderReviewCards(cleanReviews);
    } catch (e) {
      if (reviewsGrid) {
        reviewsGrid.innerHTML = '<p>Could not load reviews right now.</p>';
      }
      console.error(e);
    }
  };

  loadReviews();
});

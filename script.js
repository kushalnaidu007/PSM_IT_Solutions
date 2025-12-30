document.addEventListener('DOMContentLoaded', async () => {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const deviceSelect = document.getElementById('device-type');
  const seriesSelect = document.getElementById('device-series');
  const modelSelect = document.getElementById('device-model');
  const issueSelect = document.getElementById('issue');
  const deviceIcon = document.getElementById('device-icon');
  const issueIcon = document.getElementById('issue-icon');
  const summaryDevice = document.getElementById('summary-device');
  const summaryModel = document.getElementById('summary-model');
  const summaryIssue = document.getElementById('summary-issue');
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

  // Form options data
  let devices = [];
  let issues = [];

  const defaultDevices = [
    {
      id: 'iphone',
      label: 'iPhone',
      icon: '📱',
      series: [
        { id: 'iphone15', label: 'iPhone 15 series', models: ['15 Pro Max', '15 Pro', '15 Plus', '15'] },
        { id: 'iphone14', label: 'iPhone 14 series', models: ['14 Pro Max', '14 Pro', '14 Plus', '14'] },
        { id: 'iphone13', label: 'iPhone 13 series', models: ['13 Pro Max', '13 Pro', '13 mini', '13'] },
        { id: 'iphonese', label: 'iPhone SE', models: ['SE (3rd gen)', 'SE (2nd gen)'] }
      ]
    },
    {
      id: 'ipad',
      label: 'iPad',
      icon: '📲',
      series: [
        { id: 'ipadpro', label: 'iPad Pro', models: ['12.9"', '11"'] },
        { id: 'ipadair', label: 'iPad Air', models: ['Air (M2)', 'Air (M1)'] },
        { id: 'ipadmini', label: 'iPad mini', models: ['Mini (6th gen)', 'Mini (5th gen)'] },
        { id: 'ipad', label: 'iPad', models: ['iPad 10th gen', 'iPad 9th gen', 'iPad 8th gen'] }
      ]
    },
    {
      id: 'macbook',
      label: 'MacBook',
      icon: '💻',
      series: [
        { id: 'air', label: 'MacBook Air', models: ['Air 15" M2', 'Air 13" M2', 'Air 13" M1'] },
        { id: 'pro14', label: 'MacBook Pro 14"', models: ['M3', 'M2', 'M1'] },
        { id: 'pro16', label: 'MacBook Pro 16"', models: ['M3', 'M2', 'M1'] },
        { id: 'pro13', label: 'MacBook Pro 13"', models: ['M2', 'M1'] }
      ]
    },
    {
      id: 'apple-watch',
      label: 'Apple Watch',
      icon: '⌚',
      series: [
        { id: 'series9', label: 'Series 9', models: ['45mm', '41mm'] },
        { id: 'series8', label: 'Series 8', models: ['45mm', '41mm'] },
        { id: 'se', label: 'SE', models: ['44mm', '40mm'] }
      ]
    },
    {
      id: 'console',
      label: 'Gaming Console',
      icon: '🎮',
      series: [
        { id: 'ps', label: 'PlayStation', models: ['PS5', 'PS4 Pro', 'PS4 Slim'] },
        { id: 'xbox', label: 'Xbox', models: ['Series X', 'Series S', 'Xbox One X'] },
        { id: 'nintendo', label: 'Nintendo', models: ['Switch OLED', 'Switch', 'Switch Lite'] }
      ]
    },
    {
      id: 'android-phone',
      label: 'Android phone',
      icon: '📱',
      series: [
        { id: 'samsung-s', label: 'Samsung Galaxy S', models: ['S24', 'S23', 'S22'] },
        { id: 'samsung-a', label: 'Samsung Galaxy A', models: ['A55', 'A54', 'A34'] },
        { id: 'pixel', label: 'Google Pixel', models: ['8 Pro', '8', '7a', '7'] },
        { id: 'oneplus', label: 'OnePlus', models: ['12', '11', 'Nord series'] }
      ]
    },
    {
      id: 'android-tablet',
      label: 'Android tablet',
      icon: '📲',
      series: [
        { id: 'tab-s', label: 'Samsung Galaxy Tab S', models: ['S9', 'S8', 'S7'] },
        { id: 'tab-a', label: 'Samsung Galaxy Tab A', models: ['A9+', 'A8'] },
        { id: 'lenovo-tab', label: 'Lenovo Tab', models: ['P series', 'M series'] }
      ]
    },
    {
      id: 'windows-laptop',
      label: 'Windows laptop',
      icon: '💻',
      series: [
        { id: 'dell', label: 'Dell', models: ['XPS', 'Inspiron', 'Latitude'] },
        { id: 'hp', label: 'HP', models: ['Spectre', 'Envy', 'Pavilion', 'Omen'] },
        { id: 'lenovo', label: 'Lenovo', models: ['ThinkPad', 'Yoga', 'Legion'] }
      ]
    },
    {
      id: 'other',
      label: 'Other device',
      icon: '🛠️',
      series: [{ id: 'other-series', label: 'Other series', models: ['Other model'] }]
    }
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
      seriesId: getIdx('series_id'),
      seriesLabel: getIdx('series_label'),
      model: getIdx('model'),
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
        const sId = (cols[idx.seriesId] || '').trim();
        const sLabel = (cols[idx.seriesLabel] || '').trim();
        const model = (cols[idx.model] || '').trim();
        if (!dId || !dLabel) return;
        if (!deviceMap.has(dId)) {
          deviceMap.set(dId, { id: dId, label: dLabel, icon: dIcon, series: [] });
        }
        if (sId && sLabel) {
          const device = deviceMap.get(dId);
          let seriesObj = device.series.find((s) => s.id === sId);
          if (!seriesObj) {
            seriesObj = { id: sId, label: sLabel, models: [] };
            device.series.push(seriesObj);
          }
          if (model) {
            seriesObj.models.push(model);
          }
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

  if (deviceSelect && seriesSelect && modelSelect && issueSelect) {
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

    const updateSummary = () => {
      const selectedDevice = devices.find((d) => d.id === deviceSelect.value);
      const selectedSeries = selectedDevice?.series.find((s) => s.id === seriesSelect.value);
      const selectedModel = modelSelect.value;
      const selectedIssue = issues.find((i) => i.id === issueSelect.value);

      deviceIcon.textContent = selectedDevice?.icon || '📱';
      issueIcon.textContent = selectedIssue?.icon || '🛠️';

      summaryDevice.textContent = selectedDevice
        ? `${selectedDevice.label}${selectedSeries ? ' • ' + selectedSeries.label : ''}`
        : 'Select a device type to begin.';

      summaryModel.textContent = selectedModel ? `Model: ${selectedModel}` : 'Waiting for model...';
      summaryIssue.textContent = selectedIssue ? `Issue: ${selectedIssue.label}` : 'Pick an issue to continue.';
    };

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
    seriesSelect.disabled = true;
    modelSelect.disabled = true;
    issueSelect.disabled = true;

    deviceSelect.addEventListener('change', () => {
      const selectedDevice = devices.find((device) => device.id === deviceSelect.value);
      buildOptions(
        seriesSelect,
        'Select a series',
        selectedDevice ? selectedDevice.series.map((series) => ({ value: series.id, label: series.label })) : []
      );
      modelSelect.innerHTML = '<option disabled selected>Select a model</option>';
      modelSelect.disabled = true;
      issueSelect.disabled = !selectedDevice;
      updateSummary();
    });

    seriesSelect.addEventListener('change', () => {
      const selectedDevice = devices.find((device) => device.id === deviceSelect.value);
      const selectedSeries = selectedDevice?.series.find((series) => series.id === seriesSelect.value);
      buildOptions(
        modelSelect,
        'Select a model',
        selectedSeries ? selectedSeries.models.map((model) => ({ value: model, label: model })) : []
      );
      updateSummary();
    });

    modelSelect.addEventListener('change', updateSummary);
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
    const imgIdx = headers.indexOf('img');
    if (categoryIdx === -1 || nameIdx === -1 || imgIdx === -1) return {};
    const map = {};
    lines.slice(1).forEach((line) => {
      const cols = line.split(',');
      const category = (cols[categoryIdx] || '').trim();
      const name = (cols[nameIdx] || '').trim();
      const img = (cols[imgIdx] || '').trim();
      if (!category || !name || !img) return;
      if (!map[category]) map[category] = [];
      map[category].push({ name, img });
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
        iphone: [
          { name: 'iPhone 15 Pro', img: 'assets/hero-phone.jpg' },
          { name: 'iPhone 14', img: 'assets/hero-phone.jpg' },
          { name: 'iPhone 13', img: 'assets/hero-phone.jpg' }
        ],
        ipad: [
          { name: 'iPad Pro 12.9"', img: 'assets/hero-tablet.jpg' },
          { name: 'iPad Air', img: 'assets/hero-tablet.jpg' },
          { name: 'iPad mini', img: 'assets/hero-tablet.jpg' }
        ],
        macbook: [
          { name: 'MacBook Air M2', img: 'assets/hero-laptop.jpg' },
          { name: 'MacBook Pro 14"', img: 'assets/hero-laptop.jpg' },
          { name: 'MacBook Pro 16"', img: 'assets/hero-laptop.jpg' }
        ],
        watch: [
          { name: 'Apple Watch Series 9', img: 'assets/hero-watch.jpg' },
          { name: 'Apple Watch SE', img: 'assets/hero-watch.jpg' }
        ],
        accessories: [
          { name: 'MagSafe charger', img: 'assets/hero-accessories.jpg' },
          { name: 'Premium cases', img: 'assets/hero-accessories.jpg' },
          { name: 'Power banks', img: 'assets/hero-accessories.jpg' }
        ],
        audio: [
          { name: 'AirPods', img: 'assets/hero-audio.jpg' },
          { name: 'Over-ear headphones', img: 'assets/hero-audio.jpg' },
          { name: 'Bluetooth speakers', img: 'assets/hero-audio.jpg' }
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
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="product-name">${item.name}</div>
      `;
      productList.appendChild(div);
    });
    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
  };

  const closeProductModal = () => {
    if (!productModal) return;
    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
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

  productModal?.addEventListener('click', (event) => {
    if (event.target === productModal) {
      closeProductModal();
    }
  });

  loadProducts();
});

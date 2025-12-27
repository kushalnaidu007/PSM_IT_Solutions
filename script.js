document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const deviceSelect = document.getElementById('device-type');
  const brandSelect = document.getElementById('device-brand');
  const modelSelect = document.getElementById('device-model');
  const issueSelect = document.getElementById('issue');
  const deviceIcon = document.getElementById('device-icon');
  const issueIcon = document.getElementById('issue-icon');
  const summaryDevice = document.getElementById('summary-device');
  const summaryModel = document.getElementById('summary-model');
  const summaryIssue = document.getElementById('summary-issue');
  const quoteForm = document.getElementById('quote-form');
  const issuePhotos = document.getElementById('issue-photos');
  const photoList = document.getElementById('photo-list');
  const whatsappFab = document.getElementById('whatsapp-fab');
  const whatsappModal = document.getElementById('whatsapp-modal');
  const whatsappClose = document.getElementById('whatsapp-close');
  const whatsappForm = document.getElementById('whatsapp-form');
  const whatsappMessage = document.getElementById('whatsapp-message');
  const whatsappNumber = '447741438569';

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

  if (deviceSelect && brandSelect && modelSelect && issueSelect) {
    const devices = [
      {
        id: 'phone',
        label: 'Phone',
        icon: '📱',
        brands: [
          { id: 'apple', label: 'Apple', models: ['iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone SE'] },
          { id: 'samsung', label: 'Samsung', models: ['Galaxy S23', 'Galaxy S22', 'Galaxy A54', 'Galaxy Fold'] },
          { id: 'google', label: 'Google', models: ['Pixel 8', 'Pixel 7a', 'Pixel 6'] },
        ],
      },
      {
        id: 'tablet',
        label: 'Tablet',
        icon: '📲',
        brands: [
          { id: 'ipad', label: 'Apple iPad', models: ['iPad Pro', 'iPad Air', 'iPad Mini', 'iPad 10th Gen'] },
          { id: 'samsung-tablet', label: 'Samsung Galaxy Tab', models: ['Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A8'] },
        ],
      },
      {
        id: 'laptop',
        label: 'Laptop',
        icon: '💻',
        brands: [
          { id: 'macbook', label: 'Apple MacBook', models: ['MacBook Air M2', 'MacBook Pro 14"', 'MacBook Pro 13"'] },
          { id: 'windows', label: 'Windows Laptop', models: ['Dell XPS', 'HP Spectre', 'Lenovo ThinkPad', 'Razer Blade'] },
        ],
      },
      {
        id: 'wearable',
        label: 'Wearable',
        icon: '⌚',
        brands: [
          { id: 'apple-watch', label: 'Apple Watch', models: ['Series 9', 'Series 8', 'SE'] },
          { id: 'fitbit', label: 'Fitbit', models: ['Versa 4', 'Sense 2', 'Charge 6'] },
          { id: 'samsung-watch', label: 'Samsung Galaxy Watch', models: ['Watch6', 'Watch5'] },
        ],
      },
      {
        id: 'console',
        label: 'Gaming Console',
        icon: '🎮',
        brands: [
          { id: 'ps', label: 'PlayStation', models: ['PS5', 'PS4 Pro', 'PS4 Slim'] },
          { id: 'xbox', label: 'Xbox', models: ['Series X', 'Series S', 'Xbox One X'] },
          { id: 'nintendo', label: 'Nintendo', models: ['Switch OLED', 'Switch', 'Switch Lite'] },
        ],
      },
      {
        id: 'other',
        label: 'Other device',
        icon: '🛠️',
        brands: [{ id: 'other-brand', label: 'Other brand', models: ['Other model'] }],
      },
    ];

    const issues = [
      { id: 'screen', label: 'Screen cracked', icon: '🪟', estimate: 'Screens typically £69–£199 depending on model.' },
      { id: 'battery', label: 'Battery draining', icon: '🔋', estimate: 'Battery and power jobs start at £49.' },
      { id: 'water', label: 'Water damage', icon: '💧', estimate: 'Deep clean and recovery on a no-fix-no-fee basis.' },
      { id: 'charging', label: 'Charging port / power', icon: '⚡', estimate: 'Port and power fixes start at £59.' },
      { id: 'camera', label: 'Camera / audio', icon: '📸', estimate: 'Camera or speaker repairs start at £69.' },
      { id: 'data', label: 'Data recovery', icon: '💾', estimate: 'Data-first recovery with custom pricing per case.' },
      { id: 'other', label: 'Other issue', icon: '🧰', estimate: 'We’ll review details/photos and confirm pricing after inspection.' },
    ];

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
      const selectedBrand = selectedDevice?.brands.find((b) => b.id === brandSelect.value);
      const selectedModel = modelSelect.value;
      const selectedIssue = issues.find((i) => i.id === issueSelect.value);

      deviceIcon.textContent = selectedDevice?.icon || '📱';
      issueIcon.textContent = selectedIssue?.icon || '🛠️';

      summaryDevice.textContent = selectedDevice
        ? `${selectedDevice.label}${selectedBrand ? ' • ' + selectedBrand.label : ''}`
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
    brandSelect.disabled = true;
    modelSelect.disabled = true;
    issueSelect.disabled = true;

    deviceSelect.addEventListener('change', () => {
      const selectedDevice = devices.find((device) => device.id === deviceSelect.value);
      buildOptions(
        brandSelect,
        'Select a brand',
        selectedDevice ? selectedDevice.brands.map((brand) => ({ value: brand.id, label: brand.label })) : []
      );
      modelSelect.innerHTML = '<option disabled selected>Select a model</option>';
      modelSelect.disabled = true;
      issueSelect.disabled = !selectedDevice;
      updateSummary();
    });

    brandSelect.addEventListener('change', () => {
      const selectedDevice = devices.find((device) => device.id === deviceSelect.value);
      const selectedBrand = selectedDevice?.brands.find((brand) => brand.id === brandSelect.value);
      buildOptions(
        modelSelect,
        'Select a model',
        selectedBrand ? selectedBrand.models.map((model) => ({ value: model, label: model })) : []
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

    quoteForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      updateSummary();
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
});

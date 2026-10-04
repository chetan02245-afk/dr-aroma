/* ==========================================================================
   D R AROMA — CLIENT-SIDE SPA ROUTER & VIEW CONTROLLER
   Manages page transitions without full reloads, keeping URL hash in sync.
   ========================================================================== */

import { escapeHtml, showNoticeModal } from './ui-modal.js';

export class AppRouter {
  constructor(options = {}) {
    this.products = options.products || [];
    this.cartManager = options.cartManager;
    this.checkoutManager = options.checkoutManager;
    this.views = document.querySelectorAll('.page-view');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.currentProduct = null;
    this.selectedSize = null;
    this.selectedCarrier = null;
    this.customMonogram = '';

    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Initial route
    this.handleRoute();

    // Setup shop filtering listeners
    this.setupShopFilters();
    // Setup PDP listeners
    this.setupPdpListeners();
    // Setup visit/booking form
    this.setupVisitBookingForm();
  }

  handleRoute() {
    const rawHash = window.location.hash || '#home';
    const hashParts = rawHash.replace(/^#/, '').split('/');
    const route = hashParts[0] || 'home';
    const param = hashParts[1] || null;

    // Close mobile menu if open
    const navLinksList = document.querySelector('.nav-links');
    if (navLinksList) navLinksList.classList.remove('open');

    // Update active nav link
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${route}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Hide all views
    this.views.forEach(view => {
      view.style.display = 'none';
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Route dispatch
    switch (route) {
      case 'home':
        this.showView('#view-home');
        break;

      case 'shop':
        this.showView('#view-shop');
        this.renderShopCatalog();
        break;

      case 'product':
        this.showView('#view-pdp');
        this.renderPdp(param);
        break;

      case 'checkout':
        this.showView('#view-checkout');
        if (this.checkoutManager) {
          this.checkoutManager.renderCheckout();
        }
        break;

      case 'story':
        this.showView('#view-story');
        break;

      case 'visit':
        this.showView('#view-visit');
        break;

      case 'privacy':
        this.showView('#view-policy');
        this.renderPolicy('privacy');
        break;

      case 'terms':
        this.showView('#view-policy');
        this.renderPolicy('terms');
        break;

      case 'refund':
        this.showView('#view-policy');
        this.renderPolicy('refund');
        break;

      case 'cookies':
        this.showView('#view-policy');
        this.renderPolicy('cookies');
        break;

      default:
        this.showView('#view-home');
        break;
    }
  }

  showView(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.style.display = 'block';
    }
  }

  /* ------------------------------------------------------------------------
     Shop & Catalog Filtering
     ------------------------------------------------------------------------ */
  setupShopFilters() {
    const searchInput = document.querySelector('#shop-search');
    const sortSelect = document.querySelector('#shop-sort');
    const categoryRadios = document.querySelectorAll('input[name="shop-category"]');
    const familyCheckboxes = document.querySelectorAll('input[name="shop-family"]');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.renderShopCatalog());
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.renderShopCatalog());
    }
    categoryRadios.forEach(r => r.addEventListener('change', () => this.renderShopCatalog()));
    familyCheckboxes.forEach(c => c.addEventListener('change', () => this.renderShopCatalog()));
  }

  renderShopCatalog() {
    const grid = document.querySelector('#shop-products-grid');
    const countEl = document.querySelector('#shop-products-count');
    if (!grid) return;

    const searchTerm = (document.querySelector('#shop-search')?.value || '').toLowerCase();
    const selectedCategory = document.querySelector('input[name="shop-category"]:checked')?.value || 'all';
    const sortVal = document.querySelector('#shop-sort')?.value || 'featured';

    const selectedFamilies = Array.from(document.querySelectorAll('input[name="shop-family"]:checked')).map(cb => cb.value);

    let filtered = this.products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm) || 
                          p.subtitle.toLowerCase().includes(searchTerm) ||
                          p.pyramid.top.notes.toLowerCase().includes(searchTerm) ||
                          p.pyramid.heart.notes.toLowerCase().includes(searchTerm) ||
                          p.pyramid.base.notes.toLowerCase().includes(searchTerm);

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchFamily = selectedFamilies.length === 0 || selectedFamilies.includes(p.family);

      return matchSearch && matchCategory && matchFamily;
    });

    // Sorting
    if (sortVal === 'price-low') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortVal === 'price-high') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    }

    if (countEl) {
      countEl.textContent = `Displaying ${filtered.length} authentic formulations`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <h3 style="font-family: var(--font-serif-classic); font-size: 1.5rem; color: var(--color-maroon);">No formulations matched your criteria</h3>
          <p style="color: var(--color-charcoal-muted); margin-top: 8px;">Try clearing some filters or searching for ingredients like Rose, Oudh, Sandalwood, or Saffron.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => this.createProductCardHtml(p)).join('');
  }

  createProductCardHtml(product) {
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name} - Handcrafted Attar Perfume D R Aroma Jaipur" class="product-image" loading="lazy">
          <div class="product-badges">
            <span class="badge-gold">Est. 1960</span>
            ${product.alcoholFree ? '<span class="badge-amber">Pure Oil</span>' : ''}
          </div>
          <div class="product-quick-actions">
            <a href="#product/${product.id}" class="btn btn-gold btn-sm" style="flex: 1;">Customize & Order</a>
          </div>
        </div>
        <div class="product-info">
          <div class="product-family">${product.familyName}</div>
          <h3 class="product-title">
            <a href="#product/${product.id}">${product.name}</a>
          </h3>
          <div class="product-notes-summary">
            <span><strong>Notes:</strong> ${product.pyramid.top.notes.split(',')[0]} • ${product.pyramid.heart.notes.split(',')[0]} • Sandalwood</span>
          </div>
          <p class="product-desc">${product.story}</p>
          <div class="product-footer">
            <div class="product-price">
              <small>From</small> ₹${product.basePrice.toLocaleString('en-IN')}
            </div>
            <a href="#product/${product.id}" class="btn btn-outline-gold btn-sm">Select Vessel</a>
          </div>
        </div>
      </article>
    `;
  }

  /* ------------------------------------------------------------------------
     Product Detail Page (PDP) & Customizer
     ------------------------------------------------------------------------ */
  renderPdp(productId) {
    const product = this.products.find(p => p.id === productId) || this.products[0];
    this.currentProduct = product;
    this.selectedSize = product.sizes[0];
    this.selectedCarrier = product.carrierBases[0];
    this.customMonogram = '';

    const titleEl = document.querySelector('#pdp-title');
    const subtitleEl = document.querySelector('#pdp-subtitle');
    const imageEl = document.querySelector('#pdp-image');
    const storyEl = document.querySelector('#pdp-story');
    const harvestEl = document.querySelector('#pdp-harvest');
    const distillationEl = document.querySelector('#pdp-distillation');
    const originEl = document.querySelector('#pdp-origin');

    if (titleEl) titleEl.textContent = product.title;
    if (subtitleEl) subtitleEl.textContent = product.subtitle;
    if (imageEl) {
      imageEl.src = product.image;
      imageEl.alt = `${product.name} Handcrafted Luxury Attar`;
    }
    if (storyEl) storyEl.textContent = product.story;
    if (harvestEl) harvestEl.textContent = product.harvestSeason;
    if (distillationEl) distillationEl.textContent = product.distillationMethod;
    if (originEl) originEl.textContent = product.origin;

    // Render Pyramid
    const pyramidContainer = document.querySelector('#pdp-pyramid-container');
    if (pyramidContainer) {
      pyramidContainer.innerHTML = `
        <div class="note-pyramid">
          <div class="pyramid-tier tier-top">
            <div class="pyramid-tier-title">
              <span>Top Notes</span>
              <span class="pyramid-tier-duration">${product.pyramid.top.duration}</span>
            </div>
            <div class="pyramid-tier-notes">${product.pyramid.top.notes}</div>
          </div>
          <div class="pyramid-tier tier-heart">
            <div class="pyramid-tier-title">
              <span>Heart Notes</span>
              <span class="pyramid-tier-duration">${product.pyramid.heart.duration}</span>
            </div>
            <div class="pyramid-tier-notes">${product.pyramid.heart.notes}</div>
          </div>
          <div class="pyramid-tier tier-base">
            <div class="pyramid-tier-title">
              <span>Base Notes</span>
              <span class="pyramid-tier-duration">${product.pyramid.base.duration}</span>
            </div>
            <div class="pyramid-tier-notes">${product.pyramid.base.notes}</div>
          </div>
        </div>
      `;
    }

    // Render Vessel Size Buttons
    const sizeContainer = document.querySelector('#pdp-size-selector');
    if (sizeContainer) {
      sizeContainer.innerHTML = product.sizes.map((s, idx) => `
        <button type="button" class="custom-pill-btn ${idx === 0 ? 'active' : ''}" data-pdp-size="${s.id}">
          ${s.label}
        </button>
      `).join('');
    }

    // Render Carrier Buttons
    const carrierContainer = document.querySelector('#pdp-carrier-selector');
    if (carrierContainer) {
      carrierContainer.innerHTML = product.carrierBases.map((c, idx) => `
        <button type="button" class="custom-pill-btn ${idx === 0 ? 'active' : ''}" data-pdp-carrier="${c.id}">
          ${c.label} ${c.priceAdd > 0 ? `(+₹${c.priceAdd})` : ''}
        </button>
      `).join('');
    }

    // Reset monogram input
    const monoInput = document.querySelector('#pdp-monogram-input');
    if (monoInput) monoInput.value = '';

    this.updatePdpPrice();
  }

  setupPdpListeners() {
    // Size button clicks
    document.querySelector('#pdp-size-selector')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pdp-size]');
      if (!btn || !this.currentProduct) return;
      document.querySelectorAll('#pdp-size-selector [data-pdp-size]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sizeId = btn.dataset.pdpSize;
      this.selectedSize = this.currentProduct.sizes.find(s => s.id === sizeId);
      this.updatePdpPrice();
    });

    // Carrier button clicks
    document.querySelector('#pdp-carrier-selector')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pdp-carrier]');
      if (!btn || !this.currentProduct) return;
      document.querySelectorAll('#pdp-carrier-selector [data-pdp-carrier]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const carrierId = btn.dataset.pdpCarrier;
      this.selectedCarrier = this.currentProduct.carrierBases.find(c => c.id === carrierId);
      this.updatePdpPrice();
    });

    // Monogram input
    document.querySelector('#pdp-monogram-input')?.addEventListener('input', (e) => {
      this.customMonogram = e.target.value.toUpperCase().slice(0, 3);
    });

    // Add to cart from PDP
    document.querySelector('#pdp-add-cart-btn')?.addEventListener('click', () => {
      if (!this.currentProduct) return;
      const qtyInput = document.querySelector('#pdp-quantity-input');
      const quantity = parseInt(qtyInput?.value, 10) || 1;

      this.cartManager.addItem(this.currentProduct, {
        size: this.selectedSize,
        carrier: this.selectedCarrier,
        monogram: this.customMonogram,
        quantity: quantity
      });
    });
  }

  updatePdpPrice() {
    if (!this.currentProduct || !this.selectedSize || !this.selectedCarrier) return;
    const unitPrice = Math.round(
      this.currentProduct.basePrice * (this.selectedSize.priceMultiplier || 1) + (this.selectedCarrier.priceAdd || 0)
    );
    const priceEl = document.querySelector('#pdp-price-val');
    if (priceEl) {
      priceEl.textContent = `₹${unitPrice.toLocaleString('en-IN')}`;
    }
  }

  /* ------------------------------------------------------------------------
     Private Atelier Booking Form (Visit Page)
     ------------------------------------------------------------------------ */
  setupVisitBookingForm() {
    const form = document.querySelector('#atelier-booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawDate = document.querySelector('#booking-date')?.value;
      const rawName = document.querySelector('#booking-name')?.value;
      const rawTime = document.querySelector('#booking-time')?.value;

      const name = escapeHtml(rawName || 'Valued Patron');
      const date = escapeHtml(rawDate || 'Upcoming Date');
      const time = escapeHtml(rawTime || 'Scheduled Time');

      showNoticeModal({
        title: 'Appointment Reserved',
        subtitle: 'Tripolia Bazar Atelier, Jaipur',
        message: `Your private bespoke blending consultation has been reserved for <strong>${name}</strong> on <strong>${date}</strong> at <strong>${time}</strong>.<br><br>Our master perfumer looks forward to welcoming you to our historic counter in Tripolia Bazar.`,
        buttonText: 'Acknowledge'
      });
      form.reset();
    });
  }

  /* ------------------------------------------------------------------------
     Legal & Policy Content Renderer
     ------------------------------------------------------------------------ */
  renderPolicy(type) {
    const titleEl = document.querySelector('#policy-doc-title');
    const contentEl = document.querySelector('#policy-doc-content');
    if (!titleEl || !contentEl) return;

    if (type === 'privacy') {
      titleEl.textContent = 'Privacy Policy — D R Aroma';
      contentEl.innerHTML = `
        <p><em>Last updated: September 2026 • Compliant with Indian Digital Personal Data Protection (DPDP) Act and global privacy standards.</em></p>
        
        <h2>1. Our Sacred Commitment to Data Privacy</h2>
        <p>At D R Aroma (Est. 1960, Tripolia Bazar, Jaipur), our reputation is built on trust. We collect only the minimum necessary personal data required to fulfill your bespoke fragrance orders and communicate regarding appointments.</p>
        
        <h2>2. Data We Collect</h2>
        <ul>
          <li><strong>Bespoke Order Information:</strong> Full name, contact phone number, delivery address, and formulation customizations.</li>
          <li><strong>Communication Data:</strong> Messages transmitted via our contact or atelier booking forms.</li>
          <li><strong>We DO NOT store financial card numbers or UPI PINs.</strong> All transactions are processed through secure, RBI-authorized simulated payment gateways.</li>
        </ul>

        <h2>3. Zero Sale of Personal Data</h2>
        <p>We do not sell, rent, or trade your personal data with third-party advertisers or data brokers under any circumstances.</p>

        <h2>4. Data Retention & Your Rights</h2>
        <p>You have the full right to review, update, or request the permanent deletion of your customer records by contacting our Tripolia Bazar atelier at <strong>concierge@draroma.in</strong>.</p>
      `;
    } else if (type === 'terms') {
      titleEl.textContent = 'Terms and Conditions of Service';
      contentEl.innerHTML = `
        <p><em>Last updated: September 2026 • D R Aroma, Tripolia Bazar, Jaipur, Rajasthan.</em></p>

        <h2>1. The Artisanal Nature of Our Craft</h2>
        <p>D R Aroma crafts small-batch, made-to-order pure attars and extrait fragrances. Because our formulations rely on seasonal botanical distillations (including harvest-specific Damask roses and aged Assam agarwood), subtle natural vintage variations in color and aroma may occur between batches.</p>

        <h2>2. Made-to-Order Formulations</h2>
        <p>Every bottle ordered through our website is hand-poured and custom-compounded upon receipt of your order. Once compounding has begun, cancellation is subject to our Refund Policy.</p>

        <h2>3. Fair Pricing & Quality Assurance</h2>
        <p>All prices are listed in Indian Rupees (INR) inclusive of applicable taxes. We are committed to artisanal care and time-honored perfumery traditions in all our handcrafted formulations.</p>
      `;
    } else if (type === 'refund') {
      titleEl.textContent = 'Bespoke Refund & Returns Policy';
      contentEl.innerHTML = `
        <p><em>Fair, transparent guidelines for customized craft goods.</em></p>

        <h2>1. Custom Formulations & Personal Hygiene</h2>
        <p>Due to the personal nature of fragrance and health regulations governing opened cosmetic items, customized made-to-order bottles cannot be restocked once seal is broken.</p>

        <h2>2. The D R Aroma Satisfaction Assurance</h2>
        <p>If your received formulation was damaged during insured transit or deviates significantly from your bespoke order specification, please notify us within <strong>48 hours</strong> of delivery. We will immediately dispatch a fresh, hand-compounded replacement at zero additional charge.</p>

        <h2>3. Atelier Consultation Adjustments</h2>
        <p>For patrons who visit our Tripolia Bazar shop or order custom formulations, our master perfumer offers complimentary olfactory profile recalibration if your skin chemistry requires formula adjustments.</p>
      `;
    } else if (type === 'cookies') {
      titleEl.textContent = 'Cookie Policy & Privacy Preferences';
      contentEl.innerHTML = `
        <p><em>Detailed transparency on cookies and local device storage.</em></p>

        <h2>1. What We Store</h2>
        <ul>
          <li><strong>Essential Storage:</strong> We use local storage solely to remember the fragrances currently in your Royal Chest (cart) and to record your cookie consent choice.</li>
          <li><strong>Zero Tracking Before Consent:</strong> No analytical or third-party marketing cookies are deployed without your explicit affirmative action.</li>
        </ul>

        <h2>2. Managing Your Preferences</h2>
        <p>You may adjust or revoke your cookie choices at any time using our floating cookie settings banner or by clicking <a href="#" class="open-cookie-settings" style="color: var(--color-gold-deep); text-decoration: underline;">Reopen Cookie Preferences</a>.</p>
      `;
    }
  }
}

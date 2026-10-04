/* ==========================================================================
   D R AROMA — CART SYSTEM & DRAWER MANAGEMENT
   Persistent localStorage state, custom options tracking,
   and dynamic shipping calculation.
   ========================================================================== */

import { escapeHtml } from './ui-modal.js';

export class CartManager {
  constructor() {
    this.storageKey = 'dr_aroma_cart';
    this.items = this.loadCart();
    this.freeShippingThreshold = 2000;

    this.drawerBackdrop = document.querySelector('.cart-drawer-backdrop');
    this.drawer = document.querySelector('.cart-drawer');
    this.itemsContainer = document.querySelector('.cart-items-list');
    this.subtotalEl = document.querySelector('.cart-subtotal-val');
    this.countBadges = document.querySelectorAll('.cart-count-badge');
    this.shippingProgressFill = document.querySelector('.cart-shipping-progress-fill');
    this.shippingStatusText = document.querySelector('.cart-shipping-status-text');

    this.initEventListeners();
    this.render();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }

  initEventListeners() {
    // Open drawer buttons
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer buttons & backdrop
    const closeBtn = document.querySelector('.cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());

    // Quantity updates & removals inside drawer
    if (this.itemsContainer) {
      this.itemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('[data-cart-action]');
        if (!target) return;
        const action = target.dataset.cartAction;
        const itemKey = target.dataset.itemKey;

        if (action === 'increase') {
          this.updateQuantity(itemKey, 1);
        } else if (action === 'decrease') {
          this.updateQuantity(itemKey, -1);
        } else if (action === 'remove') {
          this.removeItem(itemKey);
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.closeDrawer();
        window.location.hash = '#checkout';
      });
    }
  }

  openDrawer() {
    if (this.drawerBackdrop) this.drawerBackdrop.classList.add('active');
    if (this.drawer) this.drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    if (this.drawerBackdrop) this.drawerBackdrop.classList.remove('active');
    if (this.drawer) this.drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  addItem(product, options = {}) {
    const size = options.size || product.sizes[0];
    const carrier = options.carrier || product.carrierBases[0];
    const monogram = (options.monogram || '').trim();
    const quantity = parseInt(options.quantity, 10) || 1;

    // Calculate final unit price
    const unitPrice = Math.round(product.basePrice * (size.priceMultiplier || 1) + (carrier.priceAdd || 0));

    // Unique key identifying item configuration
    const itemKey = `${product.id}_${size.id}_${carrier.id}_${monogram.toUpperCase()}`;

    const existingIndex = this.items.findIndex(item => item.key === itemKey);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        key: itemKey,
        productId: product.id,
        name: product.name,
        image: product.image,
        categoryName: product.categoryName,
        sizeLabel: size.label,
        carrierLabel: carrier.label,
        monogram: monogram ? monogram.toUpperCase() : null,
        unitPrice: unitPrice,
        quantity: quantity
      });
    }

    this.saveCart();
    this.render();
    this.openDrawer();
    this.showToast(`Added "${product.name}" to your royal chest.`);
  }

  updateQuantity(itemKey, delta) {
    const itemIndex = this.items.findIndex(i => i.key === itemKey);
    if (itemIndex === -1) return;

    this.items[itemIndex].quantity += delta;
    if (this.items[itemIndex].quantity <= 0) {
      this.items.splice(itemIndex, 1);
    }

    this.saveCart();
    this.render();
  }

  removeItem(itemKey) {
    this.items = this.items.filter(i => i.key !== itemKey);
    this.saveCart();
    this.render();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.render();
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  render() {
    const subtotal = this.getSubtotal();
    const totalCount = this.getTotalCount();

    // Update count badges
    this.countBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update Subtotal text
    if (this.subtotalEl) {
      this.subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    // Update Free Shipping Progress Bar
    if (this.shippingProgressFill && this.shippingStatusText) {
      if (subtotal >= this.freeShippingThreshold) {
        this.shippingProgressFill.style.width = '100%';
        this.shippingStatusText.innerHTML = `✓ <strong>Complimentary Insured Royal Courier</strong> unlocked across India!`;
      } else {
        const remaining = this.freeShippingThreshold - subtotal;
        const progress = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
        this.shippingProgressFill.style.width = `${progress}%`;
        this.shippingStatusText.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for complimentary insured courier.`;
      }
    }

    // Render items list
    if (!this.itemsContainer) return;

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg style="width: 54px; height: 54px; fill: var(--color-gold); margin: 0 auto 16px auto; opacity: 0.7;" viewBox="0 0 24 24">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/>
          </svg>
          <h4 style="font-family: var(--font-serif-royal); font-size: 1.1rem; color: var(--color-maroon); margin-bottom: 8px;">Your Royal Chest is Empty</h4>
          <p style="font-size: 0.88rem; color: var(--color-charcoal-muted); margin-bottom: 24px;">Discover our heirloom attars and customizable fragrances distilled in Tripolia Bazar.</p>
          <a href="#shop" class="btn btn-gold btn-sm" onclick="document.querySelector('.cart-close-btn').click()">Explore Collections</a>
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-key="${escapeHtml(item.key)}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item-img" onerror="this.src='/images/ingredients-flatlay.jpg'">
        <div class="cart-item-details">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-customization">
            <div>• Vessel: <strong>${escapeHtml(item.sizeLabel)}</strong></div>
            <div>• Base: <strong>${escapeHtml(item.carrierLabel)}</strong></div>
            ${item.monogram ? `<div>• Engraved Seal: <span class="badge-gold">${escapeHtml(item.monogram)}</span></div>` : ''}
          </div>
          <div class="cart-item-pricing">
            <div class="cart-item-qty">
              <button class="cart-qty-btn" data-cart-action="decrease" data-item-key="${item.key}" aria-label="Decrease quantity">−</button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn" data-cart-action="increase" data-item-key="${item.key}" aria-label="Increase quantity">+</button>
            </div>
            <div style="font-family: var(--font-serif-classic); font-weight: 700; color: var(--color-maroon-mid);">
              ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}
            </div>
            <button class="btn-remove" data-cart-action="remove" data-item-key="${item.key}" aria-label="Remove item" style="color: var(--color-charcoal-subtle); font-size: 0.78rem; text-decoration: underline;">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  showToast(message) {
    let toast = document.querySelector('.site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'site-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--color-maroon-darkest);
        color: var(--color-cream);
        border: 1px solid var(--color-gold);
        border-radius: var(--radius-sm);
        padding: 14px 20px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        z-index: 3500;
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: var(--color-gold); font-size: 1.1rem;">✦</span> ${message}`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 3200);
  }
}

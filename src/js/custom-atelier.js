/* ==========================================================================
   D R AROMA — THE BESPOKE FRAGRANCE ATELIER (INTERACTIVE BUILDER)
   A bespoke perfume prescription builder highlighting the shop's
   craft, made-to-order, personalization-driven philosophy.
   ========================================================================== */

import { escapeHtml } from './ui-modal.js';

export class BespokeAtelier {
  constructor(cartManager, products) {
    this.cartManager = cartManager;
    this.bespokeProduct = products.find(p => p.id === 'bespoke-atelier-blend') || products[0];

    this.container = document.querySelector('#bespoke-atelier-section');
    this.resultContainer = document.querySelector('#atelier-result-box');
    this.state = {
      mood: 'darbar',
      intensity: 'attar',
      base: 'sandalwood',
      monogram: ''
    };

    this.initEventListeners();
    this.updatePrescription();
  }

  initEventListeners() {
    if (!this.container) return;

    // Listen to option clicks
    this.container.querySelectorAll('[data-atelier-option]').forEach(el => {
      el.addEventListener('click', (e) => {
        const optionType = el.dataset.atelierOption;
        const value = el.dataset.value;

        // Deselect siblings
        const parent = el.closest('.atelier-step-options');
        if (parent) {
          parent.querySelectorAll(`[data-atelier-option="${optionType}"]`).forEach(sibling => {
            sibling.classList.remove('selected');
          });
        }

        el.classList.add('selected');
        this.state[optionType] = value;
        this.updatePrescription();
      });
    });

    // Monogram input
    const monogramInput = document.querySelector('#atelier-monogram-input');
    if (monogramInput) {
      monogramInput.addEventListener('input', (e) => {
        this.state.monogram = e.target.value.toUpperCase().slice(0, 3);
        this.updatePrescription();
      });
    }

    // Add to cart from Atelier
    const addBtn = document.querySelector('#atelier-add-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addCustomBlendToCart();
      });
    }
  }

  updatePrescription() {
    if (!this.resultContainer) return;

    const moodNames = {
      darbar: { name: 'Royal Darbar Nocturne', family: 'Noble Amber & Wild Assam Oudh' },
      rose: { name: 'Chaitra Damask Bloom', family: 'Kannauj Rose & Delicate Green Cardamom' },
      petrichor: { name: 'Thar Monsoon Petrichor', family: 'Baked Terracotta Earth & Khus Vetiver' },
      spice: { name: 'Desert Saffron & Shamama', family: 'Kashmiri Saffron, Star Anise & Rare Botanicals' }
    };

    const currentMood = moodNames[this.state.mood] || moodNames.darbar;
    const isSpray = this.state.intensity === 'spray';
    const baseLabel = this.state.base === 'sandalwood' 
      ? 'Traditional Sandalwood Oil Base (Alcohol-Free)' 
      : 'Cold-Pressed Organic Golden Jojoba';

    const calculatedPrice = isSpray ? 3400 : 2800;

    this.resultContainer.innerHTML = `
      <div style="border-bottom: 1px solid var(--color-cream-dark); padding-bottom: 16px; margin-bottom: 16px;">
        <span class="badge-gold" style="margin-bottom: 8px;">Atelier Master Prescription</span>
        <h3 style="font-family: var(--font-serif-classic); font-size: 1.5rem; color: var(--color-maroon); margin-top: 6px;">
          ${escapeHtml(currentMood.name)}
        </h3>
        <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-top: 4px;">
          ${escapeHtml(currentMood.family)}
        </p>
      </div>

      <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
        <div>• <strong>Format:</strong> ${isSpray ? '50ml French Atomizer (Extrait de Parfum 30%)' : '6ml Hand-Cut Crystal Tola Flacon'}</div>
        <div>• <strong>Foundation:</strong> ${escapeHtml(baseLabel)}</div>
        <div>• <strong>Custom Monogram:</strong> <span style="color: var(--color-gold-deep); font-weight: 700;">${this.state.monogram ? escapeHtml(this.state.monogram) : 'Standard Jaipur Seal'}</span></div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-top: 12px; border-top: 1px solid var(--color-cream-dark);">
        <div>
          <span style="font-size: 0.76rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Tailored Craft Price</span>
          <span style="font-family: var(--font-serif-classic); font-size: 1.5rem; font-weight: 700; color: var(--color-maroon-mid);">₹${calculatedPrice.toLocaleString('en-IN')}</span>
        </div>
        <span class="badge-amber">Freshly Compounded</span>
      </div>

      <button id="atelier-add-cart-btn" class="btn btn-gold" style="width: 100%;">
        Order This Bespoke Formulation
      </button>
    `;

    // Re-bind dynamic button click
    const newBtn = this.resultContainer.querySelector('#atelier-add-cart-btn');
    if (newBtn) {
      newBtn.addEventListener('click', () => this.addCustomBlendToCart());
    }
  }

  addCustomBlendToCart() {
    const isSpray = this.state.intensity === 'spray';
    const selectedSize = isSpray 
      ? this.bespokeProduct.sizes.find(s => s.id === '50ml') || this.bespokeProduct.sizes[3]
      : this.bespokeProduct.sizes.find(s => s.id === '6ml') || this.bespokeProduct.sizes[1];

    const selectedCarrier = this.state.base === 'sandalwood'
      ? this.bespokeProduct.carrierBases[0]
      : this.bespokeProduct.carrierBases[1];

    this.cartManager.addItem(this.bespokeProduct, {
      size: selectedSize,
      carrier: selectedCarrier,
      monogram: this.state.monogram || 'DRA',
      quantity: 1
    });
  }
}

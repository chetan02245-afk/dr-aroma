/* ==========================================================================
   D R AROMA — CHECKOUT FLOW & PAYMENT SIMULATION
   Privacy-compliant minimal-data collection, realistic UPI/Card mock,
   input sanitization, and royal order receipt generation.
   ========================================================================== */

import { escapeHtml, showNoticeModal } from './ui-modal.js';

export class CheckoutManager {
  constructor(cartManager) {
    this.cartManager = cartManager;
    this.form = document.querySelector('#checkout-form');
    this.summaryContainer = document.querySelector('.checkout-summary-items');
    this.subtotalEl = document.querySelector('.checkout-subtotal');
    this.totalEl = document.querySelector('.checkout-total');
    this.shippingEl = document.querySelector('.checkout-shipping');
    this.receiptModal = document.querySelector('.order-modal-backdrop');
    this.receiptContent = document.querySelector('.order-receipt-details');

    this.selectedPaymentMethod = 'upi';
    this.initEventListeners();
  }

  initEventListeners() {
    // Payment method selector tabs
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.selectedPaymentMethod = e.target.value;
        document.querySelectorAll('.payment-fields-group').forEach(group => {
          group.style.display = 'none';
        });
        const activeGroup = document.querySelector(`#payment-fields-${this.selectedPaymentMethod}`);
        if (activeGroup) activeGroup.style.display = 'block';
      });
    });

    // Form submit
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit();
      });
    }

    // Modal close & print buttons
    const closeReceiptBtn = document.querySelector('.close-receipt-btn');
    if (closeReceiptBtn) {
      closeReceiptBtn.addEventListener('click', () => {
        this.receiptModal.classList.remove('active');
        window.location.hash = '#home';
      });
    }

    const printReceiptBtn = document.querySelector('.print-receipt-btn');
    if (printReceiptBtn) {
      printReceiptBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  renderCheckout() {
    const items = this.cartManager.items;
    const subtotal = this.cartManager.getSubtotal();
    const shipping = subtotal >= this.cartManager.freeShippingThreshold || subtotal === 0 ? 0 : 150;
    const total = subtotal + shipping;

    if (this.subtotalEl) this.subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (this.shippingEl) this.shippingEl.textContent = shipping === 0 ? 'Complimentary' : `₹${shipping}`;
    if (this.totalEl) this.totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;

    if (!this.summaryContainer) return;

    if (items.length === 0) {
      this.summaryContainer.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--color-charcoal-muted);">
          <p>No bespoke fragrances currently in your chest.</p>
          <a href="#shop" class="btn btn-outline-gold btn-sm" style="margin-top: 12px;">Browse Catalog</a>
        </div>
      `;
      return;
    }

    this.summaryContainer.innerHTML = items.map(item => `
      <div style="display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--color-cream-dark); font-size: 0.88rem;">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
        <div style="flex-grow: 1;">
          <div style="font-weight: 600; color: var(--color-maroon-dark);">${escapeHtml(item.name)}</div>
          <div style="font-size: 0.76rem; color: var(--color-charcoal-muted);">${escapeHtml(item.sizeLabel)} • Qty: ${Number(item.quantity) || 1}</div>
          ${item.monogram ? `<div style="font-size: 0.72rem; color: var(--color-gold-deep);">Seal: ${escapeHtml(item.monogram)}</div>` : ''}
        </div>
        <div style="font-weight: 600; color: var(--color-maroon-mid);">
          ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}
        </div>
      </div>
    `).join('');
  }

  handleCheckoutSubmit() {
    if (this.cartManager.items.length === 0) {
      showNoticeModal({
        title: 'Royal Chest Empty',
        subtitle: 'Selection Required',
        message: 'Your cart is empty. Please select a handcrafted fragrance before completing checkout.',
        buttonText: 'Explore Collections',
        onClose: () => {
          window.location.hash = '#shop';
        }
      });
      return;
    }

    // Read and sanitize form inputs
    const rawName = document.querySelector('#checkout-name')?.value?.trim();
    const rawEmail = document.querySelector('#checkout-email')?.value?.trim();
    const rawPhone = document.querySelector('#checkout-phone')?.value?.trim();
    const rawAddress = document.querySelector('#checkout-address')?.value?.trim();
    const rawCity = document.querySelector('#checkout-city')?.value?.trim();
    const rawState = document.querySelector('#checkout-state')?.value?.trim();
    const rawPin = document.querySelector('#checkout-pin')?.value?.trim();
    const rawNotes = document.querySelector('#checkout-notes')?.value?.trim();

    const name = escapeHtml(rawName || 'Valued Patron');
    const email = escapeHtml(rawEmail || 'patron@example.com');
    const phone = escapeHtml(rawPhone || '+91 98290 XXXXX');
    const address = escapeHtml(rawAddress || 'Tripolia Bazar, Pink City');
    const city = escapeHtml(rawCity || 'Jaipur');
    const state = escapeHtml(rawState || 'Rajasthan');
    const pin = escapeHtml(rawPin || '302002');
    const notes = escapeHtml(rawNotes || '');
    const paymentMethodLabel = escapeHtml(this.selectedPaymentMethod.toUpperCase());

    // Generate Order Reference
    const orderId = `DRA-1960-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = this.cartManager.getSubtotal();
    const shipping = subtotal >= this.cartManager.freeShippingThreshold ? 0 : 150;
    const total = subtotal + shipping;

    const orderedItems = [...this.cartManager.items];

    // Render Royal Receipt with sanitized inputs
    if (this.receiptContent) {
      this.receiptContent.innerHTML = `
        <div style="border-bottom: 2px solid var(--color-gold); padding-bottom: 16px; margin-bottom: 24px;">
          <div style="font-family: var(--font-serif-royal); font-size: 1.4rem; color: var(--color-maroon-dark); letter-spacing: 0.12em;">
            D R AROMA
          </div>
          <div style="font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-gold-deep); margin-top: 4px;">
            Tripolia Bazar, Jaipur • Est. 1960
          </div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); margin-top: 8px;">
            Handcrafted Formulation Order Receipt
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 20px; text-align: left;">
          <div>
            <div><strong>Order No:</strong> <span style="font-family: monospace; color: var(--color-maroon-mid); font-weight: 700;">${orderId}</span></div>
            <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div><strong>Payment Status:</strong> <span style="color: #2E7D32; font-weight: 600;">Authorized (${paymentMethodLabel})</span></div>
          </div>
          <div style="text-align: right;">
            <div><strong>Patron:</strong> ${name}</div>
            <div>${phone}</div>
            <div>${city}, ${state} - ${pin}</div>
          </div>
        </div>

        <div style="background: var(--color-cream-warm); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 24px; text-align: left;">
          <div style="font-family: var(--font-serif-royal); font-size: 0.8rem; letter-spacing: 0.1em; color: var(--color-maroon); text-transform: uppercase; margin-bottom: 10px;">
            Formulation & Vessel Summary
          </div>
          ${orderedItems.map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.86rem; padding: 6px 0; border-bottom: 1px dashed rgba(197, 160, 89, 0.4);">
              <div>
                <strong>${escapeHtml(item.name)}</strong> × ${Number(item.quantity) || 1}
                <div style="font-size: 0.76rem; color: var(--color-charcoal-muted);">${escapeHtml(item.sizeLabel)} | ${escapeHtml(item.carrierLabel)} ${item.monogram ? `| Seal: ${escapeHtml(item.monogram)}` : ''}</div>
              </div>
              <div style="font-weight: 600;">₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}</div>
            </div>
          `).join('')}
          
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 0.95rem; font-weight: 700; color: var(--color-maroon-dark);">
            <span>Total Insured Value:</span>
            <span>₹${total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        ${notes ? `
          <div style="text-align: left; font-size: 0.8rem; background: #fff; padding: 10px 14px; border-left: 3px solid var(--color-gold); margin-bottom: 20px;">
            <strong>Instructions for Master Perfumer:</strong> "${notes}"
          </div>
        ` : ''}

        <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); margin-bottom: 24px; line-height: 1.5;">
          Our master perfumer in Tripolia Bazar has logged your custom formulation in the ledger. Freshly hand-decanted with meticulous care, carefully packed in our royal maroon wax-sealed presentation box, and dispatched via insured courier.
        </div>
      `;
    }

    // Show Confirmation Modal
    if (this.receiptModal) {
      this.receiptModal.classList.add('active');
    }

    // Clear cart
    this.cartManager.clearCart();
  }
}

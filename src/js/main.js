/* ==========================================================================
   D R AROMA — MAIN APP BOOTSTRAPPER
   Tripolia Bazar, Jaipur • Est. 1960
   ========================================================================== */

import { products } from './data/products.js';
import { HeroCanvasScroller } from './hero-canvas.js';
import { CartManager } from './cart.js';
import { CheckoutManager } from './checkout.js';
import { BespokeAtelier } from './custom-atelier.js';
import { CookieConsentManager } from './cookie-consent.js';
import { AppRouter } from './router.js';
import { showNoticeModal } from './ui-modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Cart
  const cartManager = new CartManager();

  // 2. Initialize Checkout
  const checkoutManager = new CheckoutManager(cartManager);

  // 3. Initialize Bespoke Fragrance Atelier (Interactive Builder)
  const bespokeAtelier = new BespokeAtelier(cartManager, products);

  // 4. Initialize Hero Canvas Scroller
  const heroScroller = new HeroCanvasScroller({
    totalFrames: 120,
    framePrefix: '/frames/frame-',
    frameExt: '.jpg'
  });

  // 5. Initialize Cookie Consent Banner
  const cookieConsent = new CookieConsentManager();

  // 6. Initialize Router
  const router = new AppRouter({
    products: products,
    cartManager: cartManager,
    checkoutManager: checkoutManager
  });

  // 7. Header scroll shadow effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 8. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 9. Quick Add / Customization triggers from Homepage Bestsellers
  document.querySelectorAll('[data-quick-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.dataset.quickAdd;
      const product = products.find(p => p.id === productId);
      if (product) {
        cartManager.addItem(product, {
          size: product.sizes[0],
          carrier: product.carrierBases[0],
          quantity: 1
        });
      }
    });
  });

  // 10. Contact form on Visit Page
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNoticeModal({
        title: 'Message Received',
        subtitle: 'Tripolia Bazar Concierge',
        message: 'Thank you for reaching out to D R Aroma. Our heritage concierge will review your note and respond via email or WhatsApp within 24 hours.',
        buttonText: 'Acknowledge'
      });
      contactForm.reset();
    });
  }

  // 11. Newsletter form in Footer
  const newsletterForm = document.querySelector('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNoticeModal({
        title: 'Subscription Confirmed',
        subtitle: 'Seasonal Distillation Ledger',
        message: 'Thank you for subscribing to D R Aroma’s seasonal distillation alerts. You will receive private updates when limited harvests are freshly decanted.',
        buttonText: 'Acknowledge'
      });
      newsletterForm.reset();
    });
  }
});

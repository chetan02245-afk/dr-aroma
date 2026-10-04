/* ==========================================================================
   D R AROMA — PRIVACY & COOKIE CONSENT BANNER
   WCAG AA compliant, zero-tracking before consent, granular preference support.
   ========================================================================== */

export class CookieConsentManager {
  constructor() {
    this.storageKey = 'dr_aroma_cookie_consent';
    this.banner = document.querySelector('#cookie-consent-banner');
    this.acceptBtn = document.querySelector('#cookie-accept-all');
    this.rejectBtn = document.querySelector('#cookie-reject-non-essential');
    this.reopenLinks = document.querySelectorAll('.open-cookie-settings');

    this.init();
  }

  init() {
    const consent = localStorage.getItem(this.storageKey);
    if (!consent) {
      setTimeout(() => {
        if (this.banner) this.banner.classList.add('show');
      }, 1200);
    } else {
      this.applyConsent(JSON.parse(consent));
    }

    if (this.acceptBtn) {
      this.acceptBtn.addEventListener('click', () => {
        this.saveConsent({ essential: true, analytics: true, functional: true });
      });
    }

    if (this.rejectBtn) {
      this.rejectBtn.addEventListener('click', () => {
        this.saveConsent({ essential: true, analytics: false, functional: false });
      });
    }

    this.reopenLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.banner) this.banner.classList.add('show');
      });
    });
  }

  saveConsent(settings) {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
    if (this.banner) this.banner.classList.remove('show');
    this.applyConsent(settings);
  }

  applyConsent(settings) {
    if (settings.analytics) {
      // In production, third-party analytics (like Google Analytics / Plausible) only load here
      window.dataLayer = window.dataLayer || [];
    }
  }
}

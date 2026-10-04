/* ==========================================================================
   D R AROMA — REUSABLE UI MODAL & SANITIZATION UTILITIES
   Provides HTML escaping and styled modal / toast alerts matching the
   heritage maroon, antique gold, and soft cream design system.
   ========================================================================== */

/**
 * Escapes unsafe characters in user-provided strings before DOM insertion.
 * Replaces &, <, >, ", and ' with corresponding HTML entities.
 * @param {string|any} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Displays a styled modal dialog conforming to the D R Aroma design system.
 * Replaces native browser alert() dialogs.
 *
 * @param {Object} options
 * @param {string} options.title - Header title
 * @param {string} [options.subtitle] - Small uppercase badge/subtitle
 * @param {string} options.message - Message body (can contain safe HTML)
 * @param {string} [options.buttonText='Acknowledge'] - Label for action button
 * @param {string} [options.icon='✦'] - Decorative icon
 * @param {Function} [options.onClose] - Optional callback when modal closes
 */
export function showNoticeModal({
  title = 'Notice',
  subtitle = 'D R Aroma • Jaipur',
  message = '',
  buttonText = 'Acknowledge',
  icon = '✦',
  onClose = null
} = {}) {
  let backdrop = document.querySelector('#notice-modal-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'notice-modal-backdrop';
    backdrop.className = 'order-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'notice-modal-title');
    document.body.appendChild(backdrop);
  }

  backdrop.innerHTML = `
    <div class="order-modal-card" style="max-width: 480px; text-align: center; margin: auto;">
      <div style="width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--color-gold); background: radial-gradient(circle, var(--color-maroon-mid) 0%, var(--color-maroon-darkest) 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: var(--color-gold-light); font-size: 1.4rem;" aria-hidden="true">
        ${escapeHtml(icon)}
      </div>
      <h3 id="notice-modal-title" style="font-family: var(--font-serif-royal); font-size: 1.3rem; color: var(--color-maroon); letter-spacing: 0.08em; margin-bottom: 6px;">
        ${escapeHtml(title)}
      </h3>
      <div style="font-size: 0.76rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-gold-deep); margin-bottom: 16px;">
        ${escapeHtml(subtitle)}
      </div>
      <div style="font-size: 0.92rem; color: var(--color-charcoal); line-height: 1.6; margin-bottom: 24px;">
        ${message}
      </div>
      <div style="display: flex; justify-content: center;">
        <button type="button" id="notice-modal-action-btn" class="btn btn-gold" style="min-width: 140px;">
          ${escapeHtml(buttonText)}
        </button>
      </div>
    </div>
  `;

  backdrop.style.display = 'flex';
  // Trigger transition
  requestAnimationFrame(() => {
    backdrop.classList.add('active');
  });

  const closeBtn = backdrop.querySelector('#notice-modal-action-btn');
  if (closeBtn) closeBtn.focus();

  const closeModal = () => {
    backdrop.classList.remove('active');
    setTimeout(() => {
      backdrop.style.display = 'none';
      if (typeof onClose === 'function') onClose();
    }, 250);
    document.removeEventListener('keydown', handleKeyDown);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  document.addEventListener('keydown', handleKeyDown);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal, { once: true });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  }, { once: true });
}

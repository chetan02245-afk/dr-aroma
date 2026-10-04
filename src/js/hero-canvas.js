/* ==========================================================================
   D R AROMA — HERO CANVAS SCROLL-TRIGGERED FRAME ANIMATION
   Apple-style scroll-scrubbed canvas with 120 Full HD frames,
   lerp smoothing, high-DPI retina rendering, and mobile video fallback.
   ========================================================================== */

export class HeroCanvasScroller {
  constructor(options = {}) {
    this.totalFrames = options.totalFrames || 120;
    this.framePrefix = options.framePrefix || '/frames/frame-';
    this.frameExt = options.frameExt || '.jpg';
    
    this.container = document.querySelector('.hero-scroll-container');
    this.canvas = document.querySelector('.hero-canvas');
    this.fallbackWrap = document.querySelector('.hero-fallback-wrap');
    this.preloader = document.querySelector('.hero-preloader');
    this.progressBar = document.querySelector('.preloader-bar-fill');
    this.statusText = document.querySelector('.preloader-status');
    this.slides = document.querySelectorAll('.hero-slide');

    if (!this.container || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.images = [];
    this.loadedCount = 0;
    this.currentFrame = 1;
    this.targetFrame = 1;
    this.rafId = null;
    this.isLoaded = false;
    this.isDestroyed = false;

    // Detect mobile or low-memory/touch environment for fallback
    this.isMobile = this.checkMobileFallback();

    this.init();
  }

  checkMobileFallback() {
    const isSmallScreen = window.innerWidth <= 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 2;
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (isSmallScreen && hasTouch) || prefersReducedMotion;
  }

  init() {
    if (this.isMobile) {
      this.activateFallback();
      return;
    }

    this.setupCanvasDimensions();
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

    this.preloadFrames();
    this.startRenderLoop();
  }

  setupCanvasDimensions() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  onResize() {
    this.setupCanvasDimensions();
    this.drawFrame(Math.round(this.currentFrame));
  }

  preloadFrames() {
    // 1. First load Frame 001 immediately so user sees initial frame with zero delay
    const firstImg = new Image();
    firstImg.src = `${this.framePrefix}001${this.frameExt}`;
    firstImg.onload = () => {
      this.images[1] = firstImg;
      this.drawFrame(1);
      this.canvas.classList.add('ready');
      // Now preload remaining frames sequentially/batched
      this.loadRemainingFrames();
    };
    firstImg.onerror = () => {
      console.warn('Hero frame 1 failed to load. Enabling fallback video.');
      this.activateFallback();
    };
  }

  loadRemainingFrames() {
    let loaded = 1;
    for (let i = 2; i <= this.totalFrames; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${this.framePrefix}${numStr}${this.frameExt}`;
      img.onload = () => {
        if (this.isDestroyed) return;
        this.images[i] = img;
        loaded++;
        this.updateProgress(loaded);
      };
      img.onerror = () => {
        loaded++;
        this.updateProgress(loaded);
      };
    }
  }

  updateProgress(loaded) {
    const pct = Math.round((loaded / this.totalFrames) * 100);
    if (this.progressBar) {
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.statusText) {
      this.statusText.textContent = `Awakening Heritage Frames... ${pct}%`;
    }

    if (loaded >= Math.floor(this.totalFrames * 0.85) && !this.isLoaded) {
      this.isLoaded = true;
      setTimeout(() => {
        if (this.preloader) {
          this.preloader.classList.add('loaded');
        }
      }, 300);
    }
  }

  onScroll() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const scrollTrack = this.container.offsetHeight - window.innerHeight;
    if (scrollTrack <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollTrack));

    // Map progress to frame index (1 to 120)
    this.targetFrame = 1 + progress * (this.totalFrames - 1);

    // Update story overlay slides based on scroll progress
    this.updateSlides(progress);
  }

  updateSlides(progress) {
    if (!this.slides || this.slides.length === 0) return;

    // Slide 1: 0% - 28%
    // Slide 2: 32% - 66%
    // Slide 3: 70% - 100%
    let activeIndex = 0;
    if (progress >= 0.70) {
      activeIndex = 2;
    } else if (progress >= 0.32) {
      activeIndex = 1;
    } else {
      activeIndex = 0;
    }

    this.slides.forEach((slide, index) => {
      if (index === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Fade scroll indicator when user starts scrolling
    const indicator = document.querySelector('.hero-scroll-indicator');
    if (indicator) {
      indicator.style.opacity = progress > 0.05 ? '0' : '1';
    }
  }

  startRenderLoop() {
    const render = () => {
      if (this.isDestroyed) return;

      // Linear interpolation (lerp) for smooth frame changes
      const diff = this.targetFrame - this.currentFrame;
      if (Math.abs(diff) > 0.01) {
        this.currentFrame += diff * 0.18;
        const frameToDraw = Math.round(this.currentFrame);
        this.drawFrame(frameToDraw);
      }

      this.rafId = requestAnimationFrame(render);
    };

    this.rafId = requestAnimationFrame(render);
  }

  drawFrame(frameIndex) {
    const clampedIndex = Math.max(1, Math.min(this.totalFrames, frameIndex));
    const img = this.images[clampedIndex] || this.images[1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = this.width;
    const canvasHeight = this.height;

    // Cover calculation (object-fit: cover for canvas)
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let renderWidth, renderHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderHeight = canvasHeight;
      renderWidth = canvasHeight * imgRatio;
      offsetY = 0;
      offsetX = (canvasWidth - renderWidth) / 2;
    }

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }

  activateFallback() {
    if (this.container) {
      this.container.classList.add('is-fallback-mode');
    }
    if (this.preloader) {
      this.preloader.classList.add('loaded');
    }
    if (this.fallbackWrap) {
      this.fallbackWrap.style.display = 'block';
    }
    // Set first slide active
    if (this.slides && this.slides[0]) {
      this.slides[0].classList.add('active');
    }
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }
}

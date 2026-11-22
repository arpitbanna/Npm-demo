/**
 * Canvas Manager for magicui-effects
 * Handles canvas creation, mounting, HiDPI scaling, resize handling, and cleanup.
 */

export class CanvasManager {
  /**
   * @param {Object} options
   * @param {HTMLElement|string} [options.target] Container element or CSS selector. Defaults to document.body (fullscreen).
   * @param {number} [options.zIndex=9999] Canvas z-index.
   * @param {string} [options.className=''] Optional CSS class name.
   * @param {boolean} [options.pointerEvents=false] Whether canvas intercepts pointer events (default: false, click-through).
   * @param {Function} [options.onResize] Resize callback receiving (width, height, dpr).
   */
  constructor(options = {}) {
    this.options = {
      target: options.target || null,
      zIndex: options.zIndex !== undefined ? options.zIndex : 9999,
      className: options.className || '',
      pointerEvents: options.pointerEvents || false,
      onResize: options.onResize || null,
    };

    this.container = null;
    this.isFullScreen = false;
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.resizeObserver = null;
    this._handleWindowResize = this._handleWindowResize.bind(this);

    this.initialized = false;
    this._init();
    this.initialized = true;
  }

  _resolveContainer() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return null;
    }

    if (!this.options.target) {
      this.isFullScreen = true;
      return document.body;
    }

    if (typeof this.options.target === 'string') {
      const el = document.querySelector(this.options.target);
      if (!el) {
        console.warn(`[magicui-effects] Container "${this.options.target}" not found. Falling back to document.body.`);
        this.isFullScreen = true;
        return document.body;
      }
      return el;
    }

    if (this.options.target instanceof HTMLElement) {
      return this.options.target;
    }

    this.isFullScreen = true;
    return document.body;
  }

  _init() {
    this.container = this._resolveContainer();
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('magicui-effects-canvas');
    if (this.options.className) {
      this.canvas.classList.add(...this.options.className.split(' ').filter(Boolean));
    }

    // Styling
    const s = this.canvas.style;
    s.pointerEvents = this.options.pointerEvents ? 'auto' : 'none';
    s.zIndex = String(this.options.zIndex);

    if (this.isFullScreen) {
      s.position = 'fixed';
      s.top = '0';
      s.left = '0';
      s.width = '100vw';
      s.height = '100vh';
    } else {
      s.position = 'absolute';
      s.top = '0';
      s.left = '0';
      s.width = '100%';
      s.height = '100%';

      // Ensure container has position context
      const containerPos = window.getComputedStyle(this.container).position;
      if (containerPos === 'static') {
        this.container.style.position = 'relative';
      }
      // Ensure overflow is hidden on target container so particles don't spill
      if (!this.isFullScreen && window.getComputedStyle(this.container).overflow === 'visible') {
        this.container.style.overflow = 'hidden';
      }
    }

    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.resize();

    // Listen to resize
    if (typeof ResizeObserver !== 'undefined' && this.container !== document.body) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', this._handleWindowResize, { passive: true });
    }
  }

  _handleWindowResize() {
    this.resize();
  }

  resize() {
    if (!this.canvas || !this.container) return;

    let w, h;
    if (this.isFullScreen) {
      w = window.innerWidth || document.documentElement.clientWidth || 800;
      h = window.innerHeight || document.documentElement.clientHeight || 600;
    } else {
      const rect = this.container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
    }

    if (w <= 0 || h <= 0) {
      // Container might not be in DOM or display:none
      w = Math.max(w, 300);
      h = Math.max(h, 150);
    }

    this.width = w;
    this.height = h;

    const rawDpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    this.dpr = Math.min(rawDpr, 2); // Cap at 2 to balance crispness with memory/GPU perf

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
    }

    if (this.initialized && typeof this.options.onResize === 'function') {
      this.options.onResize(this.width, this.height, this.dpr);
    }
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._handleWindowResize);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
    this.container = null;
  }
}

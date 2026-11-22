/**
 * Star Sparkle Effect
 * Twinkling stars, 4-point glowing sparkles, and occasional shooting stars.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, randomChoice, normalizeColor } from '../core/utils.js';

const DEFAULT_STAR_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#e0f2fe',
  '#fef08a',
  '#fbcfe8',
];

/**
 * @typedef {Object} StarsOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {number} [count=120] Star count
 * @property {number} [speed=1] Twinkle speed multiplier
 * @property {string[]} [colors] Star colors
 * @property {number} [minSize=1] Minimum star radius
 * @property {number} [maxSize=3.5] Maximum star radius
 * @property {boolean} [shootingStars=true] Enable occasional shooting stars
 * @property {number} [shootingStarInterval=4000] Interval between shooting stars in ms
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class StarsEffect extends BaseEffect {
  /**
   * @param {StarsOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 120,
      speed: 1,
      colors: DEFAULT_STAR_COLORS,
      minSize: 1,
      maxSize: 3.5,
      shootingStars: true,
      shootingStarInterval: 4000,
      zIndex: 9999,
      respectReducedMotion: true,
      autoStart: true,
    };
    super(defaults, options);
  }

  init() {
    this.stars = [];
    this.shootingStars = [];
    this.lastShootingStarTime = performance.now();

    const count = Math.max(1, Math.floor(this.options.count));
    for (let i = 0; i < count; i++) {
      this.stars.push(this._createStar());
    }
  }

  _createStar() {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const colors = (this.options.colors && this.options.colors.length) ? this.options.colors : DEFAULT_STAR_COLORS;
    const size = randomInRange(this.options.minSize, this.options.maxSize);
    const isSparkle = size > (this.options.maxSize * 0.7);

    return {
      x: randomInRange(0, w),
      y: randomInRange(0, h),
      size,
      color: randomChoice(colors),
      twinklePhase: randomInRange(0, Math.PI * 2),
      twinkleSpeed: randomInRange(0.02, 0.06) * this.options.speed,
      baseAlpha: randomInRange(0.4, 0.9),
      isSparkle,
    };
  }

  _spawnShootingStar() {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const startX = randomInRange(w * 0.2, w * 0.9);
    const startY = randomInRange(0, h * 0.4);
    const length = randomInRange(120, 240);
    const speed = randomInRange(12, 20);
    const angle = randomInRange(Math.PI * 0.7, Math.PI * 0.85); // Downwards diagonal

    this.shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length,
      speed,
      life: 1.0,
      decay: randomInRange(0.015, 0.03),
      color: randomChoice(this.options.colors || DEFAULT_STAR_COLORS),
    });
  }

  onResize(w, h) {
    if (!this.stars || !this.canvasManager) return;
    const width = w || this.canvasManager.width;
    const height = h || this.canvasManager.height;
    for (const s of this.stars) {
      if (s.x > width) s.x = randomInRange(0, width);
      if (s.y > height) s.y = randomInRange(0, height);
    }
  }

  onUpdate(changed) {
    if (changed.count !== undefined) {
      const targetCount = Math.max(1, Math.floor(this.options.count));
      while (this.stars.length < targetCount) {
        this.stars.push(this._createStar());
      }
      if (this.stars.length > targetCount) {
        this.stars.length = targetCount;
      }
    }
  }

  _drawSparkle(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.5);
    grad.addColorStop(0, normalizeColor(color, alpha));
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4-pointed diamond sparkle
    ctx.beginPath();
    ctx.fillStyle = normalizeColor(color, alpha);
    const arm = size * 2.2;
    const inner = size * 0.35;
    ctx.moveTo(0, -arm);
    ctx.lineTo(inner, -inner);
    ctx.lineTo(arm, 0);
    ctx.lineTo(inner, inner);
    ctx.lineTo(0, arm);
    ctx.lineTo(-inner, inner);
    ctx.lineTo(-arm, 0);
    ctx.lineTo(-inner, -inner);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  render(deltaMs, timestamp) {
    const ctx = this.canvasManager.ctx;
    if (!ctx) return;

    const w = this.canvasManager.width;
    const h = this.canvasManager.height;
    ctx.clearRect(0, 0, w, h);

    const timeRatio = deltaMs / 16.67;

    // Draw twinkling stars
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.twinklePhase += s.twinkleSpeed * timeRatio;
      const alpha = Math.max(0.1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35);

      if (s.isSparkle) {
        this._drawSparkle(ctx, s.x, s.y, s.size, s.color, alpha);
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = normalizeColor(s.color, alpha);
        ctx.fill();
      }
    }

    // Shooting stars
    if (this.options.shootingStars) {
      if (timestamp - this.lastShootingStarTime > this.options.shootingStarInterval) {
        this._spawnShootingStar();
        this.lastShootingStarTime = timestamp + randomInRange(-1000, 1000);
      }

      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += ss.vx * timeRatio;
        ss.y += ss.vy * timeRatio;
        ss.life -= ss.decay * timeRatio;

        if (ss.life <= 0 || ss.x < -100 || ss.y > h + 100) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - (ss.vx / ss.speed) * ss.length;
        const tailY = ss.y - (ss.vy / ss.speed) * ss.length;

        const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, normalizeColor(ss.color, ss.life));
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * ss.life;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    }
  }
}

/**
 * Creates and starts a Stars effect.
 * @param {StarsOptions} [options]
 * @returns {StarsEffect}
 */
export function stars(options) {
  return new StarsEffect(options);
}

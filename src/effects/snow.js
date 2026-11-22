/**
 * Falling Snow Effect
 * Lightweight, realistic snow particles with natural drift, wind, and depth.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, normalizeColor } from '../core/utils.js';

/**
 * @typedef {Object} SnowOptions
 * @property {HTMLElement|string} [target] Container element or selector (fullscreen if omitted)
 * @property {number} [count=100] Snowflake count
 * @property {number} [speed=1.5] Falling speed multiplier
 * @property {string} [color='#ffffff'] Snowflake color
 * @property {number} [minSize=1.5] Minimum snowflake radius
 * @property {number} [maxSize=4.5] Maximum snowflake radius
 * @property {number} [wind=0.5] Horizontal wind factor (-2 to 2)
 * @property {number} [opacity=0.85] Base opacity
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true] Respect prefers-reduced-motion
 * @property {boolean} [autoStart=true] Auto start animation
 */

export class SnowEffect extends BaseEffect {
  /**
   * @param {SnowOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 100,
      speed: 1.5,
      color: '#ffffff',
      minSize: 1.5,
      maxSize: 4.5,
      wind: 0.5,
      opacity: 0.85,
      zIndex: 9999,
      respectReducedMotion: true,
      autoStart: true,
    };
    super(defaults, options);
  }

  init() {
    this.particles = [];
    const count = Math.max(1, Math.floor(this.options.count));
    for (let i = 0; i < count; i++) {
      this.particles.push(this._createSnowflake(true));
    }
  }

  _createSnowflake(randomY = false) {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const size = randomInRange(this.options.minSize, this.options.maxSize);
    // Depth factor: larger flakes fall slightly faster and are brighter
    const depth = (size - this.options.minSize) / Math.max(1, (this.options.maxSize - this.options.minSize)) + 0.3;

    return {
      x: randomInRange(-20, w + 20),
      y: randomY ? randomInRange(0, h) : randomInRange(-20, -5),
      size,
      depth,
      baseSpeedY: randomInRange(0.6, 1.4) * depth,
      swaySpeed: randomInRange(0.015, 0.04),
      swayOffset: randomInRange(0, Math.PI * 2),
      swayAmplitude: randomInRange(0.5, 1.8),
      opacity: randomInRange(0.4, 1) * this.options.opacity,
    };
  }

  onResize(w, h) {
    if (!this.particles || !this.canvasManager) return;
    const width = w || this.canvasManager.width;
    const height = h || this.canvasManager.height;
    for (const p of this.particles) {
      if (p.x > width + 50) p.x = randomInRange(0, width);
      if (p.y > height + 50) p.y = randomInRange(0, height);
    }
  }

  onUpdate(changed) {
    if (changed.count !== undefined) {
      const targetCount = Math.max(1, Math.floor(this.options.count));
      while (this.particles.length < targetCount) {
        this.particles.push(this._createSnowflake(false));
      }
      if (this.particles.length > targetCount) {
        this.particles.length = targetCount;
      }
    }
  }

  render(deltaMs) {
    const ctx = this.canvasManager.ctx;
    if (!ctx) return;

    const w = this.canvasManager.width;
    const h = this.canvasManager.height;
    ctx.clearRect(0, 0, w, h);

    const timeRatio = deltaMs / 16.67; // Normalize to ~60fps
    const speed = this.options.speed;
    const wind = this.options.wind;
    const baseColor = this.options.color;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.swayOffset += p.swaySpeed * timeRatio;
      p.y += p.baseSpeedY * speed * timeRatio;
      p.x += (Math.sin(p.swayOffset) * p.swayAmplitude + wind * p.depth) * timeRatio;

      // Wrap around when out of bounds
      if (p.y > h + 10) {
        p.y = -10;
        p.x = randomInRange(-20, w + 20);
      } else if (p.x > w + 30) {
        p.x = -20;
      } else if (p.x < -30) {
        p.x = w + 20;
      }

      // Draw snowflake
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = normalizeColor(baseColor, p.opacity);
      ctx.fill();

      // Soft glow for larger snowflakes
      if (p.size > 3) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = normalizeColor(baseColor, p.opacity * 0.18);
        ctx.fill();
      }
    }
  }
}

/**
 * Creates and starts a Snow effect.
 * @param {SnowOptions} [options]
 * @returns {SnowEffect}
 */
export function snow(options) {
  return new SnowEffect(options);
}

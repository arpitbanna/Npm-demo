/**
 * Floating Hearts Effect
 * Romantic, gently swaying hearts floating upwards with custom colors and sizes.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, randomChoice, degToRad, normalizeColor } from '../core/utils.js';

const DEFAULT_HEART_COLORS = [
  '#ff4b72',
  '#ff6584',
  '#f50057',
  '#ff8da1',
  '#ff1744',
  '#e91e63',
];

/**
 * @typedef {Object} HeartsOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {number} [count=35] Number of floating hearts
 * @property {number} [speed=1.2] Upward floating speed
 * @property {string[]} [colors] Array of heart color strings
 * @property {number} [minSize=12] Minimum heart size
 * @property {number} [maxSize=32] Maximum heart size
 * @property {number} [sway=1.2] Horizontal swaying intensity
 * @property {number} [opacity=0.85] Base opacity
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class HeartsEffect extends BaseEffect {
  /**
   * @param {HeartsOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 35,
      speed: 1.2,
      colors: DEFAULT_HEART_COLORS,
      minSize: 12,
      maxSize: 32,
      sway: 1.2,
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
      this.particles.push(this._createHeart(true));
    }
  }

  _createHeart(randomY = false) {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const colors = (this.options.colors && this.options.colors.length) ? this.options.colors : DEFAULT_HEART_COLORS;

    return {
      x: randomInRange(0, w),
      y: randomY ? randomInRange(0, h) : randomInRange(h + 20, h + 80),
      size: randomInRange(this.options.minSize, this.options.maxSize),
      color: randomChoice(colors),
      speedY: randomInRange(0.8, 1.8) * this.options.speed,
      swaySpeed: randomInRange(0.015, 0.035),
      swayOffset: randomInRange(0, Math.PI * 2),
      swayAmplitude: randomInRange(0.8, 2.5) * this.options.sway,
      rotation: randomInRange(-25, 25),
      rotationSpeed: randomInRange(-0.5, 0.5),
      opacity: randomInRange(0.5, 1) * this.options.opacity,
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
        this.particles.push(this._createHeart(false));
      }
      if (this.particles.length > targetCount) {
        this.particles.length = targetCount;
      }
    }
  }

  _drawHeart(ctx, x, y, size, rotation, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(degToRad(rotation));
    ctx.scale(size / 30, size / 30); // Normalize based on standard 30x30 coordinate box
    ctx.beginPath();
    ctx.fillStyle = normalizeColor(color, opacity);

    // Precise cubic bezier curve heart path
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-15, -15, -30, 5, 0, 25);
    ctx.bezierCurveTo(30, 5, 15, -15, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle inner heart highlight
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.arc(-6, 3, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  render(deltaMs) {
    const ctx = this.canvasManager.ctx;
    if (!ctx) return;

    const w = this.canvasManager.width;
    const h = this.canvasManager.height;
    ctx.clearRect(0, 0, w, h);

    const timeRatio = deltaMs / 16.67;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.swayOffset += p.swaySpeed * timeRatio;
      p.y -= p.speedY * timeRatio;
      p.x += Math.sin(p.swayOffset) * p.swayAmplitude * timeRatio;
      p.rotation += p.rotationSpeed * timeRatio;

      // Wrap to bottom when off top screen
      if (p.y < -50) {
        p.y = h + randomInRange(10, 40);
        p.x = randomInRange(0, w);
        p.speedY = randomInRange(0.8, 1.8) * this.options.speed;
      }

      this._drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
    }
  }
}

/**
 * Creates and starts a Hearts effect.
 * @param {HeartsOptions} [options]
 * @returns {HeartsEffect}
 */
export function hearts(options) {
  return new HeartsEffect(options);
}

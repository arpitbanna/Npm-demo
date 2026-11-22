/**
 * Floating Bubbles Effect
 * Iridescent, translucent bubbles with realistic specular highlights floating upwards.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, randomChoice, normalizeColor } from '../core/utils.js';

const DEFAULT_BUBBLE_COLORS = [
  'rgba(255, 255, 255, 0.45)',
  'rgba(147, 197, 253, 0.45)', // soft blue
  'rgba(196, 181, 253, 0.45)', // soft violet
  'rgba(244, 114, 182, 0.40)', // soft pink
  'rgba(110, 231, 183, 0.40)', // soft emerald
];

/**
 * @typedef {Object} BubblesOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {number} [count=30] Bubble count
 * @property {number} [speed=1] Upward speed multiplier
 * @property {string[]} [colors] Colors for bubble borders and sheen
 * @property {number} [minSize=8] Minimum bubble radius
 * @property {number} [maxSize=30] Maximum bubble radius
 * @property {number} [wobble=1] Wobble movement intensity
 * @property {number} [opacity=0.6] Base opacity
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class BubblesEffect extends BaseEffect {
  /**
   * @param {BubblesOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 30,
      speed: 1,
      colors: DEFAULT_BUBBLE_COLORS,
      minSize: 8,
      maxSize: 30,
      wobble: 1,
      opacity: 0.6,
      zIndex: 9999,
      respectReducedMotion: true,
      autoStart: true,
    };
    super(defaults, options);
  }

  init() {
    this.bubbles = [];
    this.popParticles = [];

    const count = Math.max(1, Math.floor(this.options.count));
    for (let i = 0; i < count; i++) {
      this.bubbles.push(this._createBubble(true));
    }
  }

  _createBubble(randomY = false) {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const colors = (this.options.colors && this.options.colors.length) ? this.options.colors : DEFAULT_BUBBLE_COLORS;
    const size = randomInRange(this.options.minSize, this.options.maxSize);

    return {
      x: randomInRange(0, w),
      y: randomY ? randomInRange(0, h) : randomInRange(h + 20, h + 80),
      size,
      speedY: randomInRange(0.7, 1.8) * this.options.speed * (1 + (this.options.maxSize - size) / this.options.maxSize * 0.5),
      color: randomChoice(colors),
      wobbleSpeed: randomInRange(0.02, 0.04),
      wobblePhase: randomInRange(0, Math.PI * 2),
      wobbleAmp: randomInRange(0.6, 2.0) * this.options.wobble,
      stretchPhase: randomInRange(0, Math.PI * 2),
      stretchSpeed: randomInRange(0.03, 0.06),
      opacity: randomInRange(0.4, 0.8) * this.options.opacity,
    };
  }

  _spawnPop(x, y, size, color) {
    const num = Math.min(8, Math.floor(size / 3));
    for (let i = 0; i < num; i++) {
      const angle = randomInRange(0, Math.PI * 2);
      const spd = randomInRange(1, 3.5);
      this.popParticles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        life: 1.0,
        decay: randomInRange(0.07, 0.14),
        size: randomInRange(1, 2.5),
      });
    }
  }

  onResize(w, h) {
    if (!this.bubbles || !this.canvasManager) return;
    const width = w || this.canvasManager.width;
    const height = h || this.canvasManager.height;
    for (const b of this.bubbles) {
      if (b.x > width + 50) b.x = randomInRange(0, width);
      if (b.y > height + 50) b.y = randomInRange(0, height);
    }
  }

  onUpdate(changed) {
    if (changed.count !== undefined) {
      const targetCount = Math.max(1, Math.floor(this.options.count));
      while (this.bubbles.length < targetCount) {
        this.bubbles.push(this._createBubble(false));
      }
      if (this.bubbles.length > targetCount) {
        this.bubbles.length = targetCount;
      }
    }
  }

  _drawBubble(ctx, b) {
    const { x, y, size, color, opacity } = b;

    ctx.save();
    ctx.translate(x, y);

    // Subtle breathing / wobble deformation
    const stretch = 1 + Math.sin(b.stretchPhase) * 0.06;
    ctx.scale(stretch, 2 - stretch);

    // Translucent glass body fill
    const grad = ctx.createRadialGradient(
      -size * 0.3,
      -size * 0.3,
      size * 0.1,
      0,
      0,
      size
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.7, normalizeColor(color, opacity * 0.25));
    grad.addColorStop(0.95, normalizeColor(color, opacity * 0.8));
    grad.addColorStop(1, normalizeColor(color, opacity * 0.95));

    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Outer rim highlight
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = normalizeColor(color, opacity);
    ctx.stroke();

    // Main Specular highlight (top-left arc)
    ctx.beginPath();
    ctx.ellipse(
      -size * 0.38,
      -size * 0.38,
      size * 0.32,
      size * 0.15,
      -Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();

    // Secondary subtle bottom reflection
    ctx.beginPath();
    ctx.ellipse(
      size * 0.28,
      size * 0.28,
      size * 0.18,
      size * 0.08,
      -Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
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

    for (let i = 0; i < this.bubbles.length; i++) {
      const b = this.bubbles[i];

      b.wobblePhase += b.wobbleSpeed * timeRatio;
      b.stretchPhase += b.stretchSpeed * timeRatio;
      b.y -= b.speedY * timeRatio;
      b.x += Math.sin(b.wobblePhase) * b.wobbleAmp * timeRatio;

      // When reaching top, pop!
      if (b.y <= -b.size) {
        this._spawnPop(b.x, 10, b.size, b.color);
        b.y = h + randomInRange(20, 60);
        b.x = randomInRange(0, w);
        b.size = randomInRange(this.options.minSize, this.options.maxSize);
      }

      this._drawBubble(ctx, b);
    }

    // Pop particles
    if (this.popParticles.length > 0) {
      for (let i = this.popParticles.length - 1; i >= 0; i--) {
        const p = this.popParticles[i];
        p.x += p.vx * timeRatio;
        p.y += p.vy * timeRatio;
        p.life -= p.decay * timeRatio;

        if (p.life <= 0) {
          this.popParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = normalizeColor(p.color, p.life * 0.8);
        ctx.fill();
      }
    }
  }
}

/**
 * Creates and starts a Bubbles effect.
 * @param {BubblesOptions} [options]
 * @returns {BubblesEffect}
 */
export function bubbles(options) {
  return new BubblesEffect(options);
}

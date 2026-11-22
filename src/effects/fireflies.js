/**
 * Fireflies Effect
 * Bioluminescent glowing particles with organic floating motion and pulsing auras.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, randomChoice, normalizeColor } from '../core/utils.js';

const DEFAULT_FIREFLY_COLORS = [
  '#a3e635', // lime
  '#facc15', // yellow
  '#4ade80', // mint
  '#22c55e', // green
  '#38bdf8', // cyan
];

/**
 * @typedef {Object} FirefliesOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {number} [count=40] Number of fireflies
 * @property {number} [speed=1] Flight speed multiplier
 * @property {string[]|string} [colors] Firefly colors
 * @property {number} [minSize=2] Minimum core size
 * @property {number} [maxSize=5] Maximum core size
 * @property {number} [glowSize=24] Outer glow radius
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class FirefliesEffect extends BaseEffect {
  /**
   * @param {FirefliesOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 40,
      speed: 1,
      colors: DEFAULT_FIREFLY_COLORS,
      minSize: 2,
      maxSize: 5,
      glowSize: 24,
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
      this.particles.push(this._createFirefly());
    }
  }

  _getColors() {
    if (Array.isArray(this.options.colors) && this.options.colors.length) {
      return this.options.colors;
    }
    if (typeof this.options.colors === 'string') {
      return [this.options.colors];
    }
    return DEFAULT_FIREFLY_COLORS;
  }

  _createFirefly() {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const colors = this._getColors();

    const angle = randomInRange(0, Math.PI * 2);
    const speed = randomInRange(0.4, 1.2) * this.options.speed;

    return {
      x: randomInRange(0, w),
      y: randomInRange(0, h),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      angle,
      size: randomInRange(this.options.minSize, this.options.maxSize),
      color: randomChoice(colors),
      glowPhase: randomInRange(0, Math.PI * 2),
      glowSpeed: randomInRange(0.02, 0.05),
      wanderAngle: randomInRange(-0.08, 0.08),
      wanderTimer: 0,
      wanderInterval: randomInRange(30, 90),
    };
  }

  onResize(w, h) {
    if (!this.particles || !this.canvasManager) return;
    const width = w || this.canvasManager.width;
    const height = h || this.canvasManager.height;
    for (const p of this.particles) {
      if (p.x > width) p.x = randomInRange(0, width);
      if (p.y > height) p.y = randomInRange(0, height);
    }
  }

  onUpdate(changed) {
    if (changed.count !== undefined) {
      const targetCount = Math.max(1, Math.floor(this.options.count));
      while (this.particles.length < targetCount) {
        this.particles.push(this._createFirefly());
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

    const timeRatio = deltaMs / 16.67;
    const glowRadius = this.options.glowSize;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Organic wandering behavior
      p.wanderTimer += timeRatio;
      if (p.wanderTimer >= p.wanderInterval) {
        p.wanderAngle = randomInRange(-0.06, 0.06);
        p.wanderTimer = 0;
        p.wanderInterval = randomInRange(30, 90);
      }

      p.angle += p.wanderAngle * timeRatio;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
      p.vx = Math.cos(p.angle) * speed;
      p.vy = Math.sin(p.angle) * speed;

      p.x += p.vx * timeRatio;
      p.y += p.vy * timeRatio;

      // Soft boundary bouncing
      const margin = 40;
      if (p.x < margin) p.vx += 0.05 * timeRatio;
      if (p.x > w - margin) p.vx -= 0.05 * timeRatio;
      if (p.y < margin) p.vy += 0.05 * timeRatio;
      if (p.y > h - margin) p.vy -= 0.05 * timeRatio;

      // Wrap if pushed completely outside
      if (p.x < -20) p.x = w + 10;
      if (p.x > w + 20) p.x = -10;
      if (p.y < -20) p.y = h + 10;
      if (p.y > h + 20) p.y = -10;

      // Pulsing glow aura
      p.glowPhase += p.glowSpeed * timeRatio;
      const pulse = (Math.sin(p.glowPhase) + 1) / 2; // 0 to 1
      const alpha = 0.25 + pulse * 0.75;
      const currentGlow = glowRadius * (0.7 + pulse * 0.5);

      // Radial glow gradient
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentGlow);
      grad.addColorStop(0, normalizeColor(p.color, alpha * 0.8));
      grad.addColorStop(0.3, normalizeColor(p.color, alpha * 0.35));
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, currentGlow, 0, Math.PI * 2);
      ctx.fill();

      // Sharp bright core
      ctx.beginPath();
      ctx.fillStyle = normalizeColor('#ffffff', alpha);
      ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Creates and starts a Fireflies effect.
 * @param {FirefliesOptions} [options]
 * @returns {FirefliesEffect}
 */
export function fireflies(options) {
  return new FirefliesEffect(options);
}

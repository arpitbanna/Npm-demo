/**
 * Rain Effect
 * Realistic falling rain streaks with ground splashes and optional lightning flashes.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, normalizeColor } from '../core/utils.js';

/**
 * @typedef {Object} RainOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {number} [count=200] Rain streak density
 * @property {number} [speed=16] Rain falling speed
 * @property {string} [color='#93c5fd'] Rain droplet color
 * @property {number} [wind=1.5] Horizontal wind offset
 * @property {number} [length=22] Rain streak length
 * @property {boolean} [splashes=true] Enable bottom splash particles
 * @property {boolean} [lightning=false] Enable occasional lightning flash
 * @property {number} [lightningInterval=6000] Interval between lightning flashes in ms
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class RainEffect extends BaseEffect {
  /**
   * @param {RainOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 200,
      speed: 16,
      color: '#93c5fd',
      wind: 1.5,
      length: 22,
      splashes: true,
      lightning: false,
      lightningInterval: 6000,
      zIndex: 9999,
      respectReducedMotion: true,
      autoStart: true,
    };
    super(defaults, options);
  }

  init() {
    this.drops = [];
    this.splashes = [];
    this.lightningAlpha = 0;
    this.lastLightningTime = performance.now();

    const count = Math.max(1, Math.floor(this.options.count));
    for (let i = 0; i < count; i++) {
      this.drops.push(this._createDrop(true));
    }
  }

  _createDrop(randomY = false) {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;

    return {
      x: randomInRange(-50, w + 50),
      y: randomY ? randomInRange(0, h) : randomInRange(-50, -10),
      length: randomInRange(this.options.length * 0.7, this.options.length * 1.3),
      speed: randomInRange(0.8, 1.2) * this.options.speed,
      opacity: randomInRange(0.3, 0.75),
      thickness: randomInRange(1, 2),
    };
  }

  _spawnSplash(x, y) {
    if (!this.options.splashes) return;
    const numParticles = 3;
    for (let i = 0; i < numParticles; i++) {
      this.splashes.push({
        x,
        y,
        vx: randomInRange(-2, 2) + this.options.wind * 0.3,
        vy: randomInRange(-1.5, -3.5),
        life: 1.0,
        decay: randomInRange(0.06, 0.12),
        size: randomInRange(0.8, 1.8),
      });
    }
  }

  onResize(w, h) {
    if (!this.drops || !this.canvasManager) return;
    const width = w || this.canvasManager.width;
    const height = h || this.canvasManager.height;
    for (const d of this.drops) {
      if (d.x > width + 100) d.x = randomInRange(-20, width);
      if (d.y > height + 50) d.y = randomInRange(0, height);
    }
  }

  onUpdate(changed) {
    if (changed.count !== undefined) {
      const targetCount = Math.max(1, Math.floor(this.options.count));
      while (this.drops.length < targetCount) {
        this.drops.push(this._createDrop(false));
      }
      if (this.drops.length > targetCount) {
        this.drops.length = targetCount;
      }
    }
  }

  render(deltaMs, timestamp) {
    const ctx = this.canvasManager.ctx;
    if (!ctx) return;

    const w = this.canvasManager.width;
    const h = this.canvasManager.height;
    ctx.clearRect(0, 0, w, h);

    const timeRatio = deltaMs / 16.67;
    const wind = this.options.wind;
    const color = this.options.color;

    // Lightning Flash Effect
    if (this.options.lightning) {
      if (timestamp - this.lastLightningTime > this.options.lightningInterval) {
        this.lightningAlpha = 0.65;
        this.lastLightningTime = timestamp + randomInRange(-2000, 2000);
      }

      if (this.lightningAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha})`;
        ctx.fillRect(0, 0, w, h);
        this.lightningAlpha -= 0.05 * timeRatio;
        if (this.lightningAlpha < 0) this.lightningAlpha = 0;
      }
    }

    // Draw Rain Drops
    ctx.lineCap = 'round';
    for (let i = 0; i < this.drops.length; i++) {
      const d = this.drops[i];

      d.y += d.speed * timeRatio;
      d.x += wind * timeRatio;

      if (d.y >= h - 5) {
        this._spawnSplash(d.x, h - 3);
        d.y = randomInRange(-40, -10);
        d.x = randomInRange(-50, w + 50);
      } else if (d.x > w + 50) {
        d.x = -30;
      } else if (d.x < -50) {
        d.x = w + 30;
      }

      ctx.beginPath();
      ctx.strokeStyle = normalizeColor(color, d.opacity);
      ctx.lineWidth = d.thickness;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - wind * (d.length / d.speed), d.y - d.length);
      ctx.stroke();
    }

    // Draw Splash Particles
    if (this.options.splashes && this.splashes.length > 0) {
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const s = this.splashes[i];
        s.vy += 0.2 * timeRatio; // Gravity
        s.x += s.vx * timeRatio;
        s.y += s.vy * timeRatio;
        s.life -= s.decay * timeRatio;

        if (s.life <= 0) {
          this.splashes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = normalizeColor(color, s.life * 0.8);
        ctx.fill();
      }
    }
  }
}

/**
 * Creates and starts a Rain effect.
 * @param {RainOptions} [options]
 * @returns {RainEffect}
 */
export function rain(options) {
  return new RainEffect(options);
}

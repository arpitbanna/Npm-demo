/**
 * Confetti Celebration Effect
 * Vibrant celebratory particles with 3D tilt, gravity, drag, and multi-shape rendering.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, randomChoice, degToRad, normalizeColor } from '../core/utils.js';

const DEFAULT_CONFETTI_COLORS = [
  '#ff4081', // pink
  '#00e5ff', // cyan
  '#ffeb3b', // yellow
  '#76ff03', // lime
  '#e040fb', // purple
  '#ff9100', // orange
  '#3d5afe', // royal blue
];

/**
 * @typedef {Object} ConfettiOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {number} [count=100] Number of confetti particles
 * @property {string[]} [colors] Array of hex/rgb color strings
 * @property {('square'|'circle'|'triangle'|'ribbon')[]} [shapes=['square', 'circle', 'triangle', 'ribbon']]
 * @property {number} [speed=1] Speed multiplier
 * @property {number} [gravity=0.25] Gravity pulling particles down
 * @property {number} [drag=0.04] Air drag resistance
 * @property {boolean} [continuous=true] Continuous rain vs one-shot burst
 * @property {Object} [origin={ x: 0.5, y: 0.3 }] Origin coordinates (0 to 1 normalized, or pixels)
 * @property {number} [spread=90] Burst spread in degrees (for burst mode)
 * @property {number} [velocity=35] Initial burst velocity
 * @property {number} [angle=90] Burst launch angle in degrees (90 = straight up)
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class ConfettiEffect extends BaseEffect {
  /**
   * @param {ConfettiOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      count: 100,
      colors: DEFAULT_CONFETTI_COLORS,
      shapes: ['square', 'circle', 'triangle', 'ribbon'],
      speed: 1,
      gravity: 0.25,
      drag: 0.04,
      continuous: true,
      origin: { x: 0.5, y: 0.3 },
      spread: 90,
      velocity: 35,
      angle: 90,
      zIndex: 9999,
      respectReducedMotion: true,
      autoStart: true,
    };
    super(defaults, options);
  }

  init() {
    this.particles = [];
    const count = Math.max(1, Math.floor(this.options.count));

    if (this.options.continuous) {
      for (let i = 0; i < count; i++) {
        this.particles.push(this._createContinuousParticle(true));
      }
    } else {
      this.burst({
        count,
        origin: this.options.origin,
        spread: this.options.spread,
        velocity: this.options.velocity,
        angle: this.options.angle,
      });
    }
  }

  _createContinuousParticle(randomY = false) {
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const colors = (this.options.colors && this.options.colors.length) ? this.options.colors : DEFAULT_CONFETTI_COLORS;
    const shapes = (this.options.shapes && this.options.shapes.length) ? this.options.shapes : ['square', 'circle', 'triangle', 'ribbon'];

    return {
      x: randomInRange(0, w),
      y: randomY ? randomInRange(0, h) : randomInRange(-50, -10),
      vx: randomInRange(-1.5, 1.5),
      vy: randomInRange(2, 5) * this.options.speed,
      size: randomInRange(7, 14),
      color: randomChoice(colors),
      shape: randomChoice(shapes),
      rotation: randomInRange(0, 360),
      rotationSpeed: randomInRange(-4, 4),
      tilt: randomInRange(0, 360),
      tiltSpeed: randomInRange(2, 6),
      opacity: 1,
      isBurst: false,
    };
  }

  /**
   * Fires a burst of confetti particles.
   * @param {Object} [burstOpts]
   */
  burst(burstOpts = {}) {
    const opts = { ...this.options, ...burstOpts };
    const count = opts.count || 80;
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;

    let originX = (opts.origin && opts.origin.x !== undefined) ? opts.origin.x : 0.5;
    let originY = (opts.origin && opts.origin.y !== undefined) ? opts.origin.y : 0.5;

    // Support 0-1 normalized or absolute pixels
    const px = originX <= 1 ? originX * w : originX;
    const py = originY <= 1 ? originY * h : originY;

    const baseAngleRad = degToRad(opts.angle !== undefined ? opts.angle : 90);
    const halfSpreadRad = degToRad((opts.spread !== undefined ? opts.spread : 70) / 2);
    const colors = (opts.colors && opts.colors.length) ? opts.colors : DEFAULT_CONFETTI_COLORS;
    const shapes = (opts.shapes && opts.shapes.length) ? opts.shapes : ['square', 'circle', 'triangle', 'ribbon'];

    for (let i = 0; i < count; i++) {
      const angle = baseAngleRad + randomInRange(-halfSpreadRad, halfSpreadRad);
      const vel = randomInRange(opts.velocity * 0.5, opts.velocity * 1.3) * (opts.speed || 1);
      // Canvas Y is downwards, so velocity upward means negative Y
      const vx = Math.cos(angle) * vel;
      const vy = -Math.sin(angle) * vel;

      this.particles.push({
        x: px,
        y: py,
        vx,
        vy,
        size: randomInRange(8, 16),
        color: randomChoice(colors),
        shape: randomChoice(shapes),
        rotation: randomInRange(0, 360),
        rotationSpeed: randomInRange(-6, 6),
        tilt: randomInRange(0, 360),
        tiltSpeed: randomInRange(3, 8),
        opacity: 1,
        isBurst: true,
      });
    }

    if (!this.isActive()) {
      this.start();
    }
  }

  onUpdate(changed) {
    if (changed.count !== undefined && this.options.continuous) {
      const targetCount = Math.max(1, Math.floor(this.options.count));
      while (this.particles.length < targetCount) {
        this.particles.push(this._createContinuousParticle(false));
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
    const gravity = this.options.gravity;
    const drag = this.options.drag;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics
      p.vy += gravity * timeRatio;
      p.vx -= p.vx * drag * timeRatio;
      p.vy -= p.vy * (drag * 0.5) * timeRatio;

      p.x += p.vx * timeRatio;
      p.y += p.vy * timeRatio;

      p.rotation += p.rotationSpeed * timeRatio;
      p.tilt += p.tiltSpeed * timeRatio;

      // Draw particle with 3D tilt projection
      const tiltCos = Math.cos(degToRad(p.tilt));
      const width = p.size;
      const height = p.size * Math.abs(tiltCos);

      // Fade out burst particles when near the bottom or stopped
      if (p.isBurst) {
        if (p.y > h - 50) {
          p.opacity -= 0.02 * timeRatio;
        }
        if (p.opacity <= 0 || p.y > h + 50) {
          this.particles.splice(i, 1);
          continue;
        }
      } else {
        // Continuous wrap-around
        if (p.y > h + 30) {
          p.y = -20;
          p.x = randomInRange(0, w);
          p.vy = randomInRange(2, 5) * this.options.speed;
          p.vx = randomInRange(-1.5, 1.5);
        }
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(degToRad(p.rotation));
      ctx.fillStyle = normalizeColor(p.color, Math.max(0, p.opacity));

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.ellipse(0, 0, width / 2, Math.max(1, height / 2), 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(0, -height / 2);
        ctx.lineTo(width / 2, height / 2);
        ctx.lineTo(-width / 2, height / 2);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        ctx.fillRect(-width * 0.7, -height * 0.3, width * 1.4, Math.max(1.5, height * 0.6));
      } else {
        // Square / rectangle default
        ctx.fillRect(-width / 2, -height / 2, width, Math.max(1, height));
      }

      ctx.restore();
    }
  }
}

/**
 * Creates and starts a Confetti effect.
 * @param {ConfettiOptions} [options]
 * @returns {ConfettiEffect}
 */
export function confetti(options) {
  return new ConfettiEffect(options);
}

/**
 * Convenient shortcut to trigger a one-shot burst.
 * @param {ConfettiOptions} [options]
 * @returns {ConfettiEffect}
 */
confetti.burst = function(options = {}) {
  const instance = new ConfettiEffect({
    ...options,
    continuous: false,
    autoStart: true,
  });
  return instance;
};

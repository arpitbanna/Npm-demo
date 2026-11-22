/**
 * Animation loop manager for magicui-effects
 * Handles requestAnimationFrame, delta time, page visibility pauses, and reduced motion.
 */

import { isReducedMotion } from './utils.js';

export class AnimationLoop {
  /**
   * @param {Object} options
   * @param {(deltaTime: number, timestamp: number) => void} options.onTick Frame callback.
   * @param {boolean} [options.respectReducedMotion=true] Stop or reduce animation if system prefers reduced motion.
   * @param {number} [options.maxDelta=100] Maximum delta time in ms to avoid large leaps when switching tabs.
   */
  constructor(options = {}) {
    this.onTick = options.onTick || (() => {});
    this.respectReducedMotion = options.respectReducedMotion !== false;
    this.maxDelta = options.maxDelta || 100;

    this.rafId = null;
    this.running = false;
    this.lastTime = 0;
    this._visibilityHandler = this._visibilityHandler.bind(this);
    this._loop = this._loop.bind(this);

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._visibilityHandler);
    }
  }

  _visibilityHandler() {
    if (document.hidden) {
      if (this.running) {
        this._pauseInternal();
      }
    } else {
      if (this.running) {
        this.lastTime = performance.now();
        this._scheduleNext();
      }
    }
  }

  _loop(timestamp) {
    if (!this.running) return;

    if (this.lastTime === 0) {
      this.lastTime = timestamp;
    }

    const deltaMs = Math.min(timestamp - this.lastTime, this.maxDelta);
    this.lastTime = timestamp;

    try {
      this.onTick(deltaMs, timestamp);
    } catch (err) {
      console.error('[magicui-effects] Error in animation frame tick:', err);
    }

    if (this.running) {
      this._scheduleNext();
    }
  }

  _scheduleNext() {
    if (typeof window !== 'undefined') {
      this.rafId = window.requestAnimationFrame(this._loop);
    }
  }

  _pauseInternal() {
    if (this.rafId && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  start() {
    if (this.running) return;

    if (this.respectReducedMotion && isReducedMotion()) {
      // If user prefers reduced motion, render single frame and don't loop
      this.running = false;
      this.onTick(16, performance.now());
      return;
    }

    this.running = true;
    this.lastTime = 0;
    this._scheduleNext();
  }

  stop() {
    this.running = false;
    this._pauseInternal();
  }

  destroy() {
    this.stop();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
    }
  }

  isRunning() {
    return this.running;
  }
}

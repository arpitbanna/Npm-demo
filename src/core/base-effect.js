/**
 * Base effect class for magicui-effects
 * Provides consistent lifecycle methods (start, stop, toggle, destroy, update)
 * and canvas integration.
 */

import { CanvasManager } from './canvas.js';
import { AnimationLoop } from './animation.js';

export class BaseEffect {
  /**
   * @param {Object} defaultOptions Default options for this effect.
   * @param {Object} userOptions User-provided options.
   */
  constructor(defaultOptions = {}, userOptions = {}) {
    this.options = { ...defaultOptions, ...userOptions };
    this.isDestroyed = false;

    // Initialize Canvas Manager
    this.canvasManager = new CanvasManager({
      target: this.options.target,
      zIndex: this.options.zIndex,
      className: this.options.className,
      pointerEvents: this.options.pointerEvents,
      onResize: (w, h, dpr) => this.onResize(w, h, dpr),
    });

    // Initialize Animation Loop
    this.loop = new AnimationLoop({
      onTick: (delta, time) => this.render(delta, time),
      respectReducedMotion: this.options.respectReducedMotion !== false,
    });

    // Subclasses initialize particles/state
    this.init();

    // Auto-start unless explicitly set to false
    if (this.options.autoStart !== false) {
      this.start();
    }
  }

  /**
   * Subclasses should override to initialize particles and state.
   */
  init() {}

  /**
   * Subclasses should override to render each frame.
   * @param {number} _deltaTime Time since last frame in ms.
   * @param {number} _timestamp Total elapsed timestamp.
   */
  render(_deltaTime, _timestamp) {}

  /**
   * Subclasses should override to handle canvas resize.
   * @param {number} _width
   * @param {number} _height
   * @param {number} _dpr
   */
  onResize(_width, _height, _dpr) {}

  /**
   * Starts or resumes the effect.
   * @returns {this}
   */
  start() {
    if (this.isDestroyed) return this;
    this.loop.start();
    return this;
  }

  /**
   * Stops/pauses the effect without destroying the canvas.
   * @returns {this}
   */
  stop() {
    this.loop.stop();
    return this;
  }

  /**
   * Toggles the effect between running and stopped.
   * @returns {boolean} Whether the effect is now running.
   */
  toggle() {
    if (this.loop.isRunning()) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  /**
   * Clears the canvas.
   * @returns {this}
   */
  clear() {
    this.canvasManager.clear();
    return this;
  }

  /**
   * Updates options dynamically while running.
   * @param {Object} newOptions
   * @returns {this}
   */
  update(newOptions = {}) {
    if (this.isDestroyed) return this;
    this.options = { ...this.options, ...newOptions };
    this.onUpdate(newOptions);
    return this;
  }

  /**
   * Hook called when options are updated.
   * Subclasses can reconfigure particle pools or colors.
   * @param {Object} _changedOptions
   */
  onUpdate(_changedOptions) {}

  /**
   * Destroys canvas, animation loop, and frees all memory.
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.stop();
    this.loop.destroy();
    this.canvasManager.destroy();
  }

  /**
   * Returns the underlying HTMLCanvasElement.
   * @returns {HTMLCanvasElement|null}
   */
  getCanvas() {
    return this.canvasManager ? this.canvasManager.canvas : null;
  }

  /**
   * Returns whether the effect is currently animating.
   * @returns {boolean}
   */
  isActive() {
    return !this.isDestroyed && this.loop.isRunning();
  }

  /**
   * Returns the current state/options of the effect.
   * @returns {Object}
   */
  getState() {
    return {
      active: this.isActive(),
      destroyed: this.isDestroyed,
      options: { ...this.options },
    };
  }
}

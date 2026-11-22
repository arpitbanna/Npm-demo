/**
 * MagicUI Effects - Professional JavaScript Animation & Particle Library
 * Ultra-lightweight, customizable visual effects for modern web applications.
 *
 * @license MIT
 */

import { SnowEffect, snow } from './effects/snow.js';
import { ConfettiEffect, confetti } from './effects/confetti.js';
import { HeartsEffect, hearts } from './effects/hearts.js';
import { StarsEffect, stars } from './effects/stars.js';
import { FirefliesEffect, fireflies } from './effects/fireflies.js';
import { RainEffect, rain } from './effects/rain.js';
import { BubblesEffect, bubbles } from './effects/bubbles.js';
import { MatrixEffect, matrix } from './effects/matrix.js';

import { BaseEffect } from './core/base-effect.js';
import { CanvasManager } from './core/canvas.js';
import { AnimationLoop } from './core/animation.js';
import { isReducedMotion, normalizeColor, randomInRange, clamp } from './core/utils.js';

// Named exports for individual effect factories
export {
  snow,
  confetti,
  hearts,
  stars,
  fireflies,
  rain,
  bubbles,
  matrix,
};

// Named exports for Effect Classes
export {
  SnowEffect,
  ConfettiEffect,
  HeartsEffect,
  StarsEffect,
  FirefliesEffect,
  RainEffect,
  BubblesEffect,
  MatrixEffect,
};

// Core architecture exports
export {
  BaseEffect,
  CanvasManager,
  AnimationLoop,
  isReducedMotion,
  normalizeColor,
  randomInRange,
  clamp,
};

// Default export containing entire suite
const MagicUI = {
  snow,
  confetti,
  hearts,
  stars,
  fireflies,
  rain,
  bubbles,
  matrix,
  SnowEffect,
  ConfettiEffect,
  HeartsEffect,
  StarsEffect,
  FirefliesEffect,
  RainEffect,
  BubblesEffect,
  MatrixEffect,
  BaseEffect,
  CanvasManager,
  AnimationLoop,
  isReducedMotion,
};

export default MagicUI;

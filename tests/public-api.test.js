import { describe, it, expect } from 'vitest';
import MagicUI, {
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
  normalizeColor,
  clamp,
} from '../src/index.js';

describe('Public API Exports', () => {
  it('exports all 8 effect factory functions', () => {
    expect(typeof snow).toBe('function');
    expect(typeof confetti).toBe('function');
    expect(typeof confetti.burst).toBe('function');
    expect(typeof hearts).toBe('function');
    expect(typeof stars).toBe('function');
    expect(typeof fireflies).toBe('function');
    expect(typeof rain).toBe('function');
    expect(typeof bubbles).toBe('function');
    expect(typeof matrix).toBe('function');
  });

  it('exports all effect classes', () => {
    expect(SnowEffect).toBeDefined();
    expect(ConfettiEffect).toBeDefined();
    expect(HeartsEffect).toBeDefined();
    expect(StarsEffect).toBeDefined();
    expect(FirefliesEffect).toBeDefined();
    expect(RainEffect).toBeDefined();
    expect(BubblesEffect).toBeDefined();
    expect(MatrixEffect).toBeDefined();
  });

  it('exports core classes and utilities', () => {
    expect(BaseEffect).toBeDefined();
    expect(CanvasManager).toBeDefined();
    expect(AnimationLoop).toBeDefined();
    expect(typeof isReducedMotion).toBe('function');
    expect(typeof normalizeColor).toBe('function');
    expect(typeof clamp).toBe('function');
  });

  it('exports default MagicUI object with matching properties', () => {
    expect(MagicUI.snow).toBe(snow);
    expect(MagicUI.confetti).toBe(confetti);
    expect(MagicUI.hearts).toBe(hearts);
    expect(MagicUI.stars).toBe(stars);
    expect(MagicUI.fireflies).toBe(fireflies);
    expect(MagicUI.rain).toBe(rain);
    expect(MagicUI.bubbles).toBe(bubbles);
    expect(MagicUI.matrix).toBe(matrix);
    expect(MagicUI.BaseEffect).toBe(BaseEffect);
  });
});

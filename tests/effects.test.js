import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
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
} from '../src/index.js';

describe('All 8 Effects Lifecycle and Options', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'stage';
    container.style.width = '600px';
    container.style.height = '400px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  const effects = [
    { name: 'snow', fn: snow, cls: SnowEffect, defaultOpt: { count: 80, speed: 2 } },
    { name: 'confetti', fn: confetti, cls: ConfettiEffect, defaultOpt: { count: 60, speed: 1.5 } },
    { name: 'hearts', fn: hearts, cls: HeartsEffect, defaultOpt: { count: 25, speed: 1.2 } },
    { name: 'stars', fn: stars, cls: StarsEffect, defaultOpt: { count: 90, speed: 1.1 } },
    { name: 'fireflies', fn: fireflies, cls: FirefliesEffect, defaultOpt: { count: 30, speed: 1.3 } },
    { name: 'rain', fn: rain, cls: RainEffect, defaultOpt: { count: 120, speed: 14 } },
    { name: 'bubbles', fn: bubbles, cls: BubblesEffect, defaultOpt: { count: 20, speed: 1.2 } },
    { name: 'matrix', fn: matrix, cls: MatrixEffect, defaultOpt: { fontSize: 14, speed: 1.5 } },
  ];

  effects.forEach(({ name, fn, cls, defaultOpt }) => {
    describe(`${name} effect`, () => {
      it('initializes with default options without errors', () => {
        const instance = fn({ target: container });
        expect(instance).toBeInstanceOf(cls);
        expect(instance.isActive()).toBe(true);
        expect(instance.getCanvas()).toBeDefined();
        expect(container.contains(instance.getCanvas())).toBe(true);

        const state = instance.getState();
        expect(state.active).toBe(true);
        expect(state.destroyed).toBe(false);

        instance.destroy();
        expect(instance.getState().destroyed).toBe(true);
      });

      it('accepts and applies custom configuration', () => {
        const instance = fn({
          target: container,
          ...defaultOpt,
          zIndex: 50,
          autoStart: false,
        });

        expect(instance.options.zIndex).toBe(50);
        expect(instance.isActive()).toBe(false);

        instance.start();
        expect(instance.isActive()).toBe(true);

        instance.stop();
        expect(instance.isActive()).toBe(false);

        instance.toggle();
        expect(instance.isActive()).toBe(true);

        instance.destroy();
      });

      it('updates parameters dynamically via .update()', () => {
        const instance = fn({ target: container });
        instance.update({ speed: 4.5, count: 150 });
        expect(instance.options.speed).toBe(4.5);

        // Rendering a tick doesn't throw
        expect(() => instance.render(16.67, 1000)).not.toThrow();

        instance.destroy();
      });

      it('cleans up completely on destroy()', () => {
        const instance = fn({ target: container });
        const canvas = instance.getCanvas();
        expect(container.contains(canvas)).toBe(true);

        instance.destroy();
        expect(instance.isDestroyed).toBe(true);
        expect(instance.isActive()).toBe(false);
        expect(container.contains(canvas)).toBe(false);
      });
    });
  });

  describe('Special Effect Features', () => {
    it('supports confetti.burst() one-shot trigger', () => {
      const burstInstance = confetti.burst({
        target: container,
        count: 50,
        velocity: 40,
      });

      expect(burstInstance).toBeInstanceOf(ConfettiEffect);
      expect(burstInstance.particles.length).toBeGreaterThan(0);
      expect(burstInstance.particles[0].isBurst).toBe(true);
      burstInstance.destroy();
    });

    it('supports calling .burst() on an existing confetti instance', () => {
      const instance = confetti({ target: container, continuous: true });
      const initialCount = instance.particles.length;

      instance.burst({ count: 30 });
      expect(instance.particles.length).toBe(initialCount + 30);
      instance.destroy();
    });

    it('supports rain lightning flash option', () => {
      const rainInstance = rain({
        target: container,
        lightning: true,
      });
      expect(rainInstance.options.lightning).toBe(true);
      expect(() => rainInstance.render(16, performance.now() + 10000)).not.toThrow();
      rainInstance.destroy();
    });

    it('supports stars shooting stars option', () => {
      const starsInstance = stars({
        target: container,
        shootingStars: true,
      });
      expect(starsInstance.options.shootingStars).toBe(true);
      expect(() => starsInstance.render(16, performance.now() + 10000)).not.toThrow();
      starsInstance.destroy();
    });

    it('allows multiple concurrent effects without interference', () => {
      const c1 = document.createElement('div');
      const c2 = document.createElement('div');
      document.body.appendChild(c1);
      document.body.appendChild(c2);

      const snowInst = snow({ target: c1, count: 50 });
      const rainInst = rain({ target: c2, count: 60 });

      expect(c1.querySelector('canvas')).toBe(snowInst.getCanvas());
      expect(c2.querySelector('canvas')).toBe(rainInst.getCanvas());
      expect(snowInst.getCanvas()).not.toBe(rainInst.getCanvas());

      snowInst.destroy();
      rainInst.destroy();

      document.body.removeChild(c1);
      document.body.removeChild(c2);
    });
  });
});

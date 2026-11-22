import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanvasManager } from '../src/core/canvas.js';
import { AnimationLoop } from '../src/core/animation.js';
import { normalizeColor, clamp, randomInRange, randomChoice, degToRad } from '../src/core/utils.js';

describe('Core Utilities', () => {
  it('normalizes hex colors correctly', () => {
    expect(normalizeColor('#ffffff')).toBe('rgba(255, 255, 255, 1)');
    expect(normalizeColor('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
    expect(normalizeColor('#ff0000')).toBe('rgba(255, 0, 0, 1)');
    expect(normalizeColor('#fff')).toBe('rgba(255, 255, 255, 1)');
  });

  it('normalizes rgba strings and overrides alpha if specified', () => {
    expect(normalizeColor('rgba(100, 150, 200, 0.8)')).toBe('rgba(100, 150, 200, 0.8)');
    expect(normalizeColor('rgba(100, 150, 200, 0.8)', 0.3)).toBe('rgba(100, 150, 200, 0.3)');
  });

  it('clamps values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('generates random numbers in range', () => {
    for (let i = 0; i < 20; i++) {
      const val = randomInRange(5, 15);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThan(15);
    }
  });

  it('picks random choice from array', () => {
    const arr = ['a', 'b', 'c'];
    const choice = randomChoice(arr);
    expect(arr).toContain(choice);
  });

  it('converts degrees to radians accurately', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    expect(degToRad(0)).toBe(0);
  });
});

describe('CanvasManager', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    container.style.width = '500px';
    container.style.height = '400px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('creates and attaches canvas element in target container', () => {
    const cm = new CanvasManager({ target: container, zIndex: 1234, className: 'custom-effect' });
    expect(cm.canvas).toBeDefined();
    expect(container.contains(cm.canvas)).toBe(true);
    expect(cm.canvas.style.zIndex).toBe('1234');
    expect(cm.canvas.classList.contains('custom-effect')).toBe(true);
    expect(cm.canvas.classList.contains('magicui-effects-canvas')).toBe(true);
    cm.destroy();
  });

  it('supports target element as CSS selector string', () => {
    const cm = new CanvasManager({ target: '#test-container' });
    expect(cm.canvas).toBeDefined();
    expect(container.contains(cm.canvas)).toBe(true);
    cm.destroy();
  });

  it('mounts to document.body when target is omitted', () => {
    const cm = new CanvasManager();
    expect(cm.canvas).toBeDefined();
    expect(document.body.contains(cm.canvas)).toBe(true);
    expect(cm.canvas.style.position).toBe('fixed');
    cm.destroy();
    expect(document.body.contains(cm.canvas)).toBe(false);
  });

  it('removes canvas and cleans up on destroy', () => {
    const cm = new CanvasManager({ target: container });
    expect(container.contains(cm.canvas)).toBe(true);
    cm.destroy();
    expect(cm.canvas).toBeNull();
    expect(container.querySelector('canvas')).toBeNull();
  });
});

describe('AnimationLoop', () => {
  it('starts and stops gracefully', () => {
    let ticks = 0;
    const loop = new AnimationLoop({
      onTick: () => {
        ticks++;
      },
    });

    expect(loop.isRunning()).toBe(false);
    loop.start();
    expect(loop.isRunning()).toBe(true);
    loop.stop();
    expect(loop.isRunning()).toBe(false);
    loop.destroy();
  });
});

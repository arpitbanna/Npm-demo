/**
 * Utility functions for magicui-effects
 */

/**
 * Checks whether the user has requested reduced motion.
 * @returns {boolean}
 */
export function isReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns a random floating point number between min and max (inclusive of min, exclusive of max).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Picks a random item from an array.
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export function randomChoice(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Clamps a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between a and b.
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Converts degrees to radians.
 * @param {number} degrees
 * @returns {number}
 */
export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Parses any color format (hex, rgb, rgba, named) to RGBA object or string.
 * Supports #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(), rgba(), and color names.
 * @param {string} color
 * @param {number} [overrideAlpha]
 * @returns {string} rgba(...) string
 */
export function normalizeColor(color, overrideAlpha) {
  if (!color || typeof color !== 'string') {
    const a = overrideAlpha !== undefined ? overrideAlpha : 1;
    return `rgba(255, 255, 255, ${a})`;
  }

  const str = color.trim().toLowerCase();

  // Handle #hex
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('') + 'ff';
    } else if (hex.length === 4) {
      hex = hex.split('').map(c => c + c).join('');
    } else if (hex.length === 6) {
      hex += 'ff';
    }

    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = overrideAlpha !== undefined ? overrideAlpha : parseInt(hex.slice(6, 8), 16) / 255;
      return `rgba(${r}, ${g}, ${b}, ${clamp(a, 0, 1)})`;
    }
  }

  // Handle rgb / rgba
  const rgbaMatch = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const origA = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
    const a = overrideAlpha !== undefined ? overrideAlpha : origA;
    return `rgba(${r}, ${g}, ${b}, ${clamp(a, 0, 1)})`;
  }

  // For named colors or other formats, if overrideAlpha is provided and we are in browser, convert via offscreen canvas
  if (overrideAlpha !== undefined && typeof document !== 'undefined') {
    try {
      const dummy = document.createElement('div');
      dummy.style.color = str;
      document.body.appendChild(dummy);
      const computed = window.getComputedStyle(dummy).color;
      document.body.removeChild(dummy);
      const m = computed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (m) {
        return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${clamp(overrideAlpha, 0, 1)})`;
      }
    } catch {
      // Fallback
    }
  }

  return color;
}

/**
 * Matrix Digital Rain Effect
 * Iconic falling green glyphs with glowing heads and fading phosphor trails.
 */

import { BaseEffect } from '../core/base-effect.js';
import { randomInRange, randomChoice, normalizeColor } from '../core/utils.js';

const DEFAULT_CHARS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1234567890ABCDEF<>*+-/=%$#@!';

/**
 * @typedef {Object} MatrixOptions
 * @property {HTMLElement|string} [target] Container element or selector
 * @property {string} [characters] Custom string of characters to cascade
 * @property {number} [fontSize=16] Font size in pixels
 * @property {number} [speed=1] Falling speed multiplier
 * @property {string} [color='#00ff66'] Main glyph trail color (classic matrix green)
 * @property {string} [headColor='#ffffff'] Glowing leading character color
 * @property {number} [density=1] Column density factor
 * @property {number} [fadeSpeed=0.08] Fade trail persistence (0.03 to 0.2)
 * @property {number} [zIndex=9999] Canvas z-index
 * @property {boolean} [respectReducedMotion=true]
 * @property {boolean} [autoStart=true]
 */

export class MatrixEffect extends BaseEffect {
  /**
   * @param {MatrixOptions} [options]
   */
  constructor(options = {}) {
    const defaults = {
      characters: DEFAULT_CHARS,
      fontSize: 16,
      speed: 1,
      color: '#00ff66',
      headColor: '#ffffff',
      density: 1,
      fadeSpeed: 0.08,
      zIndex: 9999,
      respectReducedMotion: true,
      autoStart: true,
    };
    super(defaults, options);
  }

  init() {
    this._setupColumns();
  }

  _setupColumns() {
    if (!this.canvasManager) return;
    const w = this.canvasManager.width || 800;
    const h = this.canvasManager.height || 600;
    const fontSize = Math.max(10, Math.floor(this.options.fontSize));
    const columnCount = Math.floor((w / fontSize) * (this.options.density || 1));

    this.columns = [];
    const chars = this.options.characters || DEFAULT_CHARS;

    for (let i = 0; i < columnCount; i++) {
      this.columns.push({
        x: (i * (w / columnCount)),
        y: randomInRange(-h, 0),
        speed: randomInRange(2, 6) * this.options.speed,
        length: Math.floor(randomInRange(8, 28)),
        currentChar: randomChoice(chars),
        charChangeTimer: 0,
        charChangeInterval: randomInRange(3, 8),
      });
    }
  }

  onResize() {
    this._setupColumns();
  }

  onUpdate(changed) {
    if (changed.fontSize !== undefined || changed.density !== undefined) {
      this._setupColumns();
    }
  }

  render(deltaMs) {
    const ctx = this.canvasManager.ctx;
    if (!ctx) return;

    const w = this.canvasManager.width;
    const h = this.canvasManager.height;
    ctx.clearRect(0, 0, w, h);

    const timeRatio = deltaMs / 16.67;
    const fontSize = this.options.fontSize;
    const chars = this.options.characters || DEFAULT_CHARS;
    const baseColor = this.options.color;
    const headColor = this.options.headColor;

    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];

      col.y += col.speed * timeRatio;
      col.charChangeTimer += timeRatio;
      if (col.charChangeTimer >= col.charChangeInterval) {
        col.currentChar = randomChoice(chars);
        col.charChangeTimer = 0;
      }

      // Draw trailing glyphs
      for (let j = 0; j < col.length; j++) {
        const glyphY = col.y - j * fontSize;
        if (glyphY < -fontSize || glyphY > h) continue;

        if (j === 0) {
          // Leading character (bright glow)
          ctx.fillStyle = headColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = baseColor;
          ctx.fillText(col.currentChar, col.x, glyphY);
          ctx.shadowBlur = 0; // reset
        } else {
          // Trail fade
          const alpha = Math.max(0.05, 1 - (j / col.length));
          ctx.fillStyle = normalizeColor(baseColor, alpha);
          // Pick a character based on position hash for stability
          const charIdx = Math.abs(Math.floor(glyphY + col.x)) % chars.length;
          ctx.fillText(chars[charIdx], col.x, glyphY);
        }
      }

      // Reset when column has passed the bottom screen
      if (col.y - col.length * fontSize > h) {
        col.y = randomInRange(-100, 0);
        col.speed = randomInRange(2, 6) * this.options.speed;
        col.length = Math.floor(randomInRange(8, 28));
      }
    }
  }
}

/**
 * Creates and starts a Matrix effect.
 * @param {MatrixOptions} [options]
 * @returns {MatrixEffect}
 */
export function matrix(options) {
  return new MatrixEffect(options);
}

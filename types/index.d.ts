/**
 * TypeScript Declarations for magicui-effects
 */

export interface CommonEffectOptions {
  /** Target element or selector. If omitted, renders fullscreen on document.body. */
  target?: HTMLElement | string | null;
  /** Canvas z-index. Default: 9999 */
  zIndex?: number;
  /** Custom CSS class names to apply to the canvas */
  className?: string;
  /** Whether the canvas intercepts pointer clicks (default: false, click-through) */
  pointerEvents?: boolean;
  /** Respect OS prefers-reduced-motion setting. Default: true */
  respectReducedMotion?: boolean;
  /** Whether to automatically begin animation on initialization. Default: true */
  autoStart?: boolean;
}

export interface EffectInstance<TOptions = any> {
  start(): this;
  stop(): this;
  toggle(): boolean;
  clear(): this;
  update(options: Partial<TOptions>): this;
  destroy(): void;
  getCanvas(): HTMLCanvasElement | null;
  isActive(): boolean;
  getState(): {
    active: boolean;
    destroyed: boolean;
    options: TOptions;
  };
}

export class BaseEffect<TOptions = any> implements EffectInstance<TOptions> {
  constructor(defaultOptions?: Record<string, any>, userOptions?: Partial<TOptions>);
  options: TOptions;
  isDestroyed: boolean;
  start(): this;
  stop(): this;
  toggle(): boolean;
  clear(): this;
  update(options: Partial<TOptions>): this;
  destroy(): void;
  getCanvas(): HTMLCanvasElement | null;
  isActive(): boolean;
  getState(): {
    active: boolean;
    destroyed: boolean;
    options: TOptions;
  };
}

// Snow
export interface SnowOptions extends CommonEffectOptions {
  count?: number;
  speed?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  wind?: number;
  opacity?: number;
}
export class SnowEffect extends BaseEffect<SnowOptions> {}
export function snow(options?: SnowOptions): SnowEffect;

// Confetti
export type ConfettiShape = 'square' | 'circle' | 'triangle' | 'ribbon';
export interface ConfettiOptions extends CommonEffectOptions {
  count?: number;
  colors?: string[];
  shapes?: ConfettiShape[];
  speed?: number;
  gravity?: number;
  drag?: number;
  continuous?: boolean;
  origin?: { x: number; y: number };
  spread?: number;
  velocity?: number;
  angle?: number;
}
export class ConfettiEffect extends BaseEffect<ConfettiOptions> {
  burst(burstOpts?: Partial<ConfettiOptions>): void;
}
export interface ConfettiFunction {
  (options?: ConfettiOptions): ConfettiEffect;
  burst(options?: Partial<ConfettiOptions>): ConfettiEffect;
}
export const confetti: ConfettiFunction;

// Hearts
export interface HeartsOptions extends CommonEffectOptions {
  count?: number;
  speed?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  sway?: number;
  opacity?: number;
}
export class HeartsEffect extends BaseEffect<HeartsOptions> {}
export function hearts(options?: HeartsOptions): HeartsEffect;

// Stars
export interface StarsOptions extends CommonEffectOptions {
  count?: number;
  speed?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  shootingStars?: boolean;
  shootingStarInterval?: number;
}
export class StarsEffect extends BaseEffect<StarsOptions> {}
export function stars(options?: StarsOptions): StarsEffect;

// Fireflies
export interface FirefliesOptions extends CommonEffectOptions {
  count?: number;
  speed?: number;
  colors?: string[] | string;
  minSize?: number;
  maxSize?: number;
  glowSize?: number;
}
export class FirefliesEffect extends BaseEffect<FirefliesOptions> {}
export function fireflies(options?: FirefliesOptions): FirefliesEffect;

// Rain
export interface RainOptions extends CommonEffectOptions {
  count?: number;
  speed?: number;
  color?: string;
  wind?: number;
  length?: number;
  splashes?: boolean;
  lightning?: boolean;
  lightningInterval?: number;
}
export class RainEffect extends BaseEffect<RainOptions> {}
export function rain(options?: RainOptions): RainEffect;

// Bubbles
export interface BubblesOptions extends CommonEffectOptions {
  count?: number;
  speed?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  wobble?: number;
  opacity?: number;
}
export class BubblesEffect extends BaseEffect<BubblesOptions> {}
export function bubbles(options?: BubblesOptions): BubblesEffect;

// Matrix
export interface MatrixOptions extends CommonEffectOptions {
  characters?: string;
  fontSize?: number;
  speed?: number;
  color?: string;
  headColor?: string;
  density?: number;
  fadeSpeed?: number;
}
export class MatrixEffect extends BaseEffect<MatrixOptions> {}
export function matrix(options?: MatrixOptions): MatrixEffect;

// Utilities
export function isReducedMotion(): boolean;
export function normalizeColor(color: string, overrideAlpha?: number): string;
export function randomInRange(min: number, max: number): number;
export function clamp(val: number, min: number, max: number): number;

declare const MagicUI: {
  snow: typeof snow;
  confetti: typeof confetti;
  hearts: typeof hearts;
  stars: typeof stars;
  fireflies: typeof fireflies;
  rain: typeof rain;
  bubbles: typeof bubbles;
  matrix: typeof matrix;
  SnowEffect: typeof SnowEffect;
  ConfettiEffect: typeof ConfettiEffect;
  HeartsEffect: typeof HeartsEffect;
  StarsEffect: typeof StarsEffect;
  FirefliesEffect: typeof FirefliesEffect;
  RainEffect: typeof RainEffect;
  BubblesEffect: typeof BubblesEffect;
  MatrixEffect: typeof MatrixEffect;
  BaseEffect: typeof BaseEffect;
  isReducedMotion: typeof isReducedMotion;
};

export default MagicUI;

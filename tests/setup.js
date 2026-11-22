/**
 * Test setup: Initializes Happy DOM environment and Canvas 2D mocks
 */
import { Window } from 'happy-dom';

const win = new Window({
  url: 'http://localhost:3000',
  width: 1024,
  height: 768,
});

globalThis.window = win;
globalThis.document = win.document;
globalThis.HTMLElement = win.HTMLElement;
globalThis.HTMLCanvasElement = win.HTMLCanvasElement;
globalThis.ResizeObserver = win.ResizeObserver;
// Safely bind navigator if configurable
try {
  Object.defineProperty(globalThis, 'navigator', {
    value: win.navigator,
    configurable: true,
    writable: true,
  });
} catch {
  // Builtin navigator is present
}
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock matchMedia
win.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// Mock Canvas 2D Context
const mockGradient = {
  addColorStop: () => {},
};

const mockContext = {
  canvas: null,
  clearRect: () => {},
  fillRect: () => {},
  beginPath: () => {},
  closePath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  bezierCurveTo: () => {},
  arc: () => {},
  ellipse: () => {},
  fill: () => {},
  stroke: () => {},
  save: () => {},
  restore: () => {},
  scale: () => {},
  rotate: () => {},
  translate: () => {},
  setTransform: () => {},
  createRadialGradient: () => mockGradient,
  createLinearGradient: () => mockGradient,
  fillText: () => {},
  measureText: () => ({ width: 10 }),
  fillStyle: '#000000',
  strokeStyle: '#000000',
  lineWidth: 1,
  lineCap: 'butt',
  shadowBlur: 0,
  shadowColor: 'transparent',
  font: '10px sans-serif',
  textBaseline: 'alphabetic',
};

win.HTMLCanvasElement.prototype.getContext = function (type) {
  if (type === '2d') {
    mockContext.canvas = this;
    return mockContext;
  }
  return null;
};

win.HTMLCanvasElement.prototype.getBoundingClientRect = function () {
  return {
    top: 0,
    left: 0,
    width: 800,
    height: 600,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => {},
  };
};

win.HTMLElement.prototype.getBoundingClientRect = function () {
  return {
    top: 0,
    left: 0,
    width: 800,
    height: 600,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => {},
  };
};

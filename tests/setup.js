/**
 * Vitest setup file: Mocks Canvas 2D context and RequestAnimationFrame for happy-dom
 */

// Mock requestAnimationFrame / cancelAnimationFrame if needed
if (typeof window !== 'undefined') {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => clearTimeout(id);
  }

  // Mock matchMedia
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  // Mock HTMLCanvasElement getContext
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

  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
      mockContext.canvas = this;
      return mockContext;
    }
    return null;
  };

  HTMLCanvasElement.prototype.getBoundingClientRect = function () {
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
}

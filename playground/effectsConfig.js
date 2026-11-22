import {
  snow,
  confetti,
  hearts,
  stars,
  fireflies,
  rain,
  bubbles,
  matrix
} from 'magicui-effects';

export const EFFECTS_CONFIG = [
  {
    id: 'snow',
    name: 'Snow',
    tagline: 'Falling Snowflakes',
    icon: '❄️',
    description: 'Realistic falling snowflakes with natural sway, wind drift, and depth opacity.',
    factory: snow,
    defaultOptions: {
      count: 90,
      speed: 1.8,
      minSize: 1.5,
      maxSize: 4.5,
      wind: 0.8,
      color: '#ffffff',
    },
    controls: [
      { key: 'count', label: 'Particle Count', type: 'range', min: 20, max: 250, step: 10 },
      { key: 'speed', label: 'Falling Speed', type: 'range', min: 0.5, max: 5, step: 0.2 },
      { key: 'wind', label: 'Wind Drift', type: 'range', min: -3, max: 3, step: 0.2 },
      { key: 'color', label: 'Snow Color', type: 'color' },
    ],
    presets: [
      { label: 'Blizzard', options: { count: 200, speed: 3.5, wind: 2.0 } },
      { label: 'Gentle Flurry', options: { count: 40, speed: 1.0, wind: 0.2 } },
    ],
    importSnippet: `import { snow } from 'magicui-effects';

const effect = snow({
  target: containerRef.current,
  count: 90,
  speed: 1.8,
  wind: 0.8,
  color: '#ffffff',
});`
  },
  {
    id: 'confetti',
    name: 'Confetti',
    tagline: 'Celebration Bursts',
    icon: '🎉',
    description: 'Vibrant celebratory confetti burst and continuous gravity-driven stream.',
    factory: confetti,
    hasBurstAction: true,
    defaultOptions: {
      count: 70,
      speed: 2.5,
      gravity: 0.45,
      spread: 90,
      continuous: true,
    },
    controls: [
      { key: 'count', label: 'Confetti Pieces', type: 'range', min: 20, max: 200, step: 10 },
      { key: 'speed', label: 'Initial Velocity', type: 'range', min: 1, max: 6, step: 0.5 },
      { key: 'gravity', label: 'Gravity Pull', type: 'range', min: 0.1, max: 1.5, step: 0.1 },
      { key: 'spread', label: 'Arc Spread (°)', type: 'range', min: 30, max: 180, step: 10 },
    ],
    presets: [
      { label: 'Fiesta Stream', options: { count: 120, speed: 3.5, gravity: 0.4 } },
      { label: 'Slow Float', options: { count: 45, speed: 1.5, gravity: 0.2 } },
    ],
    importSnippet: `import { confetti } from 'magicui-effects';

// Continuous stream or single burst:
const effect = confetti({
  target: containerRef.current,
  count: 70,
  gravity: 0.45,
});

// Or trigger on click:
effect.burst({ count: 100, velocity: 20 });`
  },
  {
    id: 'hearts',
    name: 'Hearts',
    tagline: 'Floating Valentine Hearts',
    icon: '💖',
    description: 'Harmonically swaying romantic floating hearts with delicate opacity and physics.',
    factory: hearts,
    defaultOptions: {
      count: 30,
      speed: 1.4,
      sway: 1.5,
      minSize: 12,
      maxSize: 26,
    },
    controls: [
      { key: 'count', label: 'Heart Count', type: 'range', min: 10, max: 80, step: 5 },
      { key: 'speed', label: 'Rise Speed', type: 'range', min: 0.5, max: 4, step: 0.2 },
      { key: 'sway', label: 'Sway Amplitude', type: 'range', min: 0.5, max: 3, step: 0.2 },
      { key: 'maxSize', label: 'Max Size (px)', type: 'range', min: 16, max: 44, step: 2 },
    ],
    presets: [
      { label: 'Love Shower', options: { count: 60, speed: 2.4, sway: 2.2 } },
      { label: 'Gentle Drift', options: { count: 20, speed: 1.0, sway: 0.8 } },
    ],
    importSnippet: `import { hearts } from 'magicui-effects';

const effect = hearts({
  target: containerRef.current,
  count: 30,
  speed: 1.4,
  sway: 1.5,
});`
  },
  {
    id: 'stars',
    name: 'Stars',
    tagline: 'Twinkling Night Sky',
    icon: '✨',
    description: 'Mesmerizing starry night with rhythmic scintillation and shooting star meteors.',
    factory: stars,
    defaultOptions: {
      count: 90,
      speed: 1.0,
      shootingStars: true,
      shootingStarInterval: 3000,
      minSize: 1.0,
      maxSize: 3.0,
    },
    controls: [
      { key: 'count', label: 'Star Count', type: 'range', min: 30, max: 200, step: 10 },
      { key: 'speed', label: 'Twinkle Rate', type: 'range', min: 0.4, max: 3, step: 0.2 },
      { key: 'shootingStars', label: 'Shooting Stars', type: 'boolean' },
    ],
    presets: [
      { label: 'Meteor Storm', options: { count: 140, speed: 2.0, shootingStars: true, shootingStarInterval: 1200 } },
      { label: 'Calm Galaxy', options: { count: 70, speed: 0.8, shootingStars: false } },
    ],
    importSnippet: `import { stars } from 'magicui-effects';

const effect = stars({
  target: containerRef.current,
  count: 90,
  shootingStars: true,
  shootingStarInterval: 3000,
});`
  },
  {
    id: 'fireflies',
    name: 'Fireflies',
    tagline: 'Bioluminescent Glow',
    icon: '💡',
    description: 'Organic wandering fireflies with pulsing warm neon halos and natural swarm paths.',
    factory: fireflies,
    defaultOptions: {
      count: 28,
      speed: 1.2,
      glowSize: 6,
      minSize: 2,
      maxSize: 4.5,
    },
    controls: [
      { key: 'count', label: 'Firefly Count', type: 'range', min: 10, max: 70, step: 5 },
      { key: 'speed', label: 'Flight Speed', type: 'range', min: 0.4, max: 3, step: 0.2 },
      { key: 'glowSize', label: 'Glow Radius', type: 'range', min: 2, max: 12, step: 1 },
    ],
    presets: [
      { label: 'Enchanted Meadow', options: { count: 50, glowSize: 9, speed: 1.6 } },
      { label: 'Subtle Twilight', options: { count: 18, glowSize: 4, speed: 0.8 } },
    ],
    importSnippet: `import { fireflies } from 'magicui-effects';

const effect = fireflies({
  target: containerRef.current,
  count: 28,
  glowSize: 6,
  speed: 1.2,
});`
  },
  {
    id: 'rain',
    name: 'Rain',
    tagline: 'Atmospheric Rainfall',
    icon: '🌧️',
    description: 'Realistic falling raindrops with surface splash particles and electric lightning bursts.',
    factory: rain,
    defaultOptions: {
      count: 130,
      speed: 14,
      wind: -1.2,
      splashes: true,
      lightning: true,
      lightningInterval: 5000,
    },
    controls: [
      { key: 'count', label: 'Drop Count', type: 'range', min: 40, max: 280, step: 15 },
      { key: 'speed', label: 'Fall Velocity', type: 'range', min: 6, max: 26, step: 2 },
      { key: 'wind', label: 'Wind Angle', type: 'range', min: -4, max: 4, step: 0.4 },
      { key: 'splashes', label: 'Ground Splashes', type: 'boolean' },
      { key: 'lightning', label: 'Thunder & Lightning', type: 'boolean' },
    ],
    presets: [
      { label: 'Downpour & Lightning', options: { count: 240, speed: 20, wind: -2.5, lightning: true, splashes: true } },
      { label: 'Misty Drizzle', options: { count: 70, speed: 9, wind: 0.2, lightning: false, splashes: false } },
    ],
    importSnippet: `import { rain } from 'magicui-effects';

const effect = rain({
  target: containerRef.current,
  count: 130,
  speed: 14,
  wind: -1.2,
  splashes: true,
  lightning: true,
});`
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    tagline: 'Translucent Rising Orbs',
    icon: '🫧',
    description: 'Translucent chromatic bubbles with buoyant sway, iridescent highlights, and pop effect.',
    factory: bubbles,
    defaultOptions: {
      count: 32,
      speed: 1.5,
      wobble: 1.4,
      minSize: 8,
      maxSize: 28,
    },
    controls: [
      { key: 'count', label: 'Bubble Count', type: 'range', min: 10, max: 80, step: 5 },
      { key: 'speed', label: 'Ascent Speed', type: 'range', min: 0.5, max: 4, step: 0.2 },
      { key: 'wobble', label: 'Buoyancy Wobble', type: 'range', min: 0.5, max: 3, step: 0.2 },
      { key: 'maxSize', label: 'Max Radius (px)', type: 'range', min: 16, max: 48, step: 2 },
    ],
    presets: [
      { label: 'Underwater Rush', options: { count: 65, speed: 2.8, wobble: 2.2 } },
      { label: 'Lazy Bubbles', options: { count: 18, speed: 0.9, wobble: 0.9 } },
    ],
    importSnippet: `import { bubbles } from 'magicui-effects';

const effect = bubbles({
  target: containerRef.current,
  count: 32,
  speed: 1.5,
  wobble: 1.4,
});`
  },
  {
    id: 'matrix',
    name: 'Matrix',
    tagline: 'Digital Rain Cascade',
    icon: '⚡',
    description: 'Iconic falling cyber glyph cascade with glowing leading glyphs and phosphor trail fade.',
    factory: matrix,
    defaultOptions: {
      fontSize: 14,
      speed: 1.2,
      color: '#00ff41',
      headColor: '#d1fae5',
      density: 0.95,
    },
    controls: [
      { key: 'fontSize', label: 'Font Size (px)', type: 'range', min: 10, max: 24, step: 1 },
      { key: 'speed', label: 'Stream Speed', type: 'range', min: 0.5, max: 3, step: 0.2 },
      { key: 'color', label: 'Rain Color', type: 'color' },
    ],
    presets: [
      { label: 'Cyber Neon Pink', options: { color: '#ff007f', headColor: '#fbcfe8', speed: 1.5 } },
      { label: 'Classic Phosphor Green', options: { color: '#00ff41', headColor: '#d1fae5', speed: 1.2 } },
    ],
    importSnippet: `import { matrix } from 'magicui-effects';

const effect = matrix({
  target: containerRef.current,
  fontSize: 14,
  speed: 1.2,
  color: '#00ff41',
  headColor: '#d1fae5',
});`
  },
];

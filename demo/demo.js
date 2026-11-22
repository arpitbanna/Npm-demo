/**
 * MagicUI Effects Interactive Playground & Demo Script
 */

import {
  snow,
  confetti,
  hearts,
  stars,
  fireflies,
  rain,
  bubbles,
  matrix
} from '../src/index.js';

// State
let activeEffectName = 'snow';
let currentEffect = null;
let isFullscreenMode = false;
let isPaused = false;

// Effect definitions with default parameters & controls configuration
const EFFECT_CONFIGS = {
  snow: {
    name: 'Snow',
    icon: '❄️',
    description: 'Realistic falling snowflakes with wind drift and soft depth.',
    factory: snow,
    defaults: {
      count: 120,
      speed: 1.8,
      minSize: 1.5,
      maxSize: 4.5,
      wind: 0.8,
      color: '#ffffff',
    },
    controls: [
      { key: 'count', label: 'Snowflake Count', type: 'range', min: 20, max: 350, step: 5 },
      { key: 'speed', label: 'Falling Speed', type: 'range', min: 0.5, max: 5, step: 0.1 },
      { key: 'minSize', label: 'Min Size (px)', type: 'range', min: 1, max: 4, step: 0.5 },
      { key: 'maxSize', label: 'Max Size (px)', type: 'range', min: 3, max: 10, step: 0.5 },
      { key: 'wind', label: 'Wind Drift', type: 'range', min: -3, max: 3, step: 0.2 },
      { key: 'color', label: 'Snow Color', type: 'color' },
    ]
  },
  confetti: {
    name: 'Confetti',
    icon: '🎉',
    description: 'Vibrant celebratory confetti burst and continuous fiesta.',
    factory: confetti,
    defaults: {
      count: 120,
      speed: 1.2,
      gravity: 0.28,
      drag: 0.04,
      continuous: true,
      spread: 90,
      velocity: 35,
    },
    controls: [
      { key: 'count', label: 'Particle Count', type: 'range', min: 30, max: 300, step: 10 },
      { key: 'speed', label: 'Fall Speed', type: 'range', min: 0.5, max: 3, step: 0.1 },
      { key: 'gravity', label: 'Gravity', type: 'range', min: 0.1, max: 0.6, step: 0.02 },
      { key: 'velocity', label: 'Burst Velocity', type: 'range', min: 15, max: 60, step: 1 },
      { key: 'continuous', label: 'Continuous Mode', type: 'toggle' },
    ],
    hasBurstButton: true,
  },
  hearts: {
    name: 'Hearts',
    icon: '💖',
    description: 'Gentle, romantic floating hearts swaying upwards with cubic bezier elegance.',
    factory: hearts,
    defaults: {
      count: 40,
      speed: 1.3,
      minSize: 14,
      maxSize: 34,
      sway: 1.4,
    },
    controls: [
      { key: 'count', label: 'Hearts Count', type: 'range', min: 10, max: 120, step: 5 },
      { key: 'speed', label: 'Rise Speed', type: 'range', min: 0.5, max: 3.5, step: 0.1 },
      { key: 'minSize', label: 'Min Size (px)', type: 'range', min: 8, max: 20, step: 1 },
      { key: 'maxSize', label: 'Max Size (px)', type: 'range', min: 22, max: 50, step: 2 },
      { key: 'sway', label: 'Sway Amplitude', type: 'range', min: 0.2, max: 3.0, step: 0.2 },
    ]
  },
  stars: {
    name: 'Stars',
    icon: '✨',
    description: 'Twinkling stars with 4-point diamond sparkles and shooting star streaks.',
    factory: stars,
    defaults: {
      count: 140,
      speed: 1.2,
      minSize: 1,
      maxSize: 3.5,
      shootingStars: true,
      shootingStarInterval: 3500,
    },
    controls: [
      { key: 'count', label: 'Star Count', type: 'range', min: 30, max: 350, step: 10 },
      { key: 'speed', label: 'Twinkle Speed', type: 'range', min: 0.3, max: 3.0, step: 0.1 },
      { key: 'maxSize', label: 'Max Sparkle Size', type: 'range', min: 2, max: 6, step: 0.5 },
      { key: 'shootingStars', label: 'Shooting Stars', type: 'toggle' },
    ]
  },
  fireflies: {
    name: 'Fireflies',
    icon: '🪲',
    description: 'Bioluminescent floating fireflies with soft radial auras and organic paths.',
    factory: fireflies,
    defaults: {
      count: 45,
      speed: 1.1,
      minSize: 2,
      maxSize: 5,
      glowSize: 26,
    },
    controls: [
      { key: 'count', label: 'Firefly Count', type: 'range', min: 10, max: 120, step: 5 },
      { key: 'speed', label: 'Flight Speed', type: 'range', min: 0.4, max: 2.5, step: 0.1 },
      { key: 'glowSize', label: 'Glow Aura Size (px)', type: 'range', min: 12, max: 50, step: 2 },
      { key: 'maxSize', label: 'Core Size (px)', type: 'range', min: 3, max: 8, step: 0.5 },
    ]
  },
  rain: {
    name: 'Rain',
    icon: '🌧️',
    description: 'Realistic falling rain streaks with bottom splash ripples and lightning flashes.',
    factory: rain,
    defaults: {
      count: 220,
      speed: 18,
      wind: 2.0,
      length: 24,
      splashes: true,
      lightning: true,
      lightningInterval: 5000,
      color: '#93c5fd',
    },
    controls: [
      { key: 'count', label: 'Rain Density', type: 'range', min: 50, max: 500, step: 25 },
      { key: 'speed', label: 'Falling Speed', type: 'range', min: 8, max: 35, step: 1 },
      { key: 'wind', label: 'Wind Angle', type: 'range', min: -5, max: 5, step: 0.5 },
      { key: 'length', label: 'Streak Length', type: 'range', min: 10, max: 45, step: 2 },
      { key: 'splashes', label: 'Ground Splashes', type: 'toggle' },
      { key: 'lightning', label: 'Lightning Flash', type: 'toggle' },
      { key: 'color', label: 'Rain Color', type: 'color' },
    ]
  },
  bubbles: {
    name: 'Bubbles',
    icon: '🫧',
    description: 'Translucent floating bubbles with realistic glass sheen and pop physics.',
    factory: bubbles,
    defaults: {
      count: 35,
      speed: 1.2,
      minSize: 10,
      maxSize: 32,
      wobble: 1.2,
      opacity: 0.65,
    },
    controls: [
      { key: 'count', label: 'Bubble Count', type: 'range', min: 10, max: 90, step: 5 },
      { key: 'speed', label: 'Rise Speed', type: 'range', min: 0.5, max: 3.0, step: 0.1 },
      { key: 'minSize', label: 'Min Size (px)', type: 'range', min: 6, max: 18, step: 1 },
      { key: 'maxSize', label: 'Max Size (px)', type: 'range', min: 20, max: 50, step: 2 },
      { key: 'wobble', label: 'Wobble Motion', type: 'range', min: 0.2, max: 2.5, step: 0.1 },
      { key: 'opacity', label: 'Glass Opacity', type: 'range', min: 0.2, max: 1.0, step: 0.05 },
    ]
  },
  matrix: {
    name: 'Matrix',
    icon: '🟢',
    description: 'Iconic falling digital code glyphs with glowing heads and phosphor fade.',
    factory: matrix,
    defaults: {
      fontSize: 16,
      speed: 1.2,
      density: 1.0,
      color: '#00ff66',
      headColor: '#ffffff',
    },
    controls: [
      { key: 'fontSize', label: 'Font Size (px)', type: 'range', min: 11, max: 26, step: 1 },
      { key: 'speed', label: 'Rain Speed', type: 'range', min: 0.5, max: 3.0, step: 0.1 },
      { key: 'density', label: 'Column Density', type: 'range', min: 0.5, max: 2.0, step: 0.1 },
      { key: 'color', label: 'Glyph Color', type: 'color' },
      { key: 'headColor', label: 'Lead Head Color', type: 'color' },
    ]
  }
};

// Current parameter values for each effect
const currentValues = {};
Object.keys(EFFECT_CONFIGS).forEach(key => {
  currentValues[key] = { ...EFFECT_CONFIGS[key].defaults };
});

// DOM Elements
const stageViewport = document.getElementById('stage-viewport');
const effectTabsContainer = document.getElementById('effect-tabs');
const dynamicControlsContainer = document.getElementById('dynamic-controls');
const codeSnippetEl = document.getElementById('code-snippet');
const copyCodeBtn = document.getElementById('copy-code-btn');
const togglePlayBtn = document.getElementById('toggle-play-btn');
const toggleFullscreenBtn = document.getElementById('toggle-fullscreen-btn');
const burstBtn = document.getElementById('burst-btn');
const activeEffectTitle = document.getElementById('active-effect-title');
const activeEffectDesc = document.getElementById('active-effect-desc');
const fpsCounterEl = document.getElementById('fps-counter');

// Simple FPS counter
let lastFpsTime = performance.now();
let frameCount = 0;
function trackFps() {
  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime >= 1000) {
    const fps = Math.round((frameCount * 1000) / (now - lastFpsTime));
    if (fpsCounterEl) fpsCounterEl.textContent = `${fps} FPS`;
    frameCount = 0;
    lastFpsTime = now;
  }
  requestAnimationFrame(trackFps);
}
requestAnimationFrame(trackFps);

/**
 * Initializes or switches the running effect.
 */
function launchEffect(effectName) {
  if (currentEffect) {
    currentEffect.destroy();
    currentEffect = null;
  }

  activeEffectName = effectName;
  const cfg = EFFECT_CONFIGS[effectName];
  const params = { ...currentValues[effectName] };

  const target = isFullscreenMode ? null : stageViewport;
  params.target = target;

  currentEffect = cfg.factory(params);
  isPaused = false;
  if (togglePlayBtn) {
    togglePlayBtn.innerHTML = '<span>⏸</span> Pause';
  }

  if (activeEffectTitle) activeEffectTitle.textContent = `${cfg.icon} ${cfg.name} Effect`;
  if (activeEffectDesc) activeEffectDesc.textContent = cfg.description;

  // Show or hide burst button
  if (burstBtn) {
    burstBtn.style.display = cfg.hasBurstButton ? 'flex' : 'none';
  }

  renderControlInputs();
  updateCodeSnippet();
}

/**
 * Builds the interactive slider and input controls dynamically.
 */
function renderControlInputs() {
  if (!dynamicControlsContainer) return;
  dynamicControlsContainer.innerHTML = '';

  const cfg = EFFECT_CONFIGS[activeEffectName];
  const values = currentValues[activeEffectName];

  cfg.controls.forEach(ctrl => {
    const group = document.createElement('div');
    group.className = 'control-group';

    const currentVal = values[ctrl.key];

    if (ctrl.type === 'range') {
      group.innerHTML = `
        <div class="control-label-row">
          <span>${ctrl.label}</span>
          <span class="control-value" id="val-${ctrl.key}">${currentVal}</span>
        </div>
        <input type="range" id="input-${ctrl.key}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${currentVal}">
      `;

      const input = group.querySelector('input');
      input.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        values[ctrl.key] = val;
        const display = group.querySelector(`#val-${ctrl.key}`);
        if (display) display.textContent = val;

        if (currentEffect) {
          currentEffect.update({ [ctrl.key]: val });
        }
        updateCodeSnippet();
      });
    } else if (ctrl.type === 'toggle') {
      group.innerHTML = `
        <div class="toggle-row">
          <span class="toggle-label">${ctrl.label}</span>
          <label class="toggle-switch">
            <input type="checkbox" id="input-${ctrl.key}" ${currentVal ? 'checked' : ''}>
            <span class="slider-round"></span>
          </label>
        </div>
      `;

      const checkbox = group.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        const val = e.target.checked;
        values[ctrl.key] = val;
        if (currentEffect) {
          currentEffect.update({ [ctrl.key]: val });
        }
        updateCodeSnippet();
      });
    } else if (ctrl.type === 'color') {
      group.innerHTML = `
        <div class="control-label-row">
          <span>${ctrl.label}</span>
          <span class="control-value" id="val-${ctrl.key}">${currentVal}</span>
        </div>
        <div class="color-picker-row">
          <input type="color" id="input-${ctrl.key}" value="${currentVal}">
        </div>
      `;

      const colorInput = group.querySelector('input');
      colorInput.addEventListener('input', (e) => {
        const val = e.target.value;
        values[ctrl.key] = val;
        const display = group.querySelector(`#val-${ctrl.key}`);
        if (display) display.textContent = val;
        if (currentEffect) {
          currentEffect.update({ [ctrl.key]: val });
        }
        updateCodeSnippet();
      });
    }

    dynamicControlsContainer.appendChild(group);
  });
}

/**
 * Updates the live code generator box.
 */
function updateCodeSnippet() {
  if (!codeSnippetEl) return;

  const cfg = EFFECT_CONFIGS[activeEffectName];
  const values = { ...currentValues[activeEffectName] };

  const targetStr = isFullscreenMode ? '' : `  target: '#my-container',\n`;

  // Format params nicely
  const optionsEntries = Object.entries(values)
    .map(([k, v]) => {
      const valStr = typeof v === 'string' ? `'${v}'` : JSON.stringify(v);
      return `  ${k}: ${valStr}`;
    })
    .join(',\n');

  const code = `import { ${activeEffectName} } from 'magicui-effects';

const effect = ${activeEffectName}({\n${targetStr}${optionsEntries}\n});

// Optional controls:
// effect.stop();
// effect.start();
// effect.update({ speed: 2 });
// effect.destroy();`;

  codeSnippetEl.textContent = code;
}

// Copy Code Button handler
if (copyCodeBtn) {
  copyCodeBtn.addEventListener('click', () => {
    if (!codeSnippetEl) return;
    navigator.clipboard.writeText(codeSnippetEl.textContent).then(() => {
      copyCodeBtn.classList.add('copied');
      copyCodeBtn.innerHTML = '<span>✓</span> Copied!';
      setTimeout(() => {
        copyCodeBtn.classList.remove('copied');
        copyCodeBtn.innerHTML = '<span>📋</span> Copy Code';
      }, 2000);
    });
  });
}

// Quick Install Button copy handler
const quickInstallBtns = document.querySelectorAll('.quick-install-btn, #hero-copy-install');
quickInstallBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('npm install magicui-effects').then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<span>✓</span> Copied!';
      setTimeout(() => {
        btn.innerHTML = original;
      }, 2000);
    });
  });
});

// Toggle Play/Pause
if (togglePlayBtn) {
  togglePlayBtn.addEventListener('click', () => {
    if (!currentEffect) return;
    const isNowActive = currentEffect.toggle();
    isPaused = !isNowActive;
    togglePlayBtn.innerHTML = isPaused ? '<span>▶</span> Play' : '<span>⏸</span> Pause';
  });
}

// Fullscreen Toggle
if (toggleFullscreenBtn) {
  toggleFullscreenBtn.addEventListener('click', () => {
    isFullscreenMode = !isFullscreenMode;
    toggleFullscreenBtn.innerHTML = isFullscreenMode
      ? '<span>🔲</span> In Container'
      : '<span>⛶</span> Fullscreen';
    launchEffect(activeEffectName);
  });
}

// Confetti Burst Trigger
if (burstBtn) {
  burstBtn.addEventListener('click', () => {
    if (activeEffectName === 'confetti' && currentEffect) {
      currentEffect.burst({ count: 100, velocity: 45 });
    }
  });
}

// Render Tabs
if (effectTabsContainer) {
  effectTabsContainer.innerHTML = '';
  Object.keys(EFFECT_CONFIGS).forEach(key => {
    const cfg = EFFECT_CONFIGS[key];
    const btn = document.createElement('button');
    btn.className = `effect-tab ${key === activeEffectName ? 'active' : ''}`;
    btn.dataset.effect = key;
    btn.innerHTML = `<span>${cfg.icon}</span> <span>${cfg.name}</span>`;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.effect-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      launchEffect(key);
    });

    effectTabsContainer.appendChild(btn);
  });
}

// Showcase cards click handler
document.querySelectorAll('.effect-card').forEach(card => {
  card.addEventListener('click', () => {
    const effectKey = card.dataset.effect;
    if (effectKey && EFFECT_CONFIGS[effectKey]) {
      const targetTab = document.querySelector(`.effect-tab[data-effect="${effectKey}"]`);
      if (targetTab) targetTab.click();
      const studioSection = document.getElementById('playground');
      if (studioSection) {
        studioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Documentation Tabs (npm / yarn / pnpm / cdn)
const docsTabs = document.querySelectorAll('.docs-tab-btn');
const installCodeSnippet = document.getElementById('install-code');
const installSnippets = {
  npm: 'npm install magicui-effects',
  pnpm: 'pnpm add magicui-effects',
  yarn: 'yarn add magicui-effects',
  cdn: '<script type="module">\n  import { snow } from "https://esm.sh/magicui-effects";\n  snow();\n</script>'
};

docsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    docsTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const type = tab.dataset.tab;
    if (installCodeSnippet && installSnippets[type]) {
      installCodeSnippet.textContent = installSnippets[type];
    }
  });
});

// Launch default effect on load
launchEffect('snow');

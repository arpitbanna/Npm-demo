import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import EffectCard from './components/EffectCard.jsx';
import FullscreenHUD from './components/FullscreenHUD.jsx';
import PackageInspector from './components/PackageInspector.jsx';
import Footer from './components/Footer.jsx';
import { EFFECTS_CONFIG } from './effectsConfig.js';
import { confetti } from 'magicui-effects';
import './App.css';

export default function App() {
  const [fullscreenEffect, setFullscreenEffect] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Trigger a full-screen celebratory burst
  const handleTriggerGlobalBurst = useCallback(() => {
    try {
      confetti({
        target: null, // Fullscreen document.body
        count: 120,
        gravity: 0.35,
        speed: 4,
        spread: 120,
        origin: { x: window.innerWidth / 2, y: window.innerHeight * 0.4 },
      });
    } catch (err) {
      console.error('Failed to trigger burst:', err);
    }
  }, []);

  const handleLaunchFullscreen = useCallback((config) => {
    setFullscreenEffect(config);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenEffect(null);
  }, []);

  // Filter categories
  const categories = [
    { id: 'all', label: 'All Effects (8)' },
    { id: 'celebration', label: 'Celebration & Love', ids: ['confetti', 'hearts'] },
    { id: 'weather', label: 'Weather & Nature', ids: ['snow', 'rain', 'fireflies', 'bubbles'] },
    { id: 'sci-fi', label: 'Space & Cyber', ids: ['stars', 'matrix'] },
  ];

  const filteredEffects = EFFECTS_CONFIG.filter((effect) => {
    if (activeCategory === 'all') return true;
    const cat = categories.find((c) => c.id === activeCategory);
    return cat ? cat.ids.includes(effect.id) : true;
  });

  return (
    <div className="app-root">
      {/* Background ambient lighting gradients */}
      <div className="ambient-glow ambient-glow-1"></div>
      <div className="ambient-glow ambient-glow-2"></div>
      <div className="ambient-glow ambient-glow-3"></div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Header */}
      <Hero onTriggerGlobalBurst={handleTriggerGlobalBurst} />

      {/* Main Effects Showcase Section */}
      <main id="showcase" className="showcase-section">
        <div className="container">
          <div className="showcase-header">
            <div className="section-badge">
              <span className="section-badge-dot"></span>
              <span>Available Effects Suite</span>
            </div>
            <h2 className="section-heading">Interactive Effects Showcase</h2>
            <p className="section-subtext">
              Each effect is rendered into its own isolated card viewport. Use the controls to adjust velocity,
              density, color, or physics in real-time, or trigger special actions and presets.
            </p>

            {/* Category Filter Pills */}
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effects Cards Grid */}
          <div className="effects-grid">
            {filteredEffects.map((effectConfig) => (
              <EffectCard
                key={effectConfig.id}
                config={effectConfig}
                onLaunchFullscreen={handleLaunchFullscreen}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Package Inspector & Runtime Verification */}
      <PackageInspector />

      {/* Footer */}
      <Footer />

      {/* Fullscreen HUD Overlay when user tests an effect in fullscreen */}
      {fullscreenEffect && (
        <FullscreenHUD
          effectConfig={fullscreenEffect}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
}

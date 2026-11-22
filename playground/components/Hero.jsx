import React from 'react';

export default function Hero({ onTriggerGlobalBurst }) {
  return (
    <section className="hero-section">
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>

      <div className="container hero-container">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span className="hero-badge-text">Interactive Live Test Suite</span>
          <span className="hero-badge-pill">npm package: magicui-effects</span>
        </div>

        <h1 className="hero-heading">
          Explore <span className="gradient-text">Interactive Effects</span>
        </h1>

        <p className="hero-description">
          This playground demonstrates and tests the canvas-accelerated visual particle and animation effects
          available in the <code className="inline-code">magicui-effects</code> npm package.
          Experiment with real-time controls, triggers, interactive physics, and presets below.
        </p>

        <div className="hero-highlights">
          <div className="highlight-pill">
            <span className="highlight-icon">⚡</span>
            <span>Zero External Dependencies</span>
          </div>
          <div className="highlight-pill">
            <span className="highlight-icon">🎯</span>
            <span>Canvas 60+ FPS Optimized</span>
          </div>
          <div className="highlight-pill">
            <span className="highlight-icon">📱</span>
            <span>HiDPI & Responsive Scaling</span>
          </div>
          <div className="highlight-pill">
            <span className="highlight-icon">♿</span>
            <span>Prefers-Reduced-Motion Aware</span>
          </div>
        </div>

        <div className="hero-actions">
          <a href="#showcase" className="btn btn-primary">
            Explore Effects Showcase ↓
          </a>
          <button className="btn btn-secondary" onClick={onTriggerGlobalBurst}>
            🎉 Launch Screen Confetti
          </button>
        </div>
      </div>
    </section>
  );
}

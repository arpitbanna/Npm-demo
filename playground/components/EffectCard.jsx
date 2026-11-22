import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function EffectCard({ config, onLaunchFullscreen }) {
  const containerRef = useRef(null);
  const effectInstanceRef = useRef(null);

  const [options, setOptions] = useState(config.defaultOptions);
  const [isActive, setIsActive] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [burstCount, setBurstCount] = useState(0);

  // Initialize and mount effect to containerRef
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Instantiate effect with target container
      const instance = config.factory({
        target: containerRef.current,
        ...options,
        autoStart: true,
      });

      effectInstanceRef.current = instance;
      setIsActive(instance.isActive ? instance.isActive() : true);
    } catch (err) {
      console.error(`Error initializing effect ${config.name}:`, err);
    }

    return () => {
      if (effectInstanceRef.current) {
        try {
          effectInstanceRef.current.destroy();
        } catch (e) {
          console.error(`Error destroying ${config.name}:`, e);
        }
        effectInstanceRef.current = null;
      }
    };
  }, [config.id]); // Re-create if config id changes

  // Update effect options on the fly
  const handleOptionChange = (key, value) => {
    const updated = { ...options, [key]: value };
    setOptions(updated);
    setActivePreset(null);

    if (effectInstanceRef.current) {
      try {
        effectInstanceRef.current.update({ [key]: value });
      } catch (err) {
        console.warn(`Could not update option ${key}:`, err);
      }
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!effectInstanceRef.current) return;
    try {
      const active = effectInstanceRef.current.toggle();
      setIsActive(active);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Reset to default options
  const handleReset = () => {
    const defaults = { ...config.defaultOptions };
    setOptions(defaults);
    setActivePreset(null);

    if (effectInstanceRef.current) {
      try {
        effectInstanceRef.current.update(defaults);
        if (!effectInstanceRef.current.isActive()) {
          effectInstanceRef.current.start();
          setIsActive(true);
        }
      } catch (e) {
        console.error('Reset error:', e);
      }
    }
  };

  // Apply a preset
  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    const updated = { ...options, ...preset.options };
    setOptions(updated);

    if (effectInstanceRef.current) {
      try {
        effectInstanceRef.current.update(preset.options);
        if (!effectInstanceRef.current.isActive()) {
          effectInstanceRef.current.start();
          setIsActive(true);
        }
      } catch (e) {
        console.error('Preset error:', e);
      }
    }
  };

  // Trigger burst action (for confetti)
  const handleBurst = () => {
    if (effectInstanceRef.current && typeof effectInstanceRef.current.burst === 'function') {
      effectInstanceRef.current.burst({
        count: options.count ? options.count * 1.5 : 120,
        velocity: 24,
      });
      setBurstCount(prev => prev + 1);
    }
  };

  return (
    <div className={`effect-card ${isActive ? 'is-running' : 'is-paused'}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">{config.icon}</span>
          <div>
            <h3 className="card-title">{config.name}</h3>
            <span className="card-tagline">{config.tagline}</span>
          </div>
        </div>

        <div className="card-status-badge">
          <span className={`status-dot ${isActive ? 'pulse' : 'idle'}`}></span>
          <span>{isActive ? 'Active' : 'Paused'}</span>
        </div>
      </div>

      {/* Interactive Effect Canvas Viewport */}
      <div className="effect-viewport-wrapper">
        <div
          ref={containerRef}
          className="effect-canvas-container"
          aria-label={`${config.name} visual effect preview`}
        >
          {/* Subtle overlay grid for visual depth */}
          <div className="viewport-grid-overlay"></div>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="viewport-overlay-actions">
          <button
            className={`action-btn-pill ${isActive ? 'pause-mode' : 'play-mode'}`}
            onClick={togglePlay}
            title={isActive ? 'Pause Animation' : 'Start Animation'}
          >
            {isActive ? '⏸ Pause' : '▶ Play'}
          </button>

          {config.hasBurstAction && (
            <button
              className="action-btn-pill burst-mode"
              onClick={handleBurst}
              title="Trigger a confetti burst!"
            >
              🎉 Burst!
            </button>
          )}

          <button
            className="action-btn-pill fullscreen-mode"
            onClick={() => onLaunchFullscreen(config)}
            title="Launch in Fullscreen test mode"
          >
            ⛶ Fullscreen
          </button>
        </div>
      </div>

      {/* Effect Description */}
      <div className="card-description-block">
        <p className="card-description">{config.description}</p>
      </div>

      {/* Presets Row */}
      {config.presets && config.presets.length > 0 && (
        <div className="card-presets-section">
          <span className="presets-label">Presets:</span>
          <div className="presets-list">
            {config.presets.map((preset) => (
              <button
                key={preset.label}
                className={`preset-btn ${activePreset === preset.label ? 'active' : ''}`}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Parameter Controls */}
      <div className="card-controls-section">
        <div className="controls-header">
          <span className="controls-title">Live Controls</span>
          <button className="reset-btn" onClick={handleReset} title="Reset to defaults">
            ↺ Reset
          </button>
        </div>

        <div className="controls-grid">
          {config.controls.map((control) => {
            const val = options[control.key] !== undefined ? options[control.key] : control.min;

            if (control.type === 'range') {
              return (
                <div key={control.key} className="control-item">
                  <div className="control-label-row">
                    <label htmlFor={`${config.id}-${control.key}`}>{control.label}</label>
                    <span className="control-value">{val}</span>
                  </div>
                  <input
                    id={`${config.id}-${control.key}`}
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={val}
                    onChange={(e) => handleOptionChange(control.key, parseFloat(e.target.value))}
                    className="slider-input"
                  />
                </div>
              );
            }

            if (control.type === 'boolean') {
              return (
                <div key={control.key} className="control-item checkbox-item">
                  <label htmlFor={`${config.id}-${control.key}`} className="checkbox-label">
                    <input
                      id={`${config.id}-${control.key}`}
                      type="checkbox"
                      checked={Boolean(val)}
                      onChange={(e) => handleOptionChange(control.key, e.target.checked)}
                      className="checkbox-input"
                    />
                    <span>{control.label}</span>
                  </label>
                </div>
              );
            }

            if (control.type === 'color') {
              return (
                <div key={control.key} className="control-item color-item">
                  <div className="control-label-row">
                    <label htmlFor={`${config.id}-${control.key}`}>{control.label}</label>
                    <span className="color-code">{val}</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input
                      id={`${config.id}-${control.key}`}
                      type="color"
                      value={val}
                      onChange={(e) => handleOptionChange(control.key, e.target.value)}
                      className="color-input"
                    />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Code Snippet Drawer */}
      <div className="card-footer-section">
        <button
          className="code-toggle-btn"
          onClick={() => setShowCode(!showCode)}
          title="Toggle React Integration Code"
        >
          <span>{showCode ? '▲ Hide Code' : '▼ View React Code'}</span>
          <span className="code-lang-tag">React / JS</span>
        </button>

        {showCode && (
          <div className="code-snippet-box">
            <pre>
              <code>{config.importSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

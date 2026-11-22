import React, { useEffect, useRef, useState } from 'react';

export default function FullscreenHUD({ effectConfig, onClose }) {
  const effectRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!effectConfig) return;

    // Launch fullscreen effect on document.body
    try {
      const inst = effectConfig.factory({
        target: null, // Fullscreen document.body mode
        ...effectConfig.defaultOptions,
        autoStart: true,
      });
      effectRef.current = inst;
      setIsActive(true);
    } catch (err) {
      console.error('Failed to launch fullscreen effect:', err);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (effectRef.current) {
        try {
          effectRef.current.destroy();
        } catch (e) {
          console.error('Error destroying fullscreen effect:', e);
        }
        effectRef.current = null;
      }
    };
  }, [effectConfig, onClose]);

  const handleToggle = () => {
    if (effectRef.current) {
      const active = effectRef.current.toggle();
      setIsActive(active);
    }
  };

  const handleBurst = () => {
    if (effectRef.current && typeof effectRef.current.burst === 'function') {
      effectRef.current.burst({ count: 150, velocity: 28 });
    }
  };

  if (!effectConfig) return null;

  return (
    <div className="fullscreen-hud-container">
      <div className="fullscreen-hud-card">
        <div className="hud-header">
          <span className="hud-icon">{effectConfig.icon}</span>
          <div className="hud-meta">
            <h4 className="hud-title">{effectConfig.name} Fullscreen Test</h4>
            <span className="hud-sub">Press ESC or click Exit to return</span>
          </div>
        </div>

        <div className="hud-actions">
          <button className="hud-btn hud-btn-action" onClick={handleToggle}>
            {isActive ? '⏸ Pause' : '▶ Play'}
          </button>

          {effectConfig.hasBurstAction && (
            <button className="hud-btn hud-btn-burst" onClick={handleBurst}>
              🎉 Burst
            </button>
          )}

          <button className="hud-btn hud-btn-close" onClick={onClose}>
            ✕ Exit Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}

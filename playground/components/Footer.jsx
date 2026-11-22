import React from 'react';

export default function Footer() {
  return (
    <footer id="install" className="playground-footer">
      <div className="container footer-content">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="brand-badge-icon">✦</span>
              <span className="footer-title">MagicUI Effects Playground</span>
            </div>
            <p className="footer-tagline">
              A modern, high-performance visual particle animation library for modern web applications and React.
            </p>
            <div className="footer-license-pill">
              MIT License • Zero External Dependencies • 60 FPS Canvas
            </div>
          </div>

          <div className="footer-install-col">
            <h4 className="footer-heading">Quick Install</h4>
            <div className="footer-code-box">
              <code>npm install magicui-effects</code>
            </div>
            <p className="footer-note">
              Compatible with React 17+, React 18, React 19, Next.js, Vite, Vue, Svelte, and vanilla HTML/JS.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Package Links</h4>
            <ul className="footer-link-list">
              <li>
                <a
                  href="https://www.npmjs.com/package/magicui-effects"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npmjs.com/package/magicui-effects ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rajputshashank0907/magicui-effects"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rajputshashank0907/magicui-effects/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report Issues ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MagicUI Effects • Created by Shashank Singh Rajput.</p>
          <p className="footer-tech">Built with React + Vite + CSS</p>
        </div>
      </div>
    </footer>
  );
}

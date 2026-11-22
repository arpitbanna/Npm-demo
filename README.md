# magicui-effects

Lightweight canvas particle effects library for JavaScript and React applications.

## Installation

```bash
npm install magicui-effects
```

## Quick Start

```javascript
import { snow, confetti, hearts, stars, fireflies, rain, bubbles, matrix } from 'magicui-effects';

// Start full-screen snow
const effect = snow({ count: 120, speed: 2 });

// Pause or resume
effect.stop();
effect.start();

// Update parameters
effect.update({ speed: 3 });

// Cleanup
effect.destroy();
```

## Available Effects

- `snow(options)`: Falling snowflakes with wind drift
- `confetti(options)`: Confetti bursts and celebration streams
- `hearts(options)`: Floating heart animations
- `stars(options)`: Twinkling stars with shooting stars
- `fireflies(options)`: Organic bioluminescent motion
- `rain(options)`: Falling rain streaks with splashes and lightning
- `bubbles(options)`: Translucent rising bubbles with wobble
- `matrix(options)`: Digital rain glyph cascades

## React Usage

```jsx
import { useEffect, useRef } from 'react';
import { confetti } from 'magicui-effects';

export function Celebration() {
  const containerRef = useRef(null);

  useEffect(() => {
    const effect = confetti({
      target: containerRef.current,
      count: 100
    });

    return () => {
      effect.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}
```

## Build and Test

```bash
npm test
npm run build
```

## License

MIT

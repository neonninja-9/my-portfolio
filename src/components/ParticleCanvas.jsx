import React, { useRef, useEffect } from 'react';

/**
 * Full-page Matrix code rain easter egg.
 * Columns of falling characters using the site's purple/cyan palette
 * instead of classic green. Toggle via the navbar switch.
 */

// Character set: half-width katakana + digits + some latin
const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]|=+-*&@#';

const CHAR_ARRAY = CHARS.split('');

export default function MatrixRain({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const columnsRef = useRef([]);
  const lastFrameRef = useRef(0);

  // Site palette colors for the rain
  const COLORS = [
    '#8b5cf6', // purple
    '#7c3aed', // purple-dark
    '#a78bfa', // purple-light
    '#3b82f6', // blue
    '#06b6d4', // cyan
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const FONT_SIZE = 14;
    const FPS_INTERVAL = 1000 / 30; // cap at 30fps for that classic feel

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Re-init columns on resize
      const columnCount = Math.ceil(canvas.width / FONT_SIZE);
      columnsRef.current = Array.from({ length: columnCount }, () => ({
        y: Math.random() * -canvas.height, // start above viewport at random heights
        speed: 0.5 + Math.random() * 1.5,  // fall speed multiplier
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (timestamp) => {
      rafRef.current = requestAnimationFrame(animate);

      // Throttle to ~30fps
      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed < FPS_INTERVAL) return;
      lastFrameRef.current = timestamp - (elapsed % FPS_INTERVAL);

      if (!active) {
        // Fade out existing rain
        ctx.fillStyle = 'rgba(3, 3, 5, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      // Semi-transparent overlay for trail effect (the classic matrix fade)
      ctx.fillStyle = 'rgba(3, 3, 5, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      const columns = columnsRef.current;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        const x = i * FONT_SIZE;
        const y = col.y;

        // Leading character — bright white/cyan
        ctx.fillStyle = '#e0f2fe';
        ctx.globalAlpha = 0.9;
        ctx.fillText(char, x, y);

        // Trail character (slightly above) — colored
        ctx.fillStyle = col.color;
        ctx.globalAlpha = 0.7;
        const trailChar = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        ctx.fillText(trailChar, x, y - FONT_SIZE);

        // Dimmer trail
        ctx.globalAlpha = 0.35;
        const dimChar = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        ctx.fillText(dimChar, x, y - FONT_SIZE * 2);

        ctx.globalAlpha = 1;

        // Advance the column
        col.y += FONT_SIZE * col.speed;

        // Reset when off-screen (with random delay for stagger)
        if (col.y > canvas.height + 100) {
          col.y = Math.random() * -200;
          col.speed = 0.5 + Math.random() * 1.5;
          col.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
      aria-hidden="true"
    />
  );
}

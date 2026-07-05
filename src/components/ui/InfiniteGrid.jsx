import { useEffect, useRef } from 'react';

/*
 * Infinite Grid Shader Background
 * ─────────────────────────────────
 * A full-page WebGL canvas that renders an infinite scrolling grid
 * with mouse-tracked spotlight reveal. The grid lines glow near the
 * cursor and fade into the dark background further away.
 */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_scroll;

  // Draw a smooth anti-aliased grid line
  float gridLine(vec2 p, float spacing, float thickness) {
    vec2 grid = abs(fract(p / spacing - 0.5) - 0.5) * spacing;
    float d = min(grid.x, grid.y);
    return 1.0 - smoothstep(0.0, thickness, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 pixel = gl_FragCoord.xy;

    // Flip Y so mouse coords match correctly
    pixel.y = u_resolution.y - pixel.y;

    // Scroll offset — grid drifts slowly + follows page scroll
    vec2 offset = vec2(u_time * 12.0, u_time * 8.0 + u_scroll * 0.5);

    // Shifted pixel coords for grid
    vec2 p = pixel + offset;

    // Multi-scale grid for premium look
    float gridFine   = gridLine(p, 48.0, 1.2);
    float gridCoarse = gridLine(p, 192.0, 2.0);

    // Combine grids
    float grid = gridFine * 0.4 + gridCoarse * 0.8;

    // Mouse spotlight — reveal grid near cursor
    vec2 mouse = u_mouse;
    float dist = length(pixel - mouse);
    
    // Large smooth spotlight
    float spotRadius = 450.0;
    float spot = 1.0 - smoothstep(0.0, spotRadius, dist);
    spot = pow(spot, 1.4); // Adjust falloff

    // Ambient base visibility (grid visible everywhere)
    float ambient = 0.8;

    // Combine: grid visible near mouse, faint elsewhere
    float alpha = grid * (ambient + spot * 0.85);

    // Dynamic colors
    vec3 colorBase = vec3(0.4, 0.4, 0.55);   // Brighter base color so it's clearly visible without hover
    vec3 colorGlow = vec3(0.55, 0.35, 0.95);   // Bright purple glow near mouse
    vec3 colorCyan = vec3(0.1, 0.8, 0.9);      // Secondary cyan highlight
    
    // Mix colors based on mouse distance and coarse grid intersection
    vec3 col = mix(colorBase, colorGlow, spot);
    
    // Add subtle cyan to the thicker grid lines near the mouse
    col = mix(col, colorCyan, gridCoarse * spot * 0.6);

    // Subtle vignette around the screen edges
    float vignette = 1.0 - length((uv - 0.5) * 1.5);
    vignette = clamp(vignette, 0.0, 1.0);

    // Smooth vignette
    vignette = smoothstep(0.0, 0.8, vignette);

    alpha *= vignette;
    alpha = clamp(alpha, 0.0, 1.0);

    // Output straight RGB and alpha for correct blending
    gl_FragColor = vec4(col, alpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function InfiniteGrid() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Compile shaders
    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    // Full-screen quad
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uScroll = gl.getUniformLocation(program, 'u_scroll');

    // Resize handler
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const handleMouse = (e) => {
      targetMouseRef.current.x = e.clientX * dpr;
      targetMouseRef.current.y = e.clientY * dpr;
    };
    window.addEventListener('mousemove', handleMouse);

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop
    const startTime = performance.now();
    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth mouse lerp
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uScroll, scrollRef.current * dpr);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

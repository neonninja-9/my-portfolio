import React, { useEffect, useRef } from 'react';
import './HeroBackground.css';

export default function HeroBackground() {
  const glowRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      
      // Calculate mouse position relative to center of screen
      const x = (e.clientX / window.innerWidth - 0.5) * 40; // Max 20px movement
      const y = (e.clientY / window.innerHeight - 0.5) * 40; 
      
      animationFrameId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    };

    window.addEventListener('pointermove', handleMouseMove);
    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hero-bg">
      {/* Dark Grid */}
      <div className="hero-bg__grid" />
      
      {/* Mouse parallax radial glow */}
      <div className="hero-bg__glow-container">
        <div ref={glowRef} className="hero-bg__glow" />
      </div>
      
      {/* Floating particles */}
      <div className="hero-bg__particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="hero-bg__particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 20}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

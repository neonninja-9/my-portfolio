import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, GitFork, Clock } from 'lucide-react';
import './RotationalProjects.css';

gsap.registerPlugin(ScrollTrigger);

const NUM_SLICES = 5;
const RADIUS = 850;
const SPIRAL_Y_FACTOR = 450;
const LERP_FACTOR = 0.08;
const CARD_WIDTH = 680;

export default function RotationalProjects({ projects }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cardsRef = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const TOTAL = projects.length;
  const SPACING = (2 * Math.PI) / TOTAL;

  // Calculate slice bend on initialization
  const applyBendToSlices = (cardEl, bendAmountDeg) => {
    if (!cardEl) return;
    const slices = cardEl.querySelectorAll('.card-slice');
    if (bendAmountDeg < 1) {
      slices.forEach(slice => (slice.style.transform = 'none'));
      return;
    }

    const bendRad = bendAmountDeg * (Math.PI / 180);
    const r = CARD_WIDTH / bendRad;
    const sliceWidth = CARD_WIDTH / NUM_SLICES;

    slices.forEach((slice, s) => {
      const sliceIndex = s - Math.floor(NUM_SLICES / 2);
      const theta = sliceIndex * (bendRad / NUM_SLICES);

      const x = Math.sin(theta) * r;
      const z = Math.cos(theta) * r - r;
      const rotY = theta * (180 / Math.PI);

      const originalX = sliceIndex * sliceWidth;
      const dx = x - originalX;

      slice.style.transform = `translateX(${dx}px) translateZ(${z}px) rotateY(${rotY}deg)`;
    });
  };

  useEffect(() => {
    // Initial bend for all cards
    cardsRef.current.forEach(card => {
      if (card) applyBendToSlices(card, 45);
    });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${TOTAL * 100}%`, // Scroll duration proportional to number of projects
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const totalAngleNeeded = (TOTAL - 1) * SPACING;
        targetAngleRef.current = -self.progress * totalAngleNeeded;
      },
    });

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    const tick = () => {
      const diff = targetAngleRef.current - currentAngleRef.current;

      if (Math.abs(diff) > 0.0001) {
        currentAngleRef.current += diff * LERP_FACTOR;
      }

      // Update Scene
      let minDiff = Infinity;
      let closestIndex = 0;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        let cardAngle = currentAngleRef.current + (i * SPACING);
        let normalizedAngle = ((cardAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
        if (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

        const x = Math.sin(normalizedAngle) * RADIUS;
        const z = Math.cos(normalizedAngle) * RADIUS - RADIUS;
        const y = normalizedAngle * SPIRAL_Y_FACTOR;
        const rotY = normalizedAngle * (180 / Math.PI);

        const depth = (Math.cos(normalizedAngle) + 1) / 2;
        const opacity = Math.max(0, depth * 1.5 - 0.5);
        const scale = 0.7 + depth * 0.3;

        card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = Math.round(depth * 100);

        const dist = Math.abs(normalizedAngle);
        if (dist < minDiff) {
          minDiff = dist;
          closestIndex = i;
        }

        if (dist < 0.2) {
          card.classList.add('card-active');
        } else {
          card.classList.remove('card-active');
        }
      });

      if (closestIndex !== activeIndexRef.current) {
        activeIndexRef.current = closestIndex;
        setActiveIndex(closestIndex);
      }

      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateX(${mouseRef.current.y * -3}deg) rotateY(${mouseRef.current.x * 2}deg)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      trigger.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [TOTAL, SPACING]);

  const activeProject = projects[activeIndex];

  return (
    <div ref={containerRef} className="rotational-wrapper">
      {/* 3D Scene */}
      <div className="cylinder-viewport">
        <div className="cylinder-scene" ref={sceneRef}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="carousel-card"
              ref={el => cardsRef.current[i] = el}
            >
              <div className="card-inner">
                <div className="card-image-wrapper">
                  {Array.from({ length: NUM_SLICES }).map((_, s) => {
                    const sliceWidthPct = 100 / NUM_SLICES;
                    const bgPosX = s * (100 / (NUM_SLICES - 1));
                    return (
                      <div
                        key={s}
                        className="card-slice"
                        style={{
                          width: `${sliceWidthPct + 0.4}%`,
                          left: `${s * sliceWidthPct}%`,
                          backgroundImage: `url(${project.image})`,
                          backgroundSize: `${NUM_SLICES * 100}% 100%`,
                          backgroundPosition: `${bgPosX}% center`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Panel for Active Card */}
      {activeProject && (
        <div className="card-info entering" key={activeProject.id}>
          {activeProject.comingSoon && (
            <div className="card-info-badge">
              <Clock size={12} />
              Coming Soon
            </div>
          )}
          <h1 className="card-info-title">{activeProject.title}</h1>
          <p className="card-info-desc">{activeProject.description}</p>

          <div className="card-info-tags">
            {activeProject.tags.concat(activeProject.techStack).map((tag, i) => (
              <span key={i} className="card-info-tag">{tag}</span>
            ))}
          </div>

          <div className="card-info-links">
            {activeProject.githubUrl && (
              <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="card-link" style={{ pointerEvents: 'auto' }}>
                <GitFork size={16} /> Code
              </a>
            )}
            {activeProject.liveUrl && (
              <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="card-link card-link--primary" style={{ pointerEvents: 'auto' }}>
                <ExternalLink size={16} /> Live
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

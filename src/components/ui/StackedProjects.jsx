import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, GitFork, Clock } from 'lucide-react';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

/* ─── Accent colors per card index ─── */
const cardColors = [
  'rgba(139, 92, 246, 0.8)',   // purple
  'rgba(59, 130, 246, 0.8)',   // blue
  'rgba(6, 182, 212, 0.8)',    // cyan
  'rgba(236, 72, 153, 0.8)',   // pink
  'rgba(34, 197, 94, 0.8)',    // green
  'rgba(251, 191, 36, 0.8)',   // amber
  'rgba(168, 85, 247, 0.8)',   // violet
];

/* ─── Single stacked card ─── */
function StackedCard({ project, index, totalCards, color }) {
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const targetScale = 1 - (totalCards - index) * 0.05;

    gsap.set(card, { scale: 1, transformOrigin: 'center top' });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress);
        gsap.set(card, {
          scale: Math.max(scale, targetScale),
          transformOrigin: 'center top',
        });
      },
    });

    return () => trigger.kill();
  }, [index, totalCards]);

  const { title, tags, description, techStack, image, githubUrl, liveUrl, comingSoon } = project;

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
      }}
    >
      <CardOuter
        ref={cardRef}
        style={{ top: `calc(-5vh + ${index * 25}px)` }}
        $color={color}
      >
        {/* Electric border conic gradient */}
        <div
          className="electric-border"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              ${color} 60deg,
              ${color.replace('0.8', '0.6')} 120deg,
              transparent 180deg,
              ${color.replace('0.8', '0.4')} 240deg,
              transparent 360deg
            )`,
          }}
        />

        {/* Main card body */}
        <div className="card-body">
          {/* Glass overlays */}
          <div className="glass-reflection" />
          <div className="glass-shine" />
          <div className="glass-side" />

          {/* Content layout: left = info, right = preview */}
          <div className="card-content-grid">
            {/* Left: project info */}
            <div className="card-info">
              <div className="card-tags">
                {tags.map((tag) => (
                  <span key={tag} className="card-tag">{tag}</span>
                ))}
                {comingSoon && (
                  <span className="card-badge">
                    <Clock size={11} />
                    Coming Soon
                  </span>
                )}
              </div>

              <h3 className="card-title">{title}</h3>
              <p className="card-desc">{description}</p>

              <div className="card-tech">
                {techStack.map((tech) => (
                  <span key={tech} className="card-tech-pill">{tech}</span>
                ))}
              </div>

              <div className="card-links">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GitFork size={15} />
                    Code
                  </a>
                )}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link card-link--primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={15} />
                    Live
                  </a>
                )}
              </div>
            </div>

            {/* Right: image preview */}
            <div className="card-preview">
              <img
                src={image}
                alt={`Preview of ${title}`}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('card-preview--fallback');
                }}
              />
            </div>
          </div>
        </div>
      </CardOuter>
    </div>
  );
}

/* ─── Main exported component ─── */
export default function StackedProjects({ projects }) {
  return (
    <section style={{ width: '100%' }}>
      {projects.map((project, index) => (
        <StackedCard
          key={project.id}
          project={project}
          index={index}
          totalCards={projects.length}
          color={cardColors[index % cardColors.length]}
        />
      ))}
    </section>
  );
}

/* ─── Styled wrapper for each card ─── */
const CardOuter = styled.div`
  position: relative;
  width: min(80%, 900px);
  height: 420px;
  border-radius: 24px;
  isolation: isolate;
  transform-origin: top;

  .electric-border {
    position: absolute;
    inset: -3px;
    border-radius: 27px;
    padding: 3px;
    z-index: -1;
    animation: borderSpin 6s linear infinite;
  }

  @keyframes borderSpin {
    from { filter: hue-rotate(0deg); }
    to   { filter: hue-rotate(360deg); }
  }

  .card-body {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 24px;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.03)
    );
    backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      inset 0 -1px 0 rgba(255, 255, 255, 0.08);
    overflow: hidden;
    padding: 2.5rem;
  }

  /* Glass overlays */
  .glass-reflection {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
    pointer-events: none;
    border-radius: 24px 24px 0 0;
  }

  .glass-shine {
    position: absolute;
    top: 10px; left: 10px; right: 10px;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
    border-radius: 1px;
    pointer-events: none;
  }

  .glass-side {
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 100%;
    background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 50%);
    border-radius: 24px 0 0 24px;
    pointer-events: none;
  }

  /* Content grid: left info + right preview */
  .card-content-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    height: 100%;
    align-items: center;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .card-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .card-tag {
    font-size: 0.65rem;
    color: var(--accent-purple-light, #a78bfa);
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: var(--font-mono, 'Geist Mono', monospace);
  }

  .card-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(139, 92, 246, 0.85);
    color: white;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .card-title {
    font-size: clamp(1.3rem, 2vw, 1.8rem);
    font-weight: 700;
    color: #f0f0f5;
    line-height: 1.2;
    font-family: var(--font-geist);
  }

  .card-desc {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.88rem;
    line-height: 1.6;
  }

  .card-tech {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-top: 0.25rem;
  }

  .card-tech-pill {
    background: rgba(255, 255, 255, 0.07);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-family: var(--font-mono, 'Geist Mono', monospace);
  }

  .card-links {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }

  .card-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    text-decoration: none;
    transition: all 0.25s ease;

    &:hover {
      color: #fff;
      border-color: var(--accent-purple, #8b5cf6);
      background: rgba(139, 92, 246, 0.12);
      transform: translateY(-1px);
    }
  }

  .card-link--primary {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
    color: var(--accent-purple-light, #a78bfa);

    &:hover {
      background: rgba(139, 92, 246, 0.25);
    }
  }

  /* Image preview */
  .card-preview {
    border-radius: 16px;
    overflow: hidden;
    height: 100%;
    background: linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.06));
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }

  .card-preview--fallback {
    &::after {
      content: '🚀';
      font-size: 3.5rem;
      opacity: 0.2;
    }
  }

  /* ─── Responsive ─── */
  @media (max-width: 768px) {
    width: 92%;
    height: auto;
    min-height: 420px;

    .card-body {
      padding: 1.5rem;
    }

    .card-content-grid {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    .card-preview {
      height: 180px;
      order: -1;
    }
  }
`;

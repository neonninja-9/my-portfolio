import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, GitFork, Clock } from 'lucide-react';
import { projects } from '@/data/projects';
import RotationalProjects from './RotationalProjects';
import MorphSlider from '@/components/ui/MorphSlider';
import '@/sections/Projects/Projects.css';

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const morphItems = useMemo(() => projects.map(p => ({ image: p.image })), []);

  return (
    <section id="projects" className="projects section-container" style={{ minHeight: '80vh' }}>
      <h2 className="projects__heading">
        Featured <span className="gradient-text-purple">Works</span>
      </h2>
      <p className="projects__desc">
        A curated selection of solutions built with passion and technical precision.
      </p>

      {projects.length > 0 ? (
        isMobile ? (
          <div style={{ marginTop: '2rem', padding: '0 1rem' }}>
            <div style={{ height: '280px', position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
              <MorphSlider
                items={morphItems}
                transition="melt"
                intensity={0.3}
                aberration={0.15}
                drift={0.1}
                duration={0.8}
                showControls={true}
                showCaptions={false}
                onIndexChange={setActiveMobileIndex}
                autoplay={false}
                radius={16}
              />
            </div>
            
            {/* Info Panel for Active Card on Mobile */}
            {projects[activeMobileIndex] && (
              <div className="mobile-project-info" style={{ padding: '1.25rem 0.25rem', marginTop: '0.75rem' }} key={projects[activeMobileIndex].id}>
                {projects[activeMobileIndex].comingSoon && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(139, 92, 246, 0.85)', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.3px', marginBottom: '10px' }}>
                    <Clock size={12} />
                    Coming Soon
                  </div>
                )}
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f0f0f5', marginBottom: '0.4rem', lineHeight: 1.2 }}>{projects[activeMobileIndex].title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{projects[activeMobileIndex].description}</p>
      
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {projects[activeMobileIndex].tags.concat(projects[activeMobileIndex].techStack).map((tag, i) => (
                    <span key={i} style={{ fontSize: '0.6rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{tag}</span>
                  ))}
                </div>
      
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {projects[activeMobileIndex].githubUrl && (
                    <a href={projects[activeMobileIndex].githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.75)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)', textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}>
                      <GitFork size={14} /> Code
                    </a>
                  )}
                  {projects[activeMobileIndex].liveUrl && (
                    <a href={projects[activeMobileIndex].liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 500, padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)', textDecoration: 'none', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', WebkitTapHighlightColor: 'transparent' }}>
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <RotationalProjects projects={projects} />
        )
      ) : (
        <p className="projects__empty">
          No projects to show yet. Stay tuned!
        </p>
      )}
    </section>
  );
}

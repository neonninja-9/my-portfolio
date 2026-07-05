import { useState, useCallback } from 'react';
import { projects, projectCategories } from '../data/projects';
import ProjectCard from './ProjectCard';
import { useStaggerReveal } from '../hooks/useScrollReveal';
import './Projects.css';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const containerRef = useStaggerReveal({ staggerDelay: 0.08 });

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const handleFilterClick = useCallback((key) => {
    setActiveFilter(key);
  }, []);

  return (
    <section id="projects" className="projects section-container">
      <h2 className="projects__heading">
        Featured <span className="gradient-text-purple">Works</span>
      </h2>
      <p className="projects__desc">
        A curated selection of solutions built with passion and technical precision.
      </p>

      <div className="projects__filters">
        {projectCategories.map((cat) => (
          <button
            key={cat.key}
            className={`projects__filter ${activeFilter === cat.key ? 'projects__filter--active' : ''}`}
            onClick={() => handleFilterClick(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="projects__grid" ref={containerRef} key={activeFilter}>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="projects__empty">
          No projects in this category yet. Stay tuned!
        </p>
      )}
    </section>
  );
}

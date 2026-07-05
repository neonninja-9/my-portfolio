import { useState, useCallback } from 'react';
import { projects, projectCategories } from '../data/projects';
import StackedProjects from './ui/StackedProjects';
import './Projects.css';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

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

      {filteredProjects.length > 0 ? (
        <StackedProjects projects={filteredProjects} key={activeFilter} />
      ) : (
        <p className="projects__empty">
          No projects in this category yet. Stay tuned!
        </p>
      )}
    </section>
  );
}

import { projects } from '../data/projects';
import RotationalProjects from './ui/RotationalProjects';
import './Projects.css';

export default function Projects() {
  return (
    <section id="projects" className="projects section-container">
      <h2 className="projects__heading">
        Featured <span className="gradient-text-purple">Works</span>
      </h2>
      <p className="projects__desc">
        A curated selection of solutions built with passion and technical precision.
      </p>

      {projects.length > 0 ? (
        <RotationalProjects projects={projects} />
      ) : (
        <p className="projects__empty">
          No projects to show yet. Stay tuned!
        </p>
      )}
    </section>
  );
}

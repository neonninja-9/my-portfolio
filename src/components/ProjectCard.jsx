import { ExternalLink, GitFork, Clock } from 'lucide-react';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const { title, tags, description, techStack, image, githubUrl, liveUrl, comingSoon } =
    project;

  return (
    <div className="project-card glass-card reveal">
      <div className="project-card__preview">
        <img
          src={image}
          alt={`Preview of ${title}`}
          loading="lazy"
          width="800"
          height="500"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('project-card__preview--fallback');
          }}
        />
        {comingSoon && (
          <div className="project-card__badge">
            <Clock size={12} />
            Coming Soon
          </div>
        )}
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          {tags.map((tag) => (
            <span key={tag} className="project-card__tag">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__desc">{description}</p>

        <div className="project-card__tech">
          {techStack.map((tech) => (
            <span key={tech} className="project-card__tech-pill">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-card__links">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
              aria-label={`View ${title} on GitHub`}
            >
              <GitFork size={16} />
              Code
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
              aria-label={`View ${title} live demo`}
            >
              <ExternalLink size={16} />
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

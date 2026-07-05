import { techCategories } from '../data/techStack';
import { useStaggerReveal } from '../hooks/useScrollReveal';
import './TechStack.css';

const levelColors = {
  Advanced: 'var(--accent-green)',
  Intermediate: 'var(--accent-blue)',
  Familiar: 'var(--accent-cyan)',
  Learning: 'var(--accent-purple-light)',
  Beginner: 'var(--accent-pink)',
};

export default function TechStack() {
  const containerRef = useStaggerReveal({ staggerDelay: 0.1 });

  return (
    <section id="tech-stack" className="techstack section-container">
      <h2 className="techstack__heading">
        Tech <span className="gradient-text-accent">Stack</span>
      </h2>
      <p className="techstack__desc">
        Technologies and tools I work with, organized by proficiency and category.
      </p>

      <div className="techstack__grid" ref={containerRef}>
        {techCategories.map((category) => (
          <div key={category.title} className="techstack__category glass-card reveal">
            <h3 className="techstack__category-title">{category.title}</h3>
            <div className="techstack__items">
              {category.items.map((item) => (
                <div key={item.name} className="techstack__item">
                  <span className="techstack__item-name">{item.name}</span>
                  <span
                    className="techstack__item-level"
                    style={{ color: levelColors[item.level] || 'var(--text-secondary)' }}
                  >
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import TechStackGraph from './TechStackGraph';
import './TechStack.css';

export default function TechStack() {
  return (
    <section id="tech-stack" className="techstack section-container">
      <h2 className="techstack__heading">
        Tech <span className="gradient-text-accent">Stack</span>
      </h2>
      <p className="techstack__desc">
        Drag, hover, and click the nodes to explore technologies I work with.
      </p>
      <TechStackGraph />
    </section>
  );
}

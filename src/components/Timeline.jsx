import RadialTimeline from './ui/radial-timeline';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Timeline.css';

export default function Timeline() {
  const containerRef = useScrollReveal();

  return (
    <section id="journey" className="timeline-section section-container">
      <h2 className="timeline__heading">
        My <span className="dimmed">Timeline</span>
      </h2>

      <div className="timeline-radial-container reveal" ref={containerRef}>
        <RadialTimeline />
      </div>
    </section>
  );
}

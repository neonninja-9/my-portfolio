import { User, BookOpen, Zap } from 'lucide-react';
import { useStaggerReveal } from '../hooks/useScrollReveal';
import './About.css';

export default function About() {
  const containerRef = useStaggerReveal({ staggerDelay: 0.12 });

  return (
    <section id="about" className="about section-container">
      <h2 className="about__heading">
        Crafting Experiences, <span className="dimmed">Not Just Code.</span>
      </h2>

      <div className="about__grid" ref={containerRef}>
        {/* Philosophy Card */}
        <div className="about__card about__card--philosophy glass-card reveal">
          <div className="about__card-icon">
            <User size={22} />
          </div>
          <h3>The Journey</h3>
          <p>
            Based in Gwalior, I am a CS Undergrad and passionate Open Source Contributor. I bridge
            the gap between complex algorithms and real-world applications. My focus is on C++,
            Python, and JavaScript, building robust systems and interactive digital experiences.
          </p>

          <ul className="about__skills-list">
            <li>Backend development with C++ & Python</li>
            <li>REST APIs, Git, and Linux</li>
            <li>Data Structures, Algorithms & Problem Solving</li>
          </ul>

          <div className="about__pills">
            <span className="about__pill">C++</span>
            <span className="about__pill">PYTHON</span>
            <span className="about__pill">JAVASCRIPT</span>
            <span className="about__pill">OPEN SOURCE</span>
          </div>
        </div>

        {/* Stats Card */}
        <div className="about__card about__card--stats glass-card reveal">
          <div className="about__stat-big">
            <span className="about__stat-number">10+</span>
            <span className="about__stat-label">REPOSITORIES</span>
          </div>
        </div>

        {/* Learning Card */}
        <div className="about__card about__card--learning glass-card reveal">
          <div className="about__card-icon about__card-icon--blue">
            <BookOpen size={22} />
          </div>
          <h3>Currently Learning</h3>
          <div className="about__learning-items">
            <div className="about__learning-item">
              <Zap size={14} />
              <span>System Design & Architecture</span>
            </div>
            <div className="about__learning-item">
              <Zap size={14} />
              <span>Machine Learning Fundamentals</span>
            </div>
            <div className="about__learning-item">
              <Zap size={14} />
              <span>React & Modern Frontend</span>
            </div>
            <div className="about__learning-item">
              <Zap size={14} />
              <span>Cloud Computing (AWS)</span>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}

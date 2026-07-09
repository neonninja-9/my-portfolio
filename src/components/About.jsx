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
        {/* Summary Card */}
        <div className="about__card about__card--philosophy glass-card reveal" style={{ gridColumn: '1 / -1' }}>
          <div className="about__card-icon">
            <User size={22} />
          </div>
          <h3>Summary</h3>
          <p>
            Full Stack Developer with hands-on experience building scalable web applications using React.js, Express.js, Node.js, FastAPI, PostgreSQL, MongoDB, and Docker. Strong foundation in Data Structures & Algorithms, REST API development, database design, system design, authentication (JWT/OAuth), CI/CD pipelines, Linux, and cloud-native development. Passionate about building reliable backend systems and solving real-world engineering problems.
          </p>
        </div>

        {/* Education Card */}
        <div className="about__card about__card--learning glass-card reveal">
          <div className="about__card-icon about__card-icon--blue">
            <BookOpen size={22} />
          </div>
          <h3>Education</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <strong>Amity University Madhya Pradesh Gwalior, India</strong><br/>
            B.Tech in Computer Science and Engineering (AI & ML)<br/>
            2024 – June 2028 (Expected)
          </p>
          <ul className="about__skills-list">
            <li><strong>Relevant Coursework:</strong> Data Structures & Algorithms, Databases, Object-Oriented Programming, Web Development, Cryptography and Network Security, Software Engineering, Operating System</li>
            <li><strong>Current Focus:</strong> Backend Development, System Design, and Open Source Software Engineering</li>
          </ul>
        </div>

        {/* Stats Card */}
        <div className="about__card about__card--stats glass-card reveal">
          <div className="about__stat-big">
            <span className="about__stat-number">10+</span>
            <span className="about__stat-label">PROJECTS</span>
          </div>
        </div>


      </div>
    </section>
  );
}

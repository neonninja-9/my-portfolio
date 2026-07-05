import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (href) => {
    const target = document.querySelector(href);
    if (target) {
      const offset = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      {/* Ambient glow */}
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__container">
        <div className={`hero__content ${isLoaded ? 'hero__content--visible' : ''}`}>
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            <Sparkles size={14} />
            AVAILABLE FOR NEW PROJECTS
          </div>

          <h1 className="hero__title">
            Engineering <br />
            <span className="gradient-text-blue">Digital</span> <br />
            <span className="gradient-text-blue">Futures.</span>
          </h1>

          <p className="hero__subtitle">
            CS Undergrad & Open Source Contributor. Specializing in C++, Python, and Backend
            Development. Building real-world projects and shaping digital futures.
          </p>

          <div className="hero__actions">
            <button className="hero__btn hero__btn--primary" onClick={() => scrollTo('#projects')}>
              View My Work <ArrowRight size={18} />
            </button>
            <button className="hero__btn hero__btn--outline" onClick={() => scrollTo('#contact')}>
              Contact Me
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

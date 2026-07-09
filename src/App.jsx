import { useEffect, useState } from 'react';
import { Header } from './components/ui/header-2';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialCard from './components/SocialCard';
import InfiniteGrid from './components/ui/InfiniteGrid';
import MatrixRain from './components/ParticleCanvas';

export default function App() {
  const [matrixActive, setMatrixActive] = useState(false);

  // Listen for toggle events from ThemeSwitch
  useEffect(() => {
    const handler = (e) => setMatrixActive(e.detail.active);
    window.addEventListener('particle-toggle', handler);
    return () => window.removeEventListener('particle-toggle', handler);
  }, []);
  useEffect(() => {
    let isTicking = false;
    let cards = [];

    // Cache the cards so we don't query the DOM on every mouse move
    const updateCardsList = () => {
      cards = Array.from(document.querySelectorAll('.glass-card, .spotlight-card, .project-card, .about__card, .techstack__category, .contact__card'));
    };

    updateCardsList();

    // Optional: observe DOM for changes if cards are added dynamically
    const observer = new MutationObserver(updateCardsList);
    observer.observe(document.body, { childList: true, subtree: true });

    const updateSpotlight = (event) => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
            card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
          });
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('pointermove', updateSpotlight);
    return () => {
      window.removeEventListener('pointermove', updateSpotlight);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <MatrixRain active={matrixActive} />
      <InfiniteGrid />
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <SocialCard />
    </>
  );
}

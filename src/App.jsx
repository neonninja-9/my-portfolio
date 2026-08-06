import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/layout/Header';
import Hero from '@/sections/Hero/Hero';
import About from '@/sections/About/About';
import TechStack from '@/sections/TechStack/TechStack';
import Projects from '@/sections/Projects/Projects';
import Timeline from '@/sections/Timeline/Timeline';
import Contact from '@/sections/Contact/Contact';
import Footer from '@/components/layout/Footer';
import SocialCard from '@/components/shared/SocialCard';
import InfiniteGrid from './components/ui/InfiniteGrid';
import MatrixRain from '@/components/ui/ParticleCanvas';

export default function App() {
  const [matrixActive, setMatrixActive] = useState(false);

  // Listen for toggle events from ThemeSwitch
  useEffect(() => {
    const handler = (e) => setMatrixActive(e.detail.active);
    window.addEventListener('particle-toggle', handler);
    return () => window.removeEventListener('particle-toggle', handler);
  }, []);

  // Initialize Lenis for ultra-smooth scrolling
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
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

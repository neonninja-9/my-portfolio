import { useEffect } from 'react';
import { Header } from './components/ui/header-2';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialCard from './components/SocialCard';

export default function App() {
  useEffect(() => {
    const updateSpotlight = (event) => {
      const card = event.target.closest?.('.glass-card, .spotlight-card');

      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    };

    document.addEventListener('pointermove', updateSpotlight);
    return () => document.removeEventListener('pointermove', updateSpotlight);
  }, []);

  return (
    <>
      <Header />
      <main>
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

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroTerminal from "./HeroTerminal";
import Scanner from "@/components/ui/Scanner";
import HeroTypewriter from "./HeroTypewriter";
import '@/sections/Hero/Hero.css';
import SpecularButton from "@/components/ui/spacularButton";

const ROLES = [
  "Computer Science Engineer",
  "Backend Developer",
  "AI Enthusiast",
  "Open Source Contributor",
  "Linux Power User",
];

const RESUME_URL =
  "https://drive.google.com/uc?export=download&id=1h9-SYShIcLPjyPc1NH4TEvt_BPskrEPM";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Hero() {
  const [showTerminal, setShowTerminal] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Respect reduced motion or if they've seen it this session
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasSeenBoot = sessionStorage.getItem("hasSeenBoot");

    if (prefersReducedMotion || hasSeenBoot) {
      setShowTerminal(false);
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (showTerminal) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [showTerminal]);

  const scrollTo = (href) => {
    const target = document.querySelector(href);
    if (target) {
      const offset =
        target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="hero-cinematic">
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#050505',
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}>
        <Scanner />
      </div>

      <AnimatePresence mode="wait">
        {showTerminal && (
          <HeroTerminal
            key="terminal"
            onComplete={() => setShowTerminal(false)}
          />
        )}
      </AnimatePresence>

      {!showTerminal && (
        <motion.div
          className="hero-cinematic__container"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div className="hero-cinematic__content">
            <motion.div>
              <HeroTypewriter />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="hero-cinematic__role-container"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="hero-cinematic__role"
                >
                  {ROLES[roleIndex]}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="hero-cinematic__actions"
            >


              <SpecularButton
                className="hero-cinematic__btn"
                size="lg"
                radius={20}
                tint="#ffffff"
                tintOpacity={0}
                blur={0}
                textColor="#f5f5f5"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={isMobile}
                onClick={() => scrollTo("#projects")}
              >
                Explore Projects
              </SpecularButton>
              <a className='cursor-pointer' href={RESUME_URL} rel="noopener noreferrer" target="_blank">
              <SpecularButton
                className="hero-cinematic__btn hero-cinematic__btn--secondary"
                size="lg"
                radius={20}
                tint="#ffffff"
                tintOpacity={0}
                blur={0}
                textColor="#f5f5f5"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={isMobile}
              >
                Download Resume
              </SpecularButton>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

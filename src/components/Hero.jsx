import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import HeroTerminal from "./ui/HeroTerminal";
import HeroBackground from "./ui/HeroBackground";
import HeroTypewriter from "./ui/HeroTypewriter";
import "./Hero.css";

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

  useEffect(() => {
    // Respect reduced motion or if they've seen it this session
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasSeenBoot = sessionStorage.getItem("hasSeenBoot");

    if (prefersReducedMotion || hasSeenBoot) {
      setShowTerminal(false);
    }
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
      <HeroBackground />

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
            <motion.div variants={itemVariants} className="hero-cinematic__eyebrow">
              <Sparkles size={16} />
              Available for product engineering work
            </motion.div>

            <HeroTypewriter />

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

            <motion.p variants={itemVariants} className="hero-cinematic__intro">
              I build clean full-stack applications with reliable APIs, accessible interfaces,
              and maintainable engineering foundations.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="hero-cinematic__actions"
            >
              <button
                className="hero-cinematic__btn hero-cinematic__btn--primary"
                onClick={() => scrollTo("#projects")}
              >
                Explore Projects <ArrowRight size={18} />
              </button>
              <a
                className="hero-cinematic__btn hero-cinematic__btn--secondary"
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={18} /> Download Resume
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="hero-cinematic__proof">
              <span><strong>10+</strong> projects</span>
              <span><strong>Backend</strong> focused</span>
              <span><strong>Open source</strong> contributor</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

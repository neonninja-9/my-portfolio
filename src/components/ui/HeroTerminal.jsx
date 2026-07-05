import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './HeroTerminal.css';

export default function HeroTerminal({ onComplete }) {
  const terminalRef = useRef(null);
  const skippedRef = useRef(false);

  // Skip logic
  const handleSkip = () => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    sessionStorage.setItem('hasSeenBoot', 'true');
    onComplete();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let isActive = true;
    const termText = terminalRef.current;
    if (!termText) return;
    
    termText.innerHTML = ''; // Clear for React StrictMode

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function throwIfSkipped() {
      if (skippedRef.current || !isActive) throw new Error('__skip__');
    }

    function scrollTerm() {
      if (termText) {
        termText.scrollTop = termText.scrollHeight;
      }
    }

    function makeLine(cls) {
      const el = document.createElement('div');
      el.className = 'term-line ' + (cls || '');
      termText.appendChild(el);
      return el;
    }

    async function typeLine(text, cls) {
      throwIfSkipped();
      const el = makeLine((cls || '') + ' typing');
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      el.appendChild(cursor);
      for (const ch of text) {
        throwIfSkipped();
        cursor.insertAdjacentText('beforebegin', ch);
        await sleep(40 + Math.random() * 20);
      }
      cursor.remove();
      scrollTerm();
      return el;
    }

    async function addOutput(text, cls) {
      throwIfSkipped();
      const el = makeLine(cls);
      el.textContent = text;
      scrollTerm();
      await sleep(30);
    }

    async function animateLoadingBar() {
      throwIfSkipped();
      const wrap = document.createElement('div');
      wrap.id = 'loading-bar-wrap';
      wrap.className = 'term-line';
      const track = document.createElement('span');
      track.id = 'loading-bar-track';
      const pct = document.createElement('span');
      pct.id = 'loading-bar-pct';
      pct.textContent = '0%';
      wrap.appendChild(track);
      wrap.appendChild(pct);
      termText.appendChild(wrap);
      
      const totalBlocks = 20;
      for (let i = 1; i <= totalBlocks; i++) {
        throwIfSkipped();
        track.textContent = '█'.repeat(i) + '░'.repeat(totalBlocks - i);
        pct.textContent = ' ' + Math.round((i / totalBlocks) * 100) + '%';
        scrollTerm();
        await sleep(35);
      }
    }

    async function animateDots(base) {
      throwIfSkipped();
      const el = makeLine();
      for (let cycle = 0; cycle < 2; cycle++) {
        for (let dots = 1; dots <= 3; dots++) {
          throwIfSkipped();
          el.textContent = base + '.'.repeat(dots);
          scrollTerm();
          await sleep(350);
        }
      }
    }

    async function runBoot() {
      await typeLine('$ boot portfolio');
      await sleep(300);
      await addOutput('Initializing environment...', 'dim');
      await sleep(600);
      await addOutput('Loading modules...', 'dim');
      await sleep(400);
      await addOutput('✓ React', 'green');
      await sleep(140);
      await addOutput('✓ TypeScript', 'blue');
      await sleep(140);
      await addOutput('✓ Tailwind CSS', 'purple');
      await sleep(140);
      await addOutput('✓ Framer Motion', 'grey');
      await sleep(700);

      await addOutput('Loading developer profile...', 'dim');
      await sleep(500);
      await addOutput('Name: Gourav Sharma');
      await sleep(300);
      await addOutput('Role: Computer Science Engineer');
      await sleep(300);
      await addOutput('Specialization:');
      
      const specs = ['Backend Development', 'Artificial Intelligence', 'Machine Learning', 'Open Source', 'Linux'];
      for (const s of specs) {
        await addOutput(s, 'indent');
        await sleep(180);
      }
      await sleep(700);

      await addOutput('Current Status:');
      await sleep(250);
      await animateLoadingBar();
      await sleep(300);
      await addOutput('Profile Loaded Successfully', 'green');
      await sleep(700);

      await typeLine('$ whoami');
      await sleep(300);
      await addOutput('Gourav Sharma', 'big');
      await sleep(700);

      await animateDots('Launching Portfolio');
      await sleep(1000);
    }

    // Start the boot sequence
    runBoot()
      .then(() => {
        if (!skippedRef.current && isActive) {
          handleSkip();
        }
      })
      .catch((e) => {
        if (e.message !== '__skip__') console.error(e);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <motion.div 
      className="hero-terminal"
      initial={{ opacity: 1, scale: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 0.92,
        filter: 'blur(6px)',
        transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }
      }}
      onClick={handleSkip}
    >
      <div className="hero-terminal__content">
        <pre id="terminal-text" ref={terminalRef}></pre>
      </div>
      
      <div className="hero-terminal__skip">press any key to skip</div>
    </motion.div>
  );
}

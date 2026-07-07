import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SEQUENCE = [
  { text: "Hi, I'm Gourav.", keep: 0 },
  { text: "I build software,", keep: 8 },
  { text: "I build AI systems,", keep: 8 },
  { text: "I build ideas people actually use.", keep: 0 },
];

const TYPING_SPEED = 60;
const ERASING_SPEED = 40;
const PAUSE_DURATION = 2000;

export default function HeroTypewriter() {
  const [currentText, setCurrentText] = useState('');
  const [seqIndex, setSeqIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const targetSeq = SEQUENCE[seqIndex];
    const targetText = targetSeq.text;

    if (isTyping) {
      if (currentText !== targetText) {
        // Still typing forward
        timeout = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        }, TYPING_SPEED);
      } else {
        // Finished typing, pause then erase
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, PAUSE_DURATION);
      }
    } else {
      if (currentText.length > targetSeq.keep) {
        // Erasing
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, ERASING_SPEED);
      } else {
        // Finished erasing, move to next sequence
        setIsTyping(true);
        setSeqIndex((prev) => (prev + 1) % SEQUENCE.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, seqIndex]);

  // We want to color "AI systems," differently if it matches the end of the string
  // Let's implement a safe way to apply the gradient to specific words.
  // Actually, since the text is dynamic, let's just render the string, 
  // but if the string contains "AI systems,", we can split it.
  
  const renderText = () => {
    if (currentText.includes('AI systems')) {
      const parts = currentText.split('AI systems');
      return (
        <>
          {parts[0]}
          <span className="hero-cinematic__heading-accent">AI systems</span>
          {parts[1]}
        </>
      );
    }
    return currentText;
  };

  return (
    <motion.h1 
      className="hero-cinematic__heading" 
      style={{ display: 'inline-block', minHeight: '1.2em' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {renderText()}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
        style={{ display: 'inline-block', width: '4px', background: 'currentColor', height: '1em', marginLeft: '4px', verticalAlign: 'text-bottom' }}
      />
    </motion.h1>
  );
}

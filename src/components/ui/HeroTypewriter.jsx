import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SEQUENCE = [
  { text: "Hi, I'm Gourav.", keep: 0 },
  { text: "I build reliable software.", keep: 8 },
  { text: "I build thoughtful interfaces.", keep: 8 },
  { text: "I build practical AI products.", keep: 0 },
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

  // Apply a restrained accent only to the AI phrase when it is present.
  const renderText = () => {
    if (currentText.includes('AI products')) {
      const parts = currentText.split('AI products');
      return (
        <>
          {parts[0]}
          <span className="hero-cinematic__heading-accent">AI products</span>
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
        style={{ display: 'inline-block', width: '3px', background: 'currentColor', height: '0.9em', marginLeft: '6px', verticalAlign: 'text-bottom' }}
      />
    </motion.h1>
  );
}

import { useEffect, useState } from 'react';

/**
 * Custom hook for scroll-aware header styling.
 * Returns whether the page has been scrolled past a threshold.
 *
 * @param {number} threshold - Scroll distance in px to trigger
 * @returns {boolean} isScrolled
 */
export function useScrollHeader(threshold = 50) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isScrolled;
}

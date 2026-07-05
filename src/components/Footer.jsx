import { ArrowUp, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__copy">
          © {new Date().getFullYear()} Gourav Sharma. Built with{' '}
          <Heart size={14} className="footer__heart" /> and React.
        </span>

        <button
          className="footer__top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}

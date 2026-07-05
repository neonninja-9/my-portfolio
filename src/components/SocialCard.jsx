import { useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import styled from 'styled-components';
import { socialLinks } from '../data/socialLinks';

const icons = {
  GitHub: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  'Google Dev': (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
};

const boxClasses = ['box1', 'box2', 'box3'];

const SocialCard = () => {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (e) => {
      if (!cardRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [open]);

  return (
    <StyledWrapper aria-label="Social media links">
      <div
        ref={cardRef}
        className={`card ${open ? 'card--open' : ''}`}
        tabIndex={0}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <div className="background" />
        <div className="trigger-icon" aria-hidden="true">
          <Share2 size={20} />
        </div>
        <div className="logo">Socials</div>
        {socialLinks.map((link, index) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            title={link.name}
            tabIndex={open ? 0 : -1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`box ${boxClasses[index]}`}>
              <span className="icon">{icons[link.name]}</span>
            </div>
          </a>
        ))}
        <div className="box box4" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  left: clamp(0.85rem, 2vw, 1.5rem);
  bottom: clamp(0.85rem, 2vw, 1.5rem);
  z-index: 80;

  a {
    text-decoration: none;
    color: inherit;
    pointer-events: none;
  }

  .card {
    position: relative;
    width: 3.25rem;
    height: 3.25rem;
    background: transparent;
    border-radius: 999px;
    overflow: hidden;
    box-shadow:
      0 16px 44px rgba(0, 0, 0, 0.42),
      0 0 24px var(--glow-purple);
    transition:
      width 0.55s ease-in-out,
      height 0.55s ease-in-out,
      border-radius 0.55s ease-in-out,
      transform 0.55s ease-in-out,
      box-shadow 0.55s ease-in-out,
      border-color 0.55s ease-in-out;
    border: 1px solid rgba(255, 255, 255, 0.14);
    transform-origin: bottom left;
    cursor: pointer;
    outline: none;
  }

  .background {
    position: absolute;
    inset: 0;
    background: var(--gradient-main);
  }

  .trigger-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    opacity: 1;
    transition: opacity 0.35s ease-in-out;
    pointer-events: none;
    z-index: 2;
  }

  .logo {
    position: absolute;
    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
    transition: all 0.6s ease-in-out;
    font-size: 1.3em;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 3px;
    pointer-events: none;
    opacity: 0;
    white-space: nowrap;
    z-index: 1;
  }

  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  .icon .svg {
    fill: rgba(255, 255, 255, 0.797);
    width: 100%;
    transition: all 0.5s ease-in-out;
  }

  .box {
    position: absolute;
    padding: 10px;
    text-align: right;
    background: rgba(255, 255, 255, 0.389);
    border-top: 2px solid rgb(255, 255, 255);
    border-right: 1px solid white;
    border-radius: 10% 13% 42% 0% / 10% 12% 75% 0%;
    box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px;
    transform-origin: bottom left;
    transition: all 1s ease-in-out;
  }

  .box::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: all 0.5s ease-in-out;
  }

  .box:hover .svg {
    fill: white;
  }

  .box1 {
    width: 70%;
    height: 70%;
    bottom: -70%;
    left: -70%;
  }

  .box1::before {
    background: radial-gradient(
      circle at 30% 107%,
      var(--accent-purple-light) 0%,
      var(--accent-purple-dark) 90%
    );
  }

  .box1:hover::before {
    opacity: 1;
  }

  .box1:hover .icon .svg {
    filter: drop-shadow(0 0 5px white);
  }

  .box2 {
    width: 50%;
    height: 50%;
    bottom: -50%;
    left: -50%;
    transition-delay: 0.2s;
  }

  .box2::before {
    background: radial-gradient(
      circle at 30% 107%,
      var(--accent-cyan) 0%,
      var(--accent-blue) 90%
    );
  }

  .box2:hover::before {
    opacity: 1;
  }

  .box2:hover .icon .svg {
    filter: drop-shadow(0 0 5px white);
  }

  .box3 {
    width: 30%;
    height: 30%;
    bottom: -30%;
    left: -30%;
    transition-delay: 0.4s;
  }

  .box3::before {
    background: radial-gradient(
      circle at 30% 107%,
      var(--accent-purple) 0%,
      var(--accent-pink) 90%
    );
  }

  .box3:hover::before {
    opacity: 1;
  }

  .box3:hover .icon .svg {
    filter: drop-shadow(0 0 5px white);
  }

  .box4 {
    width: 10%;
    height: 10%;
    bottom: -10%;
    left: -10%;
    transition-delay: 0.6s;
  }

  .card--open {
    width: 200px;
    height: 200px;
    border-radius: 30px;
    transform: scale(1.1);
    border-color: rgba(244, 114, 182, 0.55);
    box-shadow:
      0 18px 54px rgba(0, 0, 0, 0.48),
      0 0 34px rgba(168, 85, 247, 0.28);
  }

  .card--open a {
    pointer-events: auto;
  }

  .card--open .trigger-icon {
    opacity: 0;
  }

  .card--open .logo {
    opacity: 1;
    transform: translate(70px, -52px);
    letter-spacing: 0px;
  }

  .card--open .box {
    bottom: -1px;
    left: -1px;
  }
`;

export default SocialCard;

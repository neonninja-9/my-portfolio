import styled from 'styled-components';
import { socialLinks, contactInfo } from '../../data/socialLinks';

const socialItems = [
  {
    name: 'GitHub',
    url: socialLinks.find((l) => l.name === 'GitHub')?.url || '#',
    color: '#333',
    icon: (
      <svg viewBox="0 0 24 24" height="1em">
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: socialLinks.find((l) => l.name === 'LinkedIn')?.url || '#',
    color: '#0077b5',
    icon: (
      <svg viewBox="0 0 448 512" height="1em">
        <path
          d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Email',
    url: `mailto:${contactInfo.email}`,
    color: '#ea4335',
    icon: (
      <svg viewBox="0 0 24 24" height="1em">
        <path
          d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Google Dev',
    url: socialLinks.find((l) => l.name === 'Google Dev')?.url || '#',
    color: '#4285f4',
    icon: (
      <svg viewBox="0 0 24 24" height="1em">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
      </svg>
    ),
  },
];

const ConnectIcons = () => {
  return (
    <StyledWrapper>
      <ul className="social-icons">
        {socialItems.map((item) => (
          <li key={item.name} className="icon-content">
            <a
              href={item.url}
              aria-label={item.name}
              data-social={item.name.toLowerCase().replace(/\s+/g, '-')}
              target={item.name === 'Email' ? '_self' : '_blank'}
              rel="noopener noreferrer"
            >
              <div className="filled" />
              {item.icon}
            </a>
            <div className="tooltip">{item.name}</div>
          </li>
        ))}
      </ul>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li::after {
    content: "";
    display: block;
    height: 0px;
    transition: height 0.3s ease-in-out;
    pointer-events: none;
  }

  li:hover::after {
    height: 10px;
  }

  .social-icons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }

  .icon-content {
    position: relative;
  }

  .icon-content .tooltip {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    padding: 6px 10px;
    border-radius: 5px;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    font-size: 12px;
    white-space: nowrap;
    transition: all 0.3s ease;
  }

  .icon-content:hover .tooltip {
    opacity: 1;
    visibility: visible;
    bottom: -40px;
  }

  .icon-content a {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: #4d4d4d;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
    text-decoration: none;
  }

  .icon-content a:hover {
    box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 12%);
  }

  .icon-content a svg {
    position: relative;
    z-index: 1;
    width: 22px;
    height: 22px;
  }

  .icon-content a:hover {
    color: white;
  }

  .icon-content a .filled {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #000;
    transition: all 0.3s ease-in-out;
  }

  .icon-content a:hover .filled {
    height: 100%;
  }

  /* GitHub */
  .icon-content a[data-social="github"] .filled,
  .icon-content a[data-social="github"] ~ .tooltip {
    background-color: #333;
  }

  /* LinkedIn */
  .icon-content a[data-social="linkedin"] .filled,
  .icon-content a[data-social="linkedin"] ~ .tooltip {
    background-color: #0077b5;
  }

  /* Email */
  .icon-content a[data-social="email"] .filled,
  .icon-content a[data-social="email"] ~ .tooltip {
    background-color: #ea4335;
  }

  /* Google Dev */
  .icon-content a[data-social="google-dev"] .filled,
  .icon-content a[data-social="google-dev"] ~ .tooltip {
    background-color: #4285f4;
  }
`;

export default ConnectIcons;

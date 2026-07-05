import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ThemeSwitch = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('light-mode')) {
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
    setIsLight(!isLight);
  };

  return (
    <StyledWrapper>
      <input 
        type="checkbox" 
        role="switch" 
        className="liquid-3" 
        checked={isLight}
        onChange={toggleTheme}
        aria-label="Toggle light mode"
      />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;

  .liquid-3 {
    --primary: #000;
    --secondary: #fff;
    --time: 0.6s;
    appearance: none;
    position: relative;
    cursor: pointer;
    font-size: 5px; /* Scales the entire button to 50px width */
    width: 10em;
    aspect-ratio: 2 / 1;
    background: var(--primary);
    border-radius: 20em;
    box-shadow: 0 0 0 0.5em var(--secondary);
    transform: translateX(0.5px);
    transition: transform var(--time) cubic-bezier(0.75, 0, 0.75, 50);
    filter: blur(0.66em) contrast(20);
    mix-blend-mode: normal; /* Changed from darken to normal to show on dark backgrounds */
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      width: 200%;
      height: 100%;
      transform: translate(-25%, -50%);
      left: 50%;
      top: 50%;
      background: radial-gradient(
          closest-side circle at 12.5% 50%,
          var(--secondary) 50%,
          #0000 0
        ),
        radial-gradient(
          closest-side circle at 87.5% 50%,
          var(--secondary) 50%,
          #0000 0
        ),
        #f000;
      transition: transform var(--time) cubic-bezier(0.75, 0, 0.75, 1.3);
    }

    &:checked {
      transform: translateX(-0.5px);
      &::before {
        transform: translate(-75%, -50%);
      }
    }
  }
  
  /* When in light mode, invert the switch colors so it remains visible */
  :global(.light-mode) .liquid-3 {
    --primary: #fff;
    --secondary: #000;
    box-shadow: 0 0 0 0.5em var(--secondary);
  }
`;

export default ThemeSwitch;

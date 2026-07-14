import React from 'react';
import styled from 'styled-components';

const ThemeSwitch = () => {
  return (
    <StyledWrapper>
      <input
        type="checkbox"
        role="switch"
        className="liquid-3"
        checked={false}
        readOnly
        aria-label="Toggle button"
      />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;

  .liquid-3 {
    appearance: none;
    position: relative;
    cursor: pointer;
    width: 3.2rem;
    height: 1.8rem;
    border-radius: 999px;
    border: 1px solid rgba(226, 232, 240, 0.18);
    background: rgba(15, 23, 42, 0.72);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
    transition: border-color 180ms ease, background 180ms ease;
  }

  .liquid-3::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0.28rem;
    width: 1.08rem;
    height: 1.08rem;
    border-radius: 50%;
    background: #f8fafc;
    transform: translateY(-50%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: transform 180ms ease, background 180ms ease;
  }

  .liquid-3:checked::before {
    transform: translate(1.35rem, -50%);
  }

  .liquid-3:hover {
    border-color: rgba(147, 197, 253, 0.42);
  }
  
  :global(.light-mode) .liquid-3 {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(15, 23, 42, 0.16);
  }

  :global(.light-mode) .liquid-3::before {
    background: #0f172a;
  }
`;

export default ThemeSwitch;

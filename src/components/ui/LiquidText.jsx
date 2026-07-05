import React from 'react';
import './LiquidText.css';

export default function LiquidText({ text = 'Gourav Sharma' }) {
  return (
    <div className="liquid-text-wrapper">
      <svg className="liquid-filter-def" width="0" height="0">
        <filter id="liquid-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="12s"
              values="0.015 0.015;0.025 0.025;0.015 0.015"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <h1 className="liquid-text" data-text={text}>
        {text}
      </h1>
    </div>
  );
}

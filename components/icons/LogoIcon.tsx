import React from 'react';

// FIX: Added style prop to allow inline styling for effects like drop-shadow.
const LogoIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'h-8 w-8', style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M2 7L12 12M12 22V12M22 7L12 12M12 12L17 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoIcon;
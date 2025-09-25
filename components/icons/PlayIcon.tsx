import React from 'react';

const PlayIcon: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 5V19L19 12L8 5Z"
    />
  </svg>
);

export default PlayIcon;

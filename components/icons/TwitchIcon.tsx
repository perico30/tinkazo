import React from 'react';

const TwitchIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M2.149 0L.537 4.125v15.75h5.85l2.678 2.625h3.21l2.143-2.625h4.822V14.25l2.678-2.625V0H2.149zm19.286 10.5l-3.215 3.188h-4.821l-2.411 2.625v-2.625H7.786V1.875h13.649v8.625z"></path>
    <path d="M15.536 4.125h2.143v5.25h-2.143V4.125zM11.357 4.125h2.143v5.25h-2.143V4.125z"></path>
  </svg>
);

export default TwitchIcon;

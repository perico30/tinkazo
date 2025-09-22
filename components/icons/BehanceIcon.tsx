import React from 'react';

const BehanceIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22 5.5h-7.5v1h7.5v-1zM12.5 11.25c0-1.725 1.1-2.5 3-2.5h3v-2h-3c-3.5 0-5 2-5 4.75v.5c0 2.75 1.5 4.75 5 4.75h3v-2h-3c-1.9 0-3-.775-3-2.5v-.5zM12 18.5H3.5v-1h8.5v1zM3.5 12.5h7v-1h-7v1zM24 0H0v24h24V0zM8.5 6.5C7.125 6.5 6 5.375 6 4s1.125-2.5 2.5-2.5S11 2.625 11 4s-1.125 2.5-2.5 2.5z"></path>
  </svg>
);

export default BehanceIcon;

import React from 'react';

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fb-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#0062E0" />
        <stop offset="1" stopColor="#19AFFF" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#fb-gradient)" />
    <path d="M21.5 10.5H19.5C18.3954 10.5 17.5 11.3954 17.5 12.5V14.5H21.5L20.5 18.5H17.5V27.5H12.5V18.5H9.5V14.5H12.5V12.5C12.5 9.18629 15.1863 6.5 18.5 6.5H21.5V10.5Z" fill="white" />
  </svg>
);

export default FacebookIcon;

import React from 'react';

const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tg-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#2AABEE"/>
        <stop offset="1" stopColor="#0088CC"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#tg-gradient)"/>
    <path d="M8 15.3333L25 9L21.6667 22.3333L16.3333 19L14.3333 24.3333L13 19.6667L8 15.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 9L14.3333 18.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default TelegramIcon;

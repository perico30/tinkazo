import React from 'react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28.5 3.5) rotate(135) scale(38.8907)">
        <stop stopColor="#FEDC75" />
        <stop offset="0.281" stopColor="#F58529" />
        <stop offset="0.516" stopColor="#DD2A7B" />
        <stop offset="0.76" stopColor="#8134AF" />
        <stop offset="1" stopColor="#4C63D2" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#ig-gradient)" />
    <path d="M22 7H10C8.34315 7 7 8.34315 7 10V22C7 23.6569 8.34315 25 10 25H22C23.6569 25 25 23.6569 25 22V10C25 8.34315 23.6569 7 22 7Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke="white" strokeWidth="2"/>
    <circle cx="21.5" cy="10.5" r="1" fill="white"/>
  </svg>
);

export default InstagramIcon;

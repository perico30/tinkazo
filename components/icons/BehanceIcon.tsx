import React from 'react';

const BehanceIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="be-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#053EFF"/>
        <stop offset="1" stopColor="#1769FF"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#be-gradient)"/>
    <path d="M14.5 15.5H19.5V17H14.5V15.5Z" fill="white"/>
    <path d="M13.4141 12C14.2424 12 14.9141 12.6717 14.9141 13.5C14.9141 14.3283 14.2424 15 13.4141 15H11.4141V12H13.4141Z" fill="white"/>
    <path d="M13.6364 17.5C14.5518 17.5 15.3182 18.2665 15.3182 19.1818C15.3182 20.0972 14.5518 20.8636 13.6364 20.8636H11.4545V17.5H13.6364Z" fill="white"/>
  </svg>
);

export default BehanceIcon;

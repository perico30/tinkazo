import React from 'react';

const TwitchIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tw-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#6441A5"/>
        <stop offset="1" stopColor="#9146FF"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#tw-gradient)"/>
    <path d="M9 8L7 11V23H12V26H15L18 23H22L27 18V8H9ZM25 17L22 20H18L15 23V20H11V10H25V17Z" fill="white"/>
    <rect x="15" y="13" width="2" height="5" fill="white"/>
    <rect x="20" y="13" width="2" height="5" fill="white"/>
  </svg>
);

export default TwitchIcon;

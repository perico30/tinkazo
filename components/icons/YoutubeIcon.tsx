import React from 'react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="yt-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#FF0000"/>
        <stop offset="1" stopColor="#FF4D4D"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#yt-gradient)"/>
    <path d="M22 13.5566C23.3333 14.3094 23.3333 16.1906 22 16.9434L14.5 21.2391C13.1667 21.9919 11.5 21.0513 11.5 19.5457V10.9543C11.5 9.44871 13.1667 8.50811 14.5 9.26091L22 13.5566Z" fill="white"/>
  </svg>
);

export default YoutubeIcon;

import React from 'react';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="li-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#0A66C2"/>
        <stop offset="1" stopColor="#0077B5"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#li-gradient)"/>
    <path d="M10 13H13V22H10V13Z" fill="white"/>
    <path d="M11.5 8C10.6716 8 10 8.67157 10 9.5C10 10.3284 10.6716 11 11.5 11C12.3284 11 13 10.3284 13 9.5C13 8.67157 12.3284 8 11.5 8Z" fill="white"/>
    <path d="M15 13H18V14.38C18.4419 13.5562 19.5539 12.8 20.9155 12.8C23.96 12.8 24 15.22 24 17.5V22H21V18C21 16.62 20.5 15.5 19.25 15.5C18.06 15.5 17.5 16.28 17.5 17.9V22H15V13Z" fill="white" fillOpacity="0.9"/>
  </svg>
);

export default LinkedinIcon;

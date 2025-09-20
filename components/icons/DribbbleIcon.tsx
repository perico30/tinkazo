import React from 'react';

const DribbbleIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="db-gradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#EA4C89"/>
        <stop offset="1" stopColor="#E52E71"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#db-gradient)"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24ZM16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22Z" fill="white" fillOpacity="0.8"/>
    <path d="M24.5 16C24.5 17.5 23.5 20.5 20.5 21.5" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.5 16C7.5 14.5 8.5 11.5 11.5 10.5" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 20L23 12" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default DribbbleIcon;

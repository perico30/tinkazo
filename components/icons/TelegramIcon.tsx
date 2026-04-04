import React from 'react';

const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.8,3.3c-0.2-0.2-0.5-0.3-0.8-0.2L2.3,10.5c-0.6,0.2-0.6,1,0,1.2l3.8,1.2l1.2,3.8c0.2,0.6,1,0.6,1.2,0L18.3,4c0.2-0.2,0-0.6-0.2-0.7L12.4,9L9.8,7.8L21.2,4C21.6,3.9,21.9,3.5,21.8,3.3z M8.9,13.1l-1,3.1c-0.1,0.4,0.4,0.7,0.7,0.5l2.5-1.7l-2.2-1.9H8.9z"></path>
  </svg>
);

export default TelegramIcon;

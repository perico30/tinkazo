import React from 'react';

const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#000" />
    <path d="M10.25 24L16.5 15.375L10 8H11.5L16.875 13.925L21.5 8H24L17.5 16.875L24.25 24H22.75L17.125 17.825L12.25 24H10.25ZM12 9L21.25 23H22.5L13.25 9H12Z" fill="white" />
  </svg>
);

export default TwitterIcon;

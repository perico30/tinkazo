import React from 'react';

const SnapchatIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#FFFC00"/>
    <path d="M12.5 24C10 24 8 22.5 8 19V14.5C8 14.5 10.5 13 12.5 14.5L16 17.5L19.5 14.5C21.5 13 24 14.5 24 14.5V19C24 22.5 22 24 19.5 24H12.5Z" fill="white"/>
    <path d="M12.5 14.5C14.5 13.5 15.5 10.5 15.5 8H10.5V11.5C10.5 13 11.5 14 12.5 14.5Z" fill="white"/>
    <path d="M19.5 14.5C17.5 13.5 16.5 10.5 16.5 8H21.5V11.5C21.5 13 20.5 14 19.5 14.5Z" fill="white"/>
  </svg>
);

export default SnapchatIcon;

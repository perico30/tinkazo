import React from 'react';

const ThreadsIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#000"/>
    <path d="M16 23C12.5 23 11 20.5 11 18V13C11 10 13 9 15 9C17.5 9 19.5 10.5 19.5 13C19.5 14 19 15 18 15.5C18.5 16 19.5 17 20 18.5C20.5 20.5 20 23 16 23ZM16 11C14.5 11 13.5 12 13.5 13V13.5C14 12.5 15 12 16 12C17 12 17.5 12.5 17.5 13C17.5 13.5 17 14 16 14.5C15 15 13.5 15.5 13.5 17.5C13.5 19.5 14.5 21 16 21C18 21 18.5 19.5 18 18C17.5 16.5 16.5 15.5 16.5 15.5C18.5 15 19.5 14.5 19.5 13C19.5 11.5 18 10 16 10C14 10 13.5 10.5 13.5 11.5" fill="white"/>
  </svg>
);

export default ThreadsIcon;

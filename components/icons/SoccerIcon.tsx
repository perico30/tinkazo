import React from 'react';

const SoccerIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg 
        className={className} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm.88,15.6-2.5-1.44-2.5,1.44,1-2.88-2.5-1.44h3l1-2.88,1,2.88h3L13.88,14.72Z"/>
    </svg>
);

export default SoccerIcon;
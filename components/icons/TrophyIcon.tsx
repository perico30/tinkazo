import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M19 3v4m2-2h-4M12 21v-3m0 0V5a3 3 0 013-3h1a3 3 0 013 3v3a3 3 0 01-3 3h-1m-4 0h-1a3 3 0 00-3 3v3a3 3 0 003 3h1m4 0h1a3 3 0 003-3V8a3 3 0 00-3-3h-1"
        />
    </svg>
);

export default TrophyIcon;
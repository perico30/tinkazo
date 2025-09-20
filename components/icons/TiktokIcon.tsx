import React from 'react';

const TiktokIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#000" />
    <path d="M21.1397 10.7027C22.253 10.269 23.0039 10.9634 23.0039 12.1852V16.3079C23.0039 19.2274 20.5732 21.6148 17.6003 21.6148H15.9082C13.2981 21.6148 11.1685 19.5256 11.1685 16.9602V8H14.1554V16.6346C14.1554 18.0673 15.3045 19.1929 16.7649 19.1929C18.2252 19.1929 19.3743 18.0673 19.3743 16.6346V8C15.932 8 13.0675 10.4294 13.0675 13.6826" stroke="#FE2C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.1397 10.7027C22.253 10.269 23.0039 10.9634 23.0039 12.1852V16.3079C23.0039 19.2274 20.5732 21.6148 17.6003 21.6148H15.9082C13.2981 21.6148 11.1685 19.5256 11.1685 16.9602V8H14.1554V16.6346C14.1554 18.0673 15.3045 19.1929 16.7649 19.1929C18.2252 19.1929 19.3743 18.0673 19.3743 16.6346V8C15.932 8 13.0675 10.4294 13.0675 13.6826" stroke="#25F4EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{mixBlendMode: "screen"}}/>
  </svg>
);

export default TiktokIcon;

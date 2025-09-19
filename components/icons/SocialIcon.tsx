import React from 'react';
import FacebookIcon from './FacebookIcon';
import TwitterIcon from './TwitterIcon';
import InstagramIcon from './InstagramIcon';
import YoutubeIcon from './YoutubeIcon';
import LinkedinIcon from './LinkedinIcon';

interface SocialIconProps {
  platform: string;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'h-6 w-6' }) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <FacebookIcon className={className} />;
    case 'twitter':
      return <TwitterIcon className={className} />;
    case 'instagram':
      return <InstagramIcon className={className} />;
    case 'youtube':
      return <YoutubeIcon className={className} />;
    case 'linkedin':
      return <LinkedinIcon className={className} />;
    default:
      // Fallback icon (simple circle)
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export default SocialIcon;

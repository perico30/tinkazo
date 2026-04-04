import React from 'react';
import FacebookIcon from './FacebookIcon';
import TwitterIcon from './TwitterIcon';
import InstagramIcon from './InstagramIcon';
import YoutubeIcon from './YoutubeIcon';
import LinkedinIcon from './LinkedinIcon';
import WhatsappIcon from './WhatsappIcon';
import TiktokIcon from './TiktokIcon';
import DiscordIcon from './DiscordIcon';
import SnapchatIcon from './SnapchatIcon';
import BehanceIcon from './BehanceIcon';
import ThreadsIcon from './ThreadsIcon';
import DribbbleIcon from './DribbbleIcon';
import PinterestIcon from './PinterestIcon';
import TwitchIcon from './TwitchIcon';
import TelegramIcon from './TelegramIcon';

interface SocialIconProps {
  platform: string;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'h-8 w-8' }) => {
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
    case 'whatsapp':
      return <WhatsappIcon className={className} />;
    case 'tiktok':
        return <TiktokIcon className={className} />;
    case 'discord':
        return <DiscordIcon className={className} />;
    case 'snapchat':
        return <SnapchatIcon className={className} />;
    case 'behance':
        return <BehanceIcon className={className} />;
    case 'threads':
        return <ThreadsIcon className={className} />;
    case 'dribbble':
        return <DribbbleIcon className={className} />;
    case 'pinterest':
        return <PinterestIcon className={className} />;
    case 'twitch':
        return <TwitchIcon className={className} />;
    case 'telegram':
        return <TelegramIcon className={className} />;
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

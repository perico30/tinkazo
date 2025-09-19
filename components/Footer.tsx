import React from 'react';
import type { FooterConfig, LegalLink } from '../types';
import SocialIcon from './icons/SocialIcon';

interface FooterProps {
  config: FooterConfig;
  onLegalClick: (link: LegalLink) => void;
}

const Footer: React.FC<FooterProps> = ({ config, onLegalClick }) => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-sm order-3 md:order-1">{config.copyright}</p>
          <div className="flex space-x-6 order-1 md:order-2">
            {config.socialLinks.map((link) => (
              <a 
                key={link.platform}
                href={link.url} 
                aria-label={link.platform} 
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm order-2 md:order-3 text-center">
             {config.legalLinks.map((link) => (
                <button key={link.title} onClick={() => onLegalClick(link)} className="hover:text-white transition-colors">
                    {link.title}
                </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
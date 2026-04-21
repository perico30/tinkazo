import React from 'react';
import type { FooterConfig, LegalLink } from '../types';
import SocialIcon from './icons/SocialIcon';

interface FooterProps {
  config: FooterConfig;
  onLegalClick: (link: LegalLink) => void;
}

const Footer: React.FC<FooterProps> = ({ config, onLegalClick }) => {
  const formatUrl = (url: string): string => {
    if (!url || url.trim() === '#') return '#';
    const trimmedUrl = url.trim();
    // If it already has a protocol, or is an internal/anchor link, leave it as is.
    if (/^(https?:\/\/|mailto:|tel:|\/|#)/.test(trimmedUrl)) {
      return trimmedUrl;
    }
    // Otherwise, assume it's an external link and prepend https://
    return `https://${trimmedUrl}`;
  };

  return (
    <footer className="bg-slate-950/30 text-gray-400 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-16 border-t border-slate-800 safe-bottom">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-3">
          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {config.socialLinks.map((link) => (
              <a 
                key={link.platform}
                href={formatUrl(link.url)} 
                aria-label={link.platform} 
                className="hover:opacity-80 transition-transform duration-200 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.logoUrl ? (
                  <img src={link.logoUrl} alt={link.platform} className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                ) : (
                  <SocialIcon platform={link.platform} className="h-6 w-6 sm:h-8 sm:w-8" />
                )}
              </a>
            ))}
          </div>
          {/* Legal Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
             {(config.legalLinks || []).map((link) => (
                <button 
                  key={link.title} 
                  onClick={() => onLegalClick(link)} 
                  className="bg-slate-800 hover:bg-slate-700 text-white transition-colors px-3 py-1 rounded-md text-[10px] sm:text-xs font-medium"
                >
                    {link.title}
                </button>
            ))}
          </div>
          {/* Copyright */}
          <p className="text-[10px] sm:text-xs text-gray-500">{config.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
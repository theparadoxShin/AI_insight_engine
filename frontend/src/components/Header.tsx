import React from 'react';
import { Github, Linkedin, Heart, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/translations';
import LanguageSelector from './LanguageSelector';
import config from '../config/env';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const t = useTranslation(language);

  /**
   * Opens PayPal for donations
   */
  const handleSupportClick = () => {
    const paypalUrl = `https://www.paypal.com/donate/?business=ben@parfaittedomtedom.com&no_recurring=0&currency_code=EUR`;
    window.open(paypalUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <header className="text-center mb-8">
      {/* Lang selector */}
      <div className="flex justify-center mb-4">
        <LanguageSelector 
          currentLanguage={language} 
          onLanguageChange={onLanguageChange} 
        />
      </div>
      
      {/* Title principal */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          {config.APP_NAME}
        </h1>
      </div>
      
      {/* Description */}
      <p className="text-gray-400 text-base md:text-lg mb-6 max-w-3xl mx-auto px-4">
        {t('appDescription')}
      </p>
      
      {/* Social links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-gray-500">
        <span className="mb-2 sm:mb-0">{t('createdBy')}</span>
        
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a 
            href={config.GITHUB_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition-colors px-2 py-1"
            title="View source code on GitHub"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <a 
            href={config.LINKEDIN_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition-colors px-2 py-1"
            title="Contact me on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          

        </div>
      </div>
    </header>
  );
};

export default Header;
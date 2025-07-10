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
    // PayPal URL for donations - replace YOUR_PAYPAL_EMAIL with your PayPal email
    const paypalUrl = `https://www.paypal.com/donate/?business=YOUR_PAYPAL_EMAIL&no_recurring=0&currency_code=EUR`;
    window.open(paypalUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" />
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl font-bold text-white">{config.APP_NAME}</h1>
        </div>
        <div className="flex-1 flex justify-end">
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={onLanguageChange} 
          />
        </div>
      </div>
      
      <p className="text-gray-400 text-lg mb-6 max-w-3xl mx-auto">
        {t('appDescription')}
      </p>
      
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>{t('createdBy')}</span>
          <div className="flex items-center gap-4">
            <a 
              href={config.GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
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
              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
              title="Contact me on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleSupportClick}
              className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
              title="Support me via PayPal"
            >
              <Heart className="w-4 h-4" />
              <span>{t('supportMe')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
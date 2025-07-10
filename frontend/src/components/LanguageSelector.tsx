import React from 'react';
import { Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <div className="flex bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onLanguageChange('fr')}
          className={clsx(
            "px-3 py-1 text-sm font-medium rounded transition-colors",
            currentLanguage === 'fr'
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          )}
        >
          FR
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={clsx(
            "px-3 py-1 text-sm font-medium rounded transition-colors",
            currentLanguage === 'en'
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
import React from 'react';
import { clsx } from 'clsx';
import { ModuleType, Language } from '../types';
import { MODULES } from '../utils/constants';
import { useTranslation } from '../utils/translations';

interface ModuleSelectorProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  language: Language;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  activeModule,
  onModuleChange,
  language
}) => {
  const t = useTranslation(language);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {Object.values(MODULES).map((module) => {
        // Temporarily disabled modules
        const isDisabled = module.id === 'computerVision' || module.id === 'ragPlayground' || module.id === 'documentAnalysis' || module.id === 'contentGeneration';
        
        return (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={clsx(
              "p-4 rounded-lg border-2 transition-all duration-200 relative",
              isDisabled 
                ? "opacity-50 cursor-not-allowed bg-gray-800/50 border-gray-700" 
                : "hover:border-blue-500 hover:shadow-lg",
              activeModule === module.id
                ? "bg-blue-600/20 border-blue-500 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300"
            )}
            disabled={isDisabled}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{module.icon}</span>
              <h3 className="font-medium text-sm">
                {t(`${module.id}Module`)}
              </h3>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">
              {module.description}
            </p>
            {isDisabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🚧</div>
                  <p className="text-xs text-yellow-400 font-medium">
                    {language === 'fr' ? 'Sera disponible bientôt' : 'Coming Soon'}
                  </p>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ModuleSelector;
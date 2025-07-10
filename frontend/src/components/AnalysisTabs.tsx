import React from 'react';
import { clsx } from 'clsx';
import { AnalysisType, ModuleType, Language } from '../types';
import { ANALYSIS_TYPES, MODULES } from '../utils/constants';
import { useTranslation } from '../utils/translations';

interface AnalysisTabsProps {
  activeTab: AnalysisType;
  onTabChange: (tab: AnalysisType) => void;
  module: ModuleType;
  language: Language;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  module,
  language 
}) => {
  const t = useTranslation(language);
  const moduleConfig = MODULES[module];
  const availableAnalyses = moduleConfig.analyses;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {availableAnalyses.map((analysisType) => {
        const config = ANALYSIS_TYPES[analysisType];
        return (
          <button
            key={analysisType}
            onClick={() => onTabChange(analysisType)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
              "hover:bg-gray-700 border",
              activeTab === analysisType
                ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                : "bg-gray-800 text-gray-300 border-gray-600"
            )}
          >
            <span className="text-lg">{config.icon}</span>
            <div className="text-left">
              <div className="font-medium">{t(analysisType)}</div>
              <div className="text-xs opacity-75">{config.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AnalysisTabs;
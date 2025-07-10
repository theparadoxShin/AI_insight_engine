import React from 'react';
import ProviderCard from './ProviderCard';
import { AnalysisResult, AnalysisType, ModuleType, Language } from '../types';
import { useTranslation } from '../utils/translations';

interface ResultsGridProps {
  results: AnalysisResult | null;
  analysisType: AnalysisType;
  isLoading: boolean;
  onViewCode: (provider: string) => void;
  module: ModuleType;
  language: Language;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  results,
  analysisType,
  isLoading,
  onViewCode,
  module,
  language
}) => {
  const t = useTranslation(language);

  const getProviderData = (provider: 'aws' | 'azure' | 'google') => {
    return results?.[analysisType]?.[provider] || null;
  };

  const getEmptyStateMessage = () => {
    switch (module) {
      case 'contentGeneration':
        return "Entrez un prompt et cliquez sur 'Générer' pour voir la création de contenu IA";
      case 'documentAnalysis':
        return "Uploadez un document pour voir l'analyse IA";
      case 'computerVision':
        return "Uploadez une image pour voir l'analyse de vision par ordinateur";
      case 'ragPlayground':
        return "Uploadez vos documents et posez une question pour tester le RAG";
      default:
        return "Entrez du texte et cliquez sur 'Analyser' pour voir les insights IA des trois providers";
    }
  };

  return (
    <div className="space-y-6">
      {!results && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-sm">{getEmptyStateMessage()}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProviderCard
          provider="aws"
          data={getProviderData('aws')}
          isLoading={isLoading}
          analysisType={analysisType}
          onViewCode={() => onViewCode('aws')}
          language={language}
        />
        <ProviderCard
          provider="azure"
          data={getProviderData('azure')}
          isLoading={isLoading}
          analysisType={analysisType}
          onViewCode={() => onViewCode('azure')}
          language={language}
        />
        <ProviderCard
          provider="google"
          data={getProviderData('google')}
          isLoading={isLoading}
          analysisType={analysisType}
          onViewCode={() => onViewCode('google')}
          language={language}
        />
      </div>
    </div>
  );
};

export default ResultsGrid;
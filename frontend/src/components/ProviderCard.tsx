import React from 'react';
import { clsx } from 'clsx';
import { Code, Cloud, Database, Zap } from 'lucide-react';
import { PROVIDERS } from '../utils/constants';
import { AnalysisType, Language } from '../types';
import { useTranslation } from '../utils/translations';
import LoadingSpinner from './LoadingSpinner';

interface ProviderCardProps {
  provider: 'aws' | 'azure' | 'google';
  data: any;
  isLoading: boolean;
  analysisType: AnalysisType;
  onViewCode: () => void;
  language: Language;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  data,
  isLoading,
  analysisType,
  onViewCode,
  language
}) => {
  const t = useTranslation(language);
  const providerConfig = PROVIDERS[provider];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500">
          {t('noDataAvailable')}
        </div>
      );
    }

    switch (analysisType) {
      case 'sentiment':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {data.sentiment === 'POSITIVE' ? '😊' : 
                 data.sentiment === 'NEGATIVE' ? '😢' : 
                 data.sentiment === 'NEUTRAL' ? '😐' : '🤔'}
              </span>
              <span className="font-medium capitalize">{data.sentiment}</span>
            </div>
            {data.sentimentScore && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Positive: {(data.sentimentScore.Positive * 100).toFixed(1)}%</div>
                <div>Negative: {(data.sentimentScore.Negative * 100).toFixed(1)}%</div>
                <div>Neutral: {(data.sentimentScore.Neutral * 100).toFixed(1)}%</div>
                <div>Mixed: {(data.sentimentScore.Mixed * 100).toFixed(1)}%</div>
              </div>
            )}
          </div>
        );

      case 'keyPhrases':
        return (
          <div className="space-y-2">
            {data.map((phrase: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm mr-2 mb-2"
              >
                {phrase}
              </span>
            ))}
          </div>
        );

      case 'entities':
        return (
          <div className="space-y-2">
            {data.map((entity: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1">
                <div>
                  <span className="font-medium">{entity.text}</span>
                  <span className="text-sm text-gray-400 ml-2">({entity.type})</span>
                </div>
                <span className="text-sm text-gray-400">
                  {(entity.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        );

      case 'language':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <span className="font-medium">{data.languageCode}</span>
            </div>
            <div className="text-sm text-gray-400">
              Confidence: {(data.score * 100).toFixed(1)}%
            </div>
          </div>
        );

      case 'classification':
        return (
          <div className="space-y-2">
            {data.map((category: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-400">
                  {(category.score * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-2">
            <p className="text-gray-200 leading-relaxed">{data.summary}</p>
            <div className="text-sm text-gray-400">
              Longueur: {data.summary?.length || 0} caractères
            </div>
          </div>
        );

      case 'textGeneration':
        return (
          <div className="space-y-2">
            <p className="text-gray-200 leading-relaxed">{data.generatedText}</p>
            <div className="text-sm text-gray-400">
              Modèle: {data.model} | Tokens: {data.tokens}
            </div>
          </div>
        );

      case 'imageGeneration':
        return (
          <div className="space-y-2">
            {data.imageUrl && (
              <img 
                src={data.imageUrl} 
                alt="Generated image" 
                className="w-full rounded-lg"
              />
            )}
            <div className="text-sm text-gray-400">
              Modèle: {data.model} | Résolution: {data.resolution}
            </div>
          </div>
        );

      case 'imageDescription':
        return (
          <div className="space-y-2">
            <p className="text-gray-200 leading-relaxed">{data.description}</p>
            <div className="text-sm text-gray-400">
              Confiance: {(data.confidence * 100).toFixed(1)}%
            </div>
          </div>
        );

      case 'objectDetection':
        return (
          <div className="space-y-2">
            {data.objects?.map((obj: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="font-medium">{obj.name}</span>
                <span className="text-sm text-gray-400">
                  {(obj.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        );

      case 'ocr':
        return (
          <div className="space-y-2">
            <p className="text-gray-200 leading-relaxed">{data.extractedText}</p>
            <div className="text-sm text-gray-400">
              Mots détectés: {data.wordCount}
            </div>
          </div>
        );

      case 'contentModeration':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {data.isAppropriate ? '✅' : '⚠️'}
              </span>
              <span className="font-medium">
                {data.isAppropriate ? 'Contenu approprié' : 'Contenu inapproprié'}
              </span>
            </div>
            {data.categories && (
              <div className="space-y-1">
                {data.categories.map((cat: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{cat.name}</span>
                    <span className="text-gray-400">{(cat.score * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'ragQuery':
        return (
          <div className="space-y-2">
            <p className="text-gray-200 leading-relaxed">{data.answer}</p>
            <div className="text-sm text-gray-400">
              Sources: {data.sources?.length || 0} documents
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">Unknown analysis type</div>;
    }
  };

  return (
    <div className={clsx(
      "bg-gray-800 rounded-lg p-6 transition-all hover:shadow-lg",
      provider === 'google' 
        ? "google-gradient-border" 
        : `border-t-4 ${providerConfig.borderColor}`
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            providerConfig.bgColor
          )}>
            {provider === 'aws' && <Cloud className="w-5 h-5 text-white" />}
            {provider === 'azure' && <Database className="w-5 h-5 text-white" />}
            {provider === 'google' && <Zap className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="font-medium text-white">{providerConfig.name}</h3>
            <p className="text-sm text-gray-400">{providerConfig.fullName}</p>
          </div>
        </div>
        
        <button
          onClick={onViewCode}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Code className="w-4 h-4" />
          <span>{t('viewCode')}</span>
        </button>
      </div>
      
      <div className="min-h-[120px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProviderCard;
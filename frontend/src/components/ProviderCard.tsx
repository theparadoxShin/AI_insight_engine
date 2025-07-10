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

  // 🔧 DEBUG - Afficher les données reçues
  React.useEffect(() => {
    if (data) {
      console.log(`🔍 ${provider.toUpperCase()} data for ${analysisType}:`, data);
    }
  }, [data, provider, analysisType]);

  const getSentimentEmoji = (sentiment: string) => {
    const sentimentLower = sentiment.toLowerCase();
    switch (sentimentLower) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      case 'mixed': return '🤔';
      default: return '❓';
    }
  };

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
        return renderSentimentData();

      case 'keyPhrases':
        return renderKeyPhrasesData();

      case 'entities':
        return renderEntitiesData();

      case 'language':
        return renderLanguageData();

      case 'classification':
        return renderClassificationData();

      // Autres cas existants (pas encore implémentés côté backend)
      case 'summary':
      case 'textGeneration':
      case 'imageGeneration':
      case 'imageDescription':
      case 'objectDetection':
      case 'ocr':
      case 'contentModeration':
      case 'ragQuery':
        return (
          <div className="text-center py-4 text-gray-500">
            <div className="text-sm">Feature coming soon...</div>
            <div className="text-xs text-gray-600 mt-1">
              {analysisType} not yet implemented
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Raw Data:</div>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  // 🔧 SENTIMENT ANALYSIS - Gestion par provider
  const renderSentimentData = () => {
    if (!data) return <div className="text-gray-500">No sentiment data</div>;

    console.log(`🎭 Rendering ${provider} sentiment:`, data);

    if (provider === 'aws') {
      // Format AWS: { sentiment: "NEGATIVE", scores: { Mixed: 0.001, Negative: 0.997, ... } }
      const sentiment = data.sentiment || 'UNKNOWN';
      const scores = data.scores || {};
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSentimentEmoji(sentiment)}</span>
            <span className="font-medium text-lg capitalize">
              {sentiment.toLowerCase()}
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Confidence Scores:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className="font-mono">{(Number(value) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (provider === 'azure') {
      // Format Azure: { sentiment: "negative", scores: { positive: 0, neutral: 0.01, negative: 0.98 }, languages: {...} }
      const sentiment = data.sentiment || 'unknown';
      const scores = data.scores || {};
      const languages = data.languages;
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSentimentEmoji(sentiment)}</span>
            <span className="font-medium text-lg capitalize">
              {sentiment}
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Confidence Scores:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className="font-mono">{(Number(value) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          {languages && languages.primaryLanguage && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="text-sm font-medium text-gray-400">Language:</div>
              <div className="text-sm">
                {languages.primaryLanguage.name} ({languages.primaryLanguage.iso6391Name}) - 
                {(languages.primaryLanguage.confidenceScore * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      );
    }

    if (provider === 'google') {
      // Format Google: { sentiment: { magnitude: 0.89, score: -0.89 } }
      const sentimentData = data.sentiment;
      if (!sentimentData) {
        return <div className="text-gray-500">No Google sentiment data</div>;
      }

      const { score, magnitude } = sentimentData;
      
      // Calculer le sentiment basé sur le score
      let sentimentLabel = 'NEUTRAL';
      if (score > 0.25) sentimentLabel = 'POSITIVE';
      else if (score < -0.25) sentimentLabel = 'NEGATIVE';
      else if (Math.abs(score) <= 0.25 && magnitude > 0.5) sentimentLabel = 'MIXED';
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSentimentEmoji(sentimentLabel)}</span>
            <span className="font-medium text-lg">
              {sentimentLabel}
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Google Metrics:</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Score:</span>
                <span className="text-sm font-mono">{score.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Magnitude:</span>
                <span className="text-sm font-mono">{magnitude.toFixed(3)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Score: -1 (negative) to +1 (positive)<br/>
                Magnitude: 0 (no emotion) to +∞ (strong emotion)
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Fallback pour données inconnues
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">Unknown Format:</div>
        <pre className="text-xs bg-gray-700 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  // 🔧 KEY PHRASES - Affichage selon le format de chaque provider
  const renderKeyPhrasesData = () => {
    if (!data) return <div className="text-gray-500">No key phrases data</div>;

    // Si c'est un array direct (format attendu)
    if (Array.isArray(data)) {
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400">Key Phrases:</div>
          <div className="flex flex-wrap gap-1">
            {data.map((phrase: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Fallback pour autres formats
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">Raw Data:</div>
        <pre className="text-xs bg-gray-700 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  // 🔧 ENTITIES - Affichage des entités
  const renderEntitiesData = () => {
    if (!data) return <div className="text-gray-500">No entities data</div>;

    if (Array.isArray(data)) {
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400">Entities:</div>
          <div className="space-y-2">
            {data.map((entity: any, index: number) => (
              <div key={index} className="bg-gray-700 p-2 rounded text-sm">
                <div className="font-medium">{entity.text}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {entity.type} • {(entity.confidence * 100).toFixed(1)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">Raw Data:</div>
        <pre className="text-xs bg-gray-700 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  // 🔧 LANGUAGE DETECTION
  const renderLanguageData = () => {
    if (!data) return <div className="text-gray-500">No language data</div>;

    // Format AWS: array de langues
    if (Array.isArray(data)) {
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400">Detected Languages:</div>
          {data.map((lang: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{lang.language}</span>
              <span className="text-sm text-gray-400">{(lang.confidence * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      );
    }

    // Format Azure/Google: objet unique
    if (data.language || data.languageCode) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <span className="font-medium">{data.language || data.languageCode}</span>
          </div>
          <div className="text-sm text-gray-400">
            Confidence: {(data.confidence * 100).toFixed(1)}%
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">Raw Data:</div>
        <pre className="text-xs bg-gray-700 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  // 🔧 TEXT CLASSIFICATION
  const renderClassificationData = () => {
    if (!data) return <div className="text-gray-500">No classification data</div>;

    if (Array.isArray(data)) {
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400">Categories:</div>
          <div className="space-y-2">
            {data.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="font-medium">{item.category || item.name}</span>
                <span className="text-sm text-gray-400">
                  {((item.confidence || item.score) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">Raw Data:</div>
        <pre className="text-xs bg-gray-700 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
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
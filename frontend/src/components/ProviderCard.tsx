import React from 'react';
import { clsx } from 'clsx';
import { Code, Cloud, Database, Zap, AlertCircle, FolderOpen, Users, Key } from 'lucide-react';
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

  // Debug log
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

  const getEntityTypeEmoji = (type: string) => {
    const typeUpper = type.toUpperCase();
    switch (typeUpper) {
      case 'PERSON': return '👤';
      case 'ORGANIZATION': return '🏢';
      case 'LOCATION': return '📍';
      case 'DATE': return '📅';
      case 'QUANTITY': return '🔢';
      case 'EVENT': return '🎯';
      case 'PRODUCT': return '📦';
      case 'OTHER': return '❓';
      default: return '🔗';
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
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">
            {language === 'fr' ? 'Aucune donnée disponible' : 'No data available'}
          </div>
        </div>
      );
    }

    if (data.error) {
      return (
        <div className="text-center py-6 text-red-400">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          <div className="text-sm font-medium mb-1">Error</div>
          <div className="text-xs text-red-300">{data.error}</div>
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
        return renderUnknownData();
    }
  };

  // 🎭 SENTIMENT ANALYSIS
  const renderSentimentData = () => {
    if (provider === 'aws') {
      const sentiment = data.sentiment || 'UNKNOWN';
      const scores = data.scores || {};
      
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getSentimentEmoji(sentiment)}</span>
            <div>
              <div className="font-semibold text-lg capitalize text-white">
                {sentiment.toLowerCase()}
              </div>
              <div className="text-xs text-gray-400">AWS Comprehend</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Confidence Scores:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="flex justify-between bg-gray-700 p-2 rounded">
                  <span className="capitalize">{key}:</span>
                  <span className="font-mono text-yellow-400">{(Number(value) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (provider === 'azure') {
      const sentiment = data.sentiment || 'unknown';
      const scores = data.scores || {};
      const languages = data.languages;
      
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getSentimentEmoji(sentiment)}</span>
            <div>
              <div className="font-semibold text-lg capitalize text-white">
                {sentiment}
              </div>
              <div className="text-xs text-gray-400">Azure Text Analytics</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Confidence Scores:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="flex justify-between bg-gray-700 p-2 rounded">
                  <span className="capitalize">{key}:</span>
                  <span className="font-mono text-blue-400">{(Number(value) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          {languages && languages.primaryLanguage && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="text-sm font-medium text-gray-400">Language:</div>
              <div className="text-sm bg-gray-700 p-2 rounded mt-1">
                <span className="text-white">{languages.primaryLanguage.name}</span>
                <span className="text-gray-400"> ({languages.primaryLanguage.iso6391Name})</span>
                <span className="text-blue-400 float-right">{(languages.primaryLanguage.confidenceScore * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (provider === 'google') {
      const sentimentData = data.sentiment;
      if (!sentimentData) {
        return <div className="text-gray-500">No Google sentiment data</div>;
      }

      const { score, magnitude } = sentimentData;
      let sentimentLabel = 'NEUTRAL';
      if (score > 0.25) sentimentLabel = 'POSITIVE';
      else if (score < -0.25) sentimentLabel = 'NEGATIVE';
      else if (Math.abs(score) <= 0.25 && magnitude > 0.5) sentimentLabel = 'MIXED';
      
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getSentimentEmoji(sentimentLabel)}</span>
            <div>
              <div className="font-semibold text-lg text-white">
                {sentimentLabel}
              </div>
              <div className="text-xs text-gray-400">Google Natural Language</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Metrics:</div>
            <div className="space-y-2">
              <div className="flex justify-between bg-gray-700 p-2 rounded">
                <span className="text-sm">Score:</span>
                <span className="text-sm font-mono text-green-400">{score.toFixed(3)}</span>
              </div>
              <div className="flex justify-between bg-gray-700 p-2 rounded">
                <span className="text-sm">Magnitude:</span>
                <span className="text-sm font-mono text-green-400">{magnitude.toFixed(3)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 bg-gray-800 p-2 rounded">
              Score: -1 (negative) to +1 (positive)<br/>
              Magnitude: 0 (neutral) to +∞ (emotional)
            </div>
          </div>
        </div>
      );
    }

    return renderUnknownData();
  };

  // 🔑 KEY PHRASES
  const renderKeyPhrasesData = () => {
    if (!Array.isArray(data)) {
      return renderUnknownData();
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No key phrases found</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400">
          Key Phrases ({data.length}):
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.map((phrase: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-700 p-2 rounded text-sm"
            >
              <span className="text-yellow-400">#</span>
              <span className="text-white flex-1">{phrase}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 👥 ENTITIES
  const renderEntitiesData = () => {
    if (!Array.isArray(data)) {
      return renderUnknownData();
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No entities found</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400">
          Entities ({data.length}):
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.map((entity: any, index: number) => (
            <div key={index} className="bg-gray-700 p-3 rounded text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getEntityTypeEmoji(entity.type)}</span>
                <span className="font-medium text-white">{entity.text}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 capitalize">{entity.type.toLowerCase()}</span>
                <span className="text-blue-400">{(entity.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 🌐 LANGUAGE DETECTION
  const renderLanguageData = () => {
    // Format AWS: array de langues
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-400">
            Detected Languages:
          </div>
          <div className="space-y-2">
            {data.map((lang: any, index: number) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  <span className="font-medium text-white">{lang.language}</span>
                </div>
                <span className="text-sm text-yellow-400">{(lang.confidence * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Format Azure/Google: objet unique
    if (data.language || data.languageCode) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            <div>
              <div className="font-semibold text-lg text-white">
                {data.language || data.languageCode}
              </div>
              <div className="text-xs text-gray-400">
                {provider === 'azure' ? 'Azure Text Analytics' : 'Google Natural Language'}
              </div>
            </div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Confidence:</span>
              <span className="text-sm font-mono text-green-400">
                {(data.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }

    return renderUnknownData();
  };

  // 📁 TEXT CLASSIFICATION
  const renderClassificationData = () => {
    if (!Array.isArray(data)) {
      return renderUnknownData();
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No classifications found</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400">
          Categories ({data.length}):
        </div>
        <div className="space-y-2">
          {data.map((item: any, index: number) => (
            <div key={index} className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📂</span>
                  <span className="font-medium text-white">
                    {item.category || item.name}
                  </span>
                </div>
                <span className="text-sm text-purple-400">
                  {((item.confidence || item.score) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 🤷 UNKNOWN DATA
  const renderUnknownData = () => {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400">Raw Data:</div>
        <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto max-h-40 text-gray-300">
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
          <span>{language === 'fr' ? 'Voir Code' : 'View Code'}</span>
        </button>
      </div>
      
      <div className="min-h-[120px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProviderCard;
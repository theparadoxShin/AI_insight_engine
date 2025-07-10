import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ModuleSelector from './components/ModuleSelector';
import TextInput from './components/TextInput';
import FileUpload from './components/FileUpload';
import AnalysisTabs from './components/AnalysisTabs';
import ResultsGrid from './components/ResultsGrid';
import CodeViewer from './components/CodeViewer';
import RateLimitWarning from './components/RateLimitWarning';
import { 
  AnalysisResult, 
  AnalysisType, 
  ModuleType, 
  RateLimitInfo, 
  UploadedFile,
  Language 
} from './types';
import { MODULES, GENERATION_MODELS } from './utils/constants';
import { API_URL } from './utils/constants';

function App() {
  const [language, setLanguage] = useState<Language>('fr');
  const [activeModule, setActiveModule] = useState<ModuleType>('textAnalysis');
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('sentiment');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedModel, setSelectedModel] = useState(GENERATION_MODELS[0].id);
  const [codeViewer, setCodeViewer] = useState<{
    isOpen: boolean;
    provider: string;
  }>({
    isOpen: false,
    provider: 'aws'
  });
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    remainingRequests: 50,
    resetTime: Date.now() + 3600000, // 1 hour from now
    isLimited: false
  });

  // Update analysis type when module changes
  useEffect(() => {
    const moduleConfig = MODULES[activeModule];
    if (moduleConfig.analyses.length > 0) {
      setAnalysisType(moduleConfig.analyses[0]);
    }
    setResults(null);
    setText('');
    setUploadedFiles([]);
  }, [activeModule]);

  // Mock API function - replace with actual API call
  const analyzeContent = useCallback(async (
    inputText: string, 
    type: AnalysisType, 
    files?: UploadedFile[]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock rate limiting
      if (rateLimitInfo.remainingRequests <= 0) {
        setRateLimitInfo(prev => ({ ...prev, isLimited: true }));
        throw new Error('Rate limit exceeded');
      }

      // Mock response based on analysis type and module
      const mockResults: AnalysisResult = {
        [type]: {
          aws: generateMockData(type, 'aws'),
          azure: generateMockData(type, 'azure'),
          google: generateMockData(type, 'google')
        }
      };

      setResults(mockResults);
      setRateLimitInfo(prev => ({
        ...prev,
        remainingRequests: prev.remainingRequests - 1
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [rateLimitInfo.remainingRequests]);

  const generateMockData = (type: AnalysisType, provider: string) => {
    switch (type) {
      case 'sentiment':
        return {
          sentiment: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)],
          sentimentScore: {
            Positive: Math.random() * 0.5 + 0.3,
            Negative: Math.random() * 0.3,
            Neutral: Math.random() * 0.4,
            Mixed: Math.random() * 0.2
          }
        };
      
      case 'keyPhrases':
        return [
          'intelligence artificielle',
          'apprentissage automatique',
          'analyse de texte',
          'traitement du langage naturel',
          'informatique en nuage'
        ].slice(0, Math.floor(Math.random() * 3) + 2);
      
      case 'entities':
        return [
          { text: 'OpenAI', type: 'ORGANIZATION', confidence: 0.95 },
          { text: 'San Francisco', type: 'LOCATION', confidence: 0.87 },
          { text: 'GPT-4', type: 'PRODUCT', confidence: 0.92 }
        ];
      
      case 'language':
        return {
          languageCode: language === 'fr' ? 'fr' : 'en',
          score: 0.95 + Math.random() * 0.05
        };
      
      case 'classification':
        return [
          { name: 'Technologie', score: 0.85 },
          { name: 'Business', score: 0.72 },
          { name: 'Éducation', score: 0.45 }
        ];

      case 'summary':
        return {
          summary: "Ceci est un résumé automatique généré par l'IA. Il capture les points clés du document original en quelques phrases concises et informatives.",
          originalLength: 1500,
          summaryLength: 150
        };

      case 'textGeneration':
        return {
          generatedText: "Voici un texte créatif généré par l'IA basé sur votre prompt. Le contenu est original et adapté à votre demande spécifique.",
          model: selectedModel,
          tokens: 150
        };

      case 'imageGeneration':
        return {
          imageUrl: `https://picsum.photos/400/400?random=${Math.random()}`,
          model: selectedModel,
          resolution: "512x512"
        };

      case 'imageDescription':
        return {
          description: "Cette image montre un paysage urbain moderne avec des gratte-ciel et un ciel bleu. On peut voir des voitures et des piétons dans la rue.",
          confidence: 0.92
        };

      case 'objectDetection':
        return {
          objects: [
            { name: 'Voiture', confidence: 0.95, bbox: [100, 150, 200, 250] },
            { name: 'Personne', confidence: 0.87, bbox: [300, 100, 350, 300] },
            { name: 'Bâtiment', confidence: 0.92, bbox: [0, 0, 400, 200] }
          ]
        };

      case 'ocr':
        return {
          extractedText: "Texte extrait de l'image par reconnaissance optique de caractères (OCR).",
          wordCount: 12,
          confidence: 0.89
        };

      case 'contentModeration':
        return {
          isAppropriate: Math.random() > 0.3,
          categories: [
            { name: 'Violence', score: 0.1 },
            { name: 'Contenu adulte', score: 0.05 },
            { name: 'Langage offensant', score: 0.02 }
          ]
        };

      case 'ragQuery':
        return {
          answer: "Basé sur les documents fournis, voici la réponse à votre question. L'information provient directement des sources que vous avez uploadées.",
          sources: ['document1.pdf', 'document2.docx'],
          confidence: 0.88
        };
      
      default:
        return null;
    }
  };

  const handleAnalyze = () => {
    const moduleConfig = MODULES[activeModule];
    
    if (moduleConfig.inputType === 'text' && text.trim() && !rateLimitInfo.isLimited) {
      analyzeContent(text, analysisType);
    } else if (moduleConfig.inputType === 'file' && uploadedFiles.length > 0) {
      analyzeContent('', analysisType, uploadedFiles);
    } else if (moduleConfig.inputType === 'documents' && uploadedFiles.length > 0 && text.trim()) {
      analyzeContent(text, analysisType, uploadedFiles);
    }
  };

  const handleViewCode = (provider: string) => {
    setCodeViewer({
      isOpen: true,
      provider
    });
  };

  const handleCloseCodeViewer = () => {
    setCodeViewer({
      isOpen: false,
      provider: 'aws'
    });
  };

  const handleFilesUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  // Reset rate limit periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimitInfo(prev => {
        if (Date.now() > prev.resetTime) {
          return {
            remainingRequests: 50,
            resetTime: Date.now() + 3600000,
            isLimited: false
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const moduleConfig = MODULES[activeModule];
  const canAnalyze = !rateLimitInfo.isLimited && (
    (moduleConfig.inputType === 'text' && text.trim()) ||
    (moduleConfig.inputType === 'file' && uploadedFiles.length > 0) ||
    (moduleConfig.inputType === 'image' && uploadedFiles.length > 0) ||
    (moduleConfig.inputType === 'documents' && uploadedFiles.length > 0 && text.trim())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto px-4 py-8" style={{ maxWidth: '90rem' }}>
        <Header language={language} onLanguageChange={setLanguage} />
        
        <div className="space-y-6">
          <ModuleSelector
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            language={language}
          />

          <RateLimitWarning rateLimitInfo={rateLimitInfo} language={language} />
          
          {(moduleConfig.inputType === 'text' || moduleConfig.inputType === 'documents') && (
            <TextInput
              value={text}
              onChange={setText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              isDisabled={rateLimitInfo.isLimited}
              module={activeModule}
              language={language}
              selectedModel={activeModule === 'contentGeneration' ? selectedModel : undefined}
              onModelChange={activeModule === 'contentGeneration' ? setSelectedModel : undefined}
            />
          )}

          {(moduleConfig.inputType === 'file' || 
            moduleConfig.inputType === 'image' || 
            moduleConfig.inputType === 'documents') && (
            <FileUpload
              onFilesUpload={handleFilesUpload}
              acceptedTypes={moduleConfig.inputType === 'image' ? 'images' : 'documents'}
              multiple={moduleConfig.inputType === 'documents'}
              language={language}
            />
          )}
          
          <AnalysisTabs
            activeTab={analysisType}
            onTabChange={setAnalysisType}
            module={activeModule}
            language={language}
          />
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 text-red-400">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <ResultsGrid
            results={results}
            analysisType={analysisType}
            isLoading={isLoading}
            onViewCode={handleViewCode}
            module={activeModule}
            language={language}
          />
        </div>
      </div>
      
      <CodeViewer
        isOpen={codeViewer.isOpen}
        onClose={handleCloseCodeViewer}
        provider={codeViewer.provider}
        analysisType={analysisType}
        language={language}
      />
    </div>
  );
}

export default App;
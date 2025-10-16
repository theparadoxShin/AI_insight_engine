import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { apiService } from './services/apiService';
import Header from './components/Header';
import ModuleSelector from './components/ModuleSelector';
import TextInput from './components/TextInput';
import FileUpload from './components/FileUpload';
import AnalysisTabs from './components/AnalysisTabs';
import ResultsGrid from './components/ResultsGrid';
import CodeViewer from './components/CodeViewer';
import { 
  AnalysisResult, 
  AnalysisType, 
  ModuleType, 
  UploadedFile,
  Language 
} from './types';
import { MODULES, GENERATION_MODELS } from './utils/constants';

/**
 * Main component of the AI Insight Engine application
 * Manages global state and orchestrates interactions between components
 */
function App() {
  // Main application states
  const [language, setLanguage] = useState<Language>('en');
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

  /**
   * Updates analysis type when module changes
   * Resets state to avoid inconsistencies
   */
  useEffect(() => {
    const moduleConfig = MODULES[activeModule];
    if (moduleConfig.analyses.length > 0) {
      setAnalysisType(moduleConfig.analyses[0]);
    }
    // Reset state when module changes
    setResults(null);
    setText('');
    setUploadedFiles([]);
    setError(null);
  }, [activeModule]);

  /**
   * Main content analysis function
   * Uses API service with fallback to mock data
   * @param inputText - Text to analyze
   * @param type - Type of analysis to perform
   * @param files - Uploaded files (optional)
   */
  const analyzeContent = useCallback(async (
    inputText: string, 
    type: AnalysisType, 
    files?: UploadedFile[]
  ) => {
    console.log('🚀 Starting analysis:', { type, textLength: inputText.length, filesCount: files?.length || 0 });
    
    setIsLoading(true);
    setError(null);

    try {
      // Call API service
      const response = await apiService.analyzeContent({
        text: inputText,
        analysisType: type,
      });

      if (!response.success) {
        throw new Error(response.error || 'Error during analysis');
      }

      // Update results
      if (response.data) {
        setResults(response.data);
        console.log('✅ Analysis completed successfully');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Error during analysis:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [language, selectedModel]);

  /**
   * Handler to trigger analysis
   * Validates conditions before calling analyzeContent
   */
  const handleAnalyze = useCallback(() => {
    const moduleConfig = MODULES[activeModule];
    
    // Validation based on module input type
    if (moduleConfig.inputType === 'text' && text.trim()) {
      analyzeContent(text, analysisType);
    } else if (moduleConfig.inputType === 'file' && uploadedFiles.length > 0) {
      analyzeContent('', analysisType, uploadedFiles);
    } else if (moduleConfig.inputType === 'documents' && uploadedFiles.length > 0 && text.trim()) {
      analyzeContent(text, analysisType, uploadedFiles);
    } else {
      console.warn('⚠️ Analysis conditions not met');
    }
  }, [activeModule, text, analysisType, uploadedFiles, analyzeContent]);

  /**
   * Opens code viewer for a specific provider
   * @param provider - Cloud provider (aws, azure, google)
   */
  const handleViewCode = useCallback((provider: string) => {
    console.log('Opening code viewer for:', provider);
    setCodeViewer({
      isOpen: true,
      provider
    });
  }, []);

  /**
   * Closes the code viewer
   */
  const handleCloseCodeViewer = useCallback(() => {
    setCodeViewer({
      isOpen: false,
      provider: 'aws'
    });
  }, []);

  /**
   * Handler for file uploads
   * @param files - List of uploaded files
   */
  const handleFilesUpload = useCallback((files: UploadedFile[]) => {
    console.log('Files uploaded:', files.length);
    setUploadedFiles(files);
    // Reset previous results
    setResults(null);
    setError(null);
  }, []);

  /**
   * Checks if analysis can be triggered
   * Based on module input type and conditions
   */
  const canAnalyze = useMemo(() => {    
    const moduleConfig = MODULES[activeModule];
    
    switch (moduleConfig.inputType) {
      case 'text':
        return text.trim().length > 0;
      case 'file':
      case 'image':
        return uploadedFiles.length > 0;
      case 'documents':
        return uploadedFiles.length > 0 && text.trim().length > 0;
      default:
        return false;
    }
  }, [activeModule, text, uploadedFiles]);

  // Get current module configuration
  const moduleConfig = MODULES[activeModule];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto px-4 py-8" style={{ maxWidth: '125rem' }}>
        {/* Header with title, description and links */}
        <Header language={language} onLanguageChange={setLanguage} />
        
        <div className="space-y-6">
          {/* Module selector */}
          <ModuleSelector
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            language={language}
          />
          
          {/* Text input area for appropriate modules */}
          {(moduleConfig.inputType === 'text' || moduleConfig.inputType === 'documents') && (
            <TextInput
              value={text}
              onChange={setText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              isDisabled={!canAnalyze}
              module={activeModule}
              language={language}
              selectedModel={activeModule === 'contentGeneration' ? selectedModel : undefined}
              onModelChange={activeModule === 'contentGeneration' ? setSelectedModel : undefined}
            />
          )}

          {/* File upload area for appropriate modules */}
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
          
          {/* Analysis type tabs */}
          <AnalysisTabs
            activeTab={analysisType}
            onTabChange={setAnalysisType}
            module={activeModule}
            language={language}
          />
          
          {/* Error display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 text-red-400">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Results grid for 3 providers */}
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
      
      {/* Code viewer modal */}
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
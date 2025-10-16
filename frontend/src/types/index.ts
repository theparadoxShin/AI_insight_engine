// ========================================
// INTERFACES PRINCIPALES
// ========================================

export interface AnalysisResult {
  // Structure exacte retournée par votre backend
  sentiment?: {
    aws?: AWSentimentResult;
    azure?: AzureSentimentResult;
    google?: GoogleSentimentResult;
  };
  keyPhrases?: {
    aws?: string[];
    azure?: string[];
    google?: string[];
  };
  entities?: {
    aws?: AWSEntityResult[];
    azure?: AzureEntityResult[];
    google?: GoogleEntityResult[];
  };
  language?: {
    aws?: AWSLanguageResult[];
    azure?: AzureLanguageResult;
    google?: GoogleLanguageResult;
  };
  classification?: {
    aws?: AWSClassificationResult[];
    azure?: AzureClassificationResult[];
    google?: GoogleClassificationResult[];
  };
  
  // Fonctionnalités futures (pas encore implémentées)
  summary?: { aws?: any; azure?: any; google?: any };
  formRecognition?: { aws?: any; azure?: any; google?: any };
  textGeneration?: { aws?: any; azure?: any; google?: any };
  imageGeneration?: { aws?: any; azure?: any; google?: any };
  imageDescription?: { aws?: any; azure?: any; google?: any };
  objectDetection?: { aws?: any; azure?: any; google?: any };
  ocr?: { aws?: any; azure?: any; google?: any };
  speechToText?: { aws?: any; azure?: any; google?: any };
  textToSpeech?: { aws?: any; azure?: any; google?: any };
  contentModeration?: { aws?: any; azure?: any; google?: any };
  ragQuery?: { aws?: any; azure?: any; google?: any };
  
  // Métadonnées
  message?: string;
  cached?: boolean;
}

// ========================================
// SENTIMENT ANALYSIS - Types par Provider
// ========================================

export interface AWSentimentResult {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  scores: {
    Mixed: number;
    Negative: number;
    Neutral: number;
    Positive: number;
  };
}

export interface AzureSentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  languages?: {
    primaryLanguage: {
      name: string;
      iso6391Name: string;
      confidenceScore: number;
    };
    id: string;
    warnings: any[];
  };
}

export interface GoogleSentimentResult {
  sentiment: {
    magnitude: number;
    score: number;
  };
}

// ========================================
// ENTITY RECOGNITION - Types par Provider
// ========================================

export interface AWSEntityResult {
  text: string;
  type: string;
  confidence: number;
  offset?: number;
  length?: number;
}

export interface AzureEntityResult {
  text: string;
  type: string;
  confidence: number;
  offset?: number;
  length?: number;
}

export interface GoogleEntityResult {
  text: string;
  type: string;
  confidence: number;
  offset?: number;
}

// ========================================
// LANGUAGE DETECTION - Types par Provider
// ========================================

export interface AWSLanguageResult {
  language: string;
  confidence: number;
}

export interface AzureLanguageResult {
  language: string;
  confidence: number;
}

export interface GoogleLanguageResult {
  language: string;
  confidence: number;
}

// ========================================
// TEXT CLASSIFICATION - Types par Provider
// ========================================

export interface AWSClassificationResult {
  category: string;
  confidence: number;
}

export interface AzureClassificationResult {
  category: string;
  confidence: number;
}

export interface GoogleClassificationResult {
  category: string;
  confidence: number;
}

// ========================================
// TYPES GÉNÉRIQUES (Compatibilité)
// ========================================

export interface Entity {
  text: string;
  type: string;
  confidence: number;
  offset?: number;
  length?: number;
}

// Types de données deprecated (pour compatibilité)
export interface SentimentData {
  aws?: AWSentimentResult;
  azure?: AzureSentimentResult;
  google?: GoogleSentimentResult;
}

export interface KeyPhrasesData {
  aws?: string[];
  azure?: string[];
  google?: string[];
}

export interface EntityData {
  text: string;
  type: string;
  confidence: number;
  offset?: number;
  length?: number;
}

export interface EntitiesData {
  aws?: EntityData[];
  azure?: EntityData[];
  google?: EntityData[];
}

export interface LanguageData {
  aws?: AWSLanguageResult[];
  azure?: AzureLanguageResult;
  google?: GoogleLanguageResult;
}

export interface ClassificationData {
  aws?: AWSClassificationResult[];
  azure?: AzureClassificationResult[];
  google?: GoogleClassificationResult[];
}

// ========================================
// ENUMS ET TYPES
// ========================================

export type AnalysisType = 
  | 'sentiment' 
  | 'keyPhrases' 
  | 'entities' 
  | 'language' 
  | 'classification'
  | 'summary'
  | 'formRecognition'
  | 'textGeneration'
  | 'imageGeneration'
  | 'imageDescription'
  | 'objectDetection'
  | 'ocr'
  | 'contentModeration'
  | 'speechToText'
  | 'textToSpeech'
  | 'ragQuery';

export type ModuleType = 
  | 'textAnalysis'
  | 'documentAnalysis'
  | 'contentGeneration'
  | 'computerVision'
  | 'speechAudio'
  | 'ragPlayground';

export type Language = 'en' | 'fr';

export type ProviderType = 'aws' | 'azure' | 'google';

// ========================================
// CONFIGURATION ET METADATA
// ========================================

export interface ModuleConfig {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
  analyses: AnalysisType[];
  inputType: 'text' | 'file' | 'image' | 'documents' | 'audio';
}

export interface AnalysisTypeConfig {
  title: string;
  icon: string;
  description: string;
  module: ModuleType;
}

// ========================================
// API COMMUNICATION
// ========================================

export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  message?: string;
  cached?: boolean;
}

export interface AnalysisRequest {
  text: string;
  analysisType: AnalysisType;
}

// ========================================
// UI ET INTERFACE
// ========================================

export interface Translation {
  [key: string]: {
    en: string;
    fr: string;
  };
}

export interface GenerationModel {
  id: string;
  name: string;
  provider: ProviderType;
  type: 'text' | 'image';
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  url?: string;
}

export interface RAGDocument {
  id: string;
  name: string;
  content: string;
  chunks: string[];
  embeddings?: number[][];
}

// ========================================
// MOCK DATA INTERFACES (pour apiService)
// ========================================

export interface MockSentimentData {
  sentiment: string;
  scores: Record<string, number>;
  confidence?: number;
}

export interface MockEntityData {
  text: string;
  type: string;
  confidence: number;
  beginOffset?: number;
  endOffset?: number;
}

export interface MockLanguageData {
  languageCode?: string;
  language?: string;
  confidence: number;
  name?: string;
}

export interface MockClassificationData {
  name?: string;
  category?: string;
  score?: number;
  confidence?: number;
}

// ========================================
// ERROR HANDLING
// ========================================

export interface ApiError {
  error: string;
  details?: string;
  status?: number;
  statusText?: string;
  retryAfter?: number;
  currentLength?: number;
  maxLength?: number;
  minLength?: number;
  isNetworkError?: boolean;
}

export interface RateLimitError extends ApiError {
  retryAfter: number;
  remainingRequests?: number;
  resetTime?: number;
}

// ========================================
// TYPE GUARDS (Utilitaires)
// ========================================

export function isAWSentimentResult(data: any): data is AWSentimentResult {
  return data && typeof data.sentiment === 'string' && data.scores && typeof data.scores === 'object';
}

export function isAzureSentimentResult(data: any): data is AzureSentimentResult {
  return data && typeof data.sentiment === 'string' && data.scores && typeof data.scores === 'object';
}

export function isGoogleSentimentResult(data: any): data is GoogleSentimentResult {
  return data && data.sentiment && typeof data.sentiment.score === 'number' && typeof data.sentiment.magnitude === 'number';
}

export function isApiError(error: any): error is ApiError {
  return error && typeof error.error === 'string';
}


// ========================================
// HELPER TYPES
// ========================================

export type ProviderResult<T> = {
  aws?: T;
  azure?: T;
  google?: T;
};

export type AnalysisTypeResult = {
  [K in AnalysisType]?: ProviderResult<any>;
};

// Utility type pour extraire les données d'un provider spécifique
export type ProviderData<T extends AnalysisType> = 
  T extends 'sentiment' ? (AWSentimentResult | AzureSentimentResult | GoogleSentimentResult) :
  T extends 'keyPhrases' ? string[] :
  T extends 'entities' ? (AWSEntityResult | AzureEntityResult | GoogleEntityResult)[] :
  T extends 'language' ? (AWSLanguageResult[] | AzureLanguageResult | GoogleLanguageResult) :
  T extends 'classification' ? (AWSClassificationResult | AzureClassificationResult | GoogleClassificationResult)[] :
  any;
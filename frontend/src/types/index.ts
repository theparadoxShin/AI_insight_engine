export interface AnalysisResult {
  sentiment?: SentimentData;
  keyPhrases?: KeyPhrasesData;
  entities?: EntitiesData;
  language?: LanguageData;
  classification?: ClassificationData;
  summary?: { aws?: any; azure?: any; google?: any };
  formRecognition?: { aws?: any; azure?: any; google?: any };
  textGeneration?: { aws?: any; azure?: any; google?: any };
  imageGeneration?: { aws?: any; azure?: any; google?: any };
  imageDescription?: { aws?: any; azure?: any; google?: any };
  objectDetection?: { aws?: any; azure?: any; google?: any };
  ocr?: { aws?: any; azure?: any; google?: any };
  contentModeration?: { aws?: any; azure?: any; google?: any };
  ragQuery?: { aws?: any; azure?: any; google?: any };
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
}

export interface SentimentData {
  // AWS Format
  aws?: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
    scores: {
      Mixed: number;
      Negative: number;
      Neutral: number;
      Positive: number;
    };
  };
  
  // Azure Format
  azure?: {
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
  };
  
  // Google Format
  google?: {
    sentiment: {
      magnitude: number;
      score: number;
    };
  };
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
  aws?: Array<{
    language: string;
    confidence: number;
  }>;
  azure?: {
    language: string;
    confidence: number;
  };
  google?: {
    language: string;
    confidence: number;
  };
}

export interface ClassificationData {
  aws?: Array<{
    category: string;
    confidence: number;
  }>;
  azure?: Array<{
    category: string;
    confidence: number;
  }>;
  google?: Array<{
    category: string;
    confidence: number;
  }>;
}

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
  | 'ragQuery';

export type ModuleType = 
  | 'textAnalysis'
  | 'documentAnalysis'
  | 'contentGeneration'
  | 'computerVision'
  | 'ragPlayground';

export interface ModuleConfig {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
  analyses: AnalysisType[];
  inputType: 'text' | 'file' | 'image' | 'documents';
}

export interface AnalysisTypeConfig {
  title: string;
  icon: string;
  description: string;
  module: ModuleType;
}

export interface ApiResponse {
  cloudData: {
    [key: string]: {
      aws?: any;
      azure?: any;
      google?: any;
    }
  };
  message: string;
  cached?: boolean;
}

export interface RateLimitInfo {
  remainingRequests: number;
  resetTime: number;
  isLimited: boolean;
}

export interface GenerationModel {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'google';
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

export type Language = 'en' | 'fr';

export interface Translation {
  [key: string]: {
    en: string;
    fr: string;
  };
}
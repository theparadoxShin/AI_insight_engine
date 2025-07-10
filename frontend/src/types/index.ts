export interface AnalysisResult {
  sentiment?: { aws?: any; azure?: any; google?: any };
  keyPhrases?: { aws?: string[]; azure?: string[]; google?: string[] };
  entities?: { aws?: Entity[]; azure?: Entity[]; google?: Entity[] };
  language?: { aws?: any; azure?: any; google?: any };
  classification?: { aws?: any; azure?: any; google?: any };
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

export type Language = 'fr' | 'en';

export interface Translation {
  [key: string]: {
    fr: string;
    en: string;
  };
}
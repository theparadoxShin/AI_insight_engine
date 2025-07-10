import { AnalysisTypeConfig, ModuleConfig, GenerationModel } from '../types';

export const MODULES: Record<string, ModuleConfig> = {
  textAnalysis: {
    id: 'textAnalysis',
    title: 'Advanced Text Analysis',
    description: 'Comprehensive text analysis capabilities',
    icon: '📝',
    analyses: ['sentiment', 'keyPhrases', 'entities', 'language', 'classification'],
    inputType: 'text'
  },
  documentAnalysis: {
    id: 'documentAnalysis',
    title: 'Document Analysis',
    description: 'Upload and analyze PDF/DOCX documents',
    icon: '📄',
    analyses: ['summary', 'formRecognition'],
    inputType: 'file'
  },
  contentGeneration: {
    id: 'contentGeneration',
    title: 'Creative Content Generation',
    description: 'Generate text and images with AI',
    icon: '✨',
    analyses: ['textGeneration', 'imageGeneration'],
    inputType: 'text'
  },
  computerVision: {
    id: 'computerVision',
    title: 'Computer Vision',
    description: 'Analyze and understand images',
    icon: '👁️',
    analyses: ['imageDescription', 'objectDetection', 'ocr', 'contentModeration'],
    inputType: 'image'
  },
  ragPlayground: {
    id: 'ragPlayground',
    title: 'Expert RAG Playground',
    description: 'Chat with your documents using RAG',
    icon: '🧠',
    analyses: ['ragQuery'],
    inputType: 'documents'
  }
};

export const ANALYSIS_TYPES: Record<string, AnalysisTypeConfig> = {
  // Text Analysis Module
  sentiment: {
    title: 'Sentiment Analysis',
    icon: '😊',
    description: 'Analyze emotional tone and sentiment',
    module: 'textAnalysis'
  },
  keyPhrases: {
    title: 'Key Phrases',
    icon: '🔑',
    description: 'Extract main topics and key phrases',
    module: 'textAnalysis'
  },
  entities: {
    title: 'Entity Recognition',
    icon: '👥',
    description: 'Identify people, places, organizations',
    module: 'textAnalysis'
  },
  language: {
    title: 'Language Detection',
    icon: '🌐',
    description: 'Detect text language and confidence',
    module: 'textAnalysis'
  },
  classification: {
    title: 'Text Classification',
    icon: '📁',
    description: 'Categorize text content',
    module: 'textAnalysis'
  },
  
  // Document Analysis Module
  summary: {
    title: 'Automatic Summary',
    icon: '📋',
    description: 'Generate concise document summaries',
    module: 'documentAnalysis'
  },
  formRecognition: {
    title: 'Form Recognition',
    icon: '📊',
    description: 'Extract key-value pairs from forms',
    module: 'documentAnalysis'
  },
  
  // Content Generation Module
  textGeneration: {
    title: 'Text Generation',
    icon: '✍️',
    description: 'Generate creative text content',
    module: 'contentGeneration'
  },
  imageGeneration: {
    title: 'Image Generation',
    icon: '🎨',
    description: 'Create images from text prompts',
    module: 'contentGeneration'
  },
  
  // Computer Vision Module
  imageDescription: {
    title: 'Image Description',
    icon: '🖼️',
    description: 'Generate captions for images',
    module: 'computerVision'
  },
  objectDetection: {
    title: 'Object Detection',
    icon: '🎯',
    description: 'Detect and locate objects in images',
    module: 'computerVision'
  },
  ocr: {
    title: 'Text Recognition (OCR)',
    icon: '🔍',
    description: 'Extract text from images',
    module: 'computerVision'
  },
  contentModeration: {
    title: 'Content Moderation',
    icon: '🛡️',
    description: 'Detect inappropriate content',
    module: 'computerVision'
  },
  
  // RAG Playground Module
  ragQuery: {
    title: 'RAG Query',
    icon: '💬',
    description: 'Chat with your documents',
    module: 'ragPlayground'
  }
};

export const GENERATION_MODELS: GenerationModel[] = [
  // Text Generation Models
  { id: 'claude-3', name: 'Claude 3 (Bedrock)', provider: 'aws', type: 'text' },
  { id: 'titan-text', name: 'Amazon Titan Text', provider: 'aws', type: 'text' },
  { id: 'gpt-4', name: 'GPT-4 (Azure OpenAI)', provider: 'azure', type: 'text' },
  { id: 'gemini-pro', name: 'Gemini Pro (Vertex AI)', provider: 'google', type: 'text' },
  
  // Image Generation Models
  { id: 'titan-image', name: 'Amazon Titan Image', provider: 'aws', type: 'image' },
  { id: 'dall-e-3', name: 'DALL-E 3 (Azure)', provider: 'azure', type: 'image' },
  { id: 'imagen', name: 'Imagen (Vertex AI)', provider: 'google', type: 'image' },
  { id: 'stable-diffusion', name: 'Stable Diffusion (Bedrock)', provider: 'aws', type: 'image' }
];

export const PROVIDERS = {
  aws: {
    name: 'AWS',
    fullName: 'Amazon Web Services',
    color: '#FF9900',
    bgColor: 'bg-orange-500',
    borderColor: 'border-t-[#FF9900]'
  },
  azure: {
    name: 'Azure',
    fullName: 'Microsoft Azure',
    color: '#0078D4',
    bgColor: 'bg-blue-500',
    borderColor: 'border-t-[#0078D4]'
  },
  google: {
    name: 'Google',
    fullName: 'Google Cloud',
    color: '#4285F4',
    bgColor: 'bg-indigo-500',
    borderColor: 'google-gradient-border'
  }
};

export const MAX_CHARACTERS = 5000;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = {
  documents: ['.pdf', '.docx', '.txt'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

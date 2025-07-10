import { Translation } from '../types';

export const translations: Translation = {
  // Header
  appTitle: {
    fr: "Moteur d'Analyse IA",
    en: "AI Insight Engine"
  },
  appDescription: {
    fr: "Comparez tous les services IA entre AWS, Azure et Google Cloud. Testez le NLP, l'analyse de documents, la vision par ordinateur et plus encore avec des résultats en temps réel.",
    en: "Compare all AI services across AWS, Azure, and Google Cloud. Test NLP, document analysis, computer vision, and more with real-time results."
  },
  createdBy: {
    fr: "Créé par",
    en: "Created by"
  },
  supportMe: {
    fr: "Me soutenir",
    en: "Support me"
  },
  comingSoon: {
    fr: "Sera disponible bientôt",
    en: "Coming Soon"
  },
  
  // Modules
  textAnalysisModule: {
    fr: "Analyse de Texte Avancée",
    en: "Advanced Text Analysis"
  },
  documentAnalysisModule: {
    fr: "Analyse de Documents",
    en: "Document Analysis"
  },
  contentGenerationModule: {
    fr: "Génération de Contenu Créatif",
    en: "Creative Content Generation"
  },
  computerVisionModule: {
    fr: "Vision par Ordinateur",
    en: "Computer Vision"
  },
  ragPlaygroundModule: {
    fr: "Playground RAG Expert",
    en: "Expert RAG Playground"
  },
  
  // Analysis Types
  sentiment: {
    fr: "Analyse de Sentiment",
    en: "Sentiment Analysis"
  },
  keyPhrases: {
    fr: "Phrases Clés",
    en: "Key Phrases"
  },
  entities: {
    fr: "Reconnaissance d'Entités",
    en: "Entity Recognition"
  },
  language: {
    fr: "Détection de Langue",
    en: "Language Detection"
  },
  classification: {
    fr: "Classification de Texte",
    en: "Text Classification"
  },
  summary: {
    fr: "Résumé Automatique",
    en: "Automatic Summary"
  },
  formRecognition: {
    fr: "Analyse de Formulaires",
    en: "Form Recognition"
  },
  textGeneration: {
    fr: "Génération de Texte",
    en: "Text Generation"
  },
  imageGeneration: {
    fr: "Génération d'Images",
    en: "Image Generation"
  },
  imageDescription: {
    fr: "Description d'Image",
    en: "Image Description"
  },
  objectDetection: {
    fr: "Détection d'Objets",
    en: "Object Detection"
  },
  ocr: {
    fr: "Reconnaissance de Texte (OCR)",
    en: "Text Recognition (OCR)"
  },
  contentModeration: {
    fr: "Modération de Contenu",
    en: "Content Moderation"
  },
  ragQuery: {
    fr: "Requête RAG",
    en: "RAG Query"
  },
  
  // UI Elements
  analyze: {
    fr: "Analyser",
    en: "Analyze"
  },
  analyzing: {
    fr: "Analyse en cours...",
    en: "Analyzing..."
  },
  generate: {
    fr: "Générer",
    en: "Generate"
  },
  generating: {
    fr: "Génération en cours...",
    en: "Generating..."
  },
  upload: {
    fr: "Télécharger",
    en: "Upload"
  },
  viewCode: {
    fr: "Voir le Code",
    en: "View Code"
  },
  copy: {
    fr: "Copier",
    en: "Copy"
  },
  copied: {
    fr: "Copié !",
    en: "Copied!"
  },
  close: {
    fr: "Fermer",
    en: "Close"
  },
  
  // Placeholders
  textInputPlaceholder: {
    fr: "Entrez votre texte à analyser... (Ctrl+Entrée pour analyser)",
    en: "Enter your text to analyze... (Ctrl+Enter to analyze)"
  },
  promptInputPlaceholder: {
    fr: "Entrez votre prompt pour la génération...",
    en: "Enter your prompt for generation..."
  },
  ragQueryPlaceholder: {
    fr: "Posez une question sur vos documents...",
    en: "Ask a question about your documents..."
  },
  
  // Messages
  noDataAvailable: {
    fr: "Aucune donnée disponible",
    en: "No data available"
  },
  rateLimitExceeded: {
    fr: "Limite de taux atteinte. Veuillez attendre",
    en: "Rate limit reached. Please wait"
  },
  secondsBeforeRetry: {
    fr: "secondes avant de réessayer.",
    en: "seconds before making another request."
  },
  usageRemaining: {
    fr: "Utilisation :",
    en: "Usage:"
  },
  requestsRemaining: {
    fr: "requêtes restantes",
    en: "requests remaining"
  },
  
  // File Upload
  dragDropFiles: {
    fr: "Glissez-déposez vos fichiers ici ou cliquez pour sélectionner",
    en: "Drag and drop your files here or click to select"
  },
  supportedFormats: {
    fr: "Formats supportés :",
    en: "Supported formats:"
  },
  maxFileSize: {
    fr: "Taille max :",
    en: "Max size:"
  },
  
  // Code Examples
  installation: {
    fr: "Installation",
    en: "Installation"
  },
  codeExample: {
    fr: "Exemple de Code",
    en: "Code Example"
  },
  
  // Providers
  awsProvider: {
    fr: "AWS Comprehend",
    en: "AWS Comprehend"
  },
  azureProvider: {
    fr: "Azure Text Analytics",
    en: "Azure Text Analytics"
  },
  googleProvider: {
    fr: "Google Cloud Natural Language",
    en: "Google Cloud Natural Language"
  }
};

export const useTranslation = (language: 'fr' | 'en') => {
  return (key: string): string => {
    return translations[key]?.[language] || key;
  };
};
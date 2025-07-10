/**
 * API Service for AI cloud services integration
 * Handles calls to AWS, Azure and Google Cloud with fallback to mock data
 */

import { AnalysisType, AnalysisResult, UploadedFile } from '../types';
import config from '../config/env';

// API Configuration
const API_BASE_URL = config.API_BASE_URL;
const USE_MOCK_DATA = config.USE_MOCK_DATA;

/**
 * Interface for analysis requests
 */
interface AnalysisRequest {
  text: string;
  analysisType: AnalysisType;
  files?: UploadedFile[];
  language?: string;
  model?: string;
}

/**
 * Interface for API responses
 */
interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  cached?: boolean;
  rateLimitInfo?: {
    remainingRequests: number;
    resetTime: number;
  };
}

/**
 * Main class for API calls
 */
export class ApiService {
  private static instance: ApiService;
  
  private constructor() {}
  
  /**
   * Singleton pattern for service instance
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Main method to analyze content
   * @param request - Analysis request data
   * @returns Promise<ApiResponse> - Analysis result
   */
  public async analyzeContent(request: AnalysisRequest): Promise<ApiResponse> {
    try {
      // If mock mode enabled, use simulated data
      if (USE_MOCK_DATA) {
        console.log('Mock mode enabled - Using simulated data');
        return this.getMockResponse(request);
      }

      // Real API call
      console.log('Real API call to:', `${API_BASE_URL}/analyze`);
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.getAuthToken()}`, // Uncomment if auth token needed
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.results,
        cached: data.cached,
        rateLimitInfo: data.rateLimitInfo,
      };

    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback to mock data on error
      console.log('Fallback to mock data');
      return this.getMockResponse(request);
    }
  }

  /**
   * Generates mock response for testing
   * @param request - Analysis request
   * @returns Promise<ApiResponse> - Simulated response
   */
  private async getMockResponse(request: AnalysisRequest): Promise<ApiResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const mockResults: AnalysisResult = {
      [request.analysisType]: {
        aws: this.generateMockData(request.analysisType, 'aws', request.text),
        azure: this.generateMockData(request.analysisType, 'azure', request.text),
        google: this.generateMockData(request.analysisType, 'google', request.text),
      }
    };

    return {
      success: true,
      data: mockResults,
      cached: false,
      rateLimitInfo: {
        remainingRequests: Math.floor(Math.random() * 50) + 10,
        resetTime: Date.now() + 3600000, // 1 hour
      },
    };
  }

  /**
   * Generates specific mock data by analysis type and provider
   * @param type - Analysis type
   * @param provider - Cloud provider
   * @param text - Text to analyze
   * @returns Formatted mock data
   */
  private generateMockData(type: AnalysisType, provider: string, text: string) {
    const textLength = text.length;
    const complexity = Math.min(textLength / 100, 10); // Complexity factor based on length

    switch (type) {
      case 'sentiment':
        const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'];
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        
        return {
          sentiment,
          sentimentScore: {
            Positive: sentiment === 'POSITIVE' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.3,
            Negative: sentiment === 'NEGATIVE' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.3,
            Neutral: sentiment === 'NEUTRAL' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.4,
            Mixed: sentiment === 'MIXED' ? 0.5 + Math.random() * 0.3 : Math.random() * 0.2,
          },
          confidence: 0.8 + Math.random() * 0.2,
        };

      case 'keyPhrases':
        const phrases = [
          'intelligence artificielle', 'apprentissage automatique', 'analyse de texte',
          'traitement du langage naturel', 'informatique en nuage', 'données structurées',
          'algorithmes avancés', 'modèles prédictifs', 'analyse sémantique'
        ];
        const numPhrases = Math.min(Math.floor(complexity) + 2, phrases.length);
        return phrases.slice(0, numPhrases).map(phrase => ({
          text: phrase,
          score: 0.6 + Math.random() * 0.4,
        }));

      case 'entities':
        const entityTypes = ['PERSON', 'ORGANIZATION', 'LOCATION', 'PRODUCT', 'EVENT'];
        const entities = [
          { text: 'OpenAI', type: 'ORGANIZATION' },
          { text: 'San Francisco', type: 'LOCATION' },
          { text: 'GPT-4', type: 'PRODUCT' },
          { text: 'Microsoft', type: 'ORGANIZATION' },
          { text: 'Paris', type: 'LOCATION' },
        ];
        
        return entities.slice(0, Math.floor(complexity / 2) + 1).map(entity => ({
          ...entity,
          confidence: 0.7 + Math.random() * 0.3,
          beginOffset: Math.floor(Math.random() * textLength),
          endOffset: Math.floor(Math.random() * textLength),
        }));

      case 'language':
        const languages = [
          { code: 'fr', name: 'Français' },
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Español' },
        ];
        const detectedLang = languages[Math.floor(Math.random() * languages.length)];
        
        return {
          languageCode: detectedLang.code,
          languageName: detectedLang.name,
          confidence: 0.85 + Math.random() * 0.15,
        };

      case 'classification':
        const categories = [
          'Technologie', 'Business', 'Éducation', 'Santé', 'Finance',
          'Sport', 'Divertissement', 'Science', 'Politique'
        ];
        
        return categories.slice(0, 3).map((category, index) => ({
          name: category,
          score: (0.8 - index * 0.2) + Math.random() * 0.2,
        }));

      case 'summary':
        const summaryLength = Math.max(50, Math.min(textLength / 10, 200));
        return {
          summary: `Automatic summary generated by ${provider.toUpperCase()}. This text captures the essential points of the original document in approximately ${summaryLength} characters.`,
          originalLength: textLength,
          summaryLength: summaryLength,
          compressionRatio: (summaryLength / textLength * 100).toFixed(1),
        };

      case 'textGeneration':
        return {
          generatedText: `Creative content generated by ${provider.toUpperCase()} based on your prompt. This text demonstrates the content generation capabilities of modern AI.`,
          model: this.getModelName(provider),
          tokens: 120 + Math.floor(Math.random() * 80),
          finishReason: 'stop',
        };

      default:
        return {
          message: `${type} analysis generated by ${provider}`,
          confidence: 0.8 + Math.random() * 0.2,
        };
    }
  }

  /**
   * Returns model name based on provider
   * @param provider - Cloud provider
   * @returns Model name
   */
  private getModelName(provider: string): string {
    const models = {
      aws: 'Claude-3-Sonnet',
      azure: 'GPT-4',
      google: 'Gemini-Pro',
    };
    return models[provider as keyof typeof models] || 'Unknown';
  }

  /**
   * Gets authentication token
   * @returns Auth token or empty string
   */
/*   private getAuthToken(): string {
    return import.meta.env.VITE_API_TOKEN || '';
  } */

  /**
   * Checks API health
   * @returns Promise<boolean> - API status
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000,
      } as RequestInit);
      
      return response.ok;
    } catch (error) {
      console.warn('⚠️ API Health Check failed:', error);
      return false;
    }
  }
  
}

// Export singleton instance
export const apiService = ApiService.getInstance();
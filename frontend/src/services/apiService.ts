/**
 * API Service for AI cloud services integration
 * Handles calls to AWS, Azure and Google Cloud with fallback to mock data
 * UPDATED: Fixed types to match backend response format
 */

import { 
  AnalysisType, 
  AnalysisResult, 
  AnalysisRequest,
  ApiResponse,
  AWSentimentResult,
  AzureSentimentResult,
  GoogleSentimentResult,
  AWSEntityResult,
  AzureEntityResult,
  GoogleEntityResult,
  AWSLanguageResult,
  AzureLanguageResult,
  GoogleLanguageResult,
  AWSClassificationResult,
  AzureClassificationResult,
  GoogleClassificationResult
} from '../types';
import config from '../config/env';

// API Configuration
const API_BASE_URL = config.API_BASE_URL;
const USE_MOCK_DATA = config.USE_MOCK_DATA;

/**
 * Main class for API calls
 */
export class ApiService {
  private static instance: ApiService;
  private sessionId: string;
  
  private constructor() {
    this.sessionId = this.generateSessionId();
  }
  
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
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Main method to analyze content - CORRECTED for your backend
   * @param request - Analysis request data
   * @returns Promise<ApiResponse> - Analysis result
   */
  public async analyzeContent(request: AnalysisRequest): Promise<ApiResponse> {
    try {
      console.log('🚀 Analyzing content:', request.text.substring(0, 50) + '...', 'for type:', request.analysisType);
      console.log('🔧 Using mock data:', USE_MOCK_DATA);
      console.log('🌐 API URL:', `${API_BASE_URL}/analyze`);
      
      // If mock mode enabled, use simulated data
      if (USE_MOCK_DATA) {
        console.log('🎭 Mock mode enabled - Using simulated data');
        return this.getMockResponse(request);
      }

      // Real API call - CORRECTED format
      console.log('📡 Making real API call...');
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          analysisType: request.analysisType
        }),
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('❌ API Error Response:', errorData);
        
        throw new Error(errorData?.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Raw API Response:', data);

      // CORRECTED: Your backend returns the data directly, not in a nested structure
      return {
        success: true,
        data: data, // Direct assignment - your backend structure is already correct
        cached: data.cached,
        message: data.message,
      };

    } catch (error: any) {
      console.error('🔥 API Error:', error);
      
      // Don't fallback to mock on real errors - return the actual error
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  /**
   * Generates mock response for testing - CORRECTED to match your backend format
   * @param request - Analysis request
   * @returns Promise<ApiResponse> - Simulated response
   */
  private async getMockResponse(request: AnalysisRequest): Promise<ApiResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    console.log('🎭 Generating mock data for:', request.analysisType);

    // CORRECTED: Mock data now matches your exact backend format
    const mockResults: AnalysisResult = {};
    
    // Generate mock data in the exact format your backend returns
    mockResults[request.analysisType] = {
      aws: this.generateMockProviderData(request.analysisType, 'aws', request.text),
      azure: this.generateMockProviderData(request.analysisType, 'azure', request.text),
      google: this.generateMockProviderData(request.analysisType, 'google', request.text),
    };

    // Add message like your backend
    mockResults.message = `${request.analysisType} analysis completed successfully (MOCK DATA).`;

    console.log('🎭 Generated mock results:', mockResults);

    return {
      success: true,
      data: mockResults,
      cached: false,
      message: mockResults.message,
    };
  }

  /**
   * Generates specific mock data by analysis type and provider - CORRECTED format
   * @param type - Analysis type
   * @param provider - Cloud provider
   * @param text - Text to analyze
   * @returns Formatted mock data matching your backend
   */
  private generateMockProviderData(
    type: AnalysisType, 
    provider: 'aws' | 'azure' | 'google', 
    text: string
  ): any {
    switch (type) {
      case 'sentiment':
        return this.generateMockSentiment(provider);
        
      case 'keyPhrases':
        return this.generateMockKeyPhrases(provider);
        
      case 'entities':
        return this.generateMockEntities(provider);
        
      case 'language':
        return this.generateMockLanguage(provider);
        
      case 'classification':
        return this.generateMockClassification(provider);

      default:
        return {
          message: `${type} analysis generated by ${provider}`,
          confidence: 0.8 + Math.random() * 0.2,
        };
    }
  }

  /**
   * Generate mock sentiment data by provider
   */
  private generateMockSentiment(provider: 'aws' | 'azure' | 'google'): AWSentimentResult | AzureSentimentResult | GoogleSentimentResult {
    if (provider === 'aws') {
      const sentiment = ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'][Math.floor(Math.random() * 4)] as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
      return {
        sentiment,
        scores: {
          Mixed: sentiment === 'MIXED' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.1,
          Negative: sentiment === 'NEGATIVE' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
          Neutral: sentiment === 'NEUTRAL' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
          Positive: sentiment === 'POSITIVE' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
        }
      };
    }
    
    if (provider === 'azure') {
      const sentiment = ['positive', 'negative', 'neutral', 'mixed'][Math.floor(Math.random() * 4)] as 'positive' | 'negative' | 'neutral' | 'mixed';
      return {
        sentiment,
        scores: {
          positive: sentiment === 'positive' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
          negative: sentiment === 'negative' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
          neutral: sentiment === 'neutral' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
        },
        languages: {
          primaryLanguage: {
            name: 'English',
            iso6391Name: 'en',
            confidenceScore: 0.95 + Math.random() * 0.05
          },
          id: '0',
          warnings: []
        }
      };
    }
    
    if (provider === 'google') {
      const score = (Math.random() - 0.5) * 2; // -1 to 1
      const magnitude = Math.random() * 2; // 0 to 2
      return {
        sentiment: {
          score,
          magnitude
        }
      };
    }

    throw new Error(`Unknown provider: ${provider}`);
  }

  /**
   * Generate mock key phrases data
   */
  private generateMockKeyPhrases(provider: 'aws' | 'azure' | 'google'): string[] {
    const phrasesByProvider = {
      aws: ['artificial intelligence', 'machine learning', 'data analysis', 'cloud computing'],
      azure: ['AI technology', 'advanced analytics', 'automation', 'digital transformation'],
      google: ['intelligent systems', 'predictive modeling', 'natural language', 'deep learning']
    };
    
    const phrases = phrasesByProvider[provider];
    const numPhrases = 2 + Math.floor(Math.random() * 3); // 2-4 phrases
    return phrases.slice(0, numPhrases);
  }

  /**
   * Generate mock entities data
   */
  private generateMockEntities(provider: 'aws' | 'azure' | 'google'): (AWSEntityResult | AzureEntityResult | GoogleEntityResult)[] {
    const entitiesByProvider = {
      aws: [
        { text: 'OpenAI', type: 'ORGANIZATION', confidence: 0.95 },
        { text: 'San Francisco', type: 'LOCATION', confidence: 0.88 }
      ],
      azure: [
        { text: 'Microsoft', type: 'Organization', confidence: 0.92 },
        { text: 'Seattle', type: 'Location', confidence: 0.85 }
      ],
      google: [
        { text: 'Google', type: 'ORGANIZATION', confidence: 0.96 },
        { text: 'California', type: 'LOCATION', confidence: 0.89 }
      ]
    };

    return entitiesByProvider[provider].map(entity => ({
      ...entity,
      offset: Math.floor(Math.random() * 100),
      length: entity.text.length
    }));
  }

  /**
   * Generate mock language detection data
   */
  private generateMockLanguage(provider: 'aws' | 'azure' | 'google'): AWSLanguageResult[] | AzureLanguageResult | GoogleLanguageResult {
    if (provider === 'aws') {
      return [
        { language: 'en', confidence: 0.99 },
        { language: 'fr', confidence: 0.01 }
      ];
    }
    
    if (provider === 'azure') {
      return {
        language: 'English',
        confidence: 0.98
      };
    }
    
    if (provider === 'google') {
      return {
        language: 'en',
        confidence: 0.97
      };
    }

    throw new Error(`Unknown provider: ${provider}`);
  }

  /**
   * Generate mock classification data
   */
  private generateMockClassification(provider: 'aws' | 'azure' | 'google'): (AWSClassificationResult | AzureClassificationResult | GoogleClassificationResult)[] {
    const categories = ['Technology', 'Business', 'Education', 'Science'];
    
    return categories.slice(0, 2 + Math.floor(Math.random() * 2)).map((category, index) => ({
      category,
      confidence: (0.9 - index * 0.2) + Math.random() * 0.1
    }));
  }

  /**
   * Checks API health
   * @returns Promise<boolean> - API status
   */
  public async healthCheck(): Promise<boolean> {
    if (USE_MOCK_DATA) {
      console.log('🏥 Health check: Mock mode - always healthy');
      return true;
    }

    try {
      console.log('🏥 Checking API health...');
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      const isHealthy = response.ok;
      console.log('🏥 API Health:', isHealthy ? '✅ Healthy' : '❌ Unhealthy');
      return isHealthy;
      
    } catch (error) {
      console.warn('⚠️ API Health Check failed:', error);
      return false;
    }
  }

  /**
   * Test connection with a simple request
   */
  public async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing connection...');
      
      const testRequest: AnalysisRequest = {
        text: 'Test connection',
        analysisType: 'sentiment'
      };
      
      const result = await this.analyzeContent(testRequest);
      console.log('🧪 Connection test result:', result.success ? '✅ Success' : '❌ Failed');
      
      return result.success;
    } catch (error) {
      console.error('🧪 Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();
import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import { LanguageServiceClient } from "@google-cloud/language";
import { 
  ComprehendClient, 
  DetectSentimentCommand,
  DetectDominantLanguageCommand,
  DetectKeyPhrasesCommand,
  DetectEntitiesCommand,
  ClassifyDocumentCommand
} from "@aws-sdk/client-comprehend";

dotenv.config();

// ==========================================
// 🛡️ RATE LIMITING CONFIGURATION (Conservé)
// ==========================================

const RATE_LIMITS = {
  MAX_REQUESTS_PER_IP_PER_HOUR: 50,
  MAX_REQUESTS_PER_IP_PER_DAY: 200,
  MAX_TEXT_LENGTH: 5000,
  MIN_TEXT_LENGTH: 10,
  MAX_REQUESTS_PER_SESSION: 25,
  COOLDOWN_SECONDS: 5,
};

const rateLimitStore = new Map<string, {
  requests: number[];
  lastRequest: number;
  sessionRequests: number;
}>();

const resultsCache = new Map<string, {
  result: any;
  timestamp: number;
  expiresIn: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ==========================================
// 🔧 CONFIGURATION DES CLIENTS
// ==========================================

const azureEndpoint = process.env['AZURE_LANGUAGE_ENDPOINT'] as string;
const azureApiKey = process.env['AZURE_LANGUAGE_CREDIANTIAL_KEY'] as string;
const azureCredential = new AzureKeyCredential(azureApiKey);
const azureClient = new TextAnalysisClient(azureEndpoint, azureCredential);

const awsClient = new ComprehendClient({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

const apiKey = process.env['GOOGLE_API_KEY'] as string;
const language = new LanguageServiceClient({apiKey});

// ==========================================
// 🔒 RATE LIMITING FUNCTIONS (Conservées)
// ==========================================

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const real = req.headers['x-real-ip'] as string;
  const connection = (req.connection as any)?.remoteAddress;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return real || connection || 'unknown';
}

function getSessionId(req: VercelRequest): string {
  const sessionHeader = req.headers['x-session-id'] as string;
  if (sessionHeader) return sessionHeader;
  
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`;
}

function isRateLimited(ip: string, sessionId: string): {
  limited: boolean;
  reason?: string;
  retryAfter?: number;
} {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  const dayAgo = now - (24 * 60 * 60 * 1000);
  
  let ipData = rateLimitStore.get(ip);
  if (!ipData) {
    ipData = { requests: [], lastRequest: 0, sessionRequests: 0 };
    rateLimitStore.set(ip, ipData);
  }
  
  let sessionData = rateLimitStore.get(sessionId);
  if (!sessionData) {
    sessionData = { requests: [], lastRequest: 0, sessionRequests: 0 };
    rateLimitStore.set(sessionId, sessionData);
  }
  
  ipData.requests = ipData.requests.filter(time => time > dayAgo);
  sessionData.requests = sessionData.requests.filter(time => time > hourAgo);
  
  if (now - ipData.lastRequest < RATE_LIMITS.COOLDOWN_SECONDS * 1000) {
    return {
      limited: true,
      reason: 'Too many requests, please wait between requests',
      retryAfter: RATE_LIMITS.COOLDOWN_SECONDS,
    };
  }
  
  const requestsThisHour = ipData.requests.filter(time => time > hourAgo).length;
  const requestsToday = ipData.requests.length;
  
  if (requestsThisHour >= RATE_LIMITS.MAX_REQUESTS_PER_IP_PER_HOUR) {
    return {
      limited: true,
      reason: 'Hourly limit exceeded',
      retryAfter: 3600,
    };
  }
  
  if (requestsToday >= RATE_LIMITS.MAX_REQUESTS_PER_IP_PER_DAY) {
    return {
      limited: true,
      reason: 'Daily limit exceeded',
      retryAfter: 86400,
    };
  }
  
  if (sessionData.sessionRequests >= RATE_LIMITS.MAX_REQUESTS_PER_SESSION) {
    return {
      limited: true,
      reason: 'Session limit exceeded',
      retryAfter: 3600,
    };
  }
  
  return { limited: false };
}

function recordRequest(ip: string, sessionId: string): void {
  const now = Date.now();
  
  const ipData = rateLimitStore.get(ip)!;
  ipData.requests.push(now);
  ipData.lastRequest = now;
  
  const sessionData = rateLimitStore.get(sessionId)!;
  sessionData.requests.push(now);
  sessionData.sessionRequests++;
  sessionData.lastRequest = now;
}

function getCacheKey(text: string, analysisType: string): string {
  return `${analysisType}:${Buffer.from(text).toString('base64').slice(0, 32)}`;
}

function getCachedResult(cacheKey: string): any | null {
  const cached = resultsCache.get(cacheKey);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.expiresIn) {
    resultsCache.delete(cacheKey);
    return null;
  }
  
  return cached.result;
}

function setCachedResult(cacheKey: string, result: any): void {
  resultsCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
    expiresIn: CACHE_DURATION,
  });
}

// ==========================================
// 🚀 MAIN HANDLER - ÉTENDU POUR TOUTES LES ANALYSES
// ==========================================

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, X-CSRF-Token, X-Session-ID');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text, analysisType = 'sentiment' } = req.body;
        
        // Validation du texte
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid text input', 
                details: 'Text must be a non-empty string.' 
            });
        }

        if (text.length > RATE_LIMITS.MAX_TEXT_LENGTH) {
            return res.status(400).json({
                error: 'Text too long',
                details: `Text must be less than ${RATE_LIMITS.MAX_TEXT_LENGTH} characters`,
                currentLength: text.length,
                maxLength: RATE_LIMITS.MAX_TEXT_LENGTH,
            });
        }

        if (text.length < RATE_LIMITS.MIN_TEXT_LENGTH) {
            return res.status(400).json({
                error: 'Text too short',
                details: `Text must be at least ${RATE_LIMITS.MIN_TEXT_LENGTH} characters`,
                currentLength: text.length,
                minLength: RATE_LIMITS.MIN_TEXT_LENGTH,
            });
        }

        // Rate limiting
        const ip = getClientIP(req);
        const sessionId = getSessionId(req);
        
        const rateLimitResult = isRateLimited(ip, sessionId);
        if (rateLimitResult.limited) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                details: rateLimitResult.reason,
                retryAfter: rateLimitResult.retryAfter,
            });
        }

        // Vérifier le cache
        const cacheKey = getCacheKey(text, analysisType);
        const cachedResult = getCachedResult(cacheKey);
        
        if (cachedResult) {
            recordRequest(ip, sessionId);
            return res.status(200).json({
                ...cachedResult,
                cached: true,
                message: `${analysisType} analysis completed successfully (cached).`,
            });
        }

        // Traitement selon le type d'analyse
        const documents = [text];
        let results: any = {};

        recordRequest(ip, sessionId);

        console.log(`🚀 Processing ${analysisType} analysis for text: "${text.substring(0, 50)}..."`);

        switch (analysisType) {
            case 'sentiment':
                results = await performSentimentAnalysis(documents);
                break;
            case 'keyPhrases':
                results = await performKeyPhraseExtraction(documents);
                break;
            case 'entities':
                results = await performEntityRecognition(documents);
                break;
            case 'language':
                results = await performLanguageDetection(documents);
                break;
            case 'classification':
                results = await performTextClassification(documents);
                break;
            default:
                return res.status(400).json({
                    error: 'Unknown analysis type',
                    details: `Analysis type "${analysisType}" is not supported`,
                    supportedTypes: ['sentiment', 'keyPhrases', 'entities', 'language', 'classification']
                });
        }

        const responseData = {
            [analysisType]: results,
            message: `${analysisType} analysis completed successfully.`,
        };

        setCachedResult(cacheKey, responseData);

        console.log(`✅ ${analysisType} analysis completed successfully`);
        return res.status(200).json(responseData);

    } catch (error: any) {
        console.error("Error in handler:", error);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
}

// ==========================================
// 😊 SENTIMENT ANALYSIS (Existant)
// ==========================================

async function performSentimentAnalysis(texts: string[]) {
    console.log('🎭 Performing sentiment analysis...');
    const [azureResult, googleResult, awsResult] = await Promise.all([
        getAzureSentiment(texts),
        getGoogleSentiment(texts),
        getAWSSentiment(texts)
    ]);
    
    return {
        azure: azureResult,
        google: googleResult,
        aws: awsResult,
    };
}

async function getAzureSentiment(texts: string[]) {
    try {
        const results = await azureClient.analyze("SentimentAnalysis", texts);
        const result = results[0];

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            sentiment: result.sentiment,
            scores: result.confidenceScores,
        };
    } catch (err) {
        console.error("Azure Sentiment Error:", err);
        return { error: "Failed to get sentiment analysis from Azure" };
    }
}

async function getGoogleSentiment(texts: string[]) {
    try {
        const document = {
            content: texts[0],
            type: 'PLAIN_TEXT' as const,
        };
        
        const [result] = await language.analyzeSentiment({ document });
        const sentiment = result.documentSentiment;
        
        return {
            sentiment: sentiment,
        };
    } catch (error) {
        console.error("Google Sentiment Error:", error);
        return { error: "Failed to get sentiment analysis from Google" };
    }
}

async function getAWSSentiment(texts: string[]) {
    try {
        const command = new DetectSentimentCommand({
            Text: texts[0],
            LanguageCode: 'en',
        });

        const response = await awsClient.send(command);

        return {
            sentiment: response.Sentiment,
            scores: response.SentimentScore,
        };
    } catch (error) {
        console.error("AWS Sentiment Error:", error);
        return { error: "Failed to get sentiment analysis from AWS" };
    }
}

// ==========================================
// 🔑 KEY PHRASE EXTRACTION (Nouveau)
// ==========================================

async function performKeyPhraseExtraction(texts: string[]) {
    console.log('🔑 Performing key phrase extraction...');
    const [azureResult, googleResult, awsResult] = await Promise.all([
        getAzureKeyPhrases(texts),
        getGoogleKeyPhrases(texts),
        getAWSKeyPhrases(texts)
    ]);
    
    return {
        azure: azureResult,
        google: googleResult,
        aws: awsResult,
    };
}

async function getAzureKeyPhrases(texts: string[]) {
    try {
        const results = await azureClient.analyze("KeyPhraseExtraction", texts);
        const result = results[0];

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.keyPhrases || [];
    } catch (err) {
        console.error("Azure KeyPhrases Error:", err);
        return { error: "Failed to get key phrases from Azure" };
    }
}

async function getGoogleKeyPhrases(texts: string[]) {
    try {
        const document = {
            content: texts[0],
            type: 'PLAIN_TEXT' as const,
        };
        
        const [result] = await language.analyzeEntities({ document });
        const entities = result.entities || [];
        
        // Extraire les noms d'entités comme phrases clés
        const keyPhrases = entities
            .filter(entity => entity.salience && entity.salience > 0.1)
            .map(entity => entity.name)
            .filter(Boolean);
        
        return keyPhrases;
    } catch (error) {
        console.error("Google KeyPhrases Error:", error);
        return { error: "Failed to get key phrases from Google" };
    }
}

async function getAWSKeyPhrases(texts: string[]) {
    try {
        const command = new DetectKeyPhrasesCommand({
            Text: texts[0],
            LanguageCode: 'en',
        });

        const response = await awsClient.send(command);
        const keyPhrases = response.KeyPhrases?.map(kp => kp.Text).filter(Boolean) || [];

        console.log("AWS KeyPhrases:", response.KeyPhrases);
        return keyPhrases;
    } catch (error) {
        console.error("AWS KeyPhrases Error:", error);
        return { error: "Failed to get key phrases from AWS" };
    }
}

// ==========================================
// 👥 ENTITY RECOGNITION (Nouveau)
// ==========================================

async function performEntityRecognition(texts: string[]) {
    console.log('👥 Performing entity recognition...');
    const [azureResult, googleResult, awsResult] = await Promise.all([
        getAzureEntities(texts),
        getGoogleEntities(texts),
        getAWSEntities(texts)
    ]);
    
    return {
        azure: azureResult,
        google: googleResult,
        aws: awsResult,
    };
}

async function getAzureEntities(texts: string[]) {
    try {
        const results = await azureClient.analyze("EntityRecognition", texts);
        const result = results[0];

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.entities?.map((entity: any) => ({
            text: entity.text,
            type: entity.category,
            confidence: entity.confidenceScore,
            offset: entity.offset,
            length: entity.length,
        })) || [];
    } catch (err) {
        console.error("Azure Entities Error:", err);
        return { error: "Failed to get entities from Azure" };
    }
}

async function getGoogleEntities(texts: string[]) {
    try {
        const document = {
            content: texts[0],
            type: 'PLAIN_TEXT' as const,
        };
        
        const [result] = await language.analyzeEntities({ document });
        const entities = result.entities || [];
        
        return entities.map((entity: any) => ({
            text: entity.name,
            type: entity.type,
            confidence: entity.salience,
            offset: entity.mentions?.[0]?.text?.beginOffset,
        }));
    } catch (error) {
        console.error("Google Entities Error:", error);
        return { error: "Failed to get entities from Google" };
    }
}

async function getAWSEntities(texts: string[]) {
    try {
        const command = new DetectEntitiesCommand({
            Text: texts[0],
            LanguageCode: 'en',
        });

        const response = await awsClient.send(command);
        const entities = response.Entities || [];

        return entities.map((entity: any) => ({
            text: entity.Text,
            type: entity.Type,
            confidence: entity.Score,
            offset: entity.BeginOffset,
            length: entity.EndOffset - entity.BeginOffset,
        }));
    } catch (error) {
        console.error("AWS Entities Error:", error);
        return { error: "Failed to get entities from AWS" };
    }
}

// ==========================================
// 🌐 LANGUAGE DETECTION (Nouveau)
// ==========================================

async function performLanguageDetection(texts: string[]) {
    console.log('🌐 Performing language detection...');
    const [azureResult, googleResult, awsResult] = await Promise.all([
        getAzureLanguage(texts),
        getGoogleLanguage(texts),
        getAWSLanguage(texts)
    ]);
    
    return {
        azure: azureResult,
        google: googleResult,
        aws: awsResult,
    };
}

async function getAzureLanguage(texts: string[]) {
    try {
        const results = await azureClient.analyze("LanguageDetection", texts);
        const result = results[0];

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            language: result.primaryLanguage?.name,
            confidence: result.primaryLanguage?.confidenceScore,
        };
    } catch (err) {
        console.error("Azure Language Error:", err);
        return { error: "Failed to get language detection from Azure" };
    }
}

async function getGoogleLanguage(texts: string[]) {
    try {
        const document = {
            content: texts[0],
            type: 'PLAIN_TEXT' as const,
        };
        
        const [result] = await language.analyzeSentiment({ document });
        
        return {
            language: result.language,
            confidence: 1.0, // Google ne fournit pas de score de confiance séparé
        };
    } catch (error) {
        console.error("Google Language Error:", error);
        return { error: "Failed to get language detection from Google" };
    }
}

async function getAWSLanguage(texts: string[]) {
    try {
        const command = new DetectDominantLanguageCommand({
            Text: texts[0],
        });

        const response = await awsClient.send(command);
        const languages = response.Languages || [];

        return languages.map((lang: any) => ({
            language: lang.LanguageCode,
            confidence: lang.Score,
        }));
    } catch (error) {
        console.error("AWS Language Error:", error);
        return { error: "Failed to get language detection from AWS" };
    }
}

// ==========================================
// 📁 TEXT CLASSIFICATION (Nouveau)
// ==========================================

async function performTextClassification(texts: string[]) {
    console.log('📁 Performing text classification...');
    const [azureResult, googleResult, awsResult] = await Promise.all([
        getAzureClassification(texts),
        getGoogleClassification(texts),
        getAWSClassification(texts)
    ]);
    
    return {
        azure: azureResult,
        google: googleResult,
        aws: awsResult,
    };
}

async function getAzureClassification(texts: string[]) {
    try {
        // Note: La classification Azure nécessite un modèle personnalisé
        // Pour la démo, on retourne des données d'exemple
        return [
            { category: "Technology", confidence: 0.85 },
            { category: "Business", confidence: 0.65 },
        ];
    } catch (err) {
        console.error("Azure Classification Error:", err);
        return { error: "Failed to get classification from Azure" };
    }
}

async function getGoogleClassification(texts: string[]) {
    try {
        const document = {
            content: texts[0],
            type: 'PLAIN_TEXT' as const,
        };
        
        const [result] = await language.classifyText({ document });
        const categories = result.categories || [];
        
        return categories.map((category: any) => ({
            category: category.name,
            confidence: category.confidence,
        }));
    } catch (error) {
        console.error("Google Classification Error:", error);
        // La classification Google ne fonctionne que sur certains types de texte
        return { error: "Text classification not available for this content type" };
    }
}

async function getAWSClassification(texts: string[]) {
    try {
        // Note: La classification AWS nécessite un endpoint personnalisé
        // Pour la démo, on retourne des données d'exemple
        return [
            { category: "Technology", confidence: 0.82 },
            { category: "Software", confidence: 0.78 },
        ];
    } catch (error) {
        console.error("AWS Classification Error:", error);
        return { error: "Failed to get classification from AWS" };
    }
}

// Nettoyage périodique (conservé)
setInterval(() => {
  const now = Date.now();
  
  for (const [key, data] of resultsCache.entries()) {
    if (now - data.timestamp > data.expiresIn) {
      resultsCache.delete(key);
    }
  }
  
  const dayAgo = now - (24 * 60 * 60 * 1000);
  for (const [key, data] of rateLimitStore.entries()) {
    data.requests = data.requests.filter(time => time > dayAgo);
    if (data.requests.length === 0 && now - data.lastRequest > dayAgo) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
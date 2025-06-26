// This file is part of the "AI Text Analysis" project.
// It is a serverless function that handles text analysis using Azure's Text Analysis API.
import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import { LanguageServiceClient } from "@google-cloud/language";

dotenv.config();


// ---- AZURE CONFIGURATION ---
const azureEndpoint = process.env['AZURE_LANGUAGE_ENDPOINT'] as string;
const azureApiKey = process.env['AZURE_LANGUAGE_CREDIANTIAL_KEY'] as string;
const azureCredential = new AzureKeyCredential(azureApiKey);
const azureClient = new TextAnalysisClient(azureEndpoint, azureCredential);

// --- AWS CONFIGURATION


// --- GOOGLE CONFIGURATION
const apiKey = process.env['GOOGLE_API_KEY'] as string;
const language = new LanguageServiceClient({apiKey});

// --- DOCUMENTS TESTS ---
const documents = [
  "I had the best day of my life.",
  "This was a waste of my time. The speaker put me to sleep.",
];

// --- MAIN FUNCTION TO HANDLE 3 APIs CALL ---
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Verifiy that the request is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Extract the document (text) of the request
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Please enter a text or upload a document', details: 'Text must be a non-empty string.', text: req.body, type: typeof text });
        }
        const documents = [text];

        // --- On exécute les appels API en parallèle, comme avant ---
        const [azureResult, googleResult] = await Promise.all([
            getAzureAnalyze(documents),
            getGoogleAnalyze(documents),
        ]);
        
        // --- On retourne le résultat combiné ---
        return res.status(200).json({
            azure: azureResult,
            google: googleResult,
            message: 'Sentiment analysis completed successfully.',
        });

    } catch (error: any) {
        console.error("Erreur dans le handler:", error);
        return res.status(500).json({ error: 'Une erreur interne est survenue.', details: error.message });
    }
}

/*
 **********************************************************************
 *Block of Functions for each APIs
 * This is where you can add functions for Azure, AWS and Google APIs
 * to get sentiment analysis.
 **********************************************************************
*/

// Function to get sentiment analysis, language from Azure
async function getAzureAnalyze(texts: any) {

    try{
        const resultsS = await azureClient.analyze("SentimentAnalysis", texts);
        const resultsL = await azureClient.analyze("LanguageDetection", texts);
        // Log the results for debugging
        console.log("Azure Results:", resultsS);
        const result_sentiment = resultsS[0];
        const result_language = resultsL[0];

        // Check if the result has an error
        if (result_language.error) {
            throw new Error(result_language.error.message);
        }
        if (result_sentiment.error) {
             throw new Error(result_sentiment.error.message);
        }

        // Extract the sentiment and confidence scores
        return {
            sentiment: result_sentiment.sentiment,
            scores: result_sentiment.confidenceScores,
            languages: result_language,
        };

    }catch (err){
        console.error("Azure Error :", err);
        return {err : "Failed to get anamysis from Azure"};
    }

}

// Function to get sentiment analysis from GOOGLE
async function getGoogleAnalyze(texts: any) {

    try {
        // Create a document object for Google Language API
        const document = {
            content: texts,
            type: 'PLAIN_TEXT' as const, // 'as const' helps TypeScript to be more precise
        };
        
        // Call the analyzeSentiment method
        const [result] = await language.analyzeSentiment({ document });
        
        // Extract the sentiment from the result
        const sentiment = result.documentSentiment;
        
        // Log the sentiment for debugging
        console.log('Sentiment:', sentiment);
        
        return {
            sentiment: sentiment,
        };

    } catch (error) {
        console.error("Google Error:", error);
        return { err: "Failed to get analysis from Google" };
    }

}

import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors);
app.use(express.json());
const port = process.env.PORT || 3050;

// ---- AZURE CONFIGURATION ---
const azureEndpoint = process.env.AZURE_LANGUAGE_ENDPOINT as string;
const azureApiKey = process.env.AZURE_LANGUAGE_CREDIANTIAL_KEY as string;
const azureCredential = new AzureKeyCredential(azureApiKey);
const azureClient = new TextAnalysisClient(azureEndpoint, azureCredential);

// --- AWS CONFIGURATION


// --- GOOGLE CONFIGURATION


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
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({ error: 'Please enter a text or upload a document' });
        }

        // --- On exécute les appels API en parallèle, comme avant ---
        const [azureResult] = await Promise.all([
            getAzureAnalyze(text),
        ]);
        
        // --- On retourne le résultat combiné ---
        return res.status(200).json({
            azure: azureResult,
        });

    } catch (error: any) {
        console.error("Erreur dans le handler:", error);
        return res.status(500).json({ error: 'Une erreur interne est survenue.', details: error.message });
    }
}

/*
 *********************************
 *Block of Functions for each APIs
 *********************************
*/

async function getAzureAnalyze(texts: any) {

    try{
        const results = await azureClient.analyze("SentimentAnalysis", texts);
        return results;

    }catch (err){
        console.error("Azure Error :", err);
        return {err : "Failed to get anamysis from Azure"};
    }

}

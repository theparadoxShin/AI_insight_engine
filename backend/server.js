import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors);
app.use(express.json());
const port = process.env.PORT || 3050;

// ---- AZURE CONFIGURATION ---
const azureEndpoint = process.env["AZURE_LANGUAGE_ENDPOINT"];
const azureApiKey = process.env["AZURE_LANGUAGE_CREDIANTIAL_KEY"];
const azureCredential = new AzureKeyCredential(azureApiKey);
const azureClient = new TextAnalysisClient(azureEndpoint, azureCredential);

// --- AWS CONFIGURATION


// --- GOOGLE CONFIGURATION


// --- DOCUMENTS TESTS ---
const documents = [
  "I had the best day of my life.",
  "This was a waste of my time. The speaker put me to sleep.",
];

app.get('/', (req, res) => {
        res.send('Hello from AI Insight API !');
    });

// --- MAIN FUNCTION TO HANDLE 3 APIs CALL ---
app.post('/api/analyze', async (request, response) => {
  console.log("=== Analyze Sentiment Sample ===");

  try{

    //const {document} = request.body;
    if(!documents || typeof documents != 'string' || documents.trim().length === 0){
        //return response.status(400).json({error : "please insert a text or upload a document"})
    }

    const azureResult = await getAzureAnalyze(documents);
    console.log(azureResult);

  }catch(err){
    console.error("Error in main function : " , err);
    //return response.status(500).json({error: "Error in main function : ", details: err.message})
  }

});

/*
 *********************************
 *Block of Functions for each APIs
 *********************************
*/

async function getAzureAnalyze(texts) {

    try{

        const results = await azureClient.analyze("SentimentAnalysis", texts);
        if(results.error){
            throw new Error(results.error.message)
        }
        return results;

    }catch (err){
        console.error("Azure Error :", err);
        return {err : "Failed to get anamysis from Azure"};
    }

}
app.listen(port, ()=>{
  console.log("your server is running");
})
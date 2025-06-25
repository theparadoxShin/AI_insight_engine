const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");
require("dotenv/config");

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

// --- MAIN FUNCTION TO HANDLE 3 APIs CALL ---
async function main(request, response) {
  console.log("=== Analyze Sentiment Sample ===");

  try{

    const {document} = request.body;
    if(!document || typeof document != 'string' || document.trim().length === 0){
        return response.status(400).json({error : "please insert a text or upload a document"})
    }

    const azureResult = await getAzureAnalyze(document);
    console.log(azureResult);

  }catch(err){
    console.error("Error in main function : " , err);
    return response.status(500).json({error: "Error in main function : ", details: err.message})
  }

}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };

/*
 *********************************
 *Block of Functions for each APIs
 *********************************
*/

async function getAzureAnalyze(texts) {

    try{

        const results = await client.analyze("SentimentAnalysis", texts);
        if(results.error){
            throw new Error(results.error.message)
        }
        return results;

    }catch (err){
        console.error("Azure Error :", err);
        return {err : "Failed to get anamysis from Azure"};
    }

}
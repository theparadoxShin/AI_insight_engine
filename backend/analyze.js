const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");

const endpoint = process.env["AZURE_LANGUAGE_ENDPOINT"];
const api_key = process.env["AZURE_LANGUAGE_CREDIANTIAL_KEY"];

const documents = [
  "I had the best day of my life.",
  "This was a waste of my time. The speaker put me to sleep.",
];

async function main() {
  console.log("=== Analyze Sentiment Sample ===");

  const credential = new AzureKeyCredential(api_key);

  const client = new TextAnalysisClient(endpoint, new DefaultAzureCredential());

  const results = await client.analyze("SentimentAnalysis", documents);

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    console.log(`- Document ${result.id}`);
    if (!result.error) {
      console.log(`\tDocument text: ${documents[i]}`);
      console.log(`\tOverall Sentiment: ${result.sentiment}`);
      console.log("\tSentiment confidence scores: ", result.confidenceScores);
      console.log("\tSentences");
      for (const { sentiment, confidenceScores, text } of result.sentences) {
        console.log(`\t- Sentence text: ${text}`);
        console.log(`\t  Sentence sentiment: ${sentiment}`);
        console.log("\t  Confidence scores:", confidenceScores);
      }
    } else {
      console.error(`  Error: ${result.error}`);
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };
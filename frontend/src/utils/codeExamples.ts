import { AnalysisType } from '../types';

export const getCodeExample = (provider: string, analysisType: AnalysisType): string => {
  const examples = {
    aws: {
      sentiment: `import { ComprehendClient, DetectSentimentCommand } from "@aws-sdk/client-comprehend";

const client = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new DetectSentimentCommand({
  Text: "Your text here",
  LanguageCode: 'en',
});

const response = await client.send(command);
console.log(response.Sentiment); // POSITIVE, NEGATIVE, NEUTRAL, MIXED`,

      keyPhrases: `import { ComprehendClient, DetectKeyPhrasesCommand } from "@aws-sdk/client-comprehend";

const client = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new DetectKeyPhrasesCommand({
  Text: "Your text here",
  LanguageCode: 'en',
});

const response = await client.send(command);
console.log(response.KeyPhrases);`,

      entities: `import { ComprehendClient, DetectEntitiesCommand } from "@aws-sdk/client-comprehend";

const client = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new DetectEntitiesCommand({
  Text: "Your text here",
  LanguageCode: 'en',
});

const response = await client.send(command);
console.log(response.Entities);`,

      language: `import { ComprehendClient, DetectDominantLanguageCommand } from "@aws-sdk/client-comprehend";

const client = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new DetectDominantLanguageCommand({
  Text: "Your text here",
});

const response = await client.send(command);
console.log(response.Languages);`,

      classification: `import { ComprehendClient, ClassifyDocumentCommand } from "@aws-sdk/client-comprehend";

const client = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new ClassifyDocumentCommand({
  Text: "Your text here",
  EndpointArn: "arn:aws:comprehend:us-east-1:123456789012:document-classifier-endpoint/YOUR_ENDPOINT",
});

const response = await client.send(command);
console.log(response.Classes);`,

      summary: `import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const prompt = \`Résumez le texte suivant en 3-5 phrases clés:

\${documentText}\`;

const command = new InvokeModelCommand({
  modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }]
  })
});

const response = await client.send(command);
const result = JSON.parse(new TextDecoder().decode(response.body));
console.log(result.content[0].text);`,

      textGeneration: `import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new InvokeModelCommand({
  modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 500,
    messages: [{ 
      role: "user", 
      content: "Your creative prompt here" 
    }]
  })
});

const response = await client.send(command);
const result = JSON.parse(new TextDecoder().decode(response.body));
console.log(result.content[0].text);`,

      imageGeneration: `import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new InvokeModelCommand({
  modelId: "amazon.titan-image-generator-v1",
  body: JSON.stringify({
    taskType: "TEXT_IMAGE",
    textToImageParams: {
      text: "Your image prompt here",
      negativeText: "low quality, blurry"
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      quality: "standard",
      cfgScale: 8.0,
      height: 512,
      width: 512,
      seed: 0
    }
  })
});

const response = await client.send(command);
const result = JSON.parse(new TextDecoder().decode(response.body));
console.log(result.images[0]); // Base64 encoded image`,

      ragQuery: `import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { OpenSearchClient } from "@aws-sdk/client-opensearch";

// 1. Recherche de similarité dans les embeddings
const searchSimilarChunks = async (query: string) => {
  const embedding = await generateEmbedding(query);
  
  // Recherche vectorielle dans OpenSearch/Elasticsearch
  const searchResults = await opensearchClient.search({
    index: 'document-chunks',
    body: {
      query: {
        knn: {
          embedding_vector: {
            vector: embedding,
            k: 5
          }
        }
      }
    }
  });
  
  return searchResults.body.hits.hits.map(hit => hit._source.text);
};

// 2. Génération de réponse avec contexte
const ragQuery = async (question: string) => {
  const relevantChunks = await searchSimilarChunks(question);
  
  const prompt = \`Contexte: \${relevantChunks.join('\\n\\n')}
  
Question: \${question}

Répondez en vous basant uniquement sur le contexte fourni.\`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const response = await client.send(command);
  return JSON.parse(new TextDecoder().decode(response.body));
};`
    },

    azure: {
      sentiment: `import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";

const client = new TextAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

const results = await client.analyze("SentimentAnalysis", [
  "Your text here"
]);

for (const result of results) {
  console.log(result.sentiment); // positive, negative, neutral
  console.log(result.confidenceScores);
}`,

      keyPhrases: `import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";

const client = new TextAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

const results = await client.analyze("KeyPhraseExtraction", [
  "Your text here"
]);

for (const result of results) {
  console.log(result.keyPhrases);
}`,

      entities: `import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";

const client = new TextAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

const results = await client.analyze("EntityRecognition", [
  "Your text here"
]);

for (const result of results) {
  console.log(result.entities);
}`,

      language: `import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";

const client = new TextAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

const results = await client.analyze("LanguageDetection", [
  "Your text here"
]);

for (const result of results) {
  console.log(result.primaryLanguage);
  console.log(result.confidenceScore);
}`,

      classification: `import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";

const client = new TextAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

const results = await client.analyze("CustomSingleClassification", [
  "Your text here"
], {
  projectName: "your-project",
  deploymentName: "your-deployment"
});

for (const result of results) {
  console.log(result.classifications);
}`,

      summary: `import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);

const response = await client.getChatCompletions(
  "gpt-4", // deployment name
  [
    {
      role: "system",
      content: "Vous êtes un assistant spécialisé dans la création de résumés concis et informatifs."
    },
    {
      role: "user",
      content: \`Résumez le document suivant en 3-5 phrases clés:

\${documentText}\`
    }
  ],
  {
    maxTokens: 300,
    temperature: 0.3
  }
);

console.log(response.choices[0].message.content);`,

      textGeneration: `import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);

const response = await client.getChatCompletions(
  "gpt-4", // deployment name
  [
    {
      role: "user",
      content: "Your creative prompt here"
    }
  ],
  {
    maxTokens: 500,
    temperature: 0.7
  }
);

console.log(response.choices[0].message.content);`,

      imageGeneration: `import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);

const response = await client.getImages(
  "dall-e-3", // deployment name
  "Your image prompt here",
  {
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "vivid"
  }
);

console.log(response.data[0].url);`,

      ragQuery: `import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { SearchClient } from "@azure/search-documents";

// 1. Configuration des clients
const openaiClient = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);

const searchClient = new SearchClient(
  process.env.AZURE_SEARCH_ENDPOINT,
  "document-index",
  new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
);

// 2. Recherche sémantique
const searchDocuments = async (query: string) => {
  const searchResults = await searchClient.search(query, {
    searchMode: "semantic",
    semanticConfigurationName: "default",
    top: 5,
    select: ["content", "title"]
  });

  const documents = [];
  for await (const result of searchResults.results) {
    documents.push(result.document);
  }
  return documents;
};

// 3. Génération de réponse RAG
const ragQuery = async (question: string) => {
  const relevantDocs = await searchDocuments(question);
  const context = relevantDocs.map(doc => doc.content).join('\\n\\n');

  const response = await openaiClient.getChatCompletions("gpt-4", [
    {
      role: "system",
      content: "Répondez aux questions en vous basant uniquement sur le contexte fourni."
    },
    {
      role: "user",
      content: \`Contexte: \${context}

Question: \${question}\`
    }
  ]);

  return response.choices[0].message.content;
};`
    },

    google: {
      sentiment: `import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient({
  apiKey: process.env.GOOGLE_API_KEY
});

const [result] = await client.analyzeSentiment({
  document: {
    content: "Your text here",
    type: 'PLAIN_TEXT'
  }
});

console.log(result.documentSentiment);
console.log(result.sentences);`,

      keyPhrases: `import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient({
  apiKey: process.env.GOOGLE_API_KEY
});

const [result] = await client.analyzeSyntax({
  document: {
    content: "Your text here",
    type: 'PLAIN_TEXT'
  }
});

// Extract key phrases from tokens
const keyPhrases = result.tokens
  .filter(token => token.partOfSpeech.tag === 'NOUN')
  .map(token => token.text.content);

console.log(keyPhrases);`,

      entities: `import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient({
  apiKey: process.env.GOOGLE_API_KEY
});

const [result] = await client.analyzeEntities({
  document: {
    content: "Your text here",
    type: 'PLAIN_TEXT'
  }
});

console.log(result.entities);`,

      language: `import { TranslateServiceClient } from "@google-cloud/translate";

const client = new TranslateServiceClient({
  apiKey: process.env.GOOGLE_API_KEY
});

const [result] = await client.detectLanguage({
  content: "Your text here"
});

console.log(result.languages);`,

      classification: `import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient({
  apiKey: process.env.GOOGLE_API_KEY
});

const [result] = await client.classifyText({
  document: {
    content: "Your text here",
    type: 'PLAIN_TEXT'
  }
});

console.log(result.categories);`,

      summary: `import { VertexAI } from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1'
});

const model = vertex_ai.preview.getGenerativeModel({
  model: "gemini-pro"
});

const prompt = \`Résumez le document suivant en 3-5 phrases clés:

\${documentText}\`;

const result = await model.generateContent(prompt);
console.log(result.response.text());`,

      textGeneration: `import { VertexAI } from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1'
});

const model = vertex_ai.preview.getGenerativeModel({
  model: "gemini-pro"
});

const result = await model.generateContent("Your creative prompt here");
console.log(result.response.text());`,

      imageGeneration: `import { VertexAI } from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1'
});

const model = vertex_ai.preview.getGenerativeModel({
  model: "imagegeneration@002"
});

const request = {
  prompt: "Your image prompt here",
  number_of_images: 1,
  aspect_ratio: "1:1",
  safety_filter_level: "block_some",
  person_generation: "allow_adult"
};

const result = await model.generateContent(request);
console.log(result.response.candidates[0].content);`,

      ragQuery: `import { VertexAI } from "@google-cloud/vertexai";
import { Firestore } from "@google-cloud/firestore";

// 1. Configuration
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1'
});

const firestore = new Firestore();
const model = vertex_ai.preview.getGenerativeModel({ model: "gemini-pro" });

// 2. Recherche vectorielle avec Firestore
const searchSimilarDocuments = async (query: string) => {
  // Générer l'embedding de la requête
  const embeddingModel = vertex_ai.preview.getGenerativeModel({
    model: "textembedding-gecko@003"
  });
  
  const queryEmbedding = await embeddingModel.embedContent(query);
  
  // Recherche de similarité (implémentation simplifiée)
  const documentsRef = firestore.collection('document-chunks');
  const snapshot = await documentsRef.limit(5).get();
  
  return snapshot.docs.map(doc => doc.data().content);
};

// 3. Génération RAG
const ragQuery = async (question: string) => {
  const relevantChunks = await searchSimilarDocuments(question);
  
  const prompt = \`Contexte: \${relevantChunks.join('\\n\\n')}
  
Question: \${question}

Répondez en vous basant uniquement sur le contexte fourni.\`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};`
    }
  };

  return examples[provider as keyof typeof examples]?.[analysisType] || 'Code example not available';
};

export const getInstallInstructions = (provider: string): string => {
  const instructions = {
    aws: `# Installation des SDK AWS
npm install @aws-sdk/client-comprehend @aws-sdk/client-bedrock-runtime @aws-sdk/client-opensearch

# Configuration des credentials AWS
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1

# Pour Bedrock (génération de contenu)
export AWS_BEDROCK_REGION=us-east-1`,

    azure: `# Installation des SDK Azure
npm install @azure/ai-language-text @azure/openai @azure/search-documents

# Configuration des credentials Azure
export AZURE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
export AZURE_KEY=your_subscription_key

# Pour Azure OpenAI
export AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
export AZURE_OPENAI_KEY=your_openai_key

# Pour Azure Cognitive Search (RAG)
export AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
export AZURE_SEARCH_KEY=your_search_key`,

    google: `# Installation des SDK Google Cloud
npm install @google-cloud/language @google-cloud/translate @google-cloud/vertexai @google-cloud/firestore

# Configuration des credentials Google Cloud
export GOOGLE_API_KEY=your_api_key
export GOOGLE_CLOUD_PROJECT=your-project-id

# Ou utiliser un fichier de service account
export GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Pour Vertex AI
export GOOGLE_CLOUD_LOCATION=us-central1`
  };

  return instructions[provider as keyof typeof instructions] || 'Installation instructions not available';
};
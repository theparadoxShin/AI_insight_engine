# AI Insight Engine v2.0

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://ai-insight-engine.vercel.app)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)](https://github.com/theparadoxshin/ai-insight-engine/releases)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

> The fastest way to test, compare, and integrate AI services from AWS, Azure, and Google Cloud

## 🌟 What's New in v2.0

- ✅ **Complete React Migration** - Modern TypeScript codebase
- ✅ **5 Analysis Types** - Sentiment, Entities, Key Phrases, Language, Classification
- ✅ **Interactive Code Viewer** - Copy-paste ready examples
- ✅ **Multi-language Support** - English & French
- ✅ **Rate Limiting Protection** - Cost management built-in
- ✅ **Mobile Optimized** - Works perfectly on all devices

## 🚀 Live Demo

**Try it now:** [ai-insight-engine.vercel.app](https://ai-insight-engine.vercel.app)

## 📊 AI Analysis Types

| Analysis | Description | Providers |
|----------|-------------|-----------|
| 😊 **Sentiment** | Emotional tone detection | AWS, Azure, Google |
| 🔑 **Key Phrases** | Main topics extraction | AWS, Azure, Google |
| 👥 **Entities** | People, places, organizations | AWS, Azure, Google |
| 🌐 **Language** | Automatic language detection | AWS, Azure, Google |
| 📁 **Classification** | Content categorization | AWS, Azure, Google |

## 💻 Code Examples

Each analysis includes ready-to-use code snippets for:
- **AWS SDK** with Comprehend
- **Azure SDK** with Text Analytics  
- **Google Cloud** with Natural Language

## 🛡️ Built-in Protection

- **Rate Limiting**: 50 requests/hour per IP
- **Text Validation**: 10-5000 characters
- **Cost Management**: Intelligent caching
- **Error Handling**: User-friendly messages




# ⚙️ Setup (Essential Step)

To use this project, you must provide your own API keys. Here is how to get them.

- AWS : 
    - Log in to your AWS console and navigate to the IAM service.
    - Create a new user and grant a_c_c_e_s_s to the Amazon Comprehend service on the permissions tab
    - Create Access Keys on the Security Credentials
    - At the end of the process, copy your Access Key ID and Secret Access Key.
    - You will maybe also need your AWS Region (e.g., us-east-1).

- AZURE : 
    - On the Azure portal, create a new resource of type "Azure AI Services".
    - Once the resource is created, navigate to the "Keys and Endpoint" section.
    - Copy one of the keys and the endpoint.

- GOOGLE CLOUD PLATFORM :
    - On the Google Cloud console, create a new project.
    - Go to "APIs & Services" and enable the "Cloud Natural Language API".
    - Go to "Credentials" and create an "API Key". Copy this key.

- Once you have all these keys, create use the sample.env file to create an .env file in the root of the backend folder, based on the provided .env.example file.

# Launch the project 

```bash 
git clone
cd backend
npm install
node api/analyze |  vercel dev (depend on your local runtime environment)
---
cd frontend
npm install
npm run dev
Enjoy
```

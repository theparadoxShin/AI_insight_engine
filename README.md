# AI_insight_engine
A serverless "Playground" to test, compare, and integrate AI services from the cloud giants (AWS, Azure, & GCP) into your own applications.

---

# 🤔 The Problem This Project Solves
Getting started with AI using cloud services can be intimidating. The documentation is dense, a_c_c_e_s_s configuration is complex, and it's hard to know which service to choose.

AI Insight Engine was created to be the "Rosetta Stone" for AI APIs. It aims to accelerate developers' learning by providing an interactive platform to:

- Test and visualize the results from different AIs.

- Compare their performance on the same piece of text.

- Provide ready-to-use code snippets to integrate these services into your own projects.

---

# ✨ Features (Current Modules)

- Sentiment Analysis: Detailed score (Positive, Negative, Neutral, Mixed).

- Key Phrase Extraction: Identification of main topics.

- Entity Recognition: Detection of people, places, organizations...

- Language Detection: Automatic identification of the text's language.

---

# Technical Stack (Current)

| Layer | Tech |
|-------|------|
| Platform | Web Vercel |
| Frontend | HTML/CSS/JS |
| Backend  | Typescript |


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
node api/analyze / vercel dev (depend on your local runtime environment)
open index.html in browser
Enjoy
```

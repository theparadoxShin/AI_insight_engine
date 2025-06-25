import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors);
app.use(express.json());
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello from AI Insight API !');
});

    app.get('/test', (req, res) => {
        res.send('TEST');
    });

app.listen(port, ()=>{
  console.log("your server is running");
})
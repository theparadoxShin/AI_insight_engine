import vercel from '@vercel/node';
const { VercelRequest, VercelResponse } = vercel;

export default function handler(VercelRequest, VercelResponse){
    const {text = "name test"} = VercelRequest.body;
    
    return VercelResponse.status(200).json({message: `Hello ${text}!`,});
}
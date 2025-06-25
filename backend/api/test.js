import {VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(VercelRequest, VercelResponse){
    const {text = 'name test'} = VercelRequest.body;
    
    return VercelResponse.status(200).json({message : 'test de routine'});
}
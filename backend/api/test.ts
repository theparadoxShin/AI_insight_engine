// File: backend/api/test.ts
// This file is part of the AI Insight Engine project.
// It is a serverless function that responds with a greeting message.
// It is used for testing purposes to ensure the serverless function is working correctly.
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name = 'World' } = req.query
  return res.json({
    message: `Hello ${name}!`,
  })
}
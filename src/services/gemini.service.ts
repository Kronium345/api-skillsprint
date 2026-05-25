import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
}

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export async function generateWithGemini(prompt: string): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not set in server/.env');
  }

  const { text } = await generateText({
    model: google(MODEL),
    prompt,
    temperature: 0.4,
  });

  return text;
}

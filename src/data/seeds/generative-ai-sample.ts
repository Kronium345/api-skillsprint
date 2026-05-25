import type { MCQ } from '../../models/Chapter';

export const generativeAiMcqs: MCQ[] = [
  {
    question: 'What is generative AI best described as?',
    options: [
      'Software that only classifies images',
      'Models that create new content from prompts',
      'A replacement for all databases',
      'Hardware that speeds up Wi‑Fi',
    ],
    answer: 1,
    explanation: 'Generative AI produces text, images, code, and more from learned patterns.',
  },
  {
    question: 'Which practice improves prompt quality the most?',
    options: [
      'Using one-word prompts only',
      'Adding role, context, constraints, and examples',
      'Disabling all formatting',
      'Avoiding any revision',
    ],
    answer: 1,
  },
  {
    question: 'What does "temperature" often control in LLM APIs?',
    options: ['Network latency', 'Randomness of outputs', 'Battery usage', 'File size'],
    answer: 1,
  },
  {
    question: 'RAG (Retrieval-Augmented Generation) is used to:',
    options: [
      'Train models from scratch on every request',
      'Ground answers with retrieved documents',
      'Remove the need for prompts',
      'Encrypt user passwords',
    ],
    answer: 1,
  },
  {
    question: 'A safe workflow when using AI at work includes:',
    options: [
      'Pasting confidential data into any public tool',
      'Reviewing outputs and following company policy',
      'Skipping human review for legal documents',
      'Sharing API keys in chat',
    ],
    answer: 1,
  },
];

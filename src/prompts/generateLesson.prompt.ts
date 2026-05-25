export function buildGenerateLessonPrompt(params: {
  category: string;
  topic: string;
  skillLevel: string;
  videoUrl?: string;
}): string {
  return `You are building content for the AI Career Skills Academy LMS (SkillSprint).

Create a beginner-friendly lesson.

Category: ${params.category}
Topic: ${params.topic}
Skill Level: ${params.skillLevel}
${params.videoUrl ? `Reference video URL: ${params.videoUrl}` : ''}

Return VALID JSON ONLY with this exact shape:
{
  "title": "string",
  "summary": "string (2-3 sentences)",
  "content": "string (markdown-friendly lesson body, 3-6 short paragraphs)",
  "keyTerms": ["string"],
  "videoSearchQuery": "string — a short YouTube search query (5-8 words) that would find a good tutorial for this lesson",
  "durationMinutes": number,
  "quiz": [
    {
      "question": "string",
      "explanation": "string",
      "options": [
        { "text": "string", "isCorrect": boolean }
      ]
    }
  ],
  "flashcards": [
    { "front": "string", "back": "string" }
  ]
}

Rules:
- Exactly 4 quiz questions, each with exactly 4 options, exactly one isCorrect true
- Exactly 4 flashcards
- videoSearchQuery must be a concise YouTube search string (e.g. "prompt engineering beginner tutorial 2024")
- No markdown code fences
- No text outside JSON`;
}

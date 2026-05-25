export function buildGenerateCoursePrompt(params: {
  category: string;
  topic: string;
  skillLevel: string;
  lessonCount: number;
}): string {
  return `You are building an LMS course for AI Career Skills Academy (SkillSprint).

Category: ${params.category}
Course topic: ${params.topic}
Skill level: ${params.skillLevel}
Number of lessons: ${params.lessonCount}

Return VALID JSON ONLY:
{
  "title": "string",
  "description": "string",
  "difficulty": "beginner|intermediate|advanced",
  "lessons": [
    {
      "title": "string",
      "summary": "string",
      "content": "string",
      "keyTerms": ["string"],
      "durationMinutes": number,
      "videoSearchQuery": "string — concise YouTube search query (5-8 words) for a tutorial on this lesson",
      "quiz": [
        {
          "question": "string",
          "explanation": "string",
          "options": [{ "text": "string", "isCorrect": boolean }]
        }
      ],
      "flashcards": [{ "front": "string", "back": "string" }]
    }
  ]
}

Each lesson: 3 quiz questions (4 options each), 3 flashcards.
Each lesson MUST include a videoSearchQuery (concise YouTube search phrase like "intro to prompt engineering tutorial").
No markdown fences. No text outside JSON.`;
}

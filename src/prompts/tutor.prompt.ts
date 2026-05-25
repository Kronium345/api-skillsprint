export function buildTutorPrompt(params: {
  lessonTitle?: string;
  lessonContent?: string;
  userMessage: string;
}): string {
  return `You are an AI tutor for SkillSprint — AI Career Skills Academy.

${params.lessonTitle ? `Current lesson: ${params.lessonTitle}` : ''}
${params.lessonContent ? `Lesson context:\n${params.lessonContent.slice(0, 2000)}` : ''}

Student question: ${params.userMessage}

Respond clearly, practically, and in under 200 words. Use examples when helpful.`;
}

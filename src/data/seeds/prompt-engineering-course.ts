import type { GeneratedLessonPayload } from '../../types/content';

/** Curated MVP content — YouTube refs + written summaries (no API cost to seed) */
export const promptEngineeringCourse = {
  trackSlug: 'generative-ai' as const,
  course: {
    title: 'Prompt Engineering Fundamentals',
    description:
      'Learn how to write effective prompts, structure AI workflows, and get reliable outputs from ChatGPT and similar tools.',
    difficulty: 'beginner' as const,
    durationMinutes: 45,
    sortOrder: 1,
  },
  lessons: [
    {
      order: 0,
      moduleKey: 'basics',
      payload: {
        title: 'Introduction to Prompting',
        summary:
          'A prompt is an instruction you give an AI model. Clear prompts produce clearer, more useful answers.',
        content: `## What is a prompt?

A **prompt** is the text you send to an AI model — it can be a question, instruction, or full brief.

## Why prompting matters

Models do not read your mind. They predict the most likely helpful response based on:
- your wording
- context you provide
- examples you include

## The CLEAR framework

- **Context** — Who is the audience? What is the situation?
- **Length** — Short answer vs detailed guide
- **Examples** — Show the format you want
- **Audience** — Beginner vs expert tone
- **Role** — "Act as a career coach…"

## Practice

Before your next ChatGPT session, write one sentence of context, then your actual question.`,
        videoUrl: 'https://www.youtube.com/watch?v=jC4v5AS4RIM',
        durationMinutes: 12,
        keyTerms: ['prompt', 'LLM', 'context', 'instruction'],
        quiz: [
          {
            question: 'What is a prompt?',
            explanation: 'A prompt is the input instruction you provide to the model.',
            options: [
              { text: 'A hardware chip for AI', isCorrect: false },
              { text: 'An instruction or question given to an AI model', isCorrect: true },
              { text: 'A type of database', isCorrect: false },
              { text: 'A video codec', isCorrect: false },
            ],
          },
          {
            question: 'Which element helps the model understand tone and depth?',
            explanation: 'Context frames the situation and audience.',
            options: [
              { text: 'Context', isCorrect: true },
              { text: 'Random caps lock', isCorrect: false },
              { text: 'Deleting all punctuation', isCorrect: false },
              { text: 'Using only emojis', isCorrect: false },
            ],
          },
          {
            question: 'In the CLEAR framework, what does the R stand for?',
            explanation: 'Role — e.g. act as a tutor, analyst, or editor.',
            options: [
              { text: 'Randomize', isCorrect: false },
              { text: 'Role', isCorrect: true },
              { text: 'Rewrite', isCorrect: false },
              { text: 'Rate limit', isCorrect: false },
            ],
          },
        ],
        flashcards: [
          { front: 'Prompt', back: 'Input text/instructions sent to an AI model' },
          { front: 'Context', back: 'Background info that shapes the answer' },
          { front: 'Role prompting', back: 'Tell the AI who to act as (tutor, editor, etc.)' },
        ],
      } satisfies GeneratedLessonPayload,
    },
    {
      order: 1,
      moduleKey: 'prompt-engineering',
      payload: {
        title: 'Structuring Prompts for Reliable Outputs',
        summary:
          'Use roles, constraints, and output formats to reduce vague or wrong answers.',
        content: `## Structure beats length

Long prompts are not always better. **Structured** prompts are.

## Template

\`\`\`
Role: You are a [role].
Task: [One clear task].
Constraints: [Length, tone, must-include].
Output format: [Bullets, JSON, table].
\`\`\`

## Few-shot examples

Show 1–2 examples of the output you want. Models mimic patterns.

## Iteration

1. Draft prompt
2. Review output
3. Add one constraint or example
4. Repeat

Great prompt engineers treat prompts like **code** — version and test them.`,
        videoUrl: 'https://www.youtube.com/watch?v=_ZvnD73m40o',
        durationMinutes: 18,
        keyTerms: ['few-shot', 'constraints', 'output format', 'iteration'],
        quiz: [
          {
            question: 'What improves reliability more than making prompts longer?',
            explanation: 'Structure: role, task, constraints, format.',
            options: [
              { text: 'Structured instructions with constraints', isCorrect: true },
              { text: 'Removing all punctuation', isCorrect: false },
              { text: 'Asking the same question twice', isCorrect: false },
              { text: 'Using only slang', isCorrect: false },
            ],
          },
          {
            question: 'What is few-shot prompting?',
            explanation: 'Providing examples of desired outputs in the prompt.',
            options: [
              { text: 'Giving the model example inputs/outputs', isCorrect: true },
              { text: 'Using the model only once per day', isCorrect: false },
              { text: 'Shooting a video tutorial', isCorrect: false },
              { text: 'Disabling the API', isCorrect: false },
            ],
          },
        ],
        flashcards: [
          { front: 'Few-shot', back: 'Include examples of desired output in the prompt' },
          { front: 'Constraints', back: 'Rules: length, tone, must-include, must-avoid' },
        ],
      } satisfies GeneratedLessonPayload,
    },
    {
      order: 2,
      moduleKey: 'workflows',
      payload: {
        title: 'AI Workflows for Productivity',
        summary:
          'Chain prompts for research → draft → review. Build repeatable workflows for work and learning.',
        content: `## Single prompt vs workflow

**Workflow** = multiple steps with human review between them.

Example career workflow:
1. **Research** — Summarize a job description
2. **Draft** — Tailor CV bullet points
3. **Review** — Critique tone and gaps
4. **Finalize** — Export polished version

## Tools

Combine ChatGPT/Claude with:
- Notion for notes
- Google Docs for edits
- Your LMS quizzes for retention

## Safety

Never paste passwords, API keys, or confidential client data into public tools.`,
        videoUrl: 'https://www.youtube.com/watch?v=wbKTx5J9L18',
        durationMinutes: 15,
        keyTerms: ['workflow', 'chain', 'review', 'productivity'],
        quiz: [
          {
            question: 'What defines an AI workflow vs a single prompt?',
            explanation: 'Multiple chained steps with review between stages.',
            options: [
              { text: 'Multiple steps with human review between them', isCorrect: true },
              { text: 'Using only one word prompts', isCorrect: false },
              { text: 'Turning off the internet', isCorrect: false },
              { text: 'Printing the response', isCorrect: false },
            ],
          },
        ],
        flashcards: [
          { front: 'AI workflow', back: 'Chained steps: research → draft → review → finalize' },
        ],
      } satisfies GeneratedLessonPayload,
    },
  ],
};

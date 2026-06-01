import type { GeneratedLessonPayload } from '../../types/content';

export type SeedCourseDefinition = {
  trackSlug: string;
  course: {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    durationMinutes: number;
    sortOrder: number;
  };
  lessons: Array<{
    order: number;
    moduleKey: string;
    payload: GeneratedLessonPayload;
  }>;
};

function lesson(
  title: string,
  summary: string,
  content: string,
  moduleKey: string,
  keyTerms: string[],
  quiz: GeneratedLessonPayload['quiz'],
  flashcards: GeneratedLessonPayload['flashcards'],
  durationMinutes = 12,
): GeneratedLessonPayload {
  return {
    title,
    summary,
    content,
    keyTerms,
    durationMinutes,
    quiz,
    flashcards,
  };
}

const q = (
  question: string,
  correct: string,
  wrong: [string, string, string],
  explanation?: string,
) => ({
  question,
  explanation,
  options: [
    { text: wrong[0], isCorrect: false },
    { text: correct, isCorrect: true },
    { text: wrong[1], isCorrect: false },
    { text: wrong[2], isCorrect: false },
  ],
});

/** Starter courses for tracks without curated content yet */
export const STARTER_COURSES: SeedCourseDefinition[] = [
  {
    trackSlug: 'data-analytics',
    course: {
      title: 'Excel Fundamentals for Data Analysis',
      description:
        'Learn spreadsheets, formulas, and charts to summarize data for business decisions.',
      difficulty: 'beginner',
      durationMinutes: 24,
      sortOrder: 1,
    },
    lessons: [
      {
        order: 0,
        moduleKey: 'excel',
        payload: lesson(
          'Spreadsheets and Basic Formulas',
          'Use rows, columns, and formulas like SUM and AVERAGE to analyze small datasets.',
          `## Why Excel matters

Spreadsheets are the most common tool for **data analytics** in business.

## Core concepts

- **Cell** — intersection of row and column (e.g. B3)
- **Range** — group of cells (e.g. A1:D10)
- **Formula** — starts with \`=\`, e.g. \`=SUM(B2:B20)\`

## Essential functions

| Function | Purpose |
|----------|---------|
| SUM | Add numbers |
| AVERAGE | Mean of a range |
| COUNT | Count numeric cells |

## Practice

Import a CSV of sales data and compute total revenue with SUM.`,
          'excel',
          ['cell', 'range', 'formula', 'SUM'],
          [
            q(
              'What does a formula in Excel start with?',
              '=',
              ['#', '@', '%'],
              'Formulas begin with an equals sign.',
            ),
            q(
              'Which function calculates the mean of a range?',
              'AVERAGE',
              ['SUM', 'MAX', 'CONCAT'],
            ),
          ],
          [
            { front: 'Cell', back: 'Single data point at row/column intersection' },
            { front: 'SUM', back: 'Adds all numbers in a range' },
          ],
        ),
      },
      {
        order: 1,
        moduleKey: 'sql',
        payload: lesson(
          'Introduction to SQL Queries',
          'Read data from tables using SELECT, WHERE, and ORDER BY.',
          `## What is SQL?

**SQL** (Structured Query Language) queries databases — the next step after Excel for larger data.

## Basic query

\`\`\`sql
SELECT name, revenue
FROM sales
WHERE region = 'EU'
ORDER BY revenue DESC;
\`\`\`

## Clauses

- **SELECT** — columns to return
- **FROM** — table name
- **WHERE** — filter rows
- **ORDER BY** — sort results

## Career tip

Analyst roles often require Excel + SQL together.`,
          'sql',
          ['SELECT', 'WHERE', 'table', 'query'],
          [
            q(
              'Which SQL clause filters rows?',
              'WHERE',
              ['SELECT', 'ORDER BY', 'FROM'],
            ),
            q(
              'What does SELECT specify?',
              'Which columns to return',
              ['Which server to use', 'How to delete data', 'The database password'],
            ),
          ],
          [
            { front: 'SELECT', back: 'Chooses columns to return from a table' },
            { front: 'WHERE', back: 'Filters rows by a condition' },
          ],
        ),
      },
    ],
  },
  {
    trackSlug: 'cybersecurity',
    course: {
      title: 'Cybersecurity Essentials',
      description:
        'Recognize phishing, use strong passwords, and protect your privacy online.',
      difficulty: 'beginner',
      durationMinutes: 24,
      sortOrder: 1,
    },
    lessons: [
      {
        order: 0,
        moduleKey: 'fundamentals',
        payload: lesson(
          'Phishing and Social Engineering',
          'Spot fake emails and messages designed to steal credentials.',
          `## Phishing

**Phishing** tricks you into clicking malicious links or sharing passwords.

## Red flags

- Urgent language ("Your account will be closed!")
- Misspelled sender domains (paypa1.com)
- Unexpected attachments
- Requests for passwords or 2FA codes

## What to do

1. Verify sender via official website (type URL yourself)
2. Never click suspicious links
3. Report to IT or email provider`,
          'fundamentals',
          ['phishing', 'social engineering', 'credentials'],
          [
            q(
              'What is phishing?',
              'Tricking users into revealing sensitive information',
              ['Encrypting your hard drive', 'Updating antivirus', 'Using a VPN'],
            ),
            q(
              'A common phishing sign is…',
              'Urgent pressure to act immediately',
              ['Slow internet speed', 'A long email signature', 'A company logo'],
            ),
          ],
          [
            { front: 'Phishing', back: 'Fraudulent messages that steal credentials' },
            { front: 'Social engineering', back: 'Manipulating people instead of systems' },
          ],
        ),
      },
      {
        order: 1,
        moduleKey: 'networks',
        payload: lesson(
          'Passwords and Multi-Factor Authentication',
          'Use password managers and MFA to protect accounts.',
          `## Strong passwords

- 16+ characters or use a **password manager**
- Unique password per site
- Never reuse work passwords on personal sites

## MFA (2FA)

**Multi-factor authentication** adds a second check: app code, SMS, or hardware key.

Prefer **authenticator apps** over SMS when possible.

## Hygiene checklist

- Enable MFA on email and banking
- Update OS and apps
- Lock devices when away`,
          'networks',
          ['MFA', 'password manager', '2FA'],
          [
            q(
              'Why use a password manager?',
              'Store unique strong passwords securely',
              ['Share passwords with teammates', 'Avoid MFA', 'Disable encryption'],
            ),
            q(
              'What does MFA add?',
              'A second verification step beyond the password',
              ['Faster login only', 'Unlimited storage', 'Public Wi-Fi'],
            ),
          ],
          [
            { front: 'MFA', back: 'Second factor: app code, SMS, or security key' },
            { front: 'Password manager', back: 'Generates and stores unique passwords' },
          ],
        ),
      },
    ],
  },
  {
    trackSlug: 'software-development',
    course: {
      title: 'Web Development Basics',
      description: 'Build your first web page with HTML structure and CSS styling.',
      difficulty: 'beginner',
      durationMinutes: 24,
      sortOrder: 1,
    },
    lessons: [
      {
        order: 0,
        moduleKey: 'web-basics',
        payload: lesson(
          'HTML Structure and Semantics',
          'Use headings, paragraphs, and links to create accessible pages.',
          `## HTML basics

**HTML** describes the structure of a web page.

\`\`\`html
<!DOCTYPE html>
<html>
  <head><title>My Page</title></head>
  <body>
    <h1>Hello SkillSprint</h1>
    <p>Learning to code starts here.</p>
    <a href="https://example.com">Learn more</a>
  </body>
</html>
\`\`\`

## Semantic tags

- \`<header>\`, \`<main>\`, \`<footer>\` — page regions
- \`<article>\`, \`<section>\` — content blocks

Semantic HTML helps **accessibility** and SEO.`,
          'web-basics',
          ['HTML', 'semantic', 'tag', 'accessibility'],
          [
            q(
              'What does HTML primarily define?',
              'Page structure and content',
              ['Database queries', 'Server routing', 'GPU shaders'],
            ),
            q(
              'Which tag is best for the main page heading?',
              '<h1>',
              ['<div>', '<span>', '<br>'],
            ),
          ],
          [
            { front: 'HTML', back: 'Markup language for web page structure' },
            { front: 'Semantic tags', back: 'Tags that describe meaning (header, nav, main)' },
          ],
        ),
      },
      {
        order: 1,
        moduleKey: 'javascript',
        payload: lesson(
          'JavaScript Variables and Functions',
          'Add interactivity with variables, functions, and the console.',
          `## JavaScript on the web

**JavaScript** runs in the browser and powers interactivity.

\`\`\`javascript
const user = 'Alex';
function greet(name) {
  return 'Hello, ' + name;
}
console.log(greet(user));
\`\`\`

## Core ideas

- \`const\` / \`let\` for variables
- **Functions** reuse logic
- **console.log** for debugging

## Next steps

Learn DOM manipulation to update the page from code.`,
          'javascript',
          ['variable', 'function', 'console', 'const'],
          [
            q(
              'Which keyword declares a variable that cannot be reassigned?',
              'const',
              ['var-only', 'static', 'freeze'],
            ),
            q(
              'What is a function?',
              'A reusable block of code',
              ['A CSS color', 'An HTML tag', 'A database table'],
            ),
          ],
          [
            { front: 'Function', back: 'Reusable block of code with inputs and output' },
            { front: 'const', back: 'Declares a constant binding' },
          ],
        ),
      },
    ],
  },
  {
    trackSlug: 'digital-marketing',
    course: {
      title: 'SEO and Content Marketing Fundamentals',
      description: 'Help people find your content through search engines and valuable articles.',
      difficulty: 'beginner',
      durationMinutes: 24,
      sortOrder: 1,
    },
    lessons: [
      {
        order: 0,
        moduleKey: 'seo',
        payload: lesson(
          'How Search Engines Rank Pages',
          'Understand keywords, titles, and meta descriptions for organic traffic.',
          `## SEO overview

**SEO** (Search Engine Optimization) improves visibility in Google and other search engines.

## On-page basics

- **Title tag** — clear, includes main keyword
- **Meta description** — compelling summary (155 chars)
- **Headings** — one H1, logical H2/H3 structure
- **Internal links** — connect related pages

## Intent

Match content to **search intent**: informational, commercial, or transactional.`,
          'seo',
          ['SEO', 'keyword', 'meta description', 'ranking'],
          [
            q(
              'What does SEO stand for?',
              'Search Engine Optimization',
              ['Social Email Outreach', 'Secure Encryption Option', 'Sales Event Operations'],
            ),
            q(
              'The title tag should…',
              'Include the main topic/keyword clearly',
              ['Be empty', 'Hide all keywords', 'Repeat the same word 50 times'],
            ),
          ],
          [
            { front: 'SEO', back: 'Optimizing pages to rank in search results' },
            { front: 'Search intent', back: 'What the user wants when they search' },
          ],
        ),
      },
      {
        order: 1,
        moduleKey: 'content',
        payload: lesson(
          'Writing Content That Converts',
          'Create blog posts and landing copy with clear value propositions.',
          `## Content marketing

**Content marketing** attracts and educates an audience before selling.

## Structure

1. **Hook** — problem or question
2. **Value** — actionable tips
3. **CTA** — next step (newsletter, demo, download)

## AI assist

Use AI to brainstorm outlines — but **edit for accuracy** and brand voice.

## Metrics

Track views, time on page, and conversion rate.`,
          'content',
          ['CTA', 'content marketing', 'conversion', 'audience'],
          [
            q(
              'What is a CTA?',
              'Call to action — tells the reader what to do next',
              ['Click tracking algorithm', 'Copyright transfer agreement', 'Content table archive'],
            ),
            q(
              'Content marketing focuses on…',
              'Providing value before asking for a sale',
              ['Spamming links', 'Hiding prices', 'Ignoring the audience'],
            ),
          ],
          [
            { front: 'CTA', back: 'Call to action: sign up, buy, download, etc.' },
            { front: 'Content marketing', back: 'Attract audience with useful content' },
          ],
        ),
      },
    ],
  },
  {
    trackSlug: 'career-development',
    course: {
      title: 'CV and Interview Essentials',
      description: 'Tailor your CV, optimize LinkedIn, and prepare for common interview questions.',
      difficulty: 'beginner',
      durationMinutes: 24,
      sortOrder: 1,
    },
    lessons: [
      {
        order: 0,
        moduleKey: 'cv-linkedin',
        payload: lesson(
          'Writing a Results-Driven CV',
          'Use action verbs and metrics to show impact in each role.',
          `## CV structure

1. **Header** — name, role, contact, LinkedIn
2. **Summary** — 2–3 lines tailored to target role
3. **Experience** — bullet points with **metrics**
4. **Skills** — tools and soft skills
5. **Education** — concise

## STAR for bullets

**Situation → Task → Action → Result**

Example: "Reduced report time by 40% by automating Excel dashboards."

## ATS tips

Use keywords from the job description naturally.`,
          'cv-linkedin',
          ['CV', 'STAR', 'metrics', 'ATS'],
          [
            q(
              'What does STAR help with?',
              'Structuring impact-focused bullet points',
              ['Designing logos', 'Writing SQL queries', 'Configuring servers'],
            ),
            q(
              'CV bullets should emphasize…',
              'Measurable results and actions',
              ['Hobbies only', 'Long paragraphs', 'Generic clichés without proof'],
            ),
          ],
          [
            { front: 'STAR', back: 'Situation, Task, Action, Result framework' },
            { front: 'ATS', back: 'Applicant Tracking System — scans CVs for keywords' },
          ],
        ),
      },
      {
        order: 1,
        moduleKey: 'interviews',
        payload: lesson(
          'Behavioral Interview Preparation',
          'Answer "Tell me about a time…" questions with confidence.',
          `## Behavioral interviews

Employers assess **past behavior** as a predictor of future performance.

## Common questions

- Tell me about a challenge you overcame
- Describe a time you worked in a team
- Give an example of learning something quickly

## Framework

Use STAR again — keep answers **60–90 seconds**.

## Preparation

Prepare 5 stories covering leadership, conflict, failure, success, and learning.`,
          'interviews',
          ['behavioral', 'STAR', 'interview', 'story'],
          [
            q(
              'Behavioral questions focus on…',
              'Past examples of how you handled situations',
              ['Hypothetical physics', 'Favorite movies', 'Typing speed only'],
            ),
            q(
              'Ideal answer length for one question?',
              'About 60–90 seconds',
              ['30 minutes', 'One word', 'No structure needed'],
            ),
          ],
          [
            { front: 'Behavioral interview', back: 'Questions about past actions and outcomes' },
            { front: '60–90 second rule', back: 'Keep STAR answers concise and focused' },
          ],
        ),
      },
    ],
  },
  {
    trackSlug: 'productivity',
    course: {
      title: 'Productivity Systems with Notion and AI',
      description: 'Organize tasks, notes, and workflows using modern tools and AI assistants.',
      difficulty: 'beginner',
      durationMinutes: 24,
      sortOrder: 1,
    },
    lessons: [
      {
        order: 0,
        moduleKey: 'tools',
        payload: lesson(
          'Building a Notion Workspace',
          'Create databases for tasks, projects, and weekly reviews.',
          `## Notion basics

**Notion** combines notes, databases, and wikis in one workspace.

## Starter setup

- **Tasks DB** — status, due date, priority
- **Projects** — linked to tasks
- **Weekly review** — template page

## Views

- Table — spreadsheet style
- Board — Kanban by status
- Calendar — due dates

## Habit

End each week with a 15-minute review: done, blocked, next week.`,
          'tools',
          ['Notion', 'database', 'Kanban', 'review'],
          [
            q(
              'What is a Notion database?',
              'Structured collection of pages with properties',
              ['A video editor', 'A password vault', 'An email server'],
            ),
            q(
              'Kanban view is best for…',
              'Visualizing work by status columns',
              ['Editing photos', 'Running SQL', 'Compiling code'],
            ),
          ],
          [
            { front: 'Notion database', back: 'Collection of items with custom properties' },
            { front: 'Weekly review', back: 'Reflect on progress and plan next week' },
          ],
        ),
      },
      {
        order: 1,
        moduleKey: 'ai-productivity',
        payload: lesson(
          'AI Assistants for Daily Workflows',
          'Draft emails, summarize meetings, and plan tasks with AI — safely.',
          `## AI productivity

Use AI for **drafting**, not final decisions without review.

## Safe workflows

1. **Meeting notes** — paste transcript → summary + action items
2. **Email draft** — outline → AI draft → you edit tone
3. **Learning** — explain concepts, generate quiz questions

## Rules

- No confidential data in public tools
- Verify facts and numbers
- Keep human approval on external messages`,
          'ai-productivity',
          ['workflow', 'draft', 'review', 'confidential'],
          [
            q(
              'Best practice with AI-generated emails?',
              'Edit and approve before sending',
              ['Send without reading', 'Share passwords for context', 'Disable spell check'],
            ),
            q(
              'You should NOT paste into public AI tools…',
              'Passwords and confidential client data',
              ['Public blog ideas', 'Generic learning questions', 'Marketing taglines'],
            ),
          ],
          [
            { front: 'Human in the loop', back: 'Always review AI output before acting' },
            { front: 'Action items', back: 'Concrete next steps from meetings or notes' },
          ],
        ),
      },
    ],
  },
];

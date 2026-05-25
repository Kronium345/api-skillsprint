export type TrackSlug =
  | 'generative-ai'
  | 'data-analytics'
  | 'cybersecurity'
  | 'software-development'
  | 'digital-marketing'
  | 'career-development'
  | 'productivity';

export type TrackDefinition = {
  slug: TrackSlug;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  moduleOrder: string[];
  sortOrder: number;
};

/** Keep in sync with mobile `src/constants/tracks.ts` */
export const TRACKS: TrackDefinition[] = [
  {
    slug: 'generative-ai',
    title: 'Generative AI & Prompt Engineering',
    subtitle: 'ChatGPT, prompts, agents, and AI workflows',
    icon: 'sparkles',
    color: '#8B5CF6',
    moduleOrder: ['basics', 'prompt-engineering', 'workflows', 'agents-apis'],
    sortOrder: 1,
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics',
    subtitle: 'Excel, SQL, dashboards, and Python for data',
    icon: 'bar-chart',
    color: '#4F8CFF',
    moduleOrder: ['excel', 'sql', 'visualization', 'python-analytics'],
    sortOrder: 2,
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    subtitle: 'Privacy, phishing, and security hygiene',
    icon: 'shield',
    color: '#EF4444',
    moduleOrder: ['fundamentals', 'networks', 'threats', 'ethical-basics'],
    sortOrder: 3,
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    subtitle: 'HTML, JS, React, APIs, and Git',
    icon: 'code-slash',
    color: '#22D3EE',
    moduleOrder: ['web-basics', 'javascript', 'react', 'apis-git'],
    sortOrder: 4,
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    subtitle: 'SEO, content, social, and AI for marketing',
    icon: 'megaphone',
    color: '#F97316',
    moduleOrder: ['seo', 'content', 'social', 'analytics'],
    sortOrder: 5,
  },
  {
    slug: 'career-development',
    title: 'Career Development',
    subtitle: 'CV, LinkedIn, interviews, and portfolios',
    icon: 'briefcase',
    color: '#10B981',
    moduleOrder: ['cv-linkedin', 'interviews', 'networking', 'branding'],
    sortOrder: 6,
  },
  {
    slug: 'productivity',
    title: 'Productivity & Business',
    subtitle: 'Notion, AI systems, agile, and leadership',
    icon: 'rocket',
    color: '#A78BFA',
    moduleOrder: ['tools', 'ai-productivity', 'communication', 'agile'],
    sortOrder: 7,
  },
];

export function getTrackBySlug(slug: string): TrackDefinition | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

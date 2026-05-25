export type AllowedChannel = {
  channelId: string;
  name: string;
};

export const GLOBAL_CHANNELS: AllowedChannel[] = [
  { channelId: 'UC8butISFwT-Wl7EV0hUK0BQ', name: 'freeCodeCamp.org' },
  { channelId: 'UCWv7vMbMWH4-V0ZXdmDpPBA', name: 'Programming with Mosh' },
];

export const TRACK_CHANNELS: Record<string, AllowedChannel[]> = {
  'generative-ai': [
    { channelId: 'UCZgt6AzoyjslHTC9dz0UoTw', name: 'OpenAI' },
    { channelId: 'UCcIXc5mJsHVYTZR1maL5l9w', name: 'DeepLearning.AI' },
    { channelId: 'UC3bGMfRIqR7pGFe6sYKVQeg', name: 'Matt Wolfe' },
    { channelId: 'UCx8DULidFj2kFIhGP7VBEhA', name: 'AI Explained' },
    ...GLOBAL_CHANNELS,
  ],
  'data-analytics': [
    { channelId: 'UC7cs8q-gJRlGwj4A8OmCmXg', name: 'Alex The Analyst' },
    { channelId: 'UCnUYZLuoy1rq1aVMwx4piYg', name: 'Kevin Stratvert' },
    ...GLOBAL_CHANNELS,
  ],
  cybersecurity: [
    { channelId: 'UCVeW9qkBjo3zosnqUbG7CFw', name: 'John Hammond' },
    { channelId: 'UC0ArlFuFYMpEewyRBzdLHiw', name: 'The Cyber Mentor' },
    ...GLOBAL_CHANNELS,
  ],
  'software-development': [
    { channelId: 'UC29ju8bIPH5as8OGnQzwJyA', name: 'Traversy Media' },
    { channelId: 'UCW5YeuERMmlnqo4oq8vwUpg', name: 'The Net Ninja' },
    { channelId: 'UCmXmlB4-HJmPTSestM9wBMw', name: 'JavaScript Mastery' },
    { channelId: 'UCqsTMq64LyMnRExlCxqVbYg', name: 'notJust.dev' },
    ...GLOBAL_CHANNELS,
  ],
  'digital-marketing': [
    { channelId: 'UCBIt1VN5j37PVM8LLSuQJfg', name: 'Neil Patel' },
    { channelId: 'UCXL96j4NoJVVV-tun6bPwxQ', name: 'HubSpot' },
    ...GLOBAL_CHANNELS,
  ],
  'career-development': [
    { channelId: 'UC1KbedtKa3MsetSMQtGBIlg', name: 'Ali Abdaal' },
    ...GLOBAL_CHANNELS,
  ],
  productivity: [
    { channelId: 'UC1KbedtKa3MsetSMQtGBIlg', name: 'Ali Abdaal' },
    { channelId: 'UCnUYZLuoy1rq1aVMwx4piYg', name: 'Kevin Stratvert' },
    ...GLOBAL_CHANNELS,
  ],
};

/** Return channel IDs for a track, falling back to global if track has no config */
export function getChannelIdsForTrack(trackSlug: string): string[] {
  const trackList = TRACK_CHANNELS[trackSlug];
  const channels = trackList ?? GLOBAL_CHANNELS;
  return [...new Set(channels.map((c) => c.channelId))];
}

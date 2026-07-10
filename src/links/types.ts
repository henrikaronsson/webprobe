export type LinkCategory =
  | 'browser-apis'
  | 'typescript'
  | 'performance'
  | 'accessibility'
  | 'testing'
  | 'css'
  | 'security'
  | 'developer-tools';

export interface CuratedLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
  tags: string[];
  official: boolean;
  featured?: boolean;
}

export const LINK_CATEGORIES: { id: LinkCategory; label: string }[] = [
  { id: 'browser-apis', label: 'Browser APIs' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'performance', label: 'Performance' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'testing', label: 'Testing' },
  { id: 'css', label: 'CSS' },
  { id: 'security', label: 'Security' },
  { id: 'developer-tools', label: 'Developer Tools' },
];

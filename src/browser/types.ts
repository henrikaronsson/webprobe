import type { Confidence } from '../shared/types.ts';

export interface BrowserInfoField<T = string> {
  label: string;
  value: T | null;
  confidence: Confidence;
  source: string;
  notes?: string;
}

export interface BrowserInfoReport {
  generatedAt: string;
  fields: BrowserInfoField[];
}

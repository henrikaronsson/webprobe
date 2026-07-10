export type CapabilityCategory = 'graphics' | 'compute' | 'storage' | 'network' | 'media' | 'other';

import type { CapabilityResult } from '../shared/types.ts';

export interface CapabilityDefinition {
  id: string;
  title: string;
  description: string;
  category: CapabilityCategory;
  docsUrl: string;
  notes: string[];
  labId?: string;
  detect: () => CapabilityResult | Promise<CapabilityResult>;
}

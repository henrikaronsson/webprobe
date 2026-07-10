export type CapabilityStatus = 'supported' | 'unsupported' | 'unknown';
export type Confidence = 'detected' | 'inferred' | 'approximated' | 'unavailable';

export interface CapabilityResult {
  status: CapabilityStatus;
  confidence: Confidence;
  summary: string;
  notes?: string[];
}

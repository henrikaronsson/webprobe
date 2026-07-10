export interface LabContext {
  signal: AbortSignal;
  report: (message: string) => void;
}

export interface LabModule {
  mount(container: HTMLElement, context: LabContext): () => void;
}

export interface LabManifest {
  id: string;
  title: string;
  description: string;
  category: 'compute' | 'storage' | 'graphics' | 'network' | 'media' | 'other';
  requiredCapabilities: string[];
  route: string;
  docs: { title: string; url: string }[];
  load: () => Promise<{ default: LabModule }>;
}

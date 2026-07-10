import type { CapabilityStatus } from '../shared/types.ts';
import { el } from '../shared/dom.ts';

const LABELS: Record<CapabilityStatus, string> = {
  supported: 'Supported',
  unsupported: 'Unsupported',
  unknown: 'Unknown',
};

export function renderStatusBadge(status: CapabilityStatus): HTMLElement {
  return el(
    'span',
    {
      className: `status-badge status-badge--${status}`,
      role: 'status',
    },
    LABELS[status],
  );
}

import { describe, it, expect } from 'vitest';
import { catalog } from '../../src/links/catalog.ts';
import { LINK_CATEGORIES } from '../../src/links/types.ts';

describe('links catalog', () => {
  it('has unique ids and urls', () => {
    const ids = catalog.map((l) => l.id);
    const urls = catalog.map((l) => l.url);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('has valid descriptions', () => {
    for (const link of catalog) {
      expect(link.description.length).toBeGreaterThanOrEqual(20);
      expect(link.url.startsWith('https://')).toBe(true);
    }
  });

  it('uses known categories', () => {
    const known = new Set(LINK_CATEGORIES.map((c) => c.id));
    for (const link of catalog) {
      expect(known.has(link.category)).toBe(true);
    }
  });

  it('stays reasonably small', () => {
    expect(catalog.length).toBeLessThanOrEqual(60);
  });
});

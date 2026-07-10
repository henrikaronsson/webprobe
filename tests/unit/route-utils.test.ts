import { describe, it, expect } from 'vitest';
import { buildHashPath } from '../../src/app/route-utils.ts';

describe('route query helpers', () => {
  it('builds hash path with query string', () => {
    const params = new URLSearchParams({ q: 'mdn', category: 'docs' });
    expect(buildHashPath('/links', params)).toBe('/links?q=mdn&category=docs');
  });

  it('builds hash path without query when empty', () => {
    expect(buildHashPath('/links', new URLSearchParams())).toBe('/links');
  });
});

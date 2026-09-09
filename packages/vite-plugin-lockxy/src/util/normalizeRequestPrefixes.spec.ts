import { describe, expect, it } from 'vitest';

import { normalizeRequestPrefixes } from './normalizeRequestPrefixes.js';

describe('normalizeRequestPrefixes', () => {
    it('wraps a single request prefix in an array', () => {
        expect(normalizeRequestPrefixes('/api/')).toEqual(['/api/']);
    });

    it('copies multiple request prefixes without changing their order', () => {
        const requestPrefixes = ['/api/', '/development-api/'] as const;
        const normalized = normalizeRequestPrefixes(requestPrefixes);

        expect(normalized).toEqual(requestPrefixes);
        expect(normalized).not.toBe(requestPrefixes);
    });

    it('keeps an empty prefix collection empty', () => {
        expect(normalizeRequestPrefixes([])).toEqual([]);
    });
});

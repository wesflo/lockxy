import { describe, expect, it } from 'vitest';

import { validateMethods } from './validateMethods.js';

describe('validateMethods', () => {
    it('accepts omitted, singular, and distinct methods', () => {
        expect(validateMethods(undefined, 'endpoint.method')).toEqual([]);
        expect(validateMethods('GET', 'endpoint.method')).toEqual([]);
        expect(validateMethods(['GET', 'POST'], 'endpoint.method')).toEqual([]);
    });

    it('rejects an empty method array', () => {
        expect(validateMethods([], 'endpoint.method')).toEqual(['endpoint.method: must contain at least one method']);
    });

    it('reports empty and case-insensitive duplicate methods at their exact positions', () => {
        expect(validateMethods(['POST', '', 'post'], 'endpoint.method')).toEqual([
            'endpoint.method[1]: must be a non-empty string',
            'endpoint.method[2]: duplicate method "post"',
        ]);
    });
});

import { describe, expect, it } from 'vitest';

import { decodePart } from './decodePart.js';

describe('decodePart', () => {
    it('decodes a URI component', () => {
        expect(decodePart('hello%20world')).toBe('hello world');
    });

    it('returns null for malformed URI encoding', () => {
        expect(decodePart('%E0%A4%A')).toBeNull();
    });
});

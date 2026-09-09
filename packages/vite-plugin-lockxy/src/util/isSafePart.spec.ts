import { describe, expect, it } from 'vitest';

import { isSafePart } from './isSafePart.js';

describe('isSafePart', () => {
    it('accepts a regular route part', () => {
        expect(isSafePart('orders')).toBe(true);
    });

    it.each(['.', '..', 'orders\\private'])('rejects unsafe route part %s', (part) => {
        expect(isSafePart(part)).toBe(false);
    });
});

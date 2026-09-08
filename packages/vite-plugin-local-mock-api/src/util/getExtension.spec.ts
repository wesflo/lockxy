import { describe, expect, it } from 'vitest';

import { getExtension } from './getExtension.js';

describe('getExtension', () => {
    it('returns the lowercase extension of the final path segment', () => {
        expect(getExtension('orders/archive.JSON')).toBe('.json');
    });

    it('ignores dots outside the final path segment', () => {
        expect(getExtension('orders.with.dot/archive')).toBe('');
    });

    it('does not treat a hidden file name as an extension', () => {
        expect(getExtension('.hidden')).toBe('');
    });
});

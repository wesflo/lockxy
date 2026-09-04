import { describe, expect, it } from 'vitest';

import { prefixFileName } from './prefixFileName.js';

describe('prefixFileName', () => {
    it('prefixes only the final path segment', () => {
        expect(prefixFileName('orders/archive.json', 'GET')).toBe('orders/GET_archive.json');
    });
});

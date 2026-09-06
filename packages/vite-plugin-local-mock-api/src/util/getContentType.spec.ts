import { describe, expect, it } from 'vitest';

import { getContentType } from './getContentType.js';

describe('getContentType', () => {
    const contentTypes = {
        '.json': 'application/json; charset=utf-8',
        '.xml': 'application/xml',
    };

    it('returns the configured content type for a known extension', () => {
        expect(getContentType('.json', contentTypes)).toBe('application/json; charset=utf-8');
        expect(getContentType('.xml', contentTypes)).toBe('application/xml');
    });

    it('returns the binary fallback for an unknown extension', () => {
        expect(getContentType('.unknown', contentTypes)).toBe('application/octet-stream');
    });
});

import { describe, expect, it, vi } from 'vitest';

vi.mock('../constant.js', () => ({
    CONTENT_TYPES: {
        '.json': 'application/json; charset=utf-8'
    }
}));

import { getContentType } from './getContentType.js';

describe('getContentType', () => {
    it('returns the configured content type for a known extension', () => {
        expect(getContentType('.json')).toBe('application/json; charset=utf-8');
    });

    it('returns the binary fallback for an unknown extension', () => {
        expect(getContentType('.unknown')).toBe('application/octet-stream');
    });
});

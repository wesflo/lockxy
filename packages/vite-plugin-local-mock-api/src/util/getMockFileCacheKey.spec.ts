import { describe, expect, it } from 'vitest';

import { getMockFileCacheKey } from './getMockFileCacheKey.js';

describe('getMockFileCacheKey', () => {
    it('combines the normalized method and pathname', () => {
        expect(getMockFileCacheKey('/api/users', 'post')).toBe('POST_/api/users');
    });

    it('does not include query parameters in the cache key', () => {
        expect(getMockFileCacheKey('/api/users?role=admin', 'GET')).toBe('GET_/api/users');
    });

    it('extracts the pathname from an absolute URL', () => {
        expect(getMockFileCacheKey('https://example.test/api/users?role=admin', 'GET')).toBe('GET_/api/users');
    });

    it('uses GET when the request method is absent', () => {
        expect(getMockFileCacheKey('/api/users', undefined)).toBe('GET_/api/users');
    });
});

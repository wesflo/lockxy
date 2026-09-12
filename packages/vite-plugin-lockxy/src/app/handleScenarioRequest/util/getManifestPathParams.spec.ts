import { describe, expect, it } from 'vitest';

import { getManifestPathParams } from './getManifestPathParams.js';

describe('getManifestPathParams', () => {
    it('extracts and decodes required parameters', () => {
        expect(getManifestPathParams('/api/foo/:id', '/api/foo/hello%20world')).toEqual({ id: 'hello world' });
    });

    it('omits an absent trailing optional parameter', () => {
        expect(getManifestPathParams('/api/foo/:id?', '/api/foo')).toEqual({});
    });

    it('aligns an omitted optional parameter before a static segment', () => {
        expect(getManifestPathParams('/api/foo/:id?/details', '/api/foo/details')).toEqual({});
        expect(getManifestPathParams('/api/foo/:id?/details', '/api/foo/123/details')).toEqual({ id: '123' });
    });
});

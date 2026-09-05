import { describe, expect, it } from 'vitest';

import { findMockEndpoint } from './findMockEndpoint.js';

describe('findMockEndpoint', () => {
    it('matches a minimal endpoint for every HTTP method', () => {
        const manifest = { endpoints: [{ path: '/api/profile', status: 204 }] };

        expect(findMockEndpoint(manifest, 'GET', '/api/profile')).toEqual(manifest.endpoints[0]);
        expect(findMockEndpoint(manifest, 'PUT', '/api/profile')).toEqual(manifest.endpoints[0]);
    });

    it('uses the method when one is configured', () => {
        const manifest = { endpoints: [{ path: '/api/profile', method: 'POST' }] };

        expect(findMockEndpoint(manifest, 'GET', '/api/profile')).toBeUndefined();
        expect(findMockEndpoint(manifest, 'post', '/api/profile')).toEqual(manifest.endpoints[0]);
    });

    it('supports a manifest without endpoints', () => {
        expect(findMockEndpoint({ delay: 400 }, 'GET', '/api/profile')).toBeUndefined();
    });
});

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

    it('matches any method configured in an array', () => {
        const manifest = { endpoints: [{ path: '/api/profile', method: ['POST', 'PUT'] }] };

        expect(findMockEndpoint(manifest, 'POST', '/api/profile')).toEqual(manifest.endpoints[0]);
        expect(findMockEndpoint(manifest, 'put', '/api/profile')).toEqual(manifest.endpoints[0]);
        expect(findMockEndpoint(manifest, 'PATCH', '/api/profile')).toBeUndefined();
    });

    it('matches optional manifest parameters when present or absent', () => {
        const endpoint = { path: '/_internal/webcomponent/shoppingCart/cart/:id?', method: 'GET' };
        const manifest = { endpoints: [endpoint] };

        expect(findMockEndpoint(manifest, 'GET', '/_internal/webcomponent/shoppingCart/cart/528380')).toBe(endpoint);
        expect(findMockEndpoint(manifest, 'GET', '/_internal/webcomponent/shoppingCart/cart')).toBe(endpoint);
    });

    it('supports a manifest without endpoints', () => {
        expect(findMockEndpoint({ delay: 400 }, 'GET', '/api/profile')).toBeUndefined();
    });
});

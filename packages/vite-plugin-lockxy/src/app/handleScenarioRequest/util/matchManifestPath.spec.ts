import { describe, expect, it } from 'vitest';

import { matchManifestPath } from './matchManifestPath.js';

describe('matchManifestPath', () => {
    it('matches static and required parameter segments', () => {
        expect(matchManifestPath('/api/users/:id', '/api/users/42')).toBe(true);
        expect(matchManifestPath('/api/users/:id', '/api/users')).toBe(false);
    });

    it('matches an optional parameter when it is present or absent', () => {
        const path = '/_internal/webcomponent/shoppingCart/cart/:id?';

        expect(matchManifestPath(path, '/_internal/webcomponent/shoppingCart/cart/528380')).toBe(true);
        expect(matchManifestPath(path, '/_internal/webcomponent/shoppingCart/cart')).toBe(true);
    });

    it('supports optional parameters before later static segments', () => {
        expect(matchManifestPath('/api/users/:id?/orders', '/api/users/orders')).toBe(true);
        expect(matchManifestPath('/api/users/:id?/orders', '/api/users/42/orders')).toBe(true);
    });

    it('rejects different static paths and additional segments', () => {
        expect(matchManifestPath('/api/users/:id?', '/api/orders/42')).toBe(false);
        expect(matchManifestPath('/api/users/:id?', '/api/users/42/orders')).toBe(false);
    });
});

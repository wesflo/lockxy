import { describe, expect, it } from 'vitest';

import { getEndpointSelectionKey } from './getEndpointSelectionKey.js';

describe('getEndpointSelectionKey', () => {
    it('normalizes the method and represents a wildcard method', () => {
        expect(getEndpointSelectionKey({ method: 'get', path: '/api/users' })).toBe('GET /api/users');
        expect(getEndpointSelectionKey({ path: '/api/users' })).toBe('* /api/users');
    });
});

import { describe, expect, it } from 'vitest';

import type { DemoCase, MockManifest } from '../interface';
import { findEndpoint } from './findEndpoint';

const testCase: DemoCase = {
    id: 'profile',
    title: 'Profile',
    description: 'Profile',
    group: 'Success',
    method: 'GET',
    path: '/api/users/profile',
    responseKind: 'json',
    endpointId: 'profile',
    expectedStatus: 200,
};

describe('findEndpoint', () => {
    it('finds by ID or path and respects the method', () => {
        const manifest: MockManifest = { endpoints: [{ id: 'profile', method: 'GET', path: '/api/users/profile' }] };
        expect(findEndpoint(manifest, testCase)?.id).toBe('profile');
        expect(findEndpoint(manifest, { ...testCase, endpointId: undefined })?.id).toBe('profile');
        expect(findEndpoint(manifest, { ...testCase, method: 'POST' })).toBeUndefined();
        expect(findEndpoint(undefined, testCase)).toBeUndefined();
    });
});

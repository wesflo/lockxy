import { describe, expect, it, vi } from 'vitest';

import type { DemoCase, MockManifest } from '../interface';
import { findEndpoint, findScenario, getGroups, loadManifest } from './manifest';

const testCase: DemoCase = {
    id: 'profile',
    title: 'Profile',
    description: 'Profile response',
    group: 'Success',
    method: 'GET',
    path: '/api/users/profile',
    responseKind: 'json',
    endpointId: 'profile',
    scenarioId: 'compact',
    expectedStatus: 200
};

const manifest: MockManifest = {
    endpoints: [
        {
            id: 'profile',
            method: 'GET',
            path: '/api/users/profile',
            scenarios: [{ id: 'compact', label: 'Compact', file: 'compact.json' }]
        }
    ]
};

describe('demo manifest utilities', () => {
    it('finds endpoints and automatically returns a sole scenario', () => {
        expect(findEndpoint(manifest, testCase)?.id).toBe('profile');
        expect(findScenario(manifest, { ...testCase, scenarioId: undefined })?.id).toBe('compact');
    });

    it('returns distinct groups in source order', () => {
        expect(getGroups([testCase, { ...testCase, id: 'second' }, { ...testCase, id: 'error', group: 'Errors' }])).toEqual([
            'Success',
            'Errors'
        ]);
    });

    it('loads the manifest from the fixed route', async () => {
        const request = vi.fn().mockResolvedValue({ ok: true, json: async () => manifest });

        await expect(loadManifest(request)).resolves.toEqual(manifest);
        expect(request).toHaveBeenCalledWith('/_local-mock-api/manifest');
    });

    it('reports unsuccessful manifest requests', async () => {
        const request = vi.fn().mockResolvedValue({ ok: false, status: 503 });

        await expect(loadManifest(request)).rejects.toThrow('HTTP 503');
    });
});

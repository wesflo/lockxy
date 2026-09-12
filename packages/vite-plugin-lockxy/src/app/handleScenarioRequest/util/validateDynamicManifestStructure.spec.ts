import { describe, expect, it, vi } from 'vitest';

import { validateDynamicManifestStructure } from './validateDynamicManifestStructure.js';

describe('validateDynamicManifestStructure', () => {
    it('accepts endpoints with handlers and marks them as dynamic', () => {
        const handler = vi.fn();

        expect(
            validateDynamicManifestStructure({ endpoints: [{ path: '/api/foo/:id', handler }] }, 'mock.manifest.ts')
        ).toEqual({ endpoints: [{ path: '/api/foo/:id', handler, dynamic: true }] });
    });

    it('requires a handler for every endpoint', () => {
        expect(() =>
            validateDynamicManifestStructure({ endpoints: [{ path: '/api/foo' }] }, 'mock.manifest.ts')
        ).toThrow('mock.manifest.ts.endpoints[0].handler: must be a function');
    });

    it('rejects scenarios on dynamic endpoints', () => {
        expect(() =>
            validateDynamicManifestStructure(
                { endpoints: [{ path: '/api/foo', handler: vi.fn(), scenarios: [] }] },
                'mock.manifest.ts'
            )
        ).toThrow('dynamic endpoints do not support scenarios');
    });
});

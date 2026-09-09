import { describe, expect, it } from 'vitest';

import { validateManifestStructure } from './validateManifestStructure.js';

describe('validateManifestStructure', () => {
    it.each([
        [null, 'mock.json: root must be an object'],
        [[], 'mock.json: root must be an object'],
        [{ endpoints: {} }, 'mock.json.endpoints: must be an array'],
        [{ id: 42 }, 'mock.json.id: must be a string'],
        [{ endpoints: [null] }, 'mock.json.endpoints[0]: must be an object'],
        [{ endpoints: [{}] }, 'mock.json.endpoints[0].path: must be a string beginning with /'],
        [{ endpoints: [{ path: 'api/users' }] }, 'mock.json.endpoints[0].path: must be a string beginning with /'],
        [{ endpoints: [{ path: '/api/users', method: 42 }] }, 'mock.json.endpoints[0].method: must be a string'],
        [{ endpoints: [{ path: '/api/users', scenarios: {} }] }, 'mock.json.endpoints[0].scenarios: must be an array'],
        [
            { endpoints: [{ path: '/api/users', scenarios: [null] }] },
            'mock.json.endpoints[0].scenarios[0]: must be an object',
        ],
    ])('rejects an unsafe runtime shape %#', (manifest, message) => {
        expect(() => validateManifestStructure(manifest, 'mock.json')).toThrow(message);
    });

    it('returns a structurally safe convention override', () => {
        const manifest = { id: 'checkout', delay: 100, endpoints: [{ path: '/api/users', scenarios: [{}] }] };

        expect(validateManifestStructure(manifest, 'mock.json')).toBe(manifest);
    });
});

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import type { MockManifest } from '../../../interface.js';
import { validateManifestStructure } from './validateManifestStructure.js';
import { validateMockManifest } from './validateMockManifest.js';

describe('validateManifestStructure', () => {
    it.each([
        [null, 'mock.json: root must be an object'],
        [[], 'mock.json: root must be an object'],
        [{ endpoints: {} }, 'mock.json.endpoints: must be an array'],
        [{ endpoints: [null] }, 'mock.json.endpoints[0]: must be an object'],
        [{ endpoints: [{}] }, 'mock.json.endpoints[0].path: must be a string beginning with /'],
        [{ endpoints: [{ path: 'api/users' }] }, 'mock.json.endpoints[0].path: must be a string beginning with /'],
        [{ endpoints: [{ path: '/api/users', method: 42 }] }, 'mock.json.endpoints[0].method: must be a string'],
        [{ endpoints: [{ path: '/api/users', scenarios: {} }] }, 'mock.json.endpoints[0].scenarios: must be an array'],
        [{ endpoints: [{ path: '/api/users', scenarios: [null] }] }, 'mock.json.endpoints[0].scenarios[0]: must be an object']
    ])('rejects an unsafe runtime shape %#', (manifest, message) => {
        expect(() => validateManifestStructure(manifest, 'mock.json')).toThrow(message);
    });

    it('returns a structurally safe convention override', () => {
        const manifest = { delay: 100, endpoints: [{ path: '/api/users', scenarios: [{}] }] };

        expect(validateManifestStructure(manifest, 'mock.json')).toBe(manifest);
    });
});

describe('validateMockManifest', () => {
    const temporaryDirectories: string[] = [];

    afterEach(async () => {
        await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
    });

    const createMockRoot = async (): Promise<{ directory: string; mockRoot: URL }> => {
        const directory = await mkdtemp(join(tmpdir(), 'validate-mock-manifest-'));
        temporaryDirectories.push(directory);
        return {
            directory,
            mockRoot: new URL('./', pathToFileURL(join(directory, 'placeholder')))
        };
    };

    const validate = async (manifest: MockManifest): Promise<void> => {
        const { mockRoot } = await createMockRoot();
        await validateMockManifest(manifest, 'mock.manifest.json', mockRoot);
    };

    it('accepts an empty or delay-only manifest', async () => {
        await expect(validate({})).resolves.toBeUndefined();
        await expect(validate({ delay: 0 })).resolves.toBeUndefined();
        await expect(validate({ delay: [200, 600] })).resolves.toBeUndefined();
    });

    it.each([
        [[600, 200]],
        [[200]],
        [[200, 600, 800]],
        [[-1, 200]],
        [[200.5, 600]]
    ])('rejects the invalid delay range %j', async (delay) => {
        await expect(validate({ delay: delay as [number, number] })).rejects.toThrow(
            /delay: must be a non-negative integer or an ascending \[minimum, maximum\] range/
        );
    });

    it('accepts existing endpoint and scenario files', async () => {
        const { directory, mockRoot } = await createMockRoot();
        await mkdir(join(directory, 'scenarios'));
        await writeFile(join(directory, 'endpoint.json'), '{}');
        await writeFile(join(directory, 'scenarios', 'success.json'), '{}');

        await expect(
            validateMockManifest(
                {
                    endpoints: [{
                        path: '/api/users',
                        file: 'endpoint.json',
                        scenarios: [{ file: 'scenarios/success.json' }]
                    }]
                },
                'mock.manifest.json',
                mockRoot
            )
        ).resolves.toBeUndefined();
    });

    it('reports every invalid status and delay with its field path', async () => {
        const manifest = {
            delay: -1,
            endpoints: [{
                path: '/api/users',
                status: 600,
                delay: 1.5,
                scenarios: [{ status: 99, delay: -20 }]
            }]
        } as MockManifest;

        await expect(validate(manifest)).rejects.toThrow(
            /mock\.manifest\.json\.delay: must be a non-negative integer/
        );
        await expect(validate(manifest)).rejects.toThrow(
            /mock\.manifest\.json\.endpoints\[0\]\.status: must be an integer from 100 through 599/
        );
        await expect(validate(manifest)).rejects.toThrow(
            /mock\.manifest\.json\.endpoints\[0\]\.scenarios\[0\]\.status/
        );
    });

    it.each([100, 204, 304, 599])('accepts the status boundary %s', async (status) => {
        await expect(validate({ endpoints: [{ path: '/api/status', status }] })).resolves.toBeUndefined();
    });

    it('reports unsafe, missing, and non-file references separately', async () => {
        const { directory, mockRoot } = await createMockRoot();
        await mkdir(join(directory, 'directory.json'));
        const manifest = {
            endpoints: [{
                path: '/api/files',
                file: '../outside.json',
                scenarios: [
                    { id: 'missing', file: 'missing.json' },
                    { id: 'directory', file: 'directory.json' }
                ]
            }]
        };

        await expect(
            validateMockManifest(manifest, 'mock.manifest.json', mockRoot)
        ).rejects.toThrow(/endpoints\[0\]\.file: must be a safe path relative to mockRoot/);
        await expect(
            validateMockManifest(manifest, 'mock.manifest.json', mockRoot)
        ).rejects.toThrow(/scenarios\[0\]\.file: referenced file "missing\.json" does not exist or is not a file/);
        await expect(
            validateMockManifest(manifest, 'mock.manifest.json', mockRoot)
        ).rejects.toThrow(/scenarios\[1\]\.file: referenced file "directory\.json" does not exist or is not a file/);
    });

    it('detects duplicate explicit and generated endpoint IDs', async () => {
        await expect(validate({ endpoints: [
            { id: 'users', path: '/api/users' },
            { id: 'users', method: 'POST', path: '/api/users' }
        ] })).rejects.toThrow(/endpoints\[1\]\.id: duplicate endpoint ID "users"/);

        await expect(validate({ endpoints: [
            { method: 'GET', path: '/api/users' },
            { method: 'GET', path: '/api/users' }
        ] })).rejects.toThrow(/endpoints\[1\]\.id: duplicate endpoint ID "get_api_users"/);
    });

    it('detects duplicate scenario IDs only within their endpoint', async () => {
        await expect(validate({ endpoints: [{
            path: '/api/users',
            scenarios: [{ id: 'success' }, { id: 'success' }]
        }] })).rejects.toThrow(/scenarios\[1\]\.id: duplicate scenario ID "success"/);

        await expect(validate({ endpoints: [
            { path: '/api/users', scenarios: [{ id: 'success' }] },
            { path: '/api/orders', scenarios: [{ id: 'success' }] }
        ] })).resolves.toBeUndefined();
    });

    it.each([
        [
            { method: 'GET', path: '/api/users/:id' },
            { method: 'GET', path: '/api/users/:name' }
        ],
        [
            { method: 'GET', path: '/api/users/:id' },
            { method: 'GET', path: '/api/users/current' }
        ],
        [
            { path: '/api/users' },
            { method: 'POST', path: '/api/users' }
        ]
    ])('detects routes that can handle the same request %#', async (first, second) => {
        await expect(validate({ endpoints: [first, second] })).rejects.toThrow(
            /endpoints\[1\]: route conflicts with mock\.manifest\.json\.endpoints\[0\]/
        );
    });

    it('allows routes separated by method, segment count, or inactive state', async () => {
        await expect(validate({ endpoints: [
            { method: 'GET', path: '/api/users' },
            { method: 'POST', path: '/api/users' },
            { method: 'GET', path: '/api/users/:id' },
            { id: 'inactive-users', method: 'GET', path: '/api/users', active: false }
        ] })).resolves.toBeUndefined();
    });

    it('reports invalid metadata fields without throwing an implementation error', async () => {
        const manifest = {
            $schema: '',
            endpoints: [{
                id: '',
                label: 42,
                active: 'yes',
                method: '',
                path: '/api/users',
                scenarios: [{ id: '', label: 42 }]
            }]
        } as unknown as MockManifest;

        await expect(validate(manifest)).rejects.toThrow(/mock\.manifest\.json\.\$schema: must be a non-empty string/);
        await expect(validate(manifest)).rejects.toThrow(/endpoints\[0\]\.active: must be a boolean/);
        await expect(validate(manifest)).rejects.toThrow(/scenarios\[0\]\.label: must be a non-empty string/);
    });

    it('rejects IDs that cannot safely be stored in selection cookies', async () => {
        await expect(validate({ endpoints: [{
            id: 'users:admin',
            path: '/api/users',
            scenarios: [{ id: 'slow response' }]
        }] })).rejects.toThrow(
            /endpoints\[0\]\.id: may contain only letters, numbers, underscores, and hyphens/
        );
        await expect(validate({ endpoints: [{
            id: 'users:admin',
            path: '/api/users',
            scenarios: [{ id: 'slow response' }]
        }] })).rejects.toThrow(
            /scenarios\[0\]\.id: may contain only letters, numbers, underscores, and hyphens/
        );
    });
});

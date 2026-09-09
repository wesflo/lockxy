import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { readMockManifest } from './readMockManifest.js';

describe('readMockManifest', () => {
    const temporaryDirectories: string[] = [];

    afterEach(async () => {
        await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
    });

    const writeManifest = async (content: string): Promise<URL> => {
        const directory = await mkdtemp(join(tmpdir(), 'local-mock-api-manifest-'));
        temporaryDirectories.push(directory);
        await writeFile(join(directory, 'mock.manifest.json'), content);
        return new URL('./', pathToFileURL(join(directory, 'placeholder')));
    };

    it('accepts a delay-only manifest', async () => {
        const mockRoot = await writeManifest('{"delay":400}');

        await expect(readMockManifest(mockRoot, 'mock.manifest.json')).resolves.toEqual({
            status: 'valid',
            manifest: { delay: 400 },
        });
    });

    it('keeps a missing manifest valid in debug mode', async () => {
        const directory = await mkdtemp(join(tmpdir(), 'local-mock-api-manifest-'));
        temporaryDirectories.push(directory);
        const mockRoot = new URL('./', pathToFileURL(join(directory, 'placeholder')));

        await expect(readMockManifest(mockRoot, 'mock.manifest.json', true)).resolves.toEqual({ status: 'missing' });
    });

    it('rejects a non-array endpoints field', async () => {
        const mockRoot = await writeManifest('{"endpoints":{}}');
        const result = await readMockManifest(mockRoot, 'mock.manifest.json');

        expect(result.status).toBe('invalid');
        if (result.status === 'invalid') {
            expect(result.error.message).toContain('mock.manifest.json.endpoints');
        }
    });

    it('reports the JSON line and column', async () => {
        const mockRoot = await writeManifest('{\n  "delay": 400,\n}');
        const result = await readMockManifest(mockRoot, 'mock.manifest.json');

        expect(result.status).toBe('invalid');
        if (result.status === 'invalid') {
            expect(result.error.message).toMatch(/mock\.manifest\.json:3:\d+/);
        }
    });

    it('runs semantic and file validation only in debug mode', async () => {
        const mockRoot = await writeManifest(
            JSON.stringify({
                endpoints: [
                    { id: 'same', method: 'GET', path: '/api/users/:id', status: 700, file: 'missing.json' },
                    { id: 'same', method: 'GET', path: '/api/users/:name' },
                ],
            })
        );

        await expect(readMockManifest(mockRoot, 'mock.manifest.json')).resolves.toMatchObject({ status: 'valid' });

        const result = await readMockManifest(mockRoot, 'mock.manifest.json', true);
        expect(result.status).toBe('invalid');
        if (result.status === 'invalid') {
            expect(result.error.message).toContain('endpoints[0].status');
            expect(result.error.message).toContain('referenced file "missing.json" does not exist');
            expect(result.error.message).toContain('endpoints[1].id: duplicate endpoint ID "same"');
            expect(result.error.message).toContain(
                'endpoints[1]: route conflicts with mock.manifest.json.endpoints[0]'
            );
        }
    });
});

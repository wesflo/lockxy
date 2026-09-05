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
            manifest: { delay: 400 }
        });
    });

    it('rejects a non-array endpoints field', async () => {
        const mockRoot = await writeManifest('{"endpoints":{}}');
        const result = await readMockManifest(mockRoot, 'mock.manifest.json');

        expect(result.status).toBe('invalid');
    });
});

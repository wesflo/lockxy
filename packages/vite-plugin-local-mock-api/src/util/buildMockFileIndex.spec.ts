import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { buildMockFileIndex } from './buildMockFileIndex.js';

describe('buildMockFileIndex', () => {
    const temporaryDirectories: string[] = [];

    afterEach(async () => {
        await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
    });

    it('indexes file paths recursively relative to a mock root outside src', async () => {
        const directory = await mkdtemp(join(tmpdir(), 'lockxy-file-index-'));
        temporaryDirectories.push(directory);
        await mkdir(join(directory, 'users', 'responses'), { recursive: true });
        await writeFile(join(directory, 'mock.manifest.json'), '{}');
        await writeFile(join(directory, 'users', 'profile.json'), '{}');
        await writeFile(join(directory, 'users', 'responses', 'avatar.png'), 'image');

        const index = await buildMockFileIndex(new URL('./', pathToFileURL(join(directory, 'placeholder'))));

        expect([...index].sort()).toEqual([
            'mock.manifest.json',
            'users/profile.json',
            'users/responses/avatar.png',
        ]);
    });

    it('returns an empty index when the mock root does not exist', async () => {
        const root = pathToFileURL(join(tmpdir(), `missing-lockxy-${Date.now()}/`));

        await expect(buildMockFileIndex(root)).resolves.toEqual(new Set());
    });
});

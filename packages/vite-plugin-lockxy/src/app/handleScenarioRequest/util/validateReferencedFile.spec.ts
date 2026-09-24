import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { validateReferencedFile } from './validateReferencedFile.js';

describe('validateReferencedFile', () => {
    const temporaryDirectories: string[] = [];

    afterEach(async () => {
        await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
    });

    const createMockRoot = async (): Promise<{ directory: string; mockRoot: URL }> => {
        const directory = await mkdtemp(join(tmpdir(), 'validate-referenced-file-'));
        temporaryDirectories.push(directory);
        return {
            directory,
            mockRoot: new URL('./', pathToFileURL(join(directory, 'placeholder'))),
        };
    };

    it('accepts an existing file', async () => {
        const { directory, mockRoot } = await createMockRoot();
        await writeFile(join(directory, 'profile.json'), '{}');

        await expect(validateReferencedFile('profile.json', 'endpoint', mockRoot)).resolves.toEqual([]);
    });

    it('reports missing files and directories', async () => {
        const { directory, mockRoot } = await createMockRoot();
        await mkdir(join(directory, 'directory.json'));

        await expect(validateReferencedFile('missing.json', 'endpoint', mockRoot)).resolves.toEqual([
            'endpoint.file: referenced file "missing.json" does not exist or is not a file',
        ]);
        await expect(validateReferencedFile('directory.json', 'endpoint', mockRoot)).resolves.toEqual([
            'endpoint.file: referenced file "directory.json" does not exist or is not a file',
        ]);
    });

    it('leaves omitted and unsafe paths to response-shape validation', async () => {
        const { mockRoot } = await createMockRoot();

        await expect(validateReferencedFile(undefined, 'endpoint', mockRoot)).resolves.toEqual([]);
        await expect(validateReferencedFile('../outside.json', 'endpoint', mockRoot)).resolves.toEqual([]);
    });
});

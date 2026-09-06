import { readFile } from 'node:fs/promises';

import type { ManifestReadResult, MockManifest } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';
import { normalizeMockManifest } from './normalizeMockManifest.js';
import { formatJsonError } from './formatJsonError.js';
import { validateManifestStructure } from './validateManifestStructure.js';
import { validateMockManifest } from './validateMockManifest.js';

export const readMockManifest = async (
    mockRoot: URL,
    manifestFileName: string,
    debug = false
): Promise<ManifestReadResult> => {
    try {
        const content = await readFile(toMockUrl(manifestFileName, mockRoot), 'utf8');
        let parsed: unknown;
        try {
            parsed = JSON.parse(content);
        } catch (error) {
            throw formatJsonError(manifestFileName, content, error);
        }

        const manifest: MockManifest = validateManifestStructure(parsed, manifestFileName);
        if (debug) {
            await validateMockManifest(manifest, manifestFileName, mockRoot);
        }

        return { status: 'valid', manifest: normalizeMockManifest(manifest) };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { status: 'missing' };
        }

        return {
            status: 'invalid',
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
};

import { readFile } from 'node:fs/promises';

import type { ManifestReadResult, MockManifest } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';
import { normalizeMockManifest } from './normalizeMockManifest.js';
import { parseManifestContent } from './parseManifestContent.js';
import { validateManifestStructure } from './validateManifestStructure.js';
import { validateMockManifest } from './validateMockManifest.js';

export const readMockManifest = async (
    mockRoot: URL,
    manifestFileName: string,
    debug = false
): Promise<ManifestReadResult> => {
    try {
        const content = await readFile(toMockUrl(manifestFileName, mockRoot), 'utf8');
        const parsed = parseManifestContent(manifestFileName, content);

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

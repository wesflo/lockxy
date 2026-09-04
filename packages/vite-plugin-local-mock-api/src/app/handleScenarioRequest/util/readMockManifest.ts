import { readFile } from 'node:fs/promises';

import type { ManifestReadResult, MockManifest } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';

export const readMockManifest = async (
    mockRoot: URL,
    manifestFileName: string
): Promise<ManifestReadResult> => {
    try {
        const content = await readFile(toMockUrl(manifestFileName, mockRoot), 'utf8');
        const manifest = JSON.parse(content) as MockManifest;

        if (!manifest || !Array.isArray(manifest.endpoints)) {
            throw new TypeError(`${manifestFileName} must contain an endpoints array`);
        }

        return { status: 'valid', manifest };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { status: 'missing' };
        }

        return {
            status: 'invalid',
            error: error instanceof Error ? error : new Error(String(error))
        };
    }
};

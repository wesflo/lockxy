import { readFile } from 'node:fs/promises';

import { MANIFEST_FILE_NAME } from '../../../constant.js';
import type { ManifestReadResult, MockManifest } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';

export const readMockManifest = async (mockRoot: URL): Promise<ManifestReadResult> => {
    try {
        const content = await readFile(toMockUrl(MANIFEST_FILE_NAME, mockRoot), 'utf8');
        const manifest = JSON.parse(content) as MockManifest;

        if (!manifest || !Array.isArray(manifest.endpoints)) {
            throw new TypeError('mock.manifest.json must contain an endpoints array');
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

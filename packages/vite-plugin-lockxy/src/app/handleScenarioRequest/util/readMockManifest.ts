import { readFile, stat } from 'node:fs/promises';

import type { ManifestModuleLoader, ManifestReadResult, MockManifest } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';
import { normalizeMockManifest } from './normalizeMockManifest.js';
import { parseManifestContent } from './parseManifestContent.js';
import { validateDynamicManifestStructure } from './validateDynamicManifestStructure.js';
import { validateManifestStructure } from './validateManifestStructure.js';
import { validateMockManifest } from './validateMockManifest.js';

export const readMockManifest = async (
    mockRoot: URL,
    manifestFileName: string,
    debug = false,
    loadManifestModule?: ManifestModuleLoader
): Promise<ManifestReadResult> => {
    try {
        const isDynamic = /\.[jt]s$/i.test(manifestFileName);
        let manifest: MockManifest;
        if (isDynamic) {
            await stat(toMockUrl(manifestFileName, mockRoot));
            if (!loadManifestModule) {
                throw new TypeError(`${manifestFileName}: dynamic manifests require the Vite development server`);
            }
            const loaded = await loadManifestModule(manifestFileName);
            const exported = (loaded as { default?: unknown })?.default;
            manifest = validateDynamicManifestStructure(exported, manifestFileName);
        } else {
            const content = await readFile(toMockUrl(manifestFileName, mockRoot), 'utf8');
            manifest = validateManifestStructure(parseManifestContent(manifestFileName, content), manifestFileName);
        }
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

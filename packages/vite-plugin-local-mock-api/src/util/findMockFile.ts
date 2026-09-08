import type { MockFileLookupResult } from '../interface.js';
import { readExistingFile } from './readExistingFile.js';

export const findMockFile = async (
    filePathCache: Map<string, string>,
    cacheKey: string,
    candidatePaths: readonly string[],
    mockRoot: URL
): Promise<MockFileLookupResult | null> => {
    const cachedPath = filePathCache.get(cacheKey);

    if (cachedPath) {
        const cachedFile = await readExistingFile(cachedPath, mockRoot);

        if (cachedFile) {
            return { file: cachedFile, cacheHit: true };
        }

        filePathCache.delete(cacheKey);
    }

    for (const path of candidatePaths) {
        if (path === cachedPath) {
            continue;
        }

        const file = await readExistingFile(path, mockRoot);

        if (file) {
            filePathCache.set(cacheKey, path);
            return { file, cacheHit: false };
        }
    }

    return null;
};

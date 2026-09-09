import type { MockFile } from '../interface.js';
import { readExistingFile } from './readExistingFile.js';

export const findMockFile = async (
    fileIndex: ReadonlySet<string>,
    candidatePaths: readonly string[],
    mockRoot: URL
): Promise<MockFile | null> => {
    for (const path of candidatePaths) {
        if (!fileIndex.has(path)) {
            continue;
        }

        const file = await readExistingFile(path, mockRoot);

        if (file) {
            return file;
        }
    }

    return null;
};

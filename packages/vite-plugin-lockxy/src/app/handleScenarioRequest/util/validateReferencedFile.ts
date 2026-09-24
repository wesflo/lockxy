import { stat } from 'node:fs/promises';

import { toMockUrl } from '../../../util/toMockUrl.js';
import { isSafeScenarioFile } from './isSafeScenarioFile.js';

export const validateReferencedFile = async (
    file: unknown,
    path: string,
    mockRoot: URL
): Promise<readonly string[]> => {
    if (typeof file !== 'string' || file.length === 0 || !isSafeScenarioFile(file)) {
        return [];
    }

    try {
        const fileStats = await stat(toMockUrl(file, mockRoot));
        return fileStats.isFile() ? [] : [`${path}.file: referenced file "${file}" does not exist or is not a file`];
    } catch {
        return [`${path}.file: referenced file "${file}" does not exist or is not a file`];
    }
};

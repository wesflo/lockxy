import { readFile } from 'node:fs/promises';

import type { MockFile } from '../interface.js';
import { getExtension } from './getExtension.js';
import { toMockUrl } from './toMockUrl.js';

export const readExistingFile = async (path: string, mockRoot: URL): Promise<MockFile | null> => {
    const url = toMockUrl(path, mockRoot);

    if (!url.href.startsWith(mockRoot.href)) {
        return null;
    }

    try {
        return {
            content: await readFile(url),
            extension: getExtension(path)
        };
    } catch {
        return null;
    }
};

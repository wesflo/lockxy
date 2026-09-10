import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const normalizeMockRoot = (mockRoot?: URL, projectRoot = process.cwd()): URL => {
    const resolvedMockRoot = mockRoot ?? pathToFileURL(resolve(projectRoot, 'mock'));

    return new URL(resolvedMockRoot.href.endsWith('/') ? resolvedMockRoot.href : `${resolvedMockRoot.href}/`);
};

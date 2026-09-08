import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    readExistingFile: vi.fn(),
}));

vi.mock('./readExistingFile.js', () => ({
    readExistingFile: mocks.readExistingFile,
}));

import { findMockFile } from './findMockFile.js';

describe('findMockFile', () => {
    const candidatePaths = ['users/GET_index.json', 'users/index.json'];
    const fileIndex = new Set(candidatePaths);
    const mockRoot = new URL('file:///tmp/mock/');
    const mockFile = { content: Buffer.from('{}'), extension: '.json' };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('reads indexed candidates in precedence order and returns the first existing file', async () => {
        mocks.readExistingFile.mockResolvedValueOnce(null).mockResolvedValueOnce(mockFile);

        await expect(findMockFile(fileIndex, candidatePaths, mockRoot)).resolves.toBe(mockFile);
        expect(mocks.readExistingFile).toHaveBeenCalledTimes(2);
        expect(mocks.readExistingFile).toHaveBeenNthCalledWith(1, 'users/GET_index.json', mockRoot);
        expect(mocks.readExistingFile).toHaveBeenNthCalledWith(2, 'users/index.json', mockRoot);
    });

    it('returns null when all indexed candidates disappeared before they could be read', async () => {
        mocks.readExistingFile.mockResolvedValue(null);

        await expect(findMockFile(fileIndex, candidatePaths, mockRoot)).resolves.toBeNull();
    });

    it('does not touch the file system for candidates absent from the index', async () => {
        await expect(findMockFile(new Set(), candidatePaths, mockRoot)).resolves.toBeNull();
        expect(mocks.readExistingFile).not.toHaveBeenCalled();
    });
});

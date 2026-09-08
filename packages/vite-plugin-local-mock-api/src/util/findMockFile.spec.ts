import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    readExistingFile: vi.fn(),
}));

vi.mock('./readExistingFile.js', () => ({
    readExistingFile: mocks.readExistingFile,
}));

import { findMockFile } from './findMockFile.js';

describe('findMockFile', () => {
    const cacheKey = 'GET_/api/users';
    const candidatePaths = ['users/GET_index.json', 'users/index.json'];
    const mockRoot = new URL('file:///tmp/mock/');
    const mockFile = { content: Buffer.from('{}'), extension: '.json' };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('reads only the cached path on a cache hit', async () => {
        const filePathCache = new Map([[cacheKey, 'users/index.json']]);
        mocks.readExistingFile.mockResolvedValue(mockFile);

        await expect(findMockFile(filePathCache, cacheKey, candidatePaths, mockRoot)).resolves.toEqual({
            file: mockFile,
            cacheHit: true,
        });
        expect(mocks.readExistingFile).toHaveBeenCalledOnce();
        expect(mocks.readExistingFile).toHaveBeenCalledWith('users/index.json', mockRoot);
    });

    it('caches the first existing candidate path', async () => {
        const filePathCache = new Map<string, string>();
        mocks.readExistingFile.mockResolvedValueOnce(null).mockResolvedValueOnce(mockFile);

        await expect(findMockFile(filePathCache, cacheKey, candidatePaths, mockRoot)).resolves.toEqual({
            file: mockFile,
            cacheHit: false,
        });
        expect(filePathCache.get(cacheKey)).toBe('users/index.json');
        expect(mocks.readExistingFile).toHaveBeenCalledTimes(2);
    });

    it('invalidates a deleted cached path and searches the remaining candidates', async () => {
        const filePathCache = new Map([[cacheKey, 'users/GET_index.json']]);
        mocks.readExistingFile.mockResolvedValueOnce(null).mockResolvedValueOnce(mockFile);

        await expect(findMockFile(filePathCache, cacheKey, candidatePaths, mockRoot)).resolves.toEqual({
            file: mockFile,
            cacheHit: false,
        });
        expect(mocks.readExistingFile).toHaveBeenNthCalledWith(1, 'users/GET_index.json', mockRoot);
        expect(mocks.readExistingFile).toHaveBeenNthCalledWith(2, 'users/index.json', mockRoot);
        expect(filePathCache.get(cacheKey)).toBe('users/index.json');
    });

    it('does not cache misses so files added later can be discovered', async () => {
        const filePathCache = new Map<string, string>();
        mocks.readExistingFile.mockResolvedValue(null);

        await expect(findMockFile(filePathCache, cacheKey, candidatePaths, mockRoot)).resolves.toBeNull();
        expect(filePathCache.has(cacheKey)).toBe(false);
    });

    it('reads cached file contents again for every request', async () => {
        const filePathCache = new Map([[cacheKey, 'users/index.json']]);
        const changedFile = { content: Buffer.from('{"changed":true}'), extension: '.json' };
        mocks.readExistingFile.mockResolvedValueOnce(mockFile).mockResolvedValueOnce(changedFile);

        await expect(findMockFile(filePathCache, cacheKey, candidatePaths, mockRoot)).resolves.toEqual({
            file: mockFile,
            cacheHit: true,
        });
        await expect(findMockFile(filePathCache, cacheKey, candidatePaths, mockRoot)).resolves.toEqual({
            file: changedFile,
            cacheHit: true,
        });
    });
});

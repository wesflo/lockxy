import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    readFile: vi.fn(),
    getExtension: vi.fn(),
    toMockUrl: vi.fn()
}));

vi.mock('node:fs/promises', () => ({
    readFile: mocks.readFile
}));

vi.mock('./getExtension.js', () => ({
    getExtension: mocks.getExtension
}));

vi.mock('./toMockUrl.js', () => ({
    toMockUrl: mocks.toMockUrl
}));

import { readExistingFile } from './readExistingFile.js';

describe('readExistingFile', () => {
    const mockRoot = new URL('file:///tmp/mocks/');

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.toMockUrl.mockReturnValue(new URL('file:///tmp/mocks/orders.json'));
        mocks.getExtension.mockReturnValue('.json');
    });

    it('does not read a URL outside the mock root', async () => {
        mocks.toMockUrl.mockReturnValue(new URL('file:///tmp/private/orders.json'));

        await expect(readExistingFile('../private/orders.json', mockRoot)).resolves.toBeNull();
        expect(mocks.readFile).not.toHaveBeenCalled();
        expect(mocks.getExtension).not.toHaveBeenCalled();
    });

    it('returns the file content and extension for an existing file', async () => {
        const content = Buffer.from('{"id":1}');
        mocks.readFile.mockResolvedValue(content);

        await expect(readExistingFile('orders.json', mockRoot)).resolves.toEqual({
            content,
            extension: '.json'
        });
        expect(mocks.readFile).toHaveBeenCalledWith(new URL('file:///tmp/mocks/orders.json'));
        expect(mocks.getExtension).toHaveBeenCalledWith('orders.json');
    });

    it('returns null when reading the candidate fails', async () => {
        mocks.readFile.mockRejectedValue(new Error('missing'));

        await expect(readExistingFile('orders.json', mockRoot)).resolves.toBeNull();
    });
});

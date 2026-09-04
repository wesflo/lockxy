import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    getExtension: vi.fn(),
    prefixFileName: vi.fn()
}));

vi.mock('./getExtension.js', () => ({
    getExtension: mocks.getExtension
}));

vi.mock('./prefixFileName.js', () => ({
    prefixFileName: mocks.prefixFileName
}));

import { getCandidatePaths } from './getCandidatePaths.js';

describe('getCandidatePaths', () => {
    const extensions = ['.json'];

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getExtension.mockReturnValue('');
        mocks.prefixFileName.mockImplementation(
            (path: string, prefix: string) => `${prefix}:${path}`
        );
    });

    it('creates specific and parent fallback candidates in the original order', () => {
        expect(getCandidatePaths(['inbox', 'templates', '1101'], undefined, extensions)).toEqual([
            'inbox/templates/1101.json',
            'templates/1101.json',
            '1101.json',
            'inbox/templates.json',
            'templates.json',
            'inbox.json'
        ]);
    });

    it('places an uppercased method-prefixed candidate before every fallback', () => {
        expect(getCandidatePaths(['orders'], 'post', extensions)).toEqual([
            'POST:orders.json',
            'orders.json'
        ]);
        expect(mocks.prefixFileName).toHaveBeenCalledWith('orders.json', 'POST');
    });

    it('does not append configured extensions when the candidate already has one', () => {
        mocks.getExtension.mockReturnValue('.json');

        expect(getCandidatePaths(['orders.json'], undefined, extensions)).toEqual(['orders.json']);
    });

    it('uses configured extensions', () => {
        expect(getCandidatePaths(['orders'], undefined, ['.json', '.xml'])).toEqual([
            'orders.json',
            'orders.xml'
        ]);
    });
});

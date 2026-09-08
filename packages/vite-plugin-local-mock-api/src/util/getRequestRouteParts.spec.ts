import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    decodePart: vi.fn(),
    isSafePart: vi.fn(),
}));

vi.mock('./decodePart.js', () => ({
    decodePart: mocks.decodePart,
}));

vi.mock('./isSafePart.js', () => ({
    isSafePart: mocks.isSafePart,
}));

import { getRequestRouteParts } from './getRequestRouteParts.js';

describe('getRequestRouteParts', () => {
    const requestPrefixes = ['/api/', '/external-api/'];

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.decodePart.mockImplementation((part: string) => decodeURIComponent(part));
        mocks.isSafePart.mockReturnValue(true);
    });

    it('returns null without a request URL', () => {
        expect(getRequestRouteParts(undefined, requestPrefixes)).toBeNull();
        expect(mocks.decodePart).not.toHaveBeenCalled();
    });

    it('returns null without configured request prefixes', () => {
        expect(getRequestRouteParts('/api/orders', [])).toBeNull();
        expect(mocks.decodePart).not.toHaveBeenCalled();
    });

    it('returns null for routes outside every request prefix', () => {
        expect(getRequestRouteParts('/assets/logo.svg', requestPrefixes)).toBeNull();
        expect(mocks.decodePart).not.toHaveBeenCalled();
    });

    it.each([
        ['/api/orders', ['orders']],
        ['/external-api/orders/42', ['orders', '42']],
    ])('resolves %s through its matching prefix', (requestUrl, expected) => {
        expect(getRequestRouteParts(requestUrl, requestPrefixes)).toEqual(expected);
    });

    it('uses the most specific matching prefix regardless of configuration order', () => {
        expect(getRequestRouteParts('/api/internal/orders', ['/api/', '/api/internal/'])).toEqual(['orders']);
        expect(getRequestRouteParts('/api/internal/orders', ['/api/internal/', '/api/'])).toEqual(['orders']);
    });

    it('decodes and validates each non-empty request route part', () => {
        expect(getRequestRouteParts('/external-api/orders/hello%20world/?draft=true', requestPrefixes)).toEqual([
            'orders',
            'hello world',
        ]);
        expect(mocks.decodePart.mock.calls[0]?.[0]).toBe('orders');
        expect(mocks.decodePart.mock.calls[1]?.[0]).toBe('hello%20world');
        expect(mocks.isSafePart).toHaveBeenNthCalledWith(1, 'orders');
        expect(mocks.isSafePart).toHaveBeenNthCalledWith(2, 'hello world');
    });

    it('returns null when a prefix has no remaining route parts', () => {
        expect(getRequestRouteParts('/api/', requestPrefixes)).toBeNull();
    });

    it('returns null when decoding fails', () => {
        mocks.decodePart.mockReturnValue(null);

        expect(getRequestRouteParts('/api/%E0%A4%A', requestPrefixes)).toBeNull();
        expect(mocks.isSafePart).not.toHaveBeenCalled();
    });

    it('returns null when a decoded part is unsafe', () => {
        mocks.isSafePart.mockReturnValue(false);

        expect(getRequestRouteParts('/api/unsafe', requestPrefixes)).toBeNull();
    });
});

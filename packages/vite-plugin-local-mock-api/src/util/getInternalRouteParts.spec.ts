import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    decodePart: vi.fn(),
    isSafePart: vi.fn()
}));

vi.mock('../constant.js', () => ({
    INTERNAL_PREFIX: '/_internal/'
}));

vi.mock('./decodePart.js', () => ({
    decodePart: mocks.decodePart
}));

vi.mock('./isSafePart.js', () => ({
    isSafePart: mocks.isSafePart
}));

import { getInternalRouteParts } from './getInternalRouteParts.js';

describe('getInternalRouteParts', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.decodePart.mockImplementation((part: string) => decodeURIComponent(part));
        mocks.isSafePart.mockReturnValue(true);
    });

    it('returns null without a request URL', () => {
        expect(getInternalRouteParts(undefined)).toBeNull();
        expect(mocks.decodePart).not.toHaveBeenCalled();
    });

    it('returns null for routes outside the internal prefix', () => {
        expect(getInternalRouteParts('/api/orders')).toBeNull();
        expect(mocks.decodePart).not.toHaveBeenCalled();
    });

    it('decodes and validates each non-empty internal route part', () => {
        expect(getInternalRouteParts('/_internal/orders/hello%20world/?draft=true')).toEqual([
            'orders',
            'hello world'
        ]);
        expect(mocks.decodePart.mock.calls[0]?.[0]).toBe('orders');
        expect(mocks.decodePart.mock.calls[1]?.[0]).toBe('hello%20world');
        expect(mocks.isSafePart).toHaveBeenNthCalledWith(1, 'orders');
        expect(mocks.isSafePart).toHaveBeenNthCalledWith(2, 'hello world');
    });

    it('returns null when decoding fails', () => {
        mocks.decodePart.mockReturnValue(null);

        expect(getInternalRouteParts('/_internal/%E0%A4%A')).toBeNull();
        expect(mocks.isSafePart).not.toHaveBeenCalled();
    });

    it('returns null when a decoded part is unsafe', () => {
        mocks.isSafePart.mockReturnValue(false);

        expect(getInternalRouteParts('/_internal/unsafe')).toBeNull();
    });
});

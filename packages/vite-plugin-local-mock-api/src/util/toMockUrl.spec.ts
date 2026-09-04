import { describe, expect, it } from 'vitest';

import { toMockUrl } from './toMockUrl.js';

describe('toMockUrl', () => {
    it('resolves a path relative to the mock root', () => {
        expect(toMockUrl('orders.json', new URL('file:///tmp/mocks/')).href).toBe(
            'file:///tmp/mocks/orders.json'
        );
    });
});

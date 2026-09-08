import { describe, expect, it } from 'vitest';

import { normalizeMockRoot } from './normalizeMockRoot.js';

describe('normalizeMockRoot', () => {
    it('adds a trailing slash to the mock root', () => {
        expect(normalizeMockRoot(new URL('file:///tmp/mocks')).href).toBe('file:///tmp/mocks/');
    });

    it('preserves an existing trailing slash', () => {
        expect(normalizeMockRoot(new URL('file:///tmp/mocks/')).href).toBe('file:///tmp/mocks/');
    });
});

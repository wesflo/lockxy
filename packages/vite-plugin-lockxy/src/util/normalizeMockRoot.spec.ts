import { describe, expect, it } from 'vitest';

import { normalizeMockRoot } from './normalizeMockRoot.js';

describe('normalizeMockRoot', () => {
    it('resolves the default mock directory from the Vite project root', () => {
        expect(normalizeMockRoot(undefined, '/projects/application').href).toBe('file:///projects/application/mock/');
    });

    it('adds a trailing slash to the mock root', () => {
        expect(normalizeMockRoot(new URL('file:///tmp/mocks')).href).toBe('file:///tmp/mocks/');
    });

    it('preserves an existing trailing slash', () => {
        expect(normalizeMockRoot(new URL('file:///tmp/mocks/')).href).toBe('file:///tmp/mocks/');
    });

    it('does not replace an explicit mock root with the project default', () => {
        expect(normalizeMockRoot(new URL('file:///custom/mocks'), '/projects/application').href).toBe(
            'file:///custom/mocks/'
        );
    });
});

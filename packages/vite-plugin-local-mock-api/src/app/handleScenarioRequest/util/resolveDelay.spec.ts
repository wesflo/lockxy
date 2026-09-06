import { describe, expect, it, vi } from 'vitest';

import { resolveDelay } from './resolveDelay.js';

describe('resolveDelay', () => {
    it('returns zero for an omitted delay', () => {
        expect(resolveDelay(undefined)).toBe(0);
    });

    it('returns a fixed delay unchanged', () => {
        expect(resolveDelay(250)).toBe(250);
    });

    it('selects an inclusive integer inside a delay range', () => {
        expect(resolveDelay([200, 600], vi.fn(() => 0))).toBe(200);
        expect(resolveDelay([200, 600], vi.fn(() => 0.5))).toBe(400);
        expect(resolveDelay([200, 600], vi.fn(() => 0.999999))).toBe(600);
    });
});

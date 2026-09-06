import { describe, expect, it, vi } from 'vitest';

import { restoreEndpointSelections } from './restoreEndpointSelections.js';

describe('restoreEndpointSelections', () => {
    it('keeps valid entries and discards malformed entries', () => {
        const value = JSON.stringify([
            ['GET /api/users', { active: false, scenarioId: 'error' }],
            ['bad-active', { active: 'false' }],
            ['bad-scenario', { scenarioId: 42 }],
            [42, { active: false }],
            ['missing-value']
        ]);
        expect(restoreEndpointSelections({
            getItem: () => value, setItem: vi.fn(), removeItem: vi.fn()
        }, 'key')).toEqual(new Map([['GET /api/users', { active: false, scenarioId: 'error' }]]));
    });

    it.each([null, '', '{}', 'invalid-json'])('returns empty for invalid value %s', (value) => {
        expect(restoreEndpointSelections({
            getItem: () => value, setItem: vi.fn(), removeItem: vi.fn()
        }, 'key')).toEqual(new Map());
    });

    it('returns empty when storage access throws', () => {
        expect(restoreEndpointSelections({
            getItem: () => { throw new Error('blocked'); }, setItem: vi.fn(), removeItem: vi.fn()
        }, 'key')).toEqual(new Map());
    });
});

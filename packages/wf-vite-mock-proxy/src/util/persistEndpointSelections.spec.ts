import { describe, expect, it, vi } from 'vitest';

import { persistEndpointSelections } from './persistEndpointSelections.js';

describe('persistEndpointSelections', () => {
    it('serializes ordered entries and tolerates blocked storage', () => {
        const storage = { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() };
        const selections = new Map([['GET /api/users', { active: false, scenarioId: 'error' }]]);
        persistEndpointSelections(storage, 'key', selections);
        expect(storage.setItem).toHaveBeenCalledWith(
            'key',
            '[["GET /api/users",{"active":false,"scenarioId":"error"}]]'
        );

        storage.setItem.mockImplementation(() => {
            throw new Error('blocked');
        });
        expect(() => persistEndpointSelections(storage, 'key', selections)).not.toThrow();
    });
});

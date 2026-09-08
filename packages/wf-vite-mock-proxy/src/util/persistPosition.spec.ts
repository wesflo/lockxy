import { describe, expect, it, vi } from 'vitest';

import { persistPosition } from './persistPosition.js';

describe('persistPosition', () => {
    it('serializes the position and tolerates blocked storage', () => {
        const storage = { getItem: vi.fn(), setItem: vi.fn() };
        persistPosition(storage, 'position', { x: 100, y: 120 });
        expect(storage.setItem).toHaveBeenCalledWith('position', '{"x":100,"y":120}');

        storage.setItem.mockImplementation(() => {
            throw new Error('blocked');
        });
        expect(() => persistPosition(storage, 'position', { x: 0, y: 0 })).not.toThrow();
    });
});

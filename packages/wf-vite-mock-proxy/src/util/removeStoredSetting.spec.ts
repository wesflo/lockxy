import { describe, expect, it, vi } from 'vitest';

import { removeStoredSetting } from './removeStoredSetting.js';

describe('removeStoredSetting', () => {
    it('removes the key and tolerates blocked storage', () => {
        const storage = { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() };
        removeStoredSetting(storage, 'key');
        expect(storage.removeItem).toHaveBeenCalledWith('key');

        storage.removeItem.mockImplementation(() => {
            throw new Error('blocked');
        });
        expect(() => removeStoredSetting(storage, 'key')).not.toThrow();
    });
});

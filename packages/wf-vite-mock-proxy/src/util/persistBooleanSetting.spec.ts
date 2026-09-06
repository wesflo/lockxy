import { describe, expect, it, vi } from 'vitest';

import { persistBooleanSetting } from './persistBooleanSetting.js';

describe('persistBooleanSetting', () => {
    it('stores booleans as strings and tolerates blocked storage', () => {
        const storage = { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() };
        persistBooleanSetting(storage, 'key', false);
        expect(storage.setItem).toHaveBeenCalledWith('key', 'false');

        storage.setItem.mockImplementation(() => { throw new Error('blocked'); });
        expect(() => persistBooleanSetting(storage, 'key', true)).not.toThrow();
    });
});

import { describe, expect, it, vi } from 'vitest';

import { restoreBooleanSetting } from './restoreBooleanSetting.js';

describe('restoreBooleanSetting', () => {
    it.each([['true', false, true], ['false', true, false], [null, true, true], ['invalid', false, false]])(
        'restores %s with fallback %s',
        (value, fallback, expected) => {
            expect(restoreBooleanSetting({ getItem: () => value, setItem: vi.fn(), removeItem: vi.fn() }, 'key', fallback))
                .toBe(expected);
        }
    );

    it('uses the fallback when storage access throws', () => {
        expect(restoreBooleanSetting({
            getItem: () => { throw new Error('blocked'); }, setItem: vi.fn(), removeItem: vi.fn()
        }, 'key', true)).toBe(true);
    });
});

import { describe, expect, it } from 'vitest';

import { updateScenarioCookie } from './updateScenarioCookie';

describe('updateScenarioCookie', () => {
    it('adds, replaces and retains endpoint selections', () => {
        expect(updateScenarioCookie('delay:short|errors:400', 'delay', 'long')).toBe('delay:long|errors:400');
    });

    it('removes only the requested endpoint without a scenario', () => {
        expect(updateScenarioCookie('delay:short|errors:400', 'delay')).toBe('errors:400');
    });

    it('keeps an explicit default file resolution selection', () => {
        expect(updateScenarioCookie('delay:short', 'delay', '')).toBe('delay:');
    });

    it('starts without an existing cookie and supports allowed id separators', () => {
        expect(updateScenarioCookie(undefined, 'Orders-V2', 'failure_500')).toBe('Orders-V2:failure_500');
    });

    it('does not change ordering when replacing one of several entries', () => {
        expect(updateScenarioCookie('first:a|second:b|third:c', 'second', 'updated')).toBe(
            'first:a|second:updated|third:c'
        );
    });

    it('sanitizes malformed entries before adding another selection', () => {
        expect(updateScenarioCookie('valid:first|invalid value:scenario|broken', 'profile', 'success')).toBe(
            'valid:first|profile:success'
        );
    });

    it('keeps other entries when the requested removal is absent', () => {
        expect(updateScenarioCookie('first:a|second:b', 'missing')).toBe('first:a|second:b');
    });
});

import { describe, expect, it } from 'vitest';

import { updateScenarioCookie } from './updateScenarioCookie';

describe('updateScenarioCookie', () => {
    it('adds, replaces and retains endpoint selections', () => {
        expect(updateScenarioCookie('delay:short|errors:400', 'delay', 'long')).toBe('delay:long|errors:400');
    });

    it('removes only the requested endpoint without a scenario', () => {
        expect(updateScenarioCookie('delay:short|errors:400', 'delay')).toBe('errors:400');
    });
});

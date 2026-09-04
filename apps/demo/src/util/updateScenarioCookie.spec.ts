import { describe, expect, it } from 'vitest';

import { updateScenarioCookie } from './updateScenarioCookie';

describe('updateScenarioCookie', () => {
    it('adds the first endpoint selection', () => {
        expect(updateScenarioCookie(undefined, 'delay', 'short')).toBe('delay:short');
    });

    it('retains selections for other endpoints', () => {
        expect(updateScenarioCookie('delay:short', 'http-errors', 'bad-request')).toBe(
            'delay:short|http-errors:bad-request'
        );
    });

    it('replaces the selection for the requested endpoint', () => {
        expect(updateScenarioCookie('delay:short|http-errors:bad-request', 'delay', 'long')).toBe(
            'delay:long|http-errors:bad-request'
        );
    });

    it('removes only the requested endpoint when no scenario is provided', () => {
        expect(updateScenarioCookie('delay:short|http-errors:bad-request', 'delay')).toBe(
            'http-errors:bad-request'
        );
    });
});

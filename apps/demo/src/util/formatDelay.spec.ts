import { describe, expect, it } from 'vitest';

import { formatDelay } from './formatDelay';

describe('formatDelay', () => {
    it('formats absent, fixed, and random delays', () => {
        expect(formatDelay(undefined)).toBe('No delay');
        expect(formatDelay(0)).toBe('No delay');
        expect(formatDelay(200)).toBe('0.2s');
        expect(formatDelay([200, 600])).toBe('0.2–0.6s');
    });
});

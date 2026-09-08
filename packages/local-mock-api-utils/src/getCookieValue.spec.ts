import { describe, expect, it } from 'vitest';

import { getCookieValue } from './getCookieValue';

describe('getCookieValue', () => {
    it('reads and decodes the requested cookie', () => {
        expect(getCookieValue('scenario', 'theme=dark; scenario=delay%3Along')).toBe('delay:long');
    });

    it('returns undefined for a missing cookie', () => {
        expect(getCookieValue('scenario', 'theme=dark')).toBeUndefined();
    });
});

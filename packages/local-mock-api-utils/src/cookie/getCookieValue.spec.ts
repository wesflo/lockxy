import { describe, expect, it } from 'vitest';

import { getCookieValue } from './getCookieValue';

describe('getCookieValue', () => {
    it('reads and decodes the requested cookie', () => {
        expect(getCookieValue('scenario', 'theme=dark; scenario=delay%3Along')).toBe('delay:long');
    });

    it('returns undefined for a missing cookie', () => {
        expect(getCookieValue('scenario', 'theme=dark')).toBeUndefined();
    });

    it('matches the full encoded cookie name', () => {
        expect(getCookieValue('mock scenario', 'mock=wrong; mock%20scenario=delay%3Along')).toBe('delay:long');
        expect(getCookieValue('scenario', 'other-scenario=wrong; scenario-extra=wrong')).toBeUndefined();
    });

    it('decodes unicode, delimiters and empty values', () => {
        expect(getCookieValue('selection', 'selection=gr%C3%BCn%3A%7C%20value')).toBe('grün:| value');
        expect(getCookieValue('selection', 'selection=')).toBe('');
    });
});

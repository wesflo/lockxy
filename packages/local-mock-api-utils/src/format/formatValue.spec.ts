import { describe, expect, it } from 'vitest';

import { formatValue } from './formatValue';

describe('formatValue', () => {
    it('formats objects for a code preview', () => {
        expect(formatValue({ ok: true })).toBe('{\n  "ok": true\n}');
    });

    it('formats errors and empty values', () => {
        expect(formatValue(new Error('failed'))).toBe('failed');
        expect(formatValue(undefined)).toBe('');
    });

    it('preserves strings and formats arrays, booleans and numbers', () => {
        expect(formatValue('plain text')).toBe('plain text');
        expect(formatValue(['one', 2])).toBe('[\n  "one",\n  2\n]');
        expect(formatValue(false)).toBe('false');
        expect(formatValue(0)).toBe('0');
    });
});

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
});

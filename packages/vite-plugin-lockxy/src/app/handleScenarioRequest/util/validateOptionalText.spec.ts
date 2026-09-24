import { describe, expect, it } from 'vitest';

import { validateOptionalText } from './validateOptionalText.js';

describe('validateOptionalText', () => {
    it('accepts omitted and non-empty text', () => {
        expect(validateOptionalText(undefined, 'manifest.label')).toEqual([]);
        expect(validateOptionalText('Profile', 'manifest.label')).toEqual([]);
    });

    it.each(['', 42, false])('rejects the invalid text value %j', (value) => {
        expect(validateOptionalText(value, 'manifest.label')).toEqual(['manifest.label: must be a non-empty string']);
    });
});

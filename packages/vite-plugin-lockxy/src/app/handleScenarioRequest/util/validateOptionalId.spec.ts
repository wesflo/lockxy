import { describe, expect, it } from 'vitest';

import { validateOptionalId } from './validateOptionalId.js';

describe('validateOptionalId', () => {
    it('accepts omitted IDs and cookie-safe characters', () => {
        expect(validateOptionalId(undefined, 'manifest.id')).toEqual([]);
        expect(validateOptionalId('profile_42-admin', 'manifest.id')).toEqual([]);
    });

    it('returns the text validation issue for an empty ID', () => {
        expect(validateOptionalId('', 'manifest.id')).toEqual(['manifest.id: must be a non-empty string']);
    });

    it('rejects IDs that cannot be stored safely in cookies', () => {
        expect(validateOptionalId('profile:admin', 'manifest.id')).toEqual([
            'manifest.id: may contain only letters, numbers, underscores, and hyphens',
        ]);
    });
});

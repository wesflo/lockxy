import { describe, expect, it } from 'vitest';

import { getManifestStorageKey } from './getManifestStorageKey.js';

describe('getManifestStorageKey', () => {
    it('namespaces a storage key by manifest ID', () => {
        expect(getManifestStorageKey('lockxy-selections', 'shopping-cart')).toBe('lockxy-selections:shopping-cart');
    });
});

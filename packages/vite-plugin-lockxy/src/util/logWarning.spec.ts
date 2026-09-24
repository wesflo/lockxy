import { describe, expect, it, vi } from 'vitest';

import { logWarning } from './logWarning.js';

describe('logWarning', () => {
    it('writes enabled warnings with the plugin prefix', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        logWarning(false, 'hidden');
        logWarning(true, 'Duplicate route');

        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenCalledWith('[lockxy] Duplicate route');
    });
});

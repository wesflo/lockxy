import { describe, expect, it, vi } from 'vitest';

import { logDebug } from './logDebug.js';

describe('logDebug', () => {
    it('writes output only when enabled', () => {
        const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
        logDebug(false, 'hidden');
        logDebug(true, 'Manifest valid');
        expect(debug).toHaveBeenCalledOnce();
        expect(debug).toHaveBeenCalledWith('[local-mock-api] Manifest valid');
    });
});

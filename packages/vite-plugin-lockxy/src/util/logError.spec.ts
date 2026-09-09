import { describe, expect, it, vi } from 'vitest';

import { logError } from './logError.js';

describe('logError', () => {
    it('logs errors with and without an original cause', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const cause = new Error('disk failed');
        logError(true, 'Manifest failed');
        logError(true, 'Manifest failed', cause);
        expect(error).toHaveBeenNthCalledWith(1, '[lockxy] Manifest failed');
        expect(error).toHaveBeenNthCalledWith(2, '[lockxy] Manifest failed', cause);
        error.mockRestore();
    });

    it('stays silent when disabled', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        logError(false, 'hidden');
        expect(error).not.toHaveBeenCalled();
    });
});

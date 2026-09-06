import { describe, expect, it, vi } from 'vitest';

import { logDebug } from './logDebug.js';
import { logError } from './logError.js';
import { logRequest } from './logRequest.js';

describe('logger', () => {
    it('logs the request fields in one line', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);

        logRequest(true, {
            method: 'GET',
            url: '/api/users',
            delay: 250,
            status: 200,
            source: 'manifest'
        });

        expect(info).toHaveBeenCalledWith(
            '[local-mock-api] GET /api/users -> 200; delay=250ms; source=manifest'
        );
    });

    it('does not log when logging is disabled', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        logError(false, 'hidden');

        expect(error).not.toHaveBeenCalled();
    });

    it('logs errors with and without an original cause', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const cause = new Error('disk failed');

        logError(true, 'Manifest failed');
        logError(true, 'Manifest failed', cause);

        expect(error).toHaveBeenNthCalledWith(1, '[local-mock-api] Manifest failed');
        expect(error).toHaveBeenNthCalledWith(2, '[local-mock-api] Manifest failed', cause);
    });

    it('writes debug output only when enabled', () => {
        const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);

        logDebug(false, 'hidden');
        logDebug(true, 'Manifest valid');

        expect(debug).toHaveBeenCalledOnce();
        expect(debug).toHaveBeenCalledWith('[local-mock-api] Manifest valid');
    });
});

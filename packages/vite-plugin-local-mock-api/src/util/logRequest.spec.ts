import { describe, expect, it, vi } from 'vitest';

import { logRequest } from './logRequest.js';

describe('logRequest', () => {
    it('logs every request field in one line when enabled', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(true, { method: 'GET', url: '/api/users', delay: 250, status: 200, source: 'manifest' });
        expect(info).toHaveBeenCalledWith('[local-mock-api] GET /api/users -> 200; delay=250ms; source=manifest');
        info.mockRestore();
    });

    it('stays silent when disabled', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(false, { method: 'GET', url: '/api/users', delay: 0, status: 200, source: 'manifest' });
        expect(info).not.toHaveBeenCalled();
    });
});

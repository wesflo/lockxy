import { afterEach, describe, expect, it, vi } from 'vitest';

import { LOG_COLORS } from '../constant.js';
import { logRequest } from './logRequest.js';

describe('logRequest', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('logs every request field in one line when enabled', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(true, { method: 'GET', url: '/api/users', delay: 250, status: 200, source: 'manifest' });
        expect(info).toHaveBeenCalledWith('[local-mock-api] GET /api/users -> 200; delay=250ms; Manifest');
    });

    it('colors the method, status, delay, and source while leaving the URL and separators unchanged', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(
            true,
            { method: 'POST', url: '/api/users', delay: 250, status: 201, source: 'convention' },
            true
        );

        expect(info).toHaveBeenCalledWith(
            `[local-mock-api] ${LOG_COLORS.success}POST${LOG_COLORS.reset} /api/users -> ` +
                `${LOG_COLORS.success}201${LOG_COLORS.reset}; ` +
                `${LOG_COLORS.warning}delay=250ms${LOG_COLORS.reset}; ` +
                `${LOG_COLORS.primary}Convention${LOG_COLORS.reset}`
        );
    });

    it.each([
        ['GET', LOG_COLORS.primary],
        ['PUT', LOG_COLORS.warning],
        ['PATCH', LOG_COLORS.purple],
        ['DELETE', LOG_COLORS.danger],
    ])('uses the configured color for %s', (method, color) => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(true, { method, url: '/api/users', delay: 0, status: 200, source: 'convention' }, true);

        expect(info).toHaveBeenCalledWith(expect.stringContaining(`${color}${method}${LOG_COLORS.reset}`));
    });

    it.each([
        [204, LOG_COLORS.success],
        [304, LOG_COLORS.primary],
        [404, LOG_COLORS.danger],
        [500, LOG_COLORS.danger],
    ])('uses the status-family color for HTTP %s', (status, color) => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(true, { method: 'GET', url: '/api/users', delay: 0, status, source: 'manifest' }, true);

        expect(info).toHaveBeenCalledWith(expect.stringContaining(`${color}${status}${LOG_COLORS.reset}`));
    });

    it('stays silent when disabled', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
        logRequest(false, { method: 'GET', url: '/api/users', delay: 0, status: 200, source: 'manifest' });
        expect(info).not.toHaveBeenCalled();
    });
});

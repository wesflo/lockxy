import type { ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    send: vi.fn(),
}));

vi.mock('./send.js', () => ({
    send: mocks.send,
}));

import { sendJson } from './sendJson.js';

describe('sendJson', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('delegates a serialized JSON response with the original content type', () => {
        const response = {} as ServerResponse;

        sendJson(response, 404, { error: 'missing' });

        expect(mocks.send).toHaveBeenCalledWith(
            response,
            404,
            { 'content-type': 'application/json; charset=utf-8' },
            '{"error":"missing"}',
            undefined
        );
    });
});

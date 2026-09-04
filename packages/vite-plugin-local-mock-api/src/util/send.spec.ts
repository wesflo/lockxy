import type { ServerResponse } from 'node:http';
import { describe, expect, it, vi } from 'vitest';

import { send } from './send.js';

describe('send', () => {
    it('writes status, every header, and the body to the response', () => {
        const setHeader = vi.fn();
        const end = vi.fn();
        const response = { statusCode: 0, setHeader, end } as unknown as ServerResponse;

        send(response, 201, { 'content-type': 'text/plain', 'content-length': '7' }, 'created');

        expect(response.statusCode).toBe(201);
        expect(setHeader).toHaveBeenNthCalledWith(1, 'content-type', 'text/plain');
        expect(setHeader).toHaveBeenNthCalledWith(2, 'content-length', '7');
        expect(end).toHaveBeenCalledWith('created');
    });
});

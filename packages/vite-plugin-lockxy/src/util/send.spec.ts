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
        expect(setHeader).toHaveBeenNthCalledWith(3, 'x-lockxy', 'true');
        expect(end).toHaveBeenCalledWith('created');
    });

    it.each([
        [204, 'GET'],
        [304, 'GET'],
        [200, 'HEAD'],
    ])('does not write a body for status %s and method %s', (status, method) => {
        const setHeader = vi.fn();
        const end = vi.fn();
        const response = { statusCode: 0, setHeader, end } as unknown as ServerResponse;

        send(response, status, { 'content-type': 'application/json', 'content-length': '2' }, '{}', method);

        expect(end).toHaveBeenCalledWith();
        if (status === 204 || status === 304) {
            expect(setHeader).toHaveBeenCalledOnce();
            expect(setHeader).toHaveBeenCalledWith('x-lockxy', 'true');
        }
    });
});

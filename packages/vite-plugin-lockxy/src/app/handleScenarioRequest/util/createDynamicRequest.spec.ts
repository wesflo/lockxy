import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { createDynamicRequest } from './createDynamicRequest.js';

describe('createDynamicRequest', () => {
    it('preserves URL, headers, and a JSON request body', async () => {
        const request = Readable.from(['{"name":"Lockxy"}']) as unknown as NodeJS.ReadableStream & {
            method?: string;
            url?: string;
            headers: Record<string, string>;
        };
        request.method = 'POST';
        request.url = '/api/foo?draft=true';
        request.headers = { host: 'localhost:5173', 'content-type': 'application/json' };

        const result = await createDynamicRequest(request as never);

        expect(result.url).toBe('http://localhost:5173/api/foo?draft=true');
        await expect(result.json()).resolves.toEqual({ name: 'Lockxy' });
    });
});

import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';

import lockxy from './index.js';

describe('dynamic manifest integration', () => {
    let directory = '';

    afterEach(async () => {
        if (directory) {
            await rm(directory, { recursive: true });
        }
    });

    it('loads a TypeScript manifest and executes endpoint handlers over HTTP', async () => {
        directory = await mkdtemp(join(tmpdir(), 'lockxy-dynamic-'));
        const mockDirectory = join(directory, 'mock');
        await mkdir(mockDirectory);
        await writeFile(join(directory, 'index.html'), '<div>Lockxy</div>');
        await writeFile(
            join(mockDirectory, 'mock.manifest.ts'),
            `export default {
                endpoints: [{
                    id: 'dynamic-user',
                    method: ['GET', 'POST'],
                    path: '/api/users/:id',
                    handler: async ({ request, params, searchParams }) => ({
                        status: request.method === 'POST' ? 201 : 200,
                        body: {
                            id: params.id,
                            query: searchParams.get('source'),
                            input: request.method === 'POST' ? await request.json() : null
                        }
                    })
                }]
            };`
        );

        const server = await createServer({
            root: directory,
            logLevel: 'silent',
            plugins: [lockxy({ mockRoot: pathToFileURL(`${mockDirectory}/`), logging: false })],
            server: { host: '127.0.0.1', port: 0 },
        });

        try {
            await server.listen();
            const address = server.httpServer?.address() as AddressInfo;
            const baseUrl = `http://127.0.0.1:${address.port}`;

            const getResponse = await fetch(`${baseUrl}/api/users/123?source=test`);
            expect(getResponse.status).toBe(200);
            await expect(getResponse.json()).resolves.toEqual({ id: '123', query: 'test', input: null });

            const postResponse = await fetch(`${baseUrl}/api/users/456`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name: 'Lockxy' }),
            });
            expect(postResponse.status).toBe(201);
            await expect(postResponse.json()).resolves.toEqual({ id: '456', query: null, input: { name: 'Lockxy' } });
        } finally {
            await server.close();
        }
    });
});

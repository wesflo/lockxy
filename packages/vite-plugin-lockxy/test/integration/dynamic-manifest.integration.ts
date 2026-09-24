import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';
import { eventually } from '../support/eventually.js';

describe('dynamic manifest behavior', () => {
    it('loads a TypeScript manifest and executes endpoint handlers over HTTP', async () => {
        const server = await createIntegrationServer({
            manifestFileName: 'mock.manifest.ts',
            manifest: `export default {
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
            };`,
        });

        const getResponse = await server.request('/api/users/123?source=test');
        expect(getResponse.status).toBe(200);
        await expect(getResponse.json()).resolves.toEqual({ id: '123', query: 'test', input: null });

        const manifestResponse = await server.request('/_lockxy/manifest');
        await expect(manifestResponse.json()).resolves.toMatchObject({
            endpoints: [{ id: 'dynamic-user', dynamic: true }],
        });

        const postResponse = await server.request('/api/users/456', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: 'Lockxy' }),
        });
        expect(postResponse.status).toBe(201);
        await expect(postResponse.json()).resolves.toEqual({ id: '456', query: null, input: { name: 'Lockxy' } });
    });

    it('reloads a TypeScript manifest when an imported module changes', async () => {
        const server = await createIntegrationServer({
            manifestFileName: 'mock.manifest.ts',
            manifest: `import { version } from './generators/version.ts';

                export default {
                    endpoints: [{
                        path: '/api/version',
                        handler: () => ({ body: { version } })
                    }]
                };`,
            files: {
                'generators/version.ts': 'export const version = 1;',
            },
        });

        await expect((await server.request('/api/version')).json()).resolves.toEqual({ version: 1 });

        await server.write('generators/version.ts', 'export const version = 2;');
        const response = await eventually(
            () => server.request('/api/version'),
            async (current) => (await current.clone().json()).version === 2
        );

        await expect(response.json()).resolves.toEqual({ version: 2 });
    });
});

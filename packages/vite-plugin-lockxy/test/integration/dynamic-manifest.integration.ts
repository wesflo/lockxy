import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';

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
});

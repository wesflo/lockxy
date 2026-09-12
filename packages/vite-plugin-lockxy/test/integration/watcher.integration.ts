import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';
import { eventually } from '../support/eventually.js';

describe('mock watcher', () => {
    it('indexes a convention file added after the server starts', async () => {
        const server = await createIntegrationServer();
        expect((await server.request('/api/later')).status).toBe(404);

        await server.write('later.json', '{"available":true}');
        const response = await eventually(
            () => server.request('/api/later'),
            (current) => current.status === 200
        );

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ available: true });
    });

    it('stops serving a convention file after it is removed', async () => {
        const server = await createIntegrationServer({ files: { 'temporary.json': '{"available":true}' } });
        expect((await server.request('/api/temporary')).status).toBe(200);

        await server.remove('temporary.json');
        const response = await eventually(
            () => server.request('/api/temporary'),
            (current) => current.status === 404
        );

        expect(response.status).toBe(404);
    });

    it('reloads manifest scenario choices after the manifest changes', async () => {
        const server = await createIntegrationServer({
            manifest: { endpoints: [{ id: 'state', path: '/api/state', file: 'first.json' }] },
            files: {
                'first.json': '{"version":1}',
                'second.json': '{"version":2}',
            },
        });
        await expect((await server.request('/api/state')).json()).resolves.toEqual({ version: 1 });

        await server.write(
            'mock.manifest.json',
            JSON.stringify({ endpoints: [{ id: 'state', path: '/api/state', file: 'second.json' }] })
        );
        const response = await eventually(
            () => server.request('/api/state'),
            async (current) => (await current.clone().json()).version === 2
        );

        await expect(response.json()).resolves.toEqual({ version: 2 });
    });
});

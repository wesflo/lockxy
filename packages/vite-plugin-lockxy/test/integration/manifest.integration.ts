import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';

describe('manifest behavior', () => {
    it('exposes a normalized manifest through the public manifest route', async () => {
        const server = await createIntegrationServer({
            manifest: {
                id: 'integration',
                endpoints: [{ method: 'GET', path: '/api/users', scenarios: [{ file: 'users.json' }] }],
            },
            files: { 'users.json': '[]' },
        });

        const response = await server.request('/_lockxy/manifest');
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toMatchObject({ id: 'integration' });
        expect(body.endpoints[0].id).toBeTruthy();
        expect(body.endpoints[0].scenarios[0]).toMatchObject({ file: 'users.json' });
        expect(body.endpoints[0].scenarios[0].id).toBeTruthy();
    });

    it('serves endpoint-level file, status and fixed delay settings', async () => {
        const server = await createIntegrationServer({
            manifest: {
                endpoints: [{ path: '/api/queued', file: 'queued.json', status: 202, delay: 20 }],
            },
            files: { 'queued.json': '{"queued":true}' },
        });
        const startedAt = performance.now();

        const response = await server.request('/api/queued');

        expect(response.status).toBe(202);
        expect(performance.now() - startedAt).toBeGreaterThanOrEqual(15);
        await expect(response.json()).resolves.toEqual({ queued: true });
    });

    it('uses the only scenario automatically without a cookie', async () => {
        const server = await createIntegrationServer({
            manifest: {
                endpoints: [
                    {
                        id: 'automatic',
                        path: '/api/automatic',
                        scenarios: [{ id: 'success', file: 'success.json', status: 201 }],
                    },
                ],
            },
            files: { 'success.json': '{"automatic":true}' },
        });

        const response = await server.request('/api/automatic');

        expect(response.status).toBe(201);
        await expect(response.json()).resolves.toEqual({ automatic: true });
    });

    it('loads a YAML manifest as the representative alternate format', async () => {
        const server = await createIntegrationServer({
            manifestFileName: 'mock.manifest.yaml',
            manifest: ['id: yaml-project', 'endpoints:', '  - path: /api/yaml', '    file: yaml.json'].join('\n'),
            files: { 'yaml.json': '{"format":"yaml"}' },
        });

        const response = await server.request('/api/yaml');

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ format: 'yaml' });
    });

    it('returns an empty manifest when no manifest exists', async () => {
        const server = await createIntegrationServer({ files: { 'health.json': '{"ok":true}' } });

        const response = await server.request('/_lockxy/manifest');

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({});
        expect((await server.request('/api/health')).status).toBe(200);
    });

    it('ignores an invalid endpoint while preserving convention fallback', async () => {
        const server = await createIntegrationServer({
            manifest: { endpoints: [{ id: 'invalid id', path: '/api/invalid' }] },
            files: { 'legacy.json': '{"fallback":true}' },
            plugin: { debug: true },
        });

        const manifestResponse = await server.request('/_lockxy/manifest');
        const conventionResponse = await server.request('/api/legacy');

        expect(manifestResponse.status).toBe(200);
        await expect(manifestResponse.json()).resolves.toEqual({ endpoints: [] });
        expect(conventionResponse.status).toBe(200);
        await expect(conventionResponse.json()).resolves.toEqual({ fallback: true });
    });
});

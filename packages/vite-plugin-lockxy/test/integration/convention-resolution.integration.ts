import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';

describe('convention resolution', () => {
    it('serves the most specific nested candidate and ignores the query string', async () => {
        const server = await createIntegrationServer({
            files: {
                'users/42.json': '{"source":"specific"}',
                'users.json': '{"source":"fallback"}',
            },
        });

        const response = await server.request('/api/users/42?expanded=true');

        expect(response.status).toBe(200);
        expect(response.headers.get('x-lockxy')).toBe('true');
        await expect(response.json()).resolves.toEqual({ source: 'specific' });
    });

    it('prefers a method-specific file over the generic response', async () => {
        const server = await createIntegrationServer({
            files: {
                'orders.json': '{"source":"generic"}',
                'POST_orders.json': '{"source":"post"}',
            },
        });

        const getResponse = await server.request('/api/orders');
        const postResponse = await server.request('/api/orders', { method: 'POST', body: '{}' });

        await expect(getResponse.json()).resolves.toEqual({ source: 'generic' });
        await expect(postResponse.json()).resolves.toEqual({ source: 'post' });
    });

    it('falls back through shorter request paths', async () => {
        const server = await createIntegrationServer({ files: { 'legacy.json': '{"fallback":true}' } });

        const response = await server.request('/api/demo/legacy/users/42');

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ fallback: true });
    });

    it('supports multiple configured prefixes', async () => {
        const server = await createIntegrationServer({
            files: { 'health.json': '{"ok":true}' },
            plugin: { requestPrefixes: ['/api/', '/internal/'] },
        });

        expect((await server.request('/api/health')).status).toBe(200);
        expect((await server.request('/internal/health')).status).toBe(200);
    });

    it('returns a mock 404 when no convention candidate exists', async () => {
        const server = await createIntegrationServer();

        const response = await server.request('/api/missing/resource');

        expect(response.status).toBe(404);
        expect(response.headers.get('x-lockxy')).toBe('true');
        await expect(response.json()).resolves.toEqual({ error: 'No local mock found for missing/resource' });
    });
});

import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';

describe('HTTP responses', () => {
    it('serves JSON and plain text with their content types', async () => {
        const server = await createIntegrationServer({
            files: {
                'profile.json': '{"name":"Ada"}',
                'readme.txt': 'Lockxy text fixture',
            },
        });

        const json = await server.request('/api/profile');
        const text = await server.request('/api/readme');

        expect(json.headers.get('content-type')).toBe('application/json; charset=utf-8');
        await expect(json.json()).resolves.toEqual({ name: 'Ada' });
        expect(text.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        await expect(text.text()).resolves.toBe('Lockxy text fixture');
    });

    it('supports one custom extension and content type', async () => {
        const server = await createIntegrationServer({
            files: { 'feed.xml': '<feed />' },
            plugin: { extensions: ['.xml'], contentTypes: { '.xml': 'application/xml; charset=utf-8' } },
        });

        const response = await server.request('/api/feed');

        expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8');
        await expect(response.text()).resolves.toBe('<feed />');
    });

    it('returns headers without a body for HEAD requests', async () => {
        const server = await createIntegrationServer({ files: { 'status.json': '{"ok":true}' } });

        const response = await server.request('/api/status', { method: 'HEAD' });

        expect(response.status).toBe(200);
        expect(response.headers.get('content-length')).toBe(String('{"ok":true}'.length));
        await expect(response.text()).resolves.toBe('');
    });

    it.each([204, 304])('returns status %s without entity headers or a body', async (status) => {
        const server = await createIntegrationServer({
            manifest: { endpoints: [{ path: '/api/empty', status }] },
        });

        const response = await server.request('/api/empty');

        expect(response.status).toBe(status);
        expect(response.headers.get('content-type')).toBeNull();
        expect(response.headers.get('content-length')).toBeNull();
        await expect(response.text()).resolves.toBe('');
    });
});

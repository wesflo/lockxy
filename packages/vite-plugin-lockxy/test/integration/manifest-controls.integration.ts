import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';

describe('manifest request controls', () => {
    it('passes every API request through when root preventMock is true', async () => {
        const server = await createIntegrationServer({
            manifest: {
                preventMock: true,
                endpoints: [{ id: 'profile', path: '/api/profile', file: 'profile.json' }],
            },
            files: { 'profile.json': '{"mocked":true}' },
        });

        const response = await server.request('/api/profile');

        expect(response.status).toBe(209);
        expect(response.headers.get('x-upstream')).toBe('true');
        expect(response.headers.get('x-lockxy')).toBeNull();
    });

    it('passes only a preventMock endpoint through', async () => {
        const server = await createIntegrationServer({
            manifest: {
                endpoints: [
                    { id: 'profile', path: '/api/profile', preventMock: true, file: 'profile.json' },
                    { id: 'orders', path: '/api/orders', file: 'orders.json' },
                ],
            },
            files: {
                'profile.json': '{"profile":true}',
                'orders.json': '{"orders":true}',
            },
        });

        const profile = await server.request('/api/profile');
        const orders = await server.request('/api/orders');

        expect(profile.status).toBe(209);
        expect(profile.headers.get('x-upstream')).toBe('true');
        expect(orders.status).toBe(200);
        await expect(orders.json()).resolves.toEqual({ orders: true });
    });

    it('uses the first active scenario before global bypass and scenario cookies', async () => {
        const server = await createIntegrationServer({
            manifest: {
                endpoints: [
                    {
                        id: 'orders',
                        path: '/api/orders',
                        scenarios: [
                            { id: 'success', active: false, file: 'success.json' },
                            { id: 'failure', active: true, file: 'failure.json', status: 500 },
                            { id: 'later', active: true, file: 'later.json', status: 503 },
                        ],
                    },
                ],
            },
            files: {
                'success.json': '{"scenario":"success"}',
                'failure.json': '{"scenario":"failure"}',
                'later.json': '{"scenario":"later"}',
            },
        });

        const response = await server.request('/api/orders', {
            headers: {
                cookie: 'lockxy-bypass=*; lockxy-scenarios=orders%3Asuccess',
            },
        });

        expect(response.status).toBe(500);
        expect(response.headers.get('x-lockxy')).toBe('true');
        await expect(response.json()).resolves.toEqual({ scenario: 'failure' });
    });

    it('passes through when active is defined but no scenario is active', async () => {
        const server = await createIntegrationServer({
            manifest: {
                endpoints: [
                    {
                        id: 'orders',
                        path: '/api/orders',
                        file: 'orders.json',
                        scenarios: [{ id: 'success', active: false, file: 'success.json' }, { id: 'fallback' }],
                    },
                ],
            },
            files: {
                'orders.json': '{"endpoint":true}',
                'success.json': '{"scenario":"success"}',
            },
        });

        const response = await server.request('/api/orders', {
            headers: { cookie: 'lockxy-scenarios=orders%3Asuccess' },
        });

        expect(response.status).toBe(209);
        expect(response.headers.get('x-upstream')).toBe('true');
    });

    it('treats false preventMock values like omitted values', async () => {
        const server = await createIntegrationServer({
            manifest: {
                preventMock: false,
                endpoints: [{ id: 'profile', path: '/api/profile', preventMock: false, file: 'profile.json' }],
            },
            files: { 'profile.json': '{"mocked":true}' },
        });

        const response = await server.request('/api/profile');

        expect(response.status).toBe(200);
        expect(response.headers.get('x-lockxy')).toBe('true');
        await expect(response.json()).resolves.toEqual({ mocked: true });
    });
});

import { describe, expect, it } from 'vitest';

import { createIntegrationServer } from '../support/createIntegrationServer.js';

const manifest = {
    endpoints: [
        {
            id: 'orders-v2',
            method: ['GET', 'POST'],
            path: '/api/orders/:orderId?',
            file: 'default.json',
            scenarios: [
                { id: 'success_a', file: 'success.json' },
                { id: 'failure-500', file: 'failure.json', status: 500 },
            ],
        },
        { id: 'profile', path: '/api/profile', file: 'profile.json' },
    ],
};

const files = {
    'default.json': '{"scenario":"default"}',
    'success.json': '{"scenario":"success"}',
    'failure.json': '{"scenario":"failure"}',
    'profile.json': '{"profile":true}',
};

describe('cookie selections', () => {
    it('selects a scenario for an endpoint containing supported ID separators', async () => {
        const server = await createIntegrationServer({ manifest, files });

        const response = await server.request('/api/orders/42', {
            headers: { cookie: 'lockxy-scenarios=orders-v2%3Afailure-500' },
        });

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({ scenario: 'failure' });
    });

    it('handles multiple endpoint and scenario entries in the same cookie header', async () => {
        const server = await createIntegrationServer({ manifest, files });
        const headers = {
            cookie: 'unrelated=value; lockxy-scenarios=profile%3Aunused%7Corders-v2%3Asuccess_a',
        };

        const response = await server.request('/api/orders', { method: 'POST', headers });

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ scenario: 'success' });
    });

    it('passes every API request through when the global bypass cookie is set', async () => {
        const server = await createIntegrationServer({ manifest, files });

        const response = await server.request('/api/profile', { headers: { cookie: 'lockxy-bypass=*' } });

        expect(response.status).toBe(209);
        expect(response.headers.get('x-upstream')).toBe('true');
        expect(response.headers.get('x-lockxy')).toBeNull();
    });

    it('bypasses only the selected endpoint when several bypass entries exist', async () => {
        const server = await createIntegrationServer({ manifest, files });
        const headers = { cookie: 'lockxy-bypass=unknown%7Corders-v2' };

        const orders = await server.request('/api/orders', { headers });
        const profile = await server.request('/api/profile', { headers });

        expect(orders.status).toBe(209);
        expect(profile.status).toBe(200);
        await expect(profile.json()).resolves.toEqual({ profile: true });
    });

    it('still mocks normally when no Lockxy cookie is present', async () => {
        const server = await createIntegrationServer({ manifest, files });

        const response = await server.request('/api/profile');

        expect(response.status).toBe(200);
        expect(response.headers.get('x-lockxy')).toBe('true');
    });
});

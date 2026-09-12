import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { describe, expect, it, vi } from 'vitest';

import type { MockApiRuntimeOptions, MockEndpoint } from '../../../interface.js';

const mocks = vi.hoisted(() => ({ logRequest: vi.fn(), send: vi.fn(), wait: vi.fn() }));
vi.mock('../../../util/logRequest.js', () => ({ logRequest: mocks.logRequest }));
vi.mock('../../../util/send.js', () => ({ send: mocks.send }));
vi.mock('./wait.js', () => ({ wait: mocks.wait }));

import { handleDynamicEndpoint } from './handleDynamicEndpoint.js';

describe('handleDynamicEndpoint', () => {
    const options = { logging: true } as MockApiRuntimeOptions;

    it('passes route, query, and body data to an endpoint handler', async () => {
        const request = Readable.from(['{"name":"Lockxy"}']) as unknown as IncomingMessage;
        request.method = 'POST';
        request.url = '/api/foo/123?details=true';
        request.headers = { host: 'localhost', 'content-type': 'application/json' };
        const handler = vi.fn(async ({ request: webRequest, params, searchParams }) => ({
            status: 201,
            body: { body: await webRequest.json(), id: params.id, details: searchParams.get('details') },
        }));
        const endpoint: MockEndpoint = { id: 'foo', path: '/api/foo/:id', handler, dynamic: true };

        await handleDynamicEndpoint(request, {} as ServerResponse, endpoint, options, '/api/foo/123');

        expect(mocks.send).toHaveBeenCalledWith(
            expect.anything(),
            201,
            expect.objectContaining({ 'content-type': 'application/json; charset=utf-8' }),
            '{"body":{"name":"Lockxy"},"id":"123","details":"true"}',
            'POST'
        );
    });

    it('wraps endpoint handler errors with request context', async () => {
        const request = Readable.from([]) as unknown as IncomingMessage;
        request.method = 'GET';
        request.url = '/api/foo';
        request.headers = {};
        const endpoint: MockEndpoint = {
            id: 'foo',
            path: '/api/foo',
            handler: () => {
                throw new Error('broken');
            },
        };

        await expect(handleDynamicEndpoint(request, {} as ServerResponse, endpoint, options, '/api/foo')).rejects.toThrow(
            'Dynamic handler failed for GET /api/foo.'
        );
    });
});

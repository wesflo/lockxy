import type { IncomingMessage } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiRuntimeOptions } from '../interface.js';

const mocks = vi.hoisted(() => ({
    findMockEndpoint: vi.fn(),
    getRequestRouteParts: vi.fn(),
    parseBypassSelections: vi.fn(),
}));

vi.mock('../app/handleScenarioRequest/util/findMockEndpoint.js', () => ({
    findMockEndpoint: mocks.findMockEndpoint,
}));

vi.mock('./getRequestRouteParts.js', () => ({
    getRequestRouteParts: mocks.getRequestRouteParts,
}));

vi.mock('./parseBypassSelections.js', () => ({
    parseBypassSelections: mocks.parseBypassSelections,
}));

import { shouldBypassMockRequest } from './shouldBypassMockRequest.js';

describe('shouldBypassMockRequest', () => {
    const options: MockApiRuntimeOptions = {
        mockRoot: new URL('file:///tmp/mocks/'),
        requestPrefixes: ['/api/'],
        extensions: ['.json'],
        contentTypes: { '.json': 'application/json' },
        manifestFileName: 'mock.manifest.json',
        debug: false,
        logging: false,
        fileIndex: new Set(),
        manifestResult: { status: 'missing' },
    };

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getRequestRouteParts.mockReturnValue(['orders']);
        mocks.parseBypassSelections.mockReturnValue({ all: false, endpointIds: new Set() });
        options.manifestResult = { status: 'missing' };
    });

    it('does not bypass requests outside the configured request prefixes', async () => {
        mocks.getRequestRouteParts.mockReturnValue(null);

        await expect(
            shouldBypassMockRequest({ url: '/app.js', headers: {} } as IncomingMessage, options)
        ).resolves.toBe(false);

        expect(mocks.parseBypassSelections).not.toHaveBeenCalled();
    });

    it('bypasses every API request for the global selection', async () => {
        mocks.parseBypassSelections.mockReturnValue({ all: true, endpointIds: new Set() });

        await expect(
            shouldBypassMockRequest(
                { url: '/api/orders?limit=10', headers: { cookie: 'bypass' } } as IncomingMessage,
                options
            )
        ).resolves.toBe(true);

        expect(mocks.findMockEndpoint).not.toHaveBeenCalled();
    });

    it('bypasses a request whose manifest endpoint id is selected', async () => {
        const endpoint = { id: 'orders' };
        mocks.parseBypassSelections.mockReturnValue({
            all: false,
            endpointIds: new Set(['orders']),
        });
        options.manifestResult = {
            status: 'valid',
            manifest: { endpoints: [] },
        };
        mocks.findMockEndpoint.mockReturnValue(endpoint);

        await expect(
            shouldBypassMockRequest(
                {
                    url: '/api/orders?limit=10',
                    method: 'GET',
                    headers: { cookie: 'bypass' },
                } as IncomingMessage,
                options
            )
        ).resolves.toBe(true);

        expect(mocks.findMockEndpoint).toHaveBeenCalledWith({ endpoints: [] }, 'GET', '/api/orders');
    });

    it('keeps mocking unselected and unknown endpoints', async () => {
        mocks.parseBypassSelections.mockReturnValue({
            all: false,
            endpointIds: new Set(['users']),
        });
        options.manifestResult = {
            status: 'valid',
            manifest: { endpoints: [] },
        };
        mocks.findMockEndpoint.mockReturnValue({ id: 'orders' });

        await expect(
            shouldBypassMockRequest({ url: '/api/orders', method: 'GET', headers: {} } as IncomingMessage, options)
        ).resolves.toBe(false);

        options.manifestResult = { status: 'missing' };

        await expect(
            shouldBypassMockRequest({ url: '/api/users', method: 'GET', headers: {} } as IncomingMessage, options)
        ).resolves.toBe(false);
    });
});

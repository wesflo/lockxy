import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ViteDevServer } from 'vite';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    handleMockRequest: vi.fn(),
    normalizeMockRoot: vi.fn(),
    defaultMockRoot: new URL('file:///default/mocks/')
}));

vi.mock('./app/handleMockRequest/index.js', () => ({
    handleMockRequest: mocks.handleMockRequest
}));

vi.mock('./constant.js', () => ({
    DEFAULT_MOCK_ROOT: mocks.defaultMockRoot
}));

vi.mock('./util/normalizeMockRoot.js', () => ({
    normalizeMockRoot: mocks.normalizeMockRoot
}));

import { mockApiPlugin } from './index.js';

type Middleware = (
    request: IncomingMessage,
    response: ServerResponse,
    next: () => void
) => Promise<void>;

describe('mockApiPlugin', () => {
    const normalizedMockRoot = new URL('file:///normalized/mocks/');

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.normalizeMockRoot.mockReturnValue(normalizedMockRoot);
    });

    it('creates the original named plugin and normalizes the default mock root', () => {
        const plugin = mockApiPlugin();

        expect(plugin.name).toBe('local-mock-api');
        expect(mocks.normalizeMockRoot).toHaveBeenCalledWith(mocks.defaultMockRoot);
        expect(typeof plugin.configureServer).toBe('function');
    });

    it('normalizes an explicitly configured mock root', () => {
        const mockRoot = new URL('file:///custom/mocks');

        mockApiPlugin({ mockRoot });

        expect(mocks.normalizeMockRoot).toHaveBeenCalledWith(mockRoot);
    });

    it('registers middleware that delegates to the isolated request handler', async () => {
        let middleware: Middleware | undefined;
        const use = vi.fn((registeredMiddleware: Middleware) => {
            middleware = registeredMiddleware;
        });
        const plugin = mockApiPlugin();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => void;
        configureServer({ middlewares: { use } } as unknown as ViteDevServer);
        const request = {} as IncomingMessage;
        const response = {} as ServerResponse;
        const next = vi.fn();

        await middleware!(request, response, next);

        expect(use).toHaveBeenCalledOnce();
        expect(mocks.handleMockRequest).toHaveBeenCalledWith(request, response, next, normalizedMockRoot);
    });
});

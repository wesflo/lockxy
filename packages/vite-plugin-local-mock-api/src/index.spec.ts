import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ResolvedConfig, ViteDevServer } from 'vite';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    buildMockFileIndex: vi.fn(),
    handleMockRequest: vi.fn(),
    handleScenarioRequest: vi.fn(),
    normalizeMockRoot: vi.fn(),
    readMockManifest: vi.fn(),
    registerMockWatcher: vi.fn(),
    shouldBypassMockRequest: vi.fn(),
    defaultMockRoot: new URL('file:///default/mocks/'),
}));

vi.mock('./app/handleMockRequest/index.js', () => ({
    handleMockRequest: mocks.handleMockRequest,
}));

vi.mock('./app/handleScenarioRequest/index.js', () => ({
    handleScenarioRequest: mocks.handleScenarioRequest,
}));

vi.mock('./app/handleScenarioRequest/util/readMockManifest.js', () => ({
    readMockManifest: mocks.readMockManifest,
}));

vi.mock('./constant.js', () => ({
    CONTENT_TYPES: { '.json': 'application/json' },
    DEFAULT_MOCK_ROOT: mocks.defaultMockRoot,
    EXTENSIONS: ['.json'],
    DEBUG: false,
    REQUEST_PREFIXES: ['/api/'],
    MANIFEST_FILE_NAME: 'mock.manifest.json',
    LOGGING: true,
}));

vi.mock('./util/normalizeMockRoot.js', () => ({
    normalizeMockRoot: mocks.normalizeMockRoot,
}));

vi.mock('./util/buildMockFileIndex.js', () => ({
    buildMockFileIndex: mocks.buildMockFileIndex,
}));

vi.mock('./util/registerMockWatcher.js', () => ({
    registerMockWatcher: mocks.registerMockWatcher,
}));

vi.mock('./util/shouldBypassMockRequest.js', () => ({
    shouldBypassMockRequest: mocks.shouldBypassMockRequest,
}));

import { mockApiPlugin } from './index.js';

type Middleware = (request: IncomingMessage, response: ServerResponse, next: () => void) => Promise<void>;

describe('mockApiPlugin', () => {
    const normalizedMockRoot = new URL('file:///normalized/mocks/');

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.normalizeMockRoot.mockReturnValue(normalizedMockRoot);
        mocks.buildMockFileIndex.mockResolvedValue(new Set(['orders.json']));
        mocks.readMockManifest.mockResolvedValue({ status: 'missing' });
        mocks.handleScenarioRequest.mockResolvedValue(false);
        mocks.shouldBypassMockRequest.mockResolvedValue(false);
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

    it('extends the default extensions and content types with configured values', async () => {
        let middleware: Middleware | undefined;
        const use = vi.fn((registeredMiddleware: Middleware) => {
            middleware = registeredMiddleware;
        });
        const plugin = mockApiPlugin({
            requestPrefixes: '/custom-api/',
            extensions: ['.xml'],
            contentTypes: { '.xml': 'application/xml' },
            manifestFileName: 'custom.manifest.json',
        });
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;
        await configureServer({ middlewares: { use } } as unknown as ViteDevServer);

        await middleware!({} as IncomingMessage, {} as ServerResponse, vi.fn());

        expect(mocks.handleScenarioRequest).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.objectContaining({
                requestPrefixes: ['/custom-api/'],
                extensions: ['.json', '.xml'],
                contentTypes: {
                    '.json': 'application/json',
                    '.xml': 'application/xml',
                },
                manifestFileName: 'custom.manifest.json',
            })
        );
    });

    it('registers middleware that delegates to the isolated request handler', async () => {
        let middleware: Middleware | undefined;
        const use = vi.fn((registeredMiddleware: Middleware) => {
            middleware = registeredMiddleware;
        });
        const plugin = mockApiPlugin();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;
        await configureServer({ middlewares: { use } } as unknown as ViteDevServer);
        const request = {} as IncomingMessage;
        const response = {} as ServerResponse;
        const next = vi.fn();

        await middleware!(request, response, next);

        expect(use).toHaveBeenCalledOnce();
        expect(mocks.handleMockRequest).toHaveBeenCalledWith(request, response, next, {
            mockRoot: normalizedMockRoot,
            requestPrefixes: ['/api/'],
            extensions: ['.json'],
            contentTypes: { '.json': 'application/json' },
            manifestFileName: 'mock.manifest.json',
            debug: false,
            logging: true,
            fileIndex: new Set(['orders.json']),
            manifestResult: { status: 'missing' },
        });
    });

    it('passes bypassed requests directly to the next middleware', async () => {
        let middleware: Middleware | undefined;
        const use = vi.fn((registeredMiddleware: Middleware) => {
            middleware = registeredMiddleware;
        });
        const plugin = mockApiPlugin();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;
        await configureServer({ middlewares: { use } } as unknown as ViteDevServer);
        const request = {} as IncomingMessage;
        const response = { once: vi.fn() } as unknown as ServerResponse;
        const next = vi.fn();
        mocks.shouldBypassMockRequest.mockResolvedValue(true);

        await middleware!(request, response, next);

        expect(next).toHaveBeenCalledOnce();
        expect(mocks.handleScenarioRequest).not.toHaveBeenCalled();
        expect(mocks.handleMockRequest).not.toHaveBeenCalled();
    });

    it.each([
        ['build', 'production'],
        ['serve', 'production'],
    ])('warns and refuses middleware for command %s in mode %s', async (command, mode) => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const use = vi.fn();
        const plugin = mockApiPlugin();
        const configResolved = plugin.configResolved as (config: ResolvedConfig) => void;
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;

        configResolved({ command, mode } as ResolvedConfig);
        await configureServer({ middlewares: { use } } as unknown as ViteDevServer);

        expect(warning).toHaveBeenCalledWith(expect.stringContaining('SAFETY WARNING'));
        expect(use).not.toHaveBeenCalled();
    });
});

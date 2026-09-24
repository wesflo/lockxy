import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ResolvedConfig, ViteDevServer } from 'vite';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    buildMockFileIndex: vi.fn(),
    handleMockRequest: vi.fn(),
    handleScenarioRequest: vi.fn(),
    logManifestRouteWarnings: vi.fn(),
    normalizeMockRoot: vi.fn(),
    readMockManifest: vi.fn(),
    registerMockWatcher: vi.fn(),
    shouldBypassMockRequest: vi.fn(),
    waitForMockUpdates: vi.fn(),
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
    EXTENSIONS: ['.json'],
    DEBUG: false,
    REQUEST_PREFIXES: ['/api/'],
    MANIFEST_FILE_NAME: 'mock.manifest',
    MANIFEST_FILE_EXTENSIONS: ['.json', '.yaml', '.yml', '.ts', '.js'],
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

vi.mock('./util/logManifestRouteWarnings.js', () => ({
    logManifestRouteWarnings: mocks.logManifestRouteWarnings,
}));

vi.mock('./util/shouldBypassMockRequest.js', () => ({
    shouldBypassMockRequest: mocks.shouldBypassMockRequest,
}));

import lockxy, { defineDynamicManifest, lockxy as namedLockxy } from './index.js';

type Middleware = (request: IncomingMessage, response: ServerResponse, next: () => void) => Promise<void>;

describe('lockxy', () => {
    const normalizedMockRoot = new URL('file:///normalized/mocks/');

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.normalizeMockRoot.mockReturnValue(normalizedMockRoot);
        mocks.buildMockFileIndex.mockResolvedValue(new Set(['orders.json']));
        mocks.readMockManifest.mockResolvedValue({ status: 'missing' });
        mocks.registerMockWatcher.mockReturnValue({ waitForIdle: mocks.waitForMockUpdates });
        mocks.handleScenarioRequest.mockResolvedValue(false);
        mocks.shouldBypassMockRequest.mockResolvedValue(false);
        mocks.waitForMockUpdates.mockResolvedValue(undefined);
    });

    it('exports the plugin factory as both the default and named export', () => {
        expect(lockxy).toBe(namedLockxy);
    });

    it('keeps dynamic manifests unchanged for typed authoring', () => {
        const manifest = { endpoints: [{ path: '/api/foo', handler: vi.fn() }] };

        expect(defineDynamicManifest(manifest)).toBe(manifest);
    });

    it('creates the plugin and prepares the default mock root', () => {
        const plugin = lockxy();

        expect(plugin.name).toBe('lockxy');
        expect(mocks.normalizeMockRoot).toHaveBeenCalledWith(undefined);
        expect(typeof plugin.configureServer).toBe('function');
    });

    it('resolves the default mock root from the Vite project root', () => {
        const plugin = lockxy();
        const configResolved = plugin.configResolved as (config: ResolvedConfig) => void;

        configResolved({ command: 'serve', mode: 'development', root: '/projects/application' } as ResolvedConfig);

        expect(mocks.normalizeMockRoot).toHaveBeenLastCalledWith(undefined, '/projects/application');
    });

    it('normalizes an explicitly configured mock root', () => {
        const mockRoot = new URL('file:///custom/mocks');

        lockxy({ mockRoot });

        expect(mocks.normalizeMockRoot).toHaveBeenCalledWith(mockRoot);
    });

    it('extends the default extensions and content types with configured values', async () => {
        let middleware: Middleware | undefined;
        const use = vi.fn((registeredMiddleware: Middleware) => {
            middleware = registeredMiddleware;
        });
        const plugin = lockxy({
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
        const plugin = lockxy();
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
            manifestFileName: 'mock.manifest',
            debug: false,
            logging: true,
            fileIndex: new Set(['orders.json']),
            loadManifestModule: expect.any(Function),
            manifestResult: { status: 'missing' },
        });
    });

    it('discovers the highest-priority indexed manifest from the default basename', async () => {
        mocks.buildMockFileIndex.mockResolvedValue(
            new Set(['mock.manifest.yml', 'mock.manifest.yaml', 'mock.manifest.json'])
        );
        const plugin = lockxy();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;

        await configureServer({ middlewares: { use: vi.fn() } } as unknown as ViteDevServer);

        expect(mocks.readMockManifest).toHaveBeenCalledWith(
            normalizedMockRoot,
            'mock.manifest.json',
            false,
            expect.any(Function)
        );
        expect(mocks.logManifestRouteWarnings).toHaveBeenCalledWith(
            true,
            'mock.manifest.json',
            expect.objectContaining({ status: 'missing' }),
            false
        );
    });

    it('loads dynamic manifests through Vite with a fresh cache-busting URL', async () => {
        const ssrLoadModule = vi.fn().mockResolvedValue({ default: {} });
        const plugin = lockxy();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;

        await configureServer({
            middlewares: { use: vi.fn() },
            ssrLoadModule,
        } as unknown as ViteDevServer);

        const runtime = mocks.registerMockWatcher.mock.calls[0]?.[1];
        await runtime.loadManifestModule('mock.manifest.ts');
        await runtime.loadManifestModule('mock.manifest.ts');

        expect(ssrLoadModule).toHaveBeenNthCalledWith(1, '/@fs//normalized/mocks/mock.manifest.ts?lockxy=1');
        expect(ssrLoadModule).toHaveBeenNthCalledWith(2, '/@fs//normalized/mocks/mock.manifest.ts?lockxy=2');
    });

    it('waits for mock updates before Vite continues hot updates', async () => {
        let releaseUpdate!: () => void;
        mocks.waitForMockUpdates.mockReturnValue(
            new Promise<void>((resolve) => {
                releaseUpdate = resolve;
            })
        );
        const plugin = lockxy();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;
        const hotUpdate = plugin.hotUpdate as () => Promise<void>;
        await configureServer({ middlewares: { use: vi.fn() } } as unknown as ViteDevServer);

        let completed = false;
        const update = hotUpdate().then(() => {
            completed = true;
        });
        await Promise.resolve();

        expect(completed).toBe(false);
        releaseUpdate();
        await update;
        expect(completed).toBe(true);
    });

    it('waits for mock updates before handling a request', async () => {
        let middleware: Middleware | undefined;
        let releaseUpdate!: () => void;
        mocks.waitForMockUpdates.mockReturnValue(
            new Promise<void>((resolve) => {
                releaseUpdate = resolve;
            })
        );
        const plugin = lockxy();
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;
        await configureServer({
            middlewares: {
                use: vi.fn((registeredMiddleware: Middleware) => {
                    middleware = registeredMiddleware;
                }),
            },
        } as unknown as ViteDevServer);

        const request = middleware!({} as IncomingMessage, {} as ServerResponse, vi.fn());
        await Promise.resolve();

        expect(mocks.shouldBypassMockRequest).not.toHaveBeenCalled();
        expect(mocks.handleScenarioRequest).not.toHaveBeenCalled();
        releaseUpdate();
        await request;
        expect(mocks.shouldBypassMockRequest).toHaveBeenCalledOnce();
    });

    it('passes bypassed requests directly to the next middleware', async () => {
        let middleware: Middleware | undefined;
        const use = vi.fn((registeredMiddleware: Middleware) => {
            middleware = registeredMiddleware;
        });
        const plugin = lockxy();
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
        const plugin = lockxy();
        const configResolved = plugin.configResolved as (config: ResolvedConfig) => void;
        const configureServer = plugin.configureServer as (server: ViteDevServer) => Promise<void>;

        configResolved({ command, mode } as ResolvedConfig);
        await configureServer({ middlewares: { use } } as unknown as ViteDevServer);

        expect(warning).toHaveBeenCalledWith(expect.stringContaining('SAFETY WARNING'));
        expect(use).not.toHaveBeenCalled();
    });
});

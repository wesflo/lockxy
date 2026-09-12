import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer, type Plugin, type ViteDevServer } from 'vite';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { afterEach } from 'vitest';

import lockxy from '../../src/index.js';
import type { MockApiPluginOptions, MockManifest } from '../../src/interface.js';

type FixtureContent = string | Uint8Array;

interface IntegrationServerOptions {
    files?: Readonly<Record<string, FixtureContent>>;
    manifest?: MockManifest | string;
    manifestFileName?: string;
    plugin?: Omit<MockApiPluginOptions, 'mockRoot' | 'manifestFileName'>;
}

export interface IntegrationServer {
    mockRoot: string;
    request(path: string, init?: RequestInit): Promise<Response>;
    remove(relativePath: string): Promise<void>;
    write(relativePath: string, content: FixtureContent): Promise<void>;
}

interface RunningServer {
    directory: string;
    server: ViteDevServer;
}

const runningServers = new Set<RunningServer>();

const upstreamPlugin: Plugin = {
    name: 'lockxy-integration-upstream',
    configureServer(server) {
        server.middlewares.use((request, response, next) => {
            if (!request.url?.startsWith('/api/')) {
                next();
                return;
            }

            response.statusCode = 209;
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.setHeader('x-upstream', 'true');
            response.end(JSON.stringify({ source: 'upstream', url: request.url }));
        });
    },
};

const writeFixture = async (mockRoot: string, relativePath: string, content: FixtureContent): Promise<void> => {
    const target = join(mockRoot, relativePath);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
};

export const createIntegrationServer = async ({
    files = {},
    manifest,
    manifestFileName = 'mock.manifest.json',
    plugin = {},
}: IntegrationServerOptions = {}): Promise<IntegrationServer> => {
    const directory = await mkdtemp(join(tmpdir(), 'lockxy-integration-'));
    const mockRoot = join(directory, 'mock');
    await mkdir(mockRoot, { recursive: true });
    await writeFile(join(directory, 'index.html'), '<!doctype html><title>Lockxy integration test</title>');

    for (const [relativePath, content] of Object.entries(files)) {
        await writeFixture(mockRoot, relativePath, content);
    }

    if (manifest !== undefined) {
        await writeFixture(
            mockRoot,
            manifestFileName,
            typeof manifest === 'string' ? manifest : JSON.stringify(manifest)
        );
    }

    const server = await createServer({
        configFile: false,
        logLevel: 'silent',
        root: directory,
        plugins: [
            lockxy({
                ...plugin,
                logging: false,
                mockRoot: pathToFileURL(`${mockRoot}/`),
                manifestFileName,
            }),
            upstreamPlugin,
        ],
        server: {
            host: '127.0.0.1',
            port: 0,
            strictPort: false,
        },
    });

    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === 'string') {
        throw new TypeError('The integration server did not expose a TCP port.');
    }

    runningServers.add({ directory, server });
    const baseUrl = `http://127.0.0.1:${address.port}`;

    return {
        mockRoot,
        request: (path, init) => fetch(`${baseUrl}${path}`, init),
        remove: (relativePath) => rm(join(mockRoot, relativePath), { force: true, recursive: true }),
        write: (relativePath, content) => writeFixture(mockRoot, relativePath, content),
    };
};

afterEach(async () => {
    const servers = [...runningServers];
    runningServers.clear();
    await Promise.all(servers.map(({ server }) => server.close()));
    await Promise.all(servers.map(({ directory }) => rm(directory, { force: true, recursive: true })));
});

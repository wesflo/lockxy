import type { ViteDevServer } from 'vite';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiRuntimeOptions } from '../interface.js';

const mocks = vi.hoisted(() => ({
    buildMockFileIndex: vi.fn(),
    logError: vi.fn(),
    readMockManifest: vi.fn(),
}));

vi.mock('./buildMockFileIndex.js', () => ({ buildMockFileIndex: mocks.buildMockFileIndex }));
vi.mock('./logError.js', () => ({ logError: mocks.logError }));
vi.mock('../app/handleScenarioRequest/util/readMockManifest.js', () => ({
    readMockManifest: mocks.readMockManifest,
}));

import { registerMockWatcher } from './registerMockWatcher.js';

describe('registerMockWatcher', () => {
    const runtime: MockApiRuntimeOptions = {
        mockRoot: new URL('file:///tmp/outside-src/mock/'),
        requestPrefixes: ['/api/'],
        extensions: ['.json'],
        contentTypes: {},
        manifestFileName: 'mock.manifest.json',
        debug: true,
        logging: true,
        fileIndex: new Set(['users.json']),
        manifestResult: { status: 'missing' },
    };
    let onAll: (eventName: string, changedPath: string) => Promise<void> | undefined;
    let watcher: ViteDevServer['watcher'];

    beforeEach(() => {
        vi.resetAllMocks();
        runtime.fileIndex = new Set(['users.json']);
        runtime.manifestResult = { status: 'missing' };
        watcher = {
            add: vi.fn(),
            on: vi.fn((eventName: string, callback: typeof onAll) => {
                if (eventName === 'all') {
                    onAll = callback;
                }
                return watcher;
            }),
        } as unknown as ViteDevServer['watcher'];
        mocks.buildMockFileIndex.mockResolvedValue(new Set(['users.json', 'orders.json']));
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { delay: 200 } });
    });

    it('explicitly adds a mock root outside src to the Vite watcher', () => {
        registerMockWatcher(watcher, runtime);

        expect(watcher.add).toHaveBeenCalledWith('/tmp/outside-src/mock');
    });

    it('rebuilds the file index and reloads the manifest after structural changes', async () => {
        registerMockWatcher(watcher, runtime);

        await onAll('add', '/tmp/outside-src/mock/orders.json');

        expect(runtime.fileIndex).toEqual(new Set(['users.json', 'orders.json']));
        expect(runtime.manifestResult).toEqual({ status: 'valid', manifest: { delay: 200 } });
    });

    it('reloads only the manifest when its contents change', async () => {
        registerMockWatcher(watcher, runtime);

        await onAll('change', '/tmp/outside-src/mock/mock.manifest.json');

        expect(mocks.buildMockFileIndex).not.toHaveBeenCalled();
        expect(mocks.readMockManifest).toHaveBeenCalledWith(runtime.mockRoot, 'mock.manifest.json', true);
    });

    it('selects a newly added JSON manifest before an existing YAML manifest', async () => {
        runtime.manifestFileName = 'mock.manifest';
        runtime.fileIndex = new Set(['mock.manifest.yaml']);
        mocks.buildMockFileIndex.mockResolvedValue(new Set(['mock.manifest.yaml', 'mock.manifest.json']));
        registerMockWatcher(watcher, runtime);

        await onAll('add', '/tmp/outside-src/mock/mock.manifest.json');

        expect(mocks.readMockManifest).toHaveBeenCalledWith(runtime.mockRoot, 'mock.manifest.json', true);
    });

    it('falls back to YAML when the preferred JSON manifest is removed', async () => {
        runtime.manifestFileName = 'mock.manifest';
        runtime.fileIndex = new Set(['mock.manifest.json', 'mock.manifest.yaml']);
        mocks.buildMockFileIndex.mockResolvedValue(new Set(['mock.manifest.yaml']));
        registerMockWatcher(watcher, runtime);

        await onAll('unlink', '/tmp/outside-src/mock/mock.manifest.json');

        expect(mocks.readMockManifest).toHaveBeenCalledWith(runtime.mockRoot, 'mock.manifest.yaml', true);
    });

    it('ignores content changes because file contents are not cached', async () => {
        registerMockWatcher(watcher, runtime);

        await onAll('change', '/tmp/outside-src/mock/users.json');

        expect(mocks.buildMockFileIndex).not.toHaveBeenCalled();
        expect(mocks.readMockManifest).not.toHaveBeenCalled();
    });

    it('ignores watcher events outside the mock root', async () => {
        registerMockWatcher(watcher, runtime);

        await onAll('add', '/tmp/outside-src/application.ts');

        expect(mocks.buildMockFileIndex).not.toHaveBeenCalled();
        expect(mocks.readMockManifest).not.toHaveBeenCalled();
    });
});

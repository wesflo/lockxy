import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ViteDevServer } from 'vite';

import { FILE_INDEX_EVENTS } from '../constant.js';
import type { MockApiRuntimeOptions } from '../interface.js';
import { readMockManifest } from '../app/handleScenarioRequest/util/readMockManifest.js';
import { resolveManifestFileName } from '../app/handleScenarioRequest/util/resolveManifestFileName.js';
import { buildMockFileIndex } from './buildMockFileIndex.js';
import { logError } from './logError.js';

export const registerMockWatcher = (watcher: ViteDevServer['watcher'], runtime: MockApiRuntimeOptions): void => {
    const mockRootPath = resolve(fileURLToPath(runtime.mockRoot));
    let updateQueue = Promise.resolve();

    watcher.add(mockRootPath);
    watcher.on('all', (eventName, changedPath) => {
        const absoluteChangedPath = resolve(changedPath);
        const relativePath = relative(mockRootPath, absoluteChangedPath);
        const isInsideMockRoot = relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath));
        const fileIndexChanged = FILE_INDEX_EVENTS.has(eventName);
        const currentManifestFileName = resolveManifestFileName(runtime.manifestFileName, runtime.fileIndex);
        const manifestPath = resolve(mockRootPath, currentManifestFileName);
        const manifestChanged = absoluteChangedPath === manifestPath;

        if (!isInsideMockRoot || (!fileIndexChanged && !manifestChanged)) {
            return;
        }

        updateQueue = updateQueue
            .then(async () => {
                if (fileIndexChanged) {
                    runtime.fileIndex = await buildMockFileIndex(runtime.mockRoot);
                }

                const manifestFileName = resolveManifestFileName(runtime.manifestFileName, runtime.fileIndex);
                runtime.manifestResult = await readMockManifest(
                    runtime.mockRoot,
                    manifestFileName,
                    runtime.debug
                );
            })
            .catch((error) => logError(runtime.logging, 'Failed to refresh the mock runtime state.', error));

        return updateQueue;
    });
};

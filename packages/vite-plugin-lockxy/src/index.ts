import type { Plugin } from 'vite';
import {
    BYPASS_ALL_VALUE as BYPASS_ALL,
    BYPASS_COOKIE_NAME as BYPASS_COOKIE,
    MANIFEST_ROUTE as MANIFEST_PATH,
    SCENARIO_COOKIE_NAME as SCENARIO_COOKIE,
} from '@wesflo/local-mock-api-utils';

import { handleMockRequest } from './app/handleMockRequest/index.js';
import { handleScenarioRequest } from './app/handleScenarioRequest/index.js';
import { readMockManifest } from './app/handleScenarioRequest/util/readMockManifest.js';
import { resolveManifestFileName } from './app/handleScenarioRequest/util/resolveManifestFileName.js';
import { CONTENT_TYPES, EXTENSIONS, DEBUG, REQUEST_PREFIXES, MANIFEST_FILE_NAME, LOGGING } from './constant.js';
import type { MockApiPluginOptions, MockApiRuntimeOptions, ResolvedMockApiPluginOptions } from './interface.js';
import { buildMockFileIndex } from './util/buildMockFileIndex.js';
import { logError } from './util/logError.js';
import { logRequest } from './util/logRequest.js';
import { normalizeMockRoot } from './util/normalizeMockRoot.js';
import { normalizeRequestPrefixes } from './util/normalizeRequestPrefixes.js';
import { registerMockWatcher } from './util/registerMockWatcher.js';
import { sendJson } from './util/sendJson.js';
import { shouldBypassMockRequest } from './util/shouldBypassMockRequest.js';

export const BYPASS_ALL_VALUE = BYPASS_ALL;
export const BYPASS_COOKIE_NAME = BYPASS_COOKIE;
export const MANIFEST_ROUTE = MANIFEST_PATH;
export const SCENARIO_COOKIE_NAME = SCENARIO_COOKIE;

export const lockxy = ({
    mockRoot,
    requestPrefixes = REQUEST_PREFIXES,
    extensions = [],
    contentTypes = {},
    manifestFileName = MANIFEST_FILE_NAME,
    debug = DEBUG,
    logging = LOGGING,
}: MockApiPluginOptions = {}): Plugin => {
    let developmentServer = true;
    const options: ResolvedMockApiPluginOptions = {
        mockRoot: normalizeMockRoot(mockRoot),
        requestPrefixes: normalizeRequestPrefixes(requestPrefixes),
        extensions: [...EXTENSIONS, ...extensions],
        contentTypes: { ...CONTENT_TYPES, ...contentTypes },
        manifestFileName,
        debug,
        logging,
    };

    return {
        name: 'lockxy',

        configResolved: (config) => {
            developmentServer = config.command === 'serve' && config.mode !== 'production';
            if (!mockRoot) {
                options.mockRoot = normalizeMockRoot(undefined, config.root);
            }
            if (!developmentServer) {
                console.warn(
                    '[lockxy] SAFETY WARNING: the mock API plugin was included in a production build or mode. ' +
                        'Mock middleware is disabled; include this plugin only in development configuration.'
                );
            }
        },

        configureServer: async (server) => {
            if (!developmentServer) {
                return;
            }

            const fileIndex = await buildMockFileIndex(options.mockRoot);
            const manifestFileName = resolveManifestFileName(options.manifestFileName, fileIndex);
            const runtimeOptions: MockApiRuntimeOptions = {
                ...options,
                fileIndex,
                manifestResult: await readMockManifest(options.mockRoot, manifestFileName, options.debug),
            };
            registerMockWatcher(server.watcher, runtimeOptions);

            server.middlewares.use(async (req, res, next) => {
                try {
                    if (await shouldBypassMockRequest(req, runtimeOptions)) {
                        res.once('finish', () => {
                            logRequest(runtimeOptions.logging, {
                                method: req.method ?? 'GET',
                                url: req.url ?? '',
                                delay: 0,
                                status: res.statusCode,
                                source: 'passthrough',
                            });
                        });
                        next();
                        return;
                    }

                    const handled = await handleScenarioRequest(req, res, runtimeOptions);

                    if (!handled) {
                        await handleMockRequest(req, res, next, runtimeOptions);
                    }
                } catch (error) {
                    logError(
                        runtimeOptions.logging,
                        `Unexpected error while handling ${req.method ?? 'GET'} ${req.url ?? ''}.`,
                        error
                    );
                    if (!res.headersSent) {
                        sendJson(res, 500, { error: 'The local mock API failed to handle this request.' }, req.method);
                    } else {
                        res.end();
                    }
                    logRequest(runtimeOptions.logging, {
                        method: req.method ?? 'GET',
                        url: req.url ?? '',
                        delay: 0,
                        status: res.statusCode || 500,
                        source: 'error',
                    });
                }
            });
        },
    };
};

export default lockxy;

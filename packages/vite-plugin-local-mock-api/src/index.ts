import type { Plugin } from 'vite';

import { handleMockRequest } from './app/handleMockRequest/index.js';
import { handleScenarioRequest } from './app/handleScenarioRequest/index.js';
import { DEFAULT_MOCK_ROOT } from './constant.js';
import type { MockApiPluginOptions } from './interface.js';
import { normalizeMockRoot } from './util/normalizeMockRoot.js';

export const mockApiPlugin = ({ mockRoot = DEFAULT_MOCK_ROOT }: MockApiPluginOptions = {}): Plugin => {
    const normalizedMockRoot = normalizeMockRoot(mockRoot);

    return {
        name: 'local-mock-api',

        configureServer: (server) => {
            server.middlewares.use(async (req, res, next) => {
                const handled = await handleScenarioRequest(req, res, normalizedMockRoot);

                if (!handled) {
                    await handleMockRequest(req, res, next, normalizedMockRoot);
                }
            });
        }
    };
};

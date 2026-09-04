import type { Plugin } from 'vite';

import { handleMockRequest } from './app/handleMockRequest/index.js';
import { handleScenarioRequest } from './app/handleScenarioRequest/index.js';
import {
    CONTENT_TYPES,
    DEFAULT_MOCK_ROOT,
    EXTENSIONS,
    INTERNAL_PREFIX,
    MANIFEST_FILE_NAME
} from './constant.js';
import type { MockApiPluginOptions } from './interface.js';
import { normalizeMockRoot } from './util/normalizeMockRoot.js';
import { shouldBypassMockRequest } from './util/shouldBypassMockRequest.js';

export { BYPASS_ALL_VALUE, BYPASS_COOKIE_NAME, MANIFEST_ROUTE, SCENARIO_COOKIE_NAME } from '@wesflo/local-mock-api-utils';

export const mockApiPlugin = ({
    mockRoot = DEFAULT_MOCK_ROOT,
    internalPrefix = INTERNAL_PREFIX,
    extensions = [],
    contentTypes = {},
    manifestFileName = MANIFEST_FILE_NAME
}: MockApiPluginOptions = {}): Plugin => {
    const options: Required<MockApiPluginOptions> = {
        mockRoot: normalizeMockRoot(mockRoot),
        internalPrefix,
        extensions: [...EXTENSIONS, ...extensions],
        contentTypes: { ...CONTENT_TYPES, ...contentTypes },
        manifestFileName
    };

    return {
        name: 'local-mock-api',

        configureServer: (server) => {
            server.middlewares.use(async (req, res, next) => {
                if (await shouldBypassMockRequest(req, options)) {
                    next();
                    return;
                }

                const handled = await handleScenarioRequest(req, res, options);

                if (!handled) {
                    await handleMockRequest(req, res, next, options);
                }
            });
        }
    };
};

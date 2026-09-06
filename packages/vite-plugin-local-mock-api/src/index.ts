import type { Plugin } from 'vite';
import {
    BYPASS_ALL_VALUE as BYPASS_ALL,
    BYPASS_COOKIE_NAME as BYPASS_COOKIE,
    MANIFEST_ROUTE as MANIFEST_PATH,
    SCENARIO_COOKIE_NAME as SCENARIO_COOKIE
} from '@wesflo/local-mock-api-utils';

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

export const BYPASS_ALL_VALUE = BYPASS_ALL;
export const BYPASS_COOKIE_NAME = BYPASS_COOKIE;
export const MANIFEST_ROUTE = MANIFEST_PATH;
export const SCENARIO_COOKIE_NAME = SCENARIO_COOKIE;

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

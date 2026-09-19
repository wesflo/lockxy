import type { IncomingMessage } from 'node:http';

import type { MockApiRuntimeOptions, MockEndpoint } from '../interface.js';
import { findMockEndpoint } from '../app/handleScenarioRequest/util/findMockEndpoint.js';
import { getRequestRouteParts } from './getRequestRouteParts.js';
import { logError } from './logError.js';
import { parseBypassSelections } from './parseBypassSelections.js';

export const shouldBypassMockRequest = async (
    req: IncomingMessage,
    options: MockApiRuntimeOptions
): Promise<boolean> => {
    if (!req.url || !getRequestRouteParts(req.url, options.requestPrefixes)) {
        return false;
    }

    const manifestResult = options.manifestResult;

    if (manifestResult.status === 'invalid') {
        logError(options.logging, `Failed to read mock manifest: ${manifestResult.error.message}`);
    }

    let endpoint: MockEndpoint | undefined;
    if (manifestResult.status === 'valid') {
        if (manifestResult.manifest.preventMock === true) {
            return true;
        }

        const { pathname } = new URL(req.url, 'http://localhost');
        endpoint = findMockEndpoint(manifestResult.manifest, req.method, pathname);

        if (endpoint?.preventMock === true) {
            return true;
        }

        const scenarios = endpoint?.scenarios ?? [];
        if (scenarios.some((scenario) => scenario.active !== undefined)) {
            return !scenarios.some((scenario) => scenario.active === true);
        }
    }

    const selections = parseBypassSelections(req.headers.cookie, (message) => logError(options.logging, message));

    if (selections.all) {
        return true;
    }

    return endpoint?.id ? selections.endpointIds.has(endpoint.id) : false;
};

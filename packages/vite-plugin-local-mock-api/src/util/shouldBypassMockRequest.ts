import type { IncomingMessage } from 'node:http';

import type { MockApiPluginOptions } from '../interface.js';
import { findMockEndpoint } from '../app/handleScenarioRequest/util/findMockEndpoint.js';
import { readMockManifest } from '../app/handleScenarioRequest/util/readMockManifest.js';
import { getInternalRouteParts } from './getInternalRouteParts.js';
import { logError } from './logError.js';
import { parseBypassSelections } from './parseBypassSelections.js';

export const shouldBypassMockRequest = async (
    req: IncomingMessage,
    options: Required<MockApiPluginOptions>
): Promise<boolean> => {
    if (!req.url || !getInternalRouteParts(req.url, options.internalPrefix)) {
        return false;
    }

    const selections = parseBypassSelections(req.headers.cookie, (message) => logError(options.logging, message));

    if (selections.all) {
        return true;
    }

    if (selections.endpointIds.size === 0) {
        return false;
    }

    const manifestResult = await readMockManifest(options.mockRoot, options.manifestFileName, options.debug);

    if (manifestResult.status === 'invalid') {
        logError(options.logging, `Failed to read mock manifest: ${manifestResult.error.message}`);
        return false;
    }

    if (manifestResult.status !== 'valid') {
        return false;
    }

    const { pathname } = new URL(req.url, 'http://localhost');
    const endpoint = findMockEndpoint(manifestResult.manifest, req.method, pathname);

    return endpoint?.id ? selections.endpointIds.has(endpoint.id) : false;
};

import type { IncomingMessage, ServerResponse } from 'node:http';

import { EMPTY_MANIFEST } from '../../constant.js';
import type { MockApiPluginOptions } from '../../interface.js';
import { getCandidatePaths } from '../../util/getCandidatePaths.js';
import { getContentType } from '../../util/getContentType.js';
import { getInternalRouteParts } from '../../util/getInternalRouteParts.js';
import { readExistingFile } from '../../util/readExistingFile.js';
import { send } from '../../util/send.js';
import { sendJson } from '../../util/sendJson.js';
import { findMockEndpoint } from './util/findMockEndpoint.js';
import { findSelectedScenario } from './util/findSelectedScenario.js';
import { isSafeScenarioFile } from './util/isSafeScenarioFile.js';
import { parseScenarioSelections } from './util/parseScenarioSelections.js';
import { readMockManifest } from './util/readMockManifest.js';
import { wait } from './util/wait.js';

export const handleScenarioRequest = async (
    req: IncomingMessage,
    res: ServerResponse,
    options: Required<MockApiPluginOptions>
): Promise<boolean> => {
    if (!req.url) {
        return false;
    }

    const { pathname } = new URL(req.url, 'http://localhost');

    if (req.method?.toUpperCase() === 'GET' && pathname === options.manifestRoute) {
        const result = await readMockManifest(options.mockRoot, options.manifestFileName);

        if (result.status === 'valid') {
            sendJson(res, 200, result.manifest);
        } else if (result.status === 'missing') {
            sendJson(res, 200, EMPTY_MANIFEST);
        } else {
            console.error(`Failed to read mock manifest: ${result.error.message}`, result.error);
            sendJson(res, 500, { error: `Failed to read mock manifest: ${result.error.message}` });
        }

        return true;
    }

    const internalRouteParts = getInternalRouteParts(req.url, options.internalPrefix);

    if (!internalRouteParts) {
        return false;
    }

    const manifestResult = await readMockManifest(options.mockRoot, options.manifestFileName);

    if (manifestResult.status === 'missing') {
        return false;
    }

    if (manifestResult.status === 'invalid') {
        console.error(`Failed to read mock manifest: ${manifestResult.error.message}`, manifestResult.error);
        return false;
    }

    const endpoint = findMockEndpoint(manifestResult.manifest, req.method, pathname);

    if (!endpoint) {
        return false;
    }

    const selections = parseScenarioSelections(req.headers.cookie);
    const scenario = findSelectedScenario(endpoint, selections);

    if (!scenario) {
        return false;
    }

    if (scenario.file && !isSafeScenarioFile(scenario.file)) {
        return false;
    }

    const candidatePaths = scenario.file
        ? [scenario.file]
        : getCandidatePaths(internalRouteParts, req.method, options.extensions);

    for (const path of candidatePaths) {
        const file = await readExistingFile(path, options.mockRoot);

        if (file) {
            if (scenario.delay) {
                await wait(scenario.delay);
            }

            console.log(`mocking request for: ${req.url} with content from: ${path}`);

            send(
                res,
                scenario.status ?? 200,
                {
                    'content-type': getContentType(file.extension, options.contentTypes),
                    'content-length': String(file.content.length)
                },
                file.content
            );

            return true;
        }
    }

    sendJson(res, 404, {
        error: `No local mock found for ${internalRouteParts.join('/')}`
    });

    return true;
};

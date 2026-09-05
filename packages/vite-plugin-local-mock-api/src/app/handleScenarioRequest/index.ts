import type { IncomingMessage, ServerResponse } from 'node:http';
import { MANIFEST_ROUTE } from '@wesflo/local-mock-api-utils';

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

    if (req.method?.toUpperCase() === 'GET' && pathname === MANIFEST_ROUTE) {
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

    const manifest = manifestResult.manifest;
    const endpoint = findMockEndpoint(manifest, req.method, pathname);

    if (!endpoint && manifest.delay === undefined) {
        return false;
    }

    const selections = parseScenarioSelections(req.headers.cookie);
    const scenario = endpoint ? findSelectedScenario(endpoint, selections) : undefined;
    const file = scenario?.file ?? endpoint?.file;
    const status = scenario?.status ?? endpoint?.status ?? 200;
    const delay = scenario?.delay ?? endpoint?.delay ?? manifest.delay;

    if (file && !isSafeScenarioFile(file)) {
        return false;
    }

    if (status === 204 && !file) {
        if (delay) {
            await wait(delay);
        }

        send(res, status, {}, '');
        return true;
    }

    const candidatePaths = file
        ? [file]
        : getCandidatePaths(internalRouteParts, req.method, options.extensions);

    for (const path of candidatePaths) {
        const file = await readExistingFile(path, options.mockRoot);

        if (file) {
            if (delay) {
                await wait(delay);
            }

            console.log(`mocking request for: ${req.url} with content from: ${path}`);

            send(
                res,
                status,
                status === 204
                    ? {}
                    : {
                          'content-type': getContentType(file.extension, options.contentTypes),
                          'content-length': String(file.content.length)
                      },
                status === 204 ? '' : file.content
            );

            return true;
        }
    }

    sendJson(res, 404, {
        error: `No local mock found for ${internalRouteParts.join('/')}`
    });

    return true;
};

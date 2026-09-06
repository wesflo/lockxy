import type { IncomingMessage, ServerResponse } from 'node:http';
import {
    DEVELOPMENT_HEADER_NAME,
    DEVELOPMENT_HEADER_VALUE,
    MANIFEST_ROUTE
} from '@wesflo/local-mock-api-utils';

import { EMPTY_MANIFEST } from '../../constant.js';
import type { MockApiPluginOptions } from '../../interface.js';
import { getCandidatePaths } from '../../util/getCandidatePaths.js';
import { getContentType } from '../../util/getContentType.js';
import { getInternalRouteParts } from '../../util/getInternalRouteParts.js';
import { readExistingFile } from '../../util/readExistingFile.js';
import { logDebug } from '../../util/logDebug.js';
import { logError } from '../../util/logError.js';
import { logRequest } from '../../util/logRequest.js';
import { send } from '../../util/send.js';
import { sendJson } from '../../util/sendJson.js';
import { findMockEndpoint } from './util/findMockEndpoint.js';
import { findSelectedScenario } from './util/findSelectedScenario.js';
import { isSafeScenarioFile } from './util/isSafeScenarioFile.js';
import { parseScenarioSelections } from './util/parseScenarioSelections.js';
import { readMockManifest } from './util/readMockManifest.js';
import { resolveDelay } from './util/resolveDelay.js';
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
        res.setHeader(DEVELOPMENT_HEADER_NAME, DEVELOPMENT_HEADER_VALUE);
        const result = await readMockManifest(options.mockRoot, options.manifestFileName, options.debug);

        if (result.status === 'valid') {
            logDebug(options.debug && options.logging, `${options.manifestFileName} passed manifest validation.`);
            sendJson(res, 200, result.manifest, req.method);
        } else if (result.status === 'missing') {
            sendJson(res, 200, EMPTY_MANIFEST, req.method);
        } else {
            logError(options.logging, `Failed to read mock manifest: ${result.error.message}`);
            sendJson(res, 500, { error: `Failed to read mock manifest: ${result.error.message}` }, req.method);
        }

        logRequest(options.logging, {
            method: req.method ?? 'GET',
            url: req.url,
            delay: 0,
            status: result.status === 'invalid' ? 500 : 200,
            source: 'manifest'
        });

        return true;
    }

    const internalRouteParts = getInternalRouteParts(req.url, options.internalPrefix);

    if (!internalRouteParts) {
        return false;
    }

    const manifestResult = await readMockManifest(options.mockRoot, options.manifestFileName, options.debug);

    if (manifestResult.status === 'missing') {
        return false;
    }

    if (manifestResult.status === 'invalid') {
        logError(options.logging, `Failed to read mock manifest: ${manifestResult.error.message}`);
        return false;
    }

    const manifest = manifestResult.manifest;
    const endpoint = findMockEndpoint(manifest, req.method, pathname);

    if (!endpoint && manifest.delay === undefined) {
        return false;
    }

    const selections = parseScenarioSelections(req.headers.cookie, (message) => logError(options.logging, message));
    const scenario = endpoint ? findSelectedScenario(endpoint, selections) : undefined;
    const file = scenario?.file ?? endpoint?.file;
    const status = scenario?.status ?? endpoint?.status ?? 200;
    const delay = resolveDelay(scenario?.delay ?? endpoint?.delay ?? manifest.delay);

    if (status === 204 || status === 304) {
        if (delay) {
            await wait(delay);
        }

        send(res, status, {}, '', req.method);
        logRequest(options.logging, {
            method: req.method ?? 'GET',
            url: req.url,
            delay,
            status,
            source: 'manifest'
        });
        return true;
    }

    if (file && !isSafeScenarioFile(file)) {
        logError(options.logging, `Ignoring unsafe manifest file path "${file}" for ${req.method ?? 'GET'} ${req.url}.`);
        return false;
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

            send(
                res,
                status,
                {
                    'content-type': getContentType(file.extension, options.contentTypes),
                    'content-length': String(file.content.length)
                },
                file.content,
                req.method
            );
            logRequest(options.logging, {
                method: req.method ?? 'GET',
                url: req.url,
                delay,
                status,
                source: 'manifest'
            });

            return true;
        }
    }

    logError(
        options.logging,
        file
            ? `Manifest response file "${file}" not found for ${req.method ?? 'GET'} ${req.url}.`
            : `No local mock file found for ${req.method ?? 'GET'} ${req.url}. Tried: ${candidatePaths.join(', ')}.`
    );
    sendJson(res, 404, {
        error: `No local mock found for ${internalRouteParts.join('/')}`
    }, req.method);
    logRequest(options.logging, {
        method: req.method ?? 'GET',
        url: req.url,
        delay: 0,
        status: 404,
        source: 'manifest'
    });

    return true;
};

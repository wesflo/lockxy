import type { IncomingMessage, ServerResponse } from 'node:http';

import type { MockApiRuntimeOptions, NextFunction } from '../../interface.js';
import { findMockFile } from '../../util/findMockFile.js';
import { getCandidatePaths } from '../../util/getCandidatePaths.js';
import { getContentType } from '../../util/getContentType.js';
import { getMockFileCacheKey } from '../../util/getMockFileCacheKey.js';
import { getRequestRouteParts } from '../../util/getRequestRouteParts.js';
import { logError } from '../../util/logError.js';
import { logRequest } from '../../util/logRequest.js';
import { send } from '../../util/send.js';
import { sendJson } from '../../util/sendJson.js';

export const handleMockRequest = async (
    req: IncomingMessage,
    res: ServerResponse,
    next: NextFunction,
    options: MockApiRuntimeOptions
): Promise<void> => {
    const requestRouteParts = getRequestRouteParts(req.url, options.requestPrefixes);

    if (!requestRouteParts) {
        next();
        return;
    }

    const candidatePaths = getCandidatePaths(requestRouteParts, req.method, options.extensions);
    const cacheKey = getMockFileCacheKey(req.url ?? '', req.method);
    const result = await findMockFile(options.filePathCache, cacheKey, candidatePaths, options.mockRoot);

    if (result) {
        send(
            res,
            200,
            {
                'content-type': getContentType(result.file.extension, options.contentTypes),
                'content-length': String(result.file.content.length),
            },
            result.file.content,
            req.method
        );
        logRequest(options.logging, {
            method: req.method ?? 'GET',
            url: req.url ?? '',
            delay: 0,
            status: 200,
            source: result.cacheHit ? 'cache' : 'convention',
        });

        return;
    }

    logError(
        options.logging,
        `No local mock file found for ${req.method ?? 'GET'} ${req.url ?? ''}. Tried: ${candidatePaths.join(', ')}.`
    );
    sendJson(
        res,
        404,
        {
            error: `No local mock found for ${requestRouteParts.join('/')}`,
        },
        req.method
    );
    logRequest(options.logging, {
        method: req.method ?? 'GET',
        url: req.url ?? '',
        delay: 0,
        status: 404,
        source: 'convention',
    });
};

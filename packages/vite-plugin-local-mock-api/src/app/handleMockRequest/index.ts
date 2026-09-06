import type { IncomingMessage, ServerResponse } from 'node:http';

import type { MockApiPluginOptions, NextFunction } from '../../interface.js';
import { getCandidatePaths } from '../../util/getCandidatePaths.js';
import { getContentType } from '../../util/getContentType.js';
import { getInternalRouteParts } from '../../util/getInternalRouteParts.js';
import { readExistingFile } from '../../util/readExistingFile.js';
import { logError } from '../../util/logError.js';
import { logRequest } from '../../util/logRequest.js';
import { send } from '../../util/send.js';
import { sendJson } from '../../util/sendJson.js';

export const handleMockRequest = async (
    req: IncomingMessage,
    res: ServerResponse,
    next: NextFunction,
    options: Required<MockApiPluginOptions>
): Promise<void> => {
    const internalRouteParts = getInternalRouteParts(req.url, options.internalPrefix);

    if (!internalRouteParts) {
        next();
        return;
    }

    const candidatePaths = getCandidatePaths(internalRouteParts, req.method, options.extensions);

    for (const path of candidatePaths) {
        const file = await readExistingFile(path, options.mockRoot);

        if (file) {
            send(
                res,
                200,
                {
                    'content-type': getContentType(file.extension, options.contentTypes),
                    'content-length': String(file.content.length),
                },
                file.content,
                req.method
            );
            logRequest(options.logging, {
                method: req.method ?? 'GET',
                url: req.url ?? '',
                delay: 0,
                status: 200,
                source: 'naming convention',
            });

            return;
        }
    }

    logError(
        options.logging,
        `No local mock file found for ${req.method ?? 'GET'} ${req.url ?? ''}. Tried: ${candidatePaths.join(', ')}.`
    );
    sendJson(
        res,
        404,
        {
            error: `No local mock found for ${internalRouteParts.join('/')}`,
        },
        req.method
    );
    logRequest(options.logging, {
        method: req.method ?? 'GET',
        url: req.url ?? '',
        delay: 0,
        status: 404,
        source: 'naming convention',
    });
};

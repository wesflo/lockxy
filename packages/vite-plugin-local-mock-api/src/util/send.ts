import type { ServerResponse } from 'node:http';

import type { ResponseBody, ResponseHeaders } from '../interface.js';

export const send = (
    res: ServerResponse,
    statusCode: number,
    headers: ResponseHeaders,
    body: ResponseBody,
    method?: string
): void => {
    const statusForbidsBody = statusCode === 204 || statusCode === 304;
    const bodyAllowed = !statusForbidsBody && method?.toUpperCase() !== 'HEAD';

    res.statusCode = statusCode;
    Object.entries(headers).forEach(([key, value]) => {
        if (!statusForbidsBody || !['content-length', 'content-type'].includes(key.toLowerCase())) {
            res.setHeader(key, value);
        }
    });
    bodyAllowed ? res.end(body) : res.end();
};

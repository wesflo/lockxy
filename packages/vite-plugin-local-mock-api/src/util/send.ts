import type { ServerResponse } from 'node:http';

import type { ResponseBody, ResponseHeaders } from '../interface.js';

export const send = (
    res: ServerResponse,
    statusCode: number,
    headers: ResponseHeaders,
    body: ResponseBody
): void => {
    res.statusCode = statusCode;
    Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
    res.end(body);
};

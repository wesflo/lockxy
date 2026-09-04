import type { ServerResponse } from 'node:http';

import { send } from './send.js';

export const sendJson = (res: ServerResponse, statusCode: number, data: unknown): void => {
    send(res, statusCode, { 'content-type': 'application/json; charset=utf-8' }, JSON.stringify(data));
};

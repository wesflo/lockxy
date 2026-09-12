import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';

import type { DynamicResponse, MockApiRuntimeOptions, MockEndpoint, ResponseHeaders } from '../../../interface.js';
import { logRequest } from '../../../util/logRequest.js';
import { send } from '../../../util/send.js';
import { createDynamicRequest } from './createDynamicRequest.js';
import { getManifestPathParams } from './getManifestPathParams.js';
import { resolveDelay } from './resolveDelay.js';
import { wait } from './wait.js';

const normalizeBody = (body: unknown): { body: string | Buffer; contentType?: string } => {
    if (body === undefined || body === null) {
        return { body: '' };
    }
    if (Buffer.isBuffer(body)) {
        return { body, contentType: 'application/octet-stream' };
    }
    if (typeof body === 'string') {
        return { body, contentType: 'text/plain; charset=utf-8' };
    }

    return { body: JSON.stringify(body), contentType: 'application/json; charset=utf-8' };
};

export const handleDynamicEndpoint = async (
    request: IncomingMessage,
    response: ServerResponse,
    endpoint: MockEndpoint,
    options: MockApiRuntimeOptions,
    pathname: string
): Promise<void> => {
    if (!endpoint.handler) {
        throw new TypeError(`Dynamic endpoint "${endpoint.id}" has no handler.`);
    }

    const webRequest = await createDynamicRequest(request);
    let result: DynamicResponse;
    try {
        result = await endpoint.handler({
            request: webRequest,
            params: getManifestPathParams(endpoint.path, pathname),
            searchParams: new URL(webRequest.url).searchParams,
            method: request.method?.toUpperCase() ?? 'GET',
            pathname,
        });
    } catch (error) {
        throw new Error(`Dynamic handler failed for ${request.method ?? 'GET'} ${request.url ?? pathname}.`, {
            cause: error,
        });
    }

    const status = result?.status ?? 200;
    if (!Number.isInteger(status) || status < 100 || status > 599) {
        throw new TypeError(`Dynamic handler returned invalid status ${String(status)}.`);
    }

    const delay = resolveDelay(result.delay);
    if (delay) {
        await wait(delay);
    }

    const normalized = normalizeBody(result.body);
    const headers: ResponseHeaders = { ...result.headers };
    const hasContentType = Object.keys(headers).some((name) => name.toLowerCase() === 'content-type');
    if (normalized.contentType && !hasContentType) {
        headers['content-type'] = normalized.contentType;
    }
    headers['content-length'] = String(Buffer.byteLength(normalized.body));

    send(response, status, headers, normalized.body, request.method);
    logRequest(options.logging, {
        method: request.method ?? 'GET',
        url: request.url ?? pathname,
        delay,
        status,
        source: 'manifest',
    });
};

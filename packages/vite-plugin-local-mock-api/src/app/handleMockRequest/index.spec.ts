import type { IncomingMessage, ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiRuntimeOptions } from '../../interface.js';

const mocks = vi.hoisted(() => ({
    findMockFile: vi.fn(),
    getCandidatePaths: vi.fn(),
    getContentType: vi.fn(),
    getRequestRouteParts: vi.fn(),
    logRequest: vi.fn(),
    send: vi.fn(),
    sendJson: vi.fn(),
}));

vi.mock('../../util/findMockFile.js', () => ({
    findMockFile: mocks.findMockFile,
}));

vi.mock('../../util/getCandidatePaths.js', () => ({
    getCandidatePaths: mocks.getCandidatePaths,
}));

vi.mock('../../util/getContentType.js', () => ({
    getContentType: mocks.getContentType,
}));

vi.mock('../../util/getRequestRouteParts.js', () => ({
    getRequestRouteParts: mocks.getRequestRouteParts,
}));

vi.mock('../../util/logRequest.js', () => ({
    logRequest: mocks.logRequest,
}));

vi.mock('../../util/send.js', () => ({
    send: mocks.send,
}));

vi.mock('../../util/sendJson.js', () => ({
    sendJson: mocks.sendJson,
}));

import { handleMockRequest } from './index.js';

describe('handleMockRequest', () => {
    const request = {
        url: '/_internal/orders',
        method: 'GET',
    } as IncomingMessage;
    const response = {} as ServerResponse;
    const mockRoot = new URL('file:///tmp/mocks/');
    const options: MockApiRuntimeOptions = {
        mockRoot,
        requestPrefixes: ['/_internal/'],
        extensions: ['.json'],
        contentTypes: { '.json': 'application/json; charset=utf-8' },
        manifestFileName: 'mock.manifest.json',
        debug: false,
        logging: false,
        fileIndex: new Set(),
        manifestResult: { status: 'missing' },
    };

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getContentType.mockReturnValue('application/json; charset=utf-8');
    });

    it('passes a request outside the configured prefixes to the next middleware', async () => {
        const next = vi.fn();
        mocks.getRequestRouteParts.mockReturnValue(null);

        await handleMockRequest(request, response, next, options);

        expect(mocks.getRequestRouteParts).toHaveBeenCalledWith(request.url, options.requestPrefixes);
        expect(next).toHaveBeenCalledOnce();
        expect(mocks.getCandidatePaths).not.toHaveBeenCalled();
    });

    it('serves the first existing candidate and stops searching', async () => {
        const content = Buffer.from('{"source":"fallback"}');
        mocks.getRequestRouteParts.mockReturnValue(['orders']);
        mocks.getCandidatePaths.mockReturnValue(['GET_orders.json', 'orders.json', 'orders.pdf']);
        mocks.findMockFile.mockResolvedValue({ content, extension: '.json' });

        await handleMockRequest(request, response, vi.fn(), options);

        expect(mocks.getCandidatePaths).toHaveBeenCalledWith(['orders'], 'GET', options.extensions);
        expect(mocks.findMockFile).toHaveBeenCalledWith(
            options.fileIndex,
            ['GET_orders.json', 'orders.json', 'orders.pdf'],
            mockRoot
        );
        expect(mocks.getContentType).toHaveBeenCalledWith('.json', options.contentTypes);
        expect(mocks.send).toHaveBeenCalledWith(
            response,
            200,
            {
                'content-type': 'application/json; charset=utf-8',
                'content-length': String(content.length),
            },
            content,
            'GET'
        );
        expect(mocks.sendJson).not.toHaveBeenCalled();
        expect(mocks.logRequest).toHaveBeenCalledWith(
            false,
            expect.objectContaining({ source: 'convention' })
        );
    });

    it('returns the original 404 response after every candidate misses', async () => {
        mocks.getRequestRouteParts.mockReturnValue(['orders', '42']);
        mocks.getCandidatePaths.mockReturnValue(['GET_orders/42.json', 'orders/42.json']);
        mocks.findMockFile.mockResolvedValue(null);

        await handleMockRequest(request, response, vi.fn(), options);

        expect(mocks.findMockFile).toHaveBeenCalledOnce();
        expect(mocks.send).not.toHaveBeenCalled();
        expect(mocks.sendJson).toHaveBeenCalledWith(
            response,
            404,
            { error: 'No local mock found for orders/42' },
            'GET'
        );
    });
});

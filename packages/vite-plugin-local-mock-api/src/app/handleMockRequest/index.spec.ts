import type { IncomingMessage, ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiPluginOptions } from '../../interface.js';

const mocks = vi.hoisted(() => ({
    getCandidatePaths: vi.fn(),
    getContentType: vi.fn(),
    getInternalRouteParts: vi.fn(),
    readExistingFile: vi.fn(),
    send: vi.fn(),
    sendJson: vi.fn()
}));

vi.mock('../../util/getCandidatePaths.js', () => ({
    getCandidatePaths: mocks.getCandidatePaths
}));

vi.mock('../../util/getContentType.js', () => ({
    getContentType: mocks.getContentType
}));

vi.mock('../../util/getInternalRouteParts.js', () => ({
    getInternalRouteParts: mocks.getInternalRouteParts
}));

vi.mock('../../util/readExistingFile.js', () => ({
    readExistingFile: mocks.readExistingFile
}));

vi.mock('../../util/send.js', () => ({
    send: mocks.send
}));

vi.mock('../../util/sendJson.js', () => ({
    sendJson: mocks.sendJson
}));

import { handleMockRequest } from './index.js';

describe('handleMockRequest', () => {
    const request = {
        url: '/_internal/orders',
        method: 'GET'
    } as IncomingMessage;
    const response = {} as ServerResponse;
    const mockRoot = new URL('file:///tmp/mocks/');
    const options: Required<MockApiPluginOptions> = {
        mockRoot,
        internalPrefix: '/_internal/',
        extensions: ['.json'],
        contentTypes: { '.json': 'application/json; charset=utf-8' },
        manifestFileName: 'mock.manifest.json',
        debug: false,
        logging: false
    };

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getContentType.mockReturnValue('application/json; charset=utf-8');
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
    });

    it('passes a request without internal route parts to the next middleware', async () => {
        const next = vi.fn();
        mocks.getInternalRouteParts.mockReturnValue(null);

        await handleMockRequest(request, response, next, options);

        expect(mocks.getInternalRouteParts).toHaveBeenCalledWith(
            request.url,
            options.internalPrefix
        );
        expect(next).toHaveBeenCalledOnce();
        expect(mocks.getCandidatePaths).not.toHaveBeenCalled();
    });

    it('serves the first existing candidate and stops searching', async () => {
        const content = Buffer.from('{"source":"fallback"}');
        mocks.getInternalRouteParts.mockReturnValue(['orders']);
        mocks.getCandidatePaths.mockReturnValue(['GET_orders.json', 'orders.json', 'orders.pdf']);
        mocks.readExistingFile
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ content, extension: '.json' });

        await handleMockRequest(request, response, vi.fn(), options);

        expect(mocks.getCandidatePaths).toHaveBeenCalledWith(['orders'], 'GET', options.extensions);
        expect(mocks.readExistingFile).toHaveBeenNthCalledWith(1, 'GET_orders.json', mockRoot);
        expect(mocks.readExistingFile).toHaveBeenNthCalledWith(2, 'orders.json', mockRoot);
        expect(mocks.readExistingFile).toHaveBeenCalledTimes(2);
        expect(mocks.getContentType).toHaveBeenCalledWith('.json', options.contentTypes);
        expect(mocks.send).toHaveBeenCalledWith(
            response,
            200,
            {
                'content-type': 'application/json; charset=utf-8',
                'content-length': String(content.length)
            },
            content,
            'GET'
        );
        expect(mocks.sendJson).not.toHaveBeenCalled();
    });

    it('returns the original 404 response after every candidate misses', async () => {
        mocks.getInternalRouteParts.mockReturnValue(['orders', '42']);
        mocks.getCandidatePaths.mockReturnValue(['GET_orders/42.json', 'orders/42.json']);
        mocks.readExistingFile.mockResolvedValue(null);

        await handleMockRequest(request, response, vi.fn(), options);

        expect(mocks.readExistingFile).toHaveBeenCalledTimes(2);
        expect(mocks.send).not.toHaveBeenCalled();
        expect(mocks.sendJson).toHaveBeenCalledWith(
            response,
            404,
            { error: 'No local mock found for orders/42' },
            'GET'
        );
    });
});

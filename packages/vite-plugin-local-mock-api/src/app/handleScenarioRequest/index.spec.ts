import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiRuntimeOptions } from '../../interface.js';

const mocks = vi.hoisted(() => ({
    findMockFile: vi.fn(),
    findMockEndpoint: vi.fn(),
    findSelectedScenario: vi.fn(),
    getCandidatePaths: vi.fn(),
    getMockFileCacheKey: vi.fn(),
    getRequestRouteParts: vi.fn(),
    logRequest: vi.fn(),
    parseScenarioSelections: vi.fn(),
    readExistingFile: vi.fn(),
    readMockManifest: vi.fn(),
    send: vi.fn(),
    wait: vi.fn(),
}));

vi.mock('../../util/findMockFile.js', () => ({ findMockFile: mocks.findMockFile }));
vi.mock('../../util/getCandidatePaths.js', () => ({ getCandidatePaths: mocks.getCandidatePaths }));
vi.mock('../../util/getMockFileCacheKey.js', () => ({ getMockFileCacheKey: mocks.getMockFileCacheKey }));
vi.mock('../../util/getRequestRouteParts.js', () => ({ getRequestRouteParts: mocks.getRequestRouteParts }));
vi.mock('../../util/logRequest.js', () => ({ logRequest: mocks.logRequest }));
vi.mock('../../util/readExistingFile.js', () => ({ readExistingFile: mocks.readExistingFile }));
vi.mock('../../util/send.js', () => ({ send: mocks.send }));
vi.mock('./util/findMockEndpoint.js', () => ({ findMockEndpoint: mocks.findMockEndpoint }));
vi.mock('./util/findSelectedScenario.js', () => ({ findSelectedScenario: mocks.findSelectedScenario }));
vi.mock('./util/parseScenarioSelections.js', () => ({ parseScenarioSelections: mocks.parseScenarioSelections }));
vi.mock('./util/readMockManifest.js', () => ({ readMockManifest: mocks.readMockManifest }));
vi.mock('./util/wait.js', () => ({ wait: mocks.wait }));

import { handleScenarioRequest } from './index.js';

describe('handleScenarioRequest', () => {
    const options: MockApiRuntimeOptions = {
        mockRoot: new URL('file:///tmp/mocks/'),
        requestPrefixes: ['/api/'],
        extensions: ['.json'],
        contentTypes: { '.json': 'application/json' },
        manifestFileName: 'mock.manifest.json',
        debug: false,
        logging: false,
        filePathCache: new Map(),
    };
    const request = {
        url: '/api/profile',
        method: 'GET',
        headers: {},
    } as IncomingMessage;
    const response = {} as ServerResponse;
    const mockFile = { content: Buffer.from('{}'), extension: '.json' };

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getRequestRouteParts.mockReturnValue(['profile']);
        mocks.parseScenarioSelections.mockReturnValue(new Map());
        mocks.getCandidatePaths.mockReturnValue(['GET_profile.json', 'profile.json']);
        mocks.getMockFileCacheKey.mockReturnValue('GET_/api/profile');
        mocks.findMockFile.mockResolvedValue({ file: mockFile, cacheHit: false });
        mocks.readExistingFile.mockResolvedValue(mockFile);
    });

    it('leaves convention-only requests untouched when the manifest is missing', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
        mocks.readMockManifest.mockResolvedValue({ status: 'missing' });

        await expect(
            handleScenarioRequest(request, response, { ...options, debug: true, logging: true })
        ).resolves.toBe(false);

        expect(mocks.parseScenarioSelections).not.toHaveBeenCalled();
        expect(mocks.send).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
        expect(debug).not.toHaveBeenCalled();
    });

    it('applies a root delay while keeping naming-convention resolution', async () => {
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { delay: 400 } });
        mocks.findMockEndpoint.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.getCandidatePaths).toHaveBeenCalledWith(['profile'], 'GET', ['.json']);
        expect(mocks.findMockFile).toHaveBeenCalledWith(
            options.filePathCache,
            'GET_/api/profile',
            ['GET_profile.json', 'profile.json'],
            options.mockRoot
        );
        expect(mocks.wait).toHaveBeenCalledWith(400);
        expect(mocks.send).toHaveBeenCalledWith(
            response,
            200,
            { 'content-type': 'application/json', 'content-length': '2' },
            mockFile.content,
            'GET'
        );
    });

    it('reports a cached manifest fallback as a cache response', async () => {
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { delay: 400 } });
        mocks.findMockEndpoint.mockReturnValue(undefined);
        mocks.findMockFile.mockResolvedValue({ file: mockFile, cacheHit: true });

        await handleScenarioRequest(request, response, options);

        expect(mocks.logRequest).toHaveBeenCalledWith(false, expect.objectContaining({ source: 'cache' }));
    });

    it('applies endpoint response settings without scenarios', async () => {
        const endpoint = {
            path: '/api/profile',
            file: 'scenarios/explicit.json',
            status: 202,
            delay: 150,
        };
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { delay: 400, endpoints: [endpoint] } });
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.readExistingFile).toHaveBeenCalledWith('scenarios/explicit.json', options.mockRoot);
        expect(mocks.wait).toHaveBeenCalledWith(150);
        expect(mocks.send).toHaveBeenCalledWith(
            response,
            202,
            { 'content-type': 'application/json', 'content-length': '2' },
            mockFile.content,
            'GET'
        );
    });

    it('resolves a new random delay inside the configured range', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const endpoint = { path: '/api/profile', delay: [200, 600] as const };
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { endpoints: [endpoint] } });
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.wait).toHaveBeenCalledWith(400);
    });

    it('returns an empty 204 response without reading a configured file', async () => {
        const endpoint = { path: '/api/profile', status: 204, file: 'must-not-be-read.json' };
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { endpoints: [endpoint] } });
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.getCandidatePaths).not.toHaveBeenCalled();
        expect(mocks.findMockFile).not.toHaveBeenCalled();
        expect(mocks.readExistingFile).not.toHaveBeenCalled();
        expect(mocks.send).toHaveBeenCalledWith(response, 204, {}, '', 'GET');
    });
});

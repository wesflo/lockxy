import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiRuntimeOptions } from '../../interface.js';

const mocks = vi.hoisted(() => ({
    findMockFile: vi.fn(),
    findMockEndpoint: vi.fn(),
    findSelectedScenario: vi.fn(),
    getCandidatePaths: vi.fn(),
    getRequestRouteParts: vi.fn(),
    logRequest: vi.fn(),
    parseScenarioSelections: vi.fn(),
    readExistingFile: vi.fn(),
    send: vi.fn(),
    sendJson: vi.fn(),
    wait: vi.fn(),
}));

vi.mock('../../util/findMockFile.js', () => ({ findMockFile: mocks.findMockFile }));
vi.mock('../../util/getCandidatePaths.js', () => ({ getCandidatePaths: mocks.getCandidatePaths }));
vi.mock('../../util/getRequestRouteParts.js', () => ({ getRequestRouteParts: mocks.getRequestRouteParts }));
vi.mock('../../util/logRequest.js', () => ({ logRequest: mocks.logRequest }));
vi.mock('../../util/readExistingFile.js', () => ({ readExistingFile: mocks.readExistingFile }));
vi.mock('../../util/send.js', () => ({ send: mocks.send }));
vi.mock('../../util/sendJson.js', () => ({ sendJson: mocks.sendJson }));
vi.mock('./util/findMockEndpoint.js', () => ({ findMockEndpoint: mocks.findMockEndpoint }));
vi.mock('./util/findSelectedScenario.js', () => ({ findSelectedScenario: mocks.findSelectedScenario }));
vi.mock('./util/parseScenarioSelections.js', () => ({ parseScenarioSelections: mocks.parseScenarioSelections }));
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
        fileIndex: new Set(),
        manifestResult: { status: 'missing' },
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
        mocks.findMockFile.mockResolvedValue(mockFile);
        mocks.readExistingFile.mockResolvedValue(mockFile);
        options.fileIndex = new Set();
        options.manifestResult = { status: 'missing' };
    });

    it('leaves convention-only requests untouched when the manifest is missing', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
        await expect(
            handleScenarioRequest(request, response, { ...options, debug: true, logging: true })
        ).resolves.toBe(false);

        expect(mocks.parseScenarioSelections).not.toHaveBeenCalled();
        expect(mocks.send).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
        expect(debug).not.toHaveBeenCalled();
    });

    it('applies a root delay while keeping naming-convention resolution', async () => {
        options.manifestResult = { status: 'valid', manifest: { delay: 400 } };
        mocks.findMockEndpoint.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.getCandidatePaths).toHaveBeenCalledWith(['profile'], 'GET', ['.json']);
        expect(mocks.findMockFile).toHaveBeenCalledWith(
            options.fileIndex,
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

    it('applies endpoint response settings without scenarios', async () => {
        const endpoint = {
            path: '/api/profile',
            file: 'scenarios/explicit.json',
            status: 202,
            delay: 150,
        };
        options.fileIndex = new Set(['scenarios/explicit.json']);
        options.manifestResult = { status: 'valid', manifest: { delay: 400, endpoints: [endpoint] } };
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

    it('rejects a missing manifest file from the index without accessing the file system', async () => {
        const endpoint = { path: '/api/profile', file: 'scenarios/missing.json' };
        options.manifestResult = { status: 'valid', manifest: { endpoints: [endpoint] } };
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.readExistingFile).not.toHaveBeenCalled();
        expect(mocks.sendJson).toHaveBeenCalledWith(response, 404, { error: 'No local mock found for profile' }, 'GET');
    });

    it('resolves a new random delay inside the configured range', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const endpoint = { path: '/api/profile', delay: [200, 600] as const };
        options.manifestResult = { status: 'valid', manifest: { endpoints: [endpoint] } };
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.wait).toHaveBeenCalledWith(400);
    });

    it('returns an empty 204 response without reading a configured file', async () => {
        const endpoint = { path: '/api/profile', status: 204, file: 'must-not-be-read.json' };
        options.manifestResult = { status: 'valid', manifest: { endpoints: [endpoint] } };
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.getCandidatePaths).not.toHaveBeenCalled();
        expect(mocks.findMockFile).not.toHaveBeenCalled();
        expect(mocks.readExistingFile).not.toHaveBeenCalled();
        expect(mocks.send).toHaveBeenCalledWith(response, 204, {}, '', 'GET');
    });
});

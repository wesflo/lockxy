import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MockApiPluginOptions } from '../../interface.js';

const mocks = vi.hoisted(() => ({
    findMockEndpoint: vi.fn(),
    findSelectedScenario: vi.fn(),
    getCandidatePaths: vi.fn(),
    getInternalRouteParts: vi.fn(),
    parseScenarioSelections: vi.fn(),
    readExistingFile: vi.fn(),
    readMockManifest: vi.fn(),
    send: vi.fn(),
    wait: vi.fn()
}));

vi.mock('../../util/getCandidatePaths.js', () => ({ getCandidatePaths: mocks.getCandidatePaths }));
vi.mock('../../util/getInternalRouteParts.js', () => ({ getInternalRouteParts: mocks.getInternalRouteParts }));
vi.mock('../../util/readExistingFile.js', () => ({ readExistingFile: mocks.readExistingFile }));
vi.mock('../../util/send.js', () => ({ send: mocks.send }));
vi.mock('./util/findMockEndpoint.js', () => ({ findMockEndpoint: mocks.findMockEndpoint }));
vi.mock('./util/findSelectedScenario.js', () => ({ findSelectedScenario: mocks.findSelectedScenario }));
vi.mock('./util/parseScenarioSelections.js', () => ({ parseScenarioSelections: mocks.parseScenarioSelections }));
vi.mock('./util/readMockManifest.js', () => ({ readMockManifest: mocks.readMockManifest }));
vi.mock('./util/wait.js', () => ({ wait: mocks.wait }));

import { handleScenarioRequest } from './index.js';

describe('handleScenarioRequest', () => {
    const options: Required<MockApiPluginOptions> = {
        mockRoot: new URL('file:///tmp/mocks/'),
        internalPrefix: '/api/',
        extensions: ['.json'],
        contentTypes: { '.json': 'application/json' },
        manifestFileName: 'mock.manifest.json',
        debug: false,
        logging: false
    };
    const request = {
        url: '/api/profile',
        method: 'GET',
        headers: {}
    } as IncomingMessage;
    const response = {} as ServerResponse;
    const mockFile = { content: Buffer.from('{}'), extension: '.json' };

    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getInternalRouteParts.mockReturnValue(['profile']);
        mocks.parseScenarioSelections.mockReturnValue(new Map());
        mocks.getCandidatePaths.mockReturnValue(['GET_profile.json', 'profile.json']);
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
            delay: 150
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

    it('returns an empty 204 response without reading a configured file', async () => {
        const endpoint = { path: '/api/profile', status: 204, file: 'must-not-be-read.json' };
        mocks.readMockManifest.mockResolvedValue({ status: 'valid', manifest: { endpoints: [endpoint] } });
        mocks.findMockEndpoint.mockReturnValue(endpoint);
        mocks.findSelectedScenario.mockReturnValue(undefined);

        await expect(handleScenarioRequest(request, response, options)).resolves.toBe(true);

        expect(mocks.getCandidatePaths).not.toHaveBeenCalled();
        expect(mocks.readExistingFile).not.toHaveBeenCalled();
        expect(mocks.send).toHaveBeenCalledWith(response, 204, {}, '', 'GET');
    });
});

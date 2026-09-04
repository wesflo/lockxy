import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DemoCase } from '../interface';

const mocks = vi.hoisted(() => ({
    jsonFetcher: vi.fn(),
    textFetcher: vi.fn(),
    blobFetcher: vi.fn(),
    epFetch: vi.fn(),
    epFetchText: vi.fn(),
    epFetchBlob: vi.fn()
}));

vi.mock('@electronicpartnerio/ui-utils', () => ({
    epFetch: mocks.epFetch,
    epFetchText: mocks.epFetchText,
    epFetchBlob: mocks.epFetchBlob
}));

import { executeDemoCase } from './executeDemoCase';

const createCase = (responseKind: DemoCase['responseKind']): DemoCase => ({
    id: `${responseKind}-case`,
    group: 'Responses',
    title: `${responseKind} response`,
    description: 'Exercises one response parser.',
    method: 'POST',
    path: `/_internal/demo/${responseKind}`,
    responseKind,
    expectedStatus: 200,
    body: { requested: true }
});

describe('executeDemoCase', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.epFetch.mockReturnValue(mocks.jsonFetcher);
        mocks.epFetchText.mockReturnValue(mocks.textFetcher);
        mocks.epFetchBlob.mockReturnValue(mocks.blobFetcher);
    });

    it('returns the formatted JSON response from epFetch', async () => {
        mocks.jsonFetcher.mockResolvedValue({ source: 'json' });

        const result = await executeDemoCase(createCase('json'));

        expect(result.state).toBe('success');
        expect(result.body).toBe('{\n  "source": "json"\n}');
        expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('returns the plain response from epFetchText', async () => {
        mocks.textFetcher.mockResolvedValue('text response');

        const result = await executeDemoCase(createCase('text'));

        expect(result).toMatchObject({ state: 'success', body: 'text response' });
    });

    it('retains the download returned by epFetchBlob', async () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        mocks.blobFetcher.mockResolvedValue({ blob, filename: 'response.pdf' });

        const result = await executeDemoCase(createCase('blob'));

        expect(result).toMatchObject({
            state: 'success',
            body: 'PDF (3 Bytes)',
            blob,
            filename: 'response.pdf'
        });
    });

    it('passes the configured request to the selected UI-utils fetcher', async () => {
        mocks.jsonFetcher.mockResolvedValue({ ok: true });
        const testCase = createCase('json');

        await executeDemoCase(testCase);

        expect(mocks.epFetch).toHaveBeenCalledWith('');
        expect(mocks.jsonFetcher).toHaveBeenCalledWith('/_internal/demo/json', {
            method: 'POST',
            body: JSON.stringify({ requested: true })
        });
    });

    it('turns a rejected HTTP response into displayable result data', async () => {
        mocks.jsonFetcher.mockRejectedValue(new Error('{"message":"server error"}'));

        const result = await executeDemoCase(createCase('json'));

        expect(result).toMatchObject({
            state: 'error',
            body: '{"message":"server error"}',
            error: '{"message":"server error"}'
        });
    });
});

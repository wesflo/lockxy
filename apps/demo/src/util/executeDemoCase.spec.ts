import { afterEach, describe, expect, it, vi } from 'vitest';

import type { DemoCase } from '../interface';
import { executeDemoCase } from './executeDemoCase';

const testCase: DemoCase = {
    id: 'json',
    group: 'Responses',
    title: 'JSON response',
    description: 'Exercises the response parser.',
    method: 'GET',
    path: '/demo/json',
    responseKind: 'json',
    expectedStatus: 200,
};

describe('executeDemoCase', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('captures body, headers, status and duration', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(
                async () =>
                    new Response(JSON.stringify({ source: 'mock' }), {
                        status: 200,
                        headers: { 'content-type': 'application/json' },
                    })
            )
        );

        const result = await executeDemoCase(testCase);

        expect(result).toMatchObject({
            state: 'success',
            status: 200,
            contentType: 'application/json',
            body: '{\n  "source": "mock"\n}',
        });
        expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('marks an unexpected status as an error', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => new Response('failed', { status: 500 }))
        );

        const result = await executeDemoCase({ ...testCase, responseKind: 'text' });

        expect(result).toMatchObject({
            state: 'error',
            status: 500,
            body: 'failed',
        });
    });
});

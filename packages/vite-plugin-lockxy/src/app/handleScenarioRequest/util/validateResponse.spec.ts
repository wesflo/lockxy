import { describe, expect, it } from 'vitest';

import type { MockResponseConfig } from '@wesflo/local-mock-api-utils';
import { validateResponse } from './validateResponse.js';

describe('validateResponse', () => {
    it('accepts valid response configuration', () => {
        expect(validateResponse({ status: 200, delay: [100, 500], file: 'profile.json' }, 'response')).toEqual([]);
    });

    it('returns every response issue without mutating shared state', () => {
        const response = { status: 600, delay: [500, 100], file: '../profile.json' } as MockResponseConfig;

        expect(validateResponse(response, 'response')).toEqual([
            'response.status: must be an integer from 100 through 599',
            'response.delay: must be a non-negative integer or an ascending [minimum, maximum] range',
            'response.file: must be a safe path relative to mockRoot',
        ]);
    });

    it.each([100, 204, 304, 599])('accepts the status boundary %s', (status) => {
        expect(validateResponse({ status }, 'response')).toEqual([]);
    });
});

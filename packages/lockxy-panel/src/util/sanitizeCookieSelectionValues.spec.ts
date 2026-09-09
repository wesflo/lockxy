import { describe, expect, it } from 'vitest';

import type { MockEndpoint } from '../interface.js';
import { sanitizeCookieSelectionValues } from './sanitizeCookieSelectionValues.js';

const endpoints: MockEndpoint[] = [
    {
        id: 'orders',
        path: '/api/orders',
        scenarios: [{ id: 'success' }, { id: 'error' }],
    },
];

describe('sanitizeCookieSelectionValues', () => {
    it('preserves valid endpoint and scenario selections', () => {
        expect(sanitizeCookieSelectionValues(endpoints, 'orders', 'orders:error')).toEqual({
            bypass: 'orders',
            scenarios: 'orders:error',
        });
    });

    it('removes selections belonging to another manifest', () => {
        expect(sanitizeCookieSelectionValues(endpoints, 'other', 'other:failure')).toEqual({
            bypass: '',
            scenarios: '',
        });
    });

    it('falls back to the first scenario when a selected scenario no longer exists', () => {
        expect(sanitizeCookieSelectionValues(endpoints, undefined, 'orders:removed')).toEqual({
            bypass: '',
            scenarios: 'orders:success',
        });
    });

    it('preserves global bypass and removes malformed entries', () => {
        expect(sanitizeCookieSelectionValues(endpoints, '*', 'invalid:value:extra')).toEqual({
            bypass: '*',
            scenarios: '',
        });
    });
});

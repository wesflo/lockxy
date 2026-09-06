import { describe, expect, it } from 'vitest';

import type { MockEndpoint } from '../interface.js';
import { createCookieSelectionValues } from './createCookieSelectionValues.js';

const endpoints: MockEndpoint[] = [{
    id: 'orders', method: 'GET', path: '/api/orders', scenarios: [{ id: 'success' }, { id: 'error' }]
}];

describe('createCookieSelectionValues', () => {
    it('maps route selections to current endpoint IDs', () => {
        const stored = new Map([['GET /api/orders', { active: false, scenarioId: 'error' }]]);
        expect(createCookieSelectionValues(endpoints, stored, true)).toEqual({
            bypass: 'orders', scenarios: 'orders:error'
        });
    });

    it('falls back to the first scenario and preserves global bypass', () => {
        const stored = new Map([['GET /api/orders', { active: false, scenarioId: 'removed' }]]);
        expect(createCookieSelectionValues(endpoints, stored, false)).toEqual({
            bypass: '*', scenarios: 'orders:success'
        });
    });

    it('ignores unknown routes and endpoints without IDs', () => {
        const stored = new Map([['POST /api/unknown', { active: false }]]);
        expect(createCookieSelectionValues([...endpoints, { path: '/api/no-id' }], stored, true)).toEqual({
            bypass: '', scenarios: ''
        });
    });
});

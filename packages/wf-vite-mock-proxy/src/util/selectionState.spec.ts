import { describe, expect, it } from 'vitest';

import type { MockEndpoint } from '../interface.js';
import { createCookieSelectionValues } from './createCookieSelectionValues.js';
import { mergeStoredEndpointSelections } from './mergeStoredEndpointSelections.js';

const endpoints: MockEndpoint[] = [{
    id: 'orders',
    method: 'GET',
    path: '/api/orders',
    scenarios: [{ id: 'success' }, { id: 'error' }]
}];

describe('selectionState', () => {
    it('maps method-and-path selections to current endpoint IDs', () => {
        const stored = new Map([['GET /api/orders', { active: false, scenarioId: 'error' }]]);

        expect(createCookieSelectionValues(endpoints, stored, true)).toEqual({
            bypass: 'orders',
            scenarios: 'orders:error'
        });
    });

    it('uses the first scenario when a stored scenario disappeared', () => {
        const stored = new Map([['GET /api/orders', { scenarioId: 'removed' }]]);

        expect(createCookieSelectionValues(endpoints, stored, true).scenarios).toBe('orders:success');
    });

    it('keeps the global proxy disabled while restoring scenario choices', () => {
        const stored = new Map([['GET /api/orders', { active: false, scenarioId: 'error' }]]);

        expect(createCookieSelectionValues(endpoints, stored, false)).toEqual({
            bypass: '*',
            scenarios: 'orders:error'
        });
    });

    it('ignores stored routes that are absent from the manifest and endpoints without IDs', () => {
        const stored = new Map([['POST /api/unknown', { active: false, scenarioId: 'error' }]]);

        expect(createCookieSelectionValues([...endpoints, { path: '/api/no-id' }], stored, true)).toEqual({
            bypass: '',
            scenarios: ''
        });
    });

    it('stores endpoint bypass and scenario state without removing other micro frontend entries', () => {
        const stored = new Map([['GET /api/other', { scenarioId: 'other' }]]);
        const result = mergeStoredEndpointSelections(
            stored,
            endpoints,
            { all: false, endpointIds: new Set(['orders']) },
            new Map([['orders', 'error']])
        );

        expect(result).toEqual(new Map([
            ['GET /api/other', { scenarioId: 'other' }],
            ['GET /api/orders', { active: false, scenarioId: 'error' }]
        ]));
    });

    it('removes a route entry after its endpoint returns to defaults', () => {
        const stored = new Map([['GET /api/orders', { active: false, scenarioId: 'error' }]]);

        expect(mergeStoredEndpointSelections(
            stored,
            endpoints,
            { all: false, endpointIds: new Set() },
            new Map()
        )).toEqual(new Map());
    });
});

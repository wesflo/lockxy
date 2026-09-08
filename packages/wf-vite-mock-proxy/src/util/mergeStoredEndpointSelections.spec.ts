import { describe, expect, it } from 'vitest';

import { mergeStoredEndpointSelections } from './mergeStoredEndpointSelections.js';

const endpoints = [{ id: 'orders', method: 'GET', path: '/api/orders' }];

describe('mergeStoredEndpointSelections', () => {
    it('updates current routes while retaining entries from other micro frontends', () => {
        const stored = new Map([['GET /api/other', { scenarioId: 'other' }]]);
        expect(
            mergeStoredEndpointSelections(
                stored,
                endpoints,
                { all: false, endpointIds: new Set(['orders']) },
                new Map([['orders', 'error']])
            )
        ).toEqual(
            new Map([
                ['GET /api/other', { scenarioId: 'other' }],
                ['GET /api/orders', { active: false, scenarioId: 'error' }],
            ])
        );
    });

    it('removes defaults and ignores endpoints without IDs', () => {
        const stored = new Map([['GET /api/orders', { active: false }]]);
        expect(
            mergeStoredEndpointSelections(
                stored,
                [...endpoints, { path: '/api/no-id' }],
                { all: false, endpointIds: new Set() },
                new Map()
            )
        ).toEqual(new Map());
    });
});

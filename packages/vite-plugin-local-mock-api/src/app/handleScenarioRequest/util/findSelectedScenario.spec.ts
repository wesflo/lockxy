import { describe, expect, it } from 'vitest';

import type { MockEndpoint } from '../../../interface.js';
import { findSelectedScenario } from './findSelectedScenario.js';

describe('findSelectedScenario', () => {
    it('automatically selects the only configured scenario', () => {
        const endpoint: MockEndpoint = {
            path: '/api/profile',
            scenarios: [{ id: 'success', label: 'Success', status: 200 }]
        };

        expect(findSelectedScenario(endpoint, new Map())).toEqual(endpoint.scenarios?.[0]);
    });

    it('uses the cookie selection when multiple scenarios exist', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            scenarios: [
                { id: 'success', label: 'Success' },
                { id: 'failure', label: 'Failure', status: 500 }
            ]
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', 'failure']]))).toEqual(
            endpoint.scenarios?.[1]
        );
        expect(findSelectedScenario(endpoint, new Map())).toBeUndefined();
    });
});

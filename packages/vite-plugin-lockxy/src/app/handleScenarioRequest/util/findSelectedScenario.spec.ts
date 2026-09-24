import { describe, expect, it } from 'vitest';

import type { MockEndpoint } from '../../../runtimeInterface.js';
import { findSelectedScenario } from './findSelectedScenario.js';

describe('findSelectedScenario', () => {
    it('leaves endpoints without scenarios on endpoint or convention resolution', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            file: 'profile.json',
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', 'removed']]))).toBeUndefined();
    });

    it('automatically selects the only configured scenario', () => {
        const endpoint: MockEndpoint = {
            path: '/api/profile',
            scenarios: [{ id: 'success', label: 'Success', status: 200 }],
        };

        expect(findSelectedScenario(endpoint, new Map())).toEqual(endpoint.scenarios?.[0]);
    });

    it('uses the cookie selection when multiple scenarios exist', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            scenarios: [
                { id: 'success', label: 'Success' },
                { id: 'failure', label: 'Failure', status: 500 },
            ],
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', 'failure']]))).toEqual(endpoint.scenarios?.[1]);
        expect(findSelectedScenario(endpoint, new Map())).toEqual(endpoint.scenarios?.[0]);
    });

    it('uses the first active scenario and ignores cookie selections', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            scenarios: [
                { id: 'success', active: false },
                { id: 'failure', active: true, status: 500 },
                { id: 'later', active: true, status: 503 },
            ],
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', 'success']]))).toEqual(endpoint.scenarios?.[1]);
    });

    it('returns no scenario when active is configured without a true value', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            scenarios: [{ id: 'success', active: false }, { id: 'failure' }],
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', 'failure']]))).toBeUndefined();
    });

    it('uses convention resolution when the default option was explicitly selected', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            scenarios: [
                { id: 'success', label: 'Success' },
                { id: 'failure', label: 'Failure' },
            ],
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', '']]))).toBeUndefined();
    });

    it('falls back to the first scenario when a stored selection no longer exists', () => {
        const endpoint: MockEndpoint = {
            id: 'profile',
            path: '/api/profile',
            scenarios: [
                { id: 'first', label: 'First' },
                { id: 'second', label: 'Second' },
            ],
        };

        expect(findSelectedScenario(endpoint, new Map([['profile', 'removed-fourth']]))).toEqual(
            endpoint.scenarios?.[0]
        );
    });
});

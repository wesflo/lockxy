import { describe, expect, it } from 'vitest';

import type { DemoCase, MockManifest } from '../interface';
import { findScenario } from './findScenario';

const testCase: DemoCase = {
    id: 'profile',
    title: 'Profile',
    description: 'Profile',
    group: 'Success',
    method: 'GET',
    path: '/api/users/profile',
    responseKind: 'json',
    endpointId: 'profile',
    expectedStatus: 200,
};

describe('findScenario', () => {
    it('automatically selects a sole scenario and otherwise uses the requested ID', () => {
        const sole: MockManifest = {
            endpoints: [{ id: 'profile', path: testCase.path, scenarios: [{ id: 'success' }] }],
        };
        expect(findScenario(sole, testCase)?.id).toBe('success');

        const multiple: MockManifest = {
            endpoints: [{ id: 'profile', path: testCase.path, scenarios: [{ id: 'success' }, { id: 'error' }] }],
        };
        expect(findScenario(multiple, { ...testCase, scenarioId: 'error' })?.id).toBe('error');
        expect(findScenario(multiple, testCase)).toBeUndefined();
    });
});

import { MANIFEST_ROUTE } from '@wesflo/local-mock-api-utils';

import type { DemoCase, MockEndpoint, MockManifest, MockScenario } from '../interface';

export const findEndpoint = (manifest: MockManifest | undefined, testCase: DemoCase): MockEndpoint | undefined =>
    manifest?.endpoints?.find(
        (endpoint) =>
            (testCase.endpointId ? endpoint.id === testCase.endpointId : endpoint.path === testCase.path) &&
            (!endpoint.method || endpoint.method === testCase.method)
    );

export const findScenario = (manifest: MockManifest | undefined, testCase: DemoCase): MockScenario | undefined => {
    const scenarios = findEndpoint(manifest, testCase)?.scenarios ?? [];

    if (scenarios.length === 1) {
        return scenarios[0];
    }

    return scenarios.find(({ id }) => id === testCase.scenarioId);
};

export const getGroups = (cases: readonly DemoCase[]): string[] => [...new Set(cases.map(({ group }) => group))];

export const loadManifest = async (
    request: typeof fetch = fetch,
    route: string = MANIFEST_ROUTE
): Promise<MockManifest> => {
    const response = await request(route);
    if (!response.ok) {
        throw new Error(`Manifest request failed with HTTP ${response.status}`);
    }

    return (await response.json()) as MockManifest;
};

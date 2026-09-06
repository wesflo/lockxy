import type { DemoCase, MockManifest, MockScenario } from '../interface';
import { findEndpoint } from './findEndpoint';

export const findScenario = (
    manifest: MockManifest | undefined,
    testCase: DemoCase
): MockScenario | undefined => {
    const scenarios = findEndpoint(manifest, testCase)?.scenarios ?? [];

    if (scenarios.length === 1) {
        return scenarios[0];
    }

    return scenarios.find(({ id }) => id === testCase.scenarioId);
};

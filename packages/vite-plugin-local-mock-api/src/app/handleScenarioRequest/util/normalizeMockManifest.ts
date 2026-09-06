import type {
    MockManifest,
    NormalizedMockEndpoint,
    NormalizedMockManifest,
    NormalizedMockScenario
} from '../../../interface.js';
import { createEndpointId } from './createEndpointId.js';
import { createScenarioId } from './createScenarioId.js';

export const normalizeMockManifest = (manifest: MockManifest): NormalizedMockManifest => {
    const { endpoints, ...root } = manifest;

    if (!endpoints) {
        return root;
    }

    return {
        ...root,
        endpoints: endpoints.map(
            (endpoint): NormalizedMockEndpoint => ({
                ...endpoint,
                id: endpoint.id ?? createEndpointId(endpoint.method, endpoint.path),
                scenarios: endpoint.scenarios?.map((scenario, index): NormalizedMockScenario => {
                    const id = scenario.id ?? createScenarioId(endpoint.path, index);

                    return {
                        ...scenario,
                        id,
                        label: scenario.label ?? scenario.id ?? id
                    };
                })
            })
        )
    };
};

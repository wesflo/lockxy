import type {
    MockManifest,
    NormalizedMockEndpoint,
    NormalizedMockManifest,
    NormalizedMockScenario,
} from '../../../interface.js';
import { createEndpointId } from './createEndpointId.js';
import { createScenarioId } from './createScenarioId.js';

export const normalizeMockManifest = (manifest: MockManifest): NormalizedMockManifest => {
    const { endpoints, ...root } = manifest;

    if (!endpoints) {
        return root;
    }

    const endpointIds = new Set(endpoints.flatMap((endpoint) => (endpoint.id ? [endpoint.id] : [])));

    return {
        ...root,
        endpoints: endpoints.map((endpoint): NormalizedMockEndpoint => {
            let id = endpoint.id;
            if (!id) {
                const generatedId = createEndpointId(endpoint.method, endpoint.path);
                id = generatedId;
                let suffix = 2;
                while (endpointIds.has(id)) {
                    id = `${generatedId}_${suffix}`;
                    suffix += 1;
                }
                endpointIds.add(id);
            }

            return {
                ...endpoint,
                id,
                scenarios: endpoint.scenarios?.map((scenario, index): NormalizedMockScenario => {
                    const scenarioId = scenario.id ?? createScenarioId(endpoint.path, index);

                    return {
                        ...scenario,
                        id: scenarioId,
                        label: scenario.label ?? scenario.id ?? scenarioId,
                    };
                }),
            };
        }),
    };
};

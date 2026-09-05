import type {
    MockManifest,
    NormalizedMockEndpoint,
    NormalizedMockManifest,
    NormalizedMockScenario
} from '../../../interface.js';

const toGeneratedId = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'mock';

export const createEndpointId = (method: string | undefined, path: string): string =>
    toGeneratedId(`${method ?? 'any'}_${path}`);

export const createScenarioId = (endpointPath: string, index: number): string =>
    toGeneratedId(`${endpointPath}_${index + 1}`);

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

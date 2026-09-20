import type { MockManifest } from '@wesflo/local-mock-api-utils';

import { createScenarioId } from './createScenarioId.js';
import { validateMethods } from './validateMethods.js';
import { validateOptionalId } from './validateOptionalId.js';
import { validateOptionalText } from './validateOptionalText.js';
import { validateReferencedFile } from './validateReferencedFile.js';
import { validateResponse } from './validateResponse.js';

export const validateMockManifest = async (manifest: MockManifest, fileName: string, mockRoot: URL): Promise<void> => {
    const endpoints = manifest.endpoints ?? [];
    const endpointIssues = await Promise.all(
        endpoints.map(async (endpoint, endpointIndex): Promise<readonly string[]> => {
            const path = `${fileName}.endpoints[${endpointIndex}]`;
            const duplicateEndpointId =
                typeof endpoint.id === 'string' &&
                endpoint.id.length > 0 &&
                endpoints.slice(0, endpointIndex).some((candidate) => candidate.id === endpoint.id);
            const scenarios = endpoint.scenarios ?? [];
            const scenarioIssues = await Promise.all(
                scenarios.map(async (scenario, scenarioIndex): Promise<readonly string[]> => {
                    const scenarioPath = `${path}.scenarios[${scenarioIndex}]`;
                    const scenarioId = scenario.id ?? createScenarioId(endpoint.path, scenarioIndex);
                    const duplicateScenarioId = scenarios.slice(0, scenarioIndex).some((candidate, candidateIndex) => {
                        const candidateId = candidate.id ?? createScenarioId(endpoint.path, candidateIndex);
                        return candidateId === scenarioId;
                    });

                    return [
                        ...validateResponse(scenario, scenarioPath),
                        ...validateOptionalId(scenario.id, `${scenarioPath}.id`),
                        ...validateOptionalText(scenario.label, `${scenarioPath}.label`),
                        ...(scenario.active !== undefined && typeof scenario.active !== 'boolean'
                            ? [`${scenarioPath}.active: must be a boolean`]
                            : []),
                        ...(duplicateScenarioId ? [`${scenarioPath}.id: duplicate scenario ID "${scenarioId}"`] : []),
                        ...(await validateReferencedFile(scenario.file, scenarioPath, mockRoot)),
                    ];
                })
            );

            return [
                ...validateResponse(endpoint, path),
                ...validateOptionalId(endpoint.id, `${path}.id`),
                ...validateOptionalText(endpoint.label, `${path}.label`),
                ...validateMethods(endpoint.method, `${path}.method`),
                ...('active' in endpoint
                    ? [`${path}.active: is not supported on endpoints; use preventMock instead`]
                    : []),
                ...(endpoint.preventMock !== undefined && typeof endpoint.preventMock !== 'boolean'
                    ? [`${path}.preventMock: must be a boolean`]
                    : []),
                ...(duplicateEndpointId ? [`${path}.id: duplicate endpoint ID "${endpoint.id}"`] : []),
                ...(await validateReferencedFile(endpoint.file, path, mockRoot)),
                ...scenarioIssues.flat(),
            ];
        })
    );
    const issues = [
        ...validateResponse(manifest, fileName),
        ...validateOptionalText(manifest.$schema, `${fileName}.$schema`),
        ...validateOptionalId(manifest.id, `${fileName}.id`),
        ...(manifest.preventMock !== undefined && typeof manifest.preventMock !== 'boolean'
            ? [`${fileName}.preventMock: must be a boolean`]
            : []),
        ...endpointIssues.flat(),
    ];

    if (issues.length > 0) {
        throw new TypeError(`Invalid mock manifest:\n- ${issues.join('\n- ')}`);
    }
};

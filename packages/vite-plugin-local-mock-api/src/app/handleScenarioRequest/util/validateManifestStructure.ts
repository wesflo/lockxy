import type { MockManifest } from '../../../interface.js';

const isObject = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const validateManifestStructure = (value: unknown, fileName: string): MockManifest => {
    if (!isObject(value)) {
        throw new TypeError(`${fileName}: root must be an object`);
    }

    if (value.endpoints !== undefined && !Array.isArray(value.endpoints)) {
        throw new TypeError(`${fileName}.endpoints: must be an array`);
    }

    value.endpoints?.forEach((endpoint, endpointIndex) => {
        const path = `${fileName}.endpoints[${endpointIndex}]`;

        if (!isObject(endpoint)) {
            throw new TypeError(`${path}: must be an object`);
        }
        if (typeof endpoint.path !== 'string' || !endpoint.path.startsWith('/')) {
            throw new TypeError(`${path}.path: must be a string beginning with /`);
        }
        if (endpoint.method !== undefined && typeof endpoint.method !== 'string') {
            throw new TypeError(`${path}.method: must be a string`);
        }
        if (endpoint.scenarios !== undefined && !Array.isArray(endpoint.scenarios)) {
            throw new TypeError(`${path}.scenarios: must be an array`);
        }
        endpoint.scenarios?.forEach((scenario, scenarioIndex) => {
            if (!isObject(scenario)) {
                throw new TypeError(`${path}.scenarios[${scenarioIndex}]: must be an object`);
            }
        });
    });

    return value as unknown as MockManifest;
};

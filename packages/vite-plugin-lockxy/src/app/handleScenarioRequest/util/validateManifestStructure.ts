import type { MockManifest } from '../../../interface.js';

const isObject = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const validateEndpointStructure = (endpoint: unknown, path: string): void => {
    if (!isObject(endpoint)) {
        throw new TypeError(`${path}: must be an object`);
    }
    if (typeof endpoint.path !== 'string' || !endpoint.path.startsWith('/')) {
        throw new TypeError(`${path}.path: must be a string beginning with /`);
    }
    if (endpoint.method !== undefined && typeof endpoint.method !== 'string' && !Array.isArray(endpoint.method)) {
        throw new TypeError(`${path}.method: must be a string or an array of strings`);
    }
    if (Array.isArray(endpoint.method)) {
        if (endpoint.method.length === 0) {
            throw new TypeError(`${path}.method: must contain at least one method`);
        }
        endpoint.method.forEach((method, methodIndex) => {
            if (typeof method !== 'string') {
                throw new TypeError(`${path}.method[${methodIndex}]: must be a string`);
            }
        });
    }
    if (endpoint.scenarios !== undefined && !Array.isArray(endpoint.scenarios)) {
        throw new TypeError(`${path}.scenarios: must be an array`);
    }
    endpoint.scenarios?.forEach((scenario, scenarioIndex) => {
        if (!isObject(scenario)) {
            throw new TypeError(`${path}.scenarios[${scenarioIndex}]: must be an object`);
        }
    });
};

export const validateManifestStructure = (
    value: unknown,
    fileName: string,
    onInvalidEndpoint?: (message: string) => void
): MockManifest => {
    if (!isObject(value)) {
        throw new TypeError(`${fileName}: root must be an object`);
    }

    if (value.endpoints !== undefined && !Array.isArray(value.endpoints)) {
        throw new TypeError(`${fileName}.endpoints: must be an array`);
    }
    if (value.id !== undefined && typeof value.id !== 'string') {
        throw new TypeError(`${fileName}.id: must be a string`);
    }

    const endpoints = value.endpoints?.flatMap((endpoint, endpointIndex) => {
        const path = `${fileName}.endpoints[${endpointIndex}]`;

        try {
            validateEndpointStructure(endpoint, path);
            return [endpoint];
        } catch (error) {
            if (!onInvalidEndpoint) {
                throw error;
            }
            onInvalidEndpoint(error instanceof Error ? error.message : String(error));
            return [];
        }
    });

    if (!endpoints || endpoints.length === value.endpoints?.length) {
        return value as unknown as MockManifest;
    }

    return { ...value, endpoints } as unknown as MockManifest;
};

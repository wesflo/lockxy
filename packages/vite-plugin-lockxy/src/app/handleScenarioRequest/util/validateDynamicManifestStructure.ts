import type { DynamicMockManifest } from '../../../interface.js';
import { validateManifestStructure } from './validateManifestStructure.js';

export const validateDynamicManifestStructure = (value: unknown, fileName: string): DynamicMockManifest => {
    const manifest = validateManifestStructure(value, fileName);

    if (!manifest.endpoints) {
        throw new TypeError(`${fileName}.endpoints: must be an array`);
    }

    manifest.endpoints.forEach((endpoint, index) => {
        const path = `${fileName}.endpoints[${index}]`;
        if (typeof endpoint.handler !== 'function') {
            throw new TypeError(`${path}.handler: must be a function`);
        }
        if (endpoint.scenarios !== undefined) {
            throw new TypeError(`${path}.scenarios: dynamic endpoints do not support scenarios`);
        }
    });

    return {
        ...(manifest.id === undefined ? {} : { id: manifest.id }),
        endpoints: manifest.endpoints.map((endpoint) => ({ ...endpoint, dynamic: true })),
    } as DynamicMockManifest;
};

import { toMethodArray } from '@wesflo/local-mock-api-utils';

import type { MockEndpoint, MockManifest } from '../../../interface.js';
import { matchManifestPath } from './matchManifestPath.js';

export const findMockEndpoint = (
    manifest: MockManifest,
    method: string | undefined,
    pathname: string
): MockEndpoint | undefined => {
    const normalizedMethod = method?.toUpperCase();

    return manifest.endpoints?.find((endpoint) => {
        if (endpoint.active === false) {
            return false;
        }

        const methods = toMethodArray(endpoint.method).map((value) => value.toUpperCase());
        if (methods.length > 0 && !methods.includes(normalizedMethod ?? '')) {
            return false;
        }

        return matchManifestPath(endpoint.path, pathname);
    });
};

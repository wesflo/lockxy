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

        if (endpoint.method && endpoint.method.toUpperCase() !== normalizedMethod) {
            return false;
        }

        return matchManifestPath(endpoint.path, pathname);
    });
};

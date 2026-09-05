import type { MockEndpoint, MockManifest } from '../../../interface.js';

export const findMockEndpoint = (
    manifest: MockManifest,
    method: string | undefined,
    pathname: string
): MockEndpoint | undefined => {
    const requestParts = pathname.split('/').filter(Boolean);
    const normalizedMethod = method?.toUpperCase();

    return manifest.endpoints?.find((endpoint) => {
        if (endpoint.active === false) {
            return false;
        }

        if (endpoint.method && endpoint.method.toUpperCase() !== normalizedMethod) {
            return false;
        }

        const endpointParts = endpoint.path.split('/').filter(Boolean);

        if (endpointParts.length !== requestParts.length) {
            return false;
        }

        return endpointParts.every((part, index) => part.startsWith(':') || part === requestParts[index]);
    });
};

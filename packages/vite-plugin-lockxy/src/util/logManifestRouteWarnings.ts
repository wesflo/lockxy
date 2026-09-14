import { toMethodArray } from '@wesflo/local-mock-api-utils';

import type { ManifestReadResult, NormalizedMockEndpoint } from '../interface.js';
import { logWarning } from './logWarning.js';

const normalizePath = (path: string): string => `/${path.split('/').filter(Boolean).join('/')}`;

const methodsOverlap = (left: NormalizedMockEndpoint, right: NormalizedMockEndpoint): boolean => {
    const leftMethods = toMethodArray(left.method).map((method) => method.toUpperCase());
    const rightMethods = toMethodArray(right.method).map((method) => method.toUpperCase());

    return (
        leftMethods.length === 0 ||
        rightMethods.length === 0 ||
        leftMethods.some((method) => rightMethods.includes(method))
    );
};

export const logManifestRouteWarnings = (enabled: boolean, fileName: string, result: ManifestReadResult): void => {
    if (!enabled || result.status !== 'valid') {
        return;
    }

    result.warnings?.forEach((warning) => logWarning(enabled, warning));

    const endpoints = result.manifest.endpoints ?? [];
    const overlaps = new Map<string, Set<number>>();

    endpoints.forEach((endpoint, endpointIndex) => {
        if (endpoint.active === false) {
            return;
        }

        endpoints.slice(endpointIndex + 1).forEach((candidate, candidateOffset) => {
            if (
                candidate.active === false ||
                normalizePath(endpoint.path) !== normalizePath(candidate.path) ||
                !methodsOverlap(endpoint, candidate)
            ) {
                return;
            }

            const route = normalizePath(endpoint.path);
            const indexes = overlaps.get(route) ?? new Set<number>();
            indexes.add(endpointIndex);
            indexes.add(endpointIndex + candidateOffset + 1);
            overlaps.set(route, indexes);
        });
    });

    overlaps.forEach((indexes, route) => {
        const locations = [...indexes].map((index) => `endpoints[${index}]`).join(', ');
        logWarning(
            enabled,
            `${fileName}: route "${route}" has multiple matching configurations at ${locations}. ` +
                'The most specific configuration wins; manifest order breaks ties.'
        );
    });
};

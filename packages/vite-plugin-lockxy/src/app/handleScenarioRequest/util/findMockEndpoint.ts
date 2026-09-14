import { toMethodArray } from '@wesflo/local-mock-api-utils';

import type { MockEndpoint, MockManifest } from '../../../interface.js';
import { matchManifestPath } from './matchManifestPath.js';

interface EndpointSpecificity {
    literalSegments: number;
    optionalSegments: number;
    dynamicSegments: number;
    methodCount: number;
}

const getSpecificity = (endpoint: MockEndpoint): EndpointSpecificity => {
    const segments = endpoint.path.split('/').filter(Boolean);
    const methods = toMethodArray(endpoint.method);

    return {
        literalSegments: segments.filter((segment) => !segment.startsWith(':')).length,
        optionalSegments: segments.filter((segment) => segment.startsWith(':') && segment.endsWith('?')).length,
        dynamicSegments: segments.filter((segment) => segment.startsWith(':')).length,
        methodCount: methods.length || Number.POSITIVE_INFINITY,
    };
};

const isMoreSpecific = (candidate: EndpointSpecificity, current: EndpointSpecificity): boolean =>
    candidate.literalSegments > current.literalSegments ||
    (candidate.literalSegments === current.literalSegments &&
        (candidate.optionalSegments < current.optionalSegments ||
            (candidate.optionalSegments === current.optionalSegments &&
                (candidate.dynamicSegments < current.dynamicSegments ||
                    (candidate.dynamicSegments === current.dynamicSegments &&
                        candidate.methodCount < current.methodCount)))));

export const findMockEndpoint = (
    manifest: MockManifest,
    method: string | undefined,
    pathname: string
): MockEndpoint | undefined => {
    const normalizedMethod = method?.toUpperCase();
    let match: { endpoint: MockEndpoint; specificity: EndpointSpecificity } | undefined;

    for (const endpoint of manifest.endpoints ?? []) {
        if (endpoint.active === false) {
            continue;
        }

        const methods = toMethodArray(endpoint.method).map((value) => value.toUpperCase());
        if (methods.length > 0 && !methods.includes(normalizedMethod ?? '')) {
            continue;
        }

        if (!matchManifestPath(endpoint.path, pathname)) {
            continue;
        }

        const specificity = getSpecificity(endpoint);
        if (!match || isMoreSpecific(specificity, match.specificity)) {
            match = { endpoint, specificity };
        }
    }

    return match?.endpoint;
};

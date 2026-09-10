import { toMethodArray } from '@wesflo/local-mock-api-utils';

import type { MockEndpoint } from '../interface.js';

export const getEndpointSelectionKey = (endpoint: MockEndpoint): string => {
    const methods = toMethodArray(endpoint.method)
        .map((method) => method.toUpperCase())
        .sort()
        .join('|');

    return `${methods || '*'} ${endpoint.path}`;
};

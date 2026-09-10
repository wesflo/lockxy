import { toMethodArray } from '@wesflo/local-mock-api-utils';

import type { MockMethod } from '../../../interface.js';

const toGeneratedId = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'mock';

export const createEndpointId = (method: MockMethod | undefined, path: string): string => {
    const methodId = toMethodArray(method)
        .map((value) => value.toLocaleLowerCase())
        .sort()
        .join('_');

    return toGeneratedId(`${methodId || 'any'}_${path}`);
};

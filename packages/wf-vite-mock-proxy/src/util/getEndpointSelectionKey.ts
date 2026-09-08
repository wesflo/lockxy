import type { MockEndpoint } from '../interface.js';

export const getEndpointSelectionKey = (endpoint: MockEndpoint): string =>
    `${endpoint.method?.toUpperCase() ?? '*'} ${endpoint.path}`;

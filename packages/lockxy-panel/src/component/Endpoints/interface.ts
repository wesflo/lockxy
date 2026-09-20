import type { MockEndpoint } from '@wesflo/local-mock-api-utils';

export interface ProxyChangeDetail {
    active: boolean;
}

export interface EndpointChangeDetail {
    endpoint: MockEndpoint;
    active: boolean;
}

export interface ScenarioChangeDetail {
    endpoint: MockEndpoint;
    scenarioId: string;
}

export interface QueryChangeDetail {
    query: string;
}

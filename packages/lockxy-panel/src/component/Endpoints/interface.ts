import type { MockEndpoint } from '../../interface.js';

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

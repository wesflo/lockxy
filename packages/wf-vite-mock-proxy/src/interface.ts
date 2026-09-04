export interface BypassSelection {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

export interface MockManifest {
    endpoints: MockEndpoint[];
}

export interface MockEndpoint {
    id: string;
    label?: string;
    active?: boolean;
    method: string;
    path: string;
    scenarios: MockScenario[];
}

export interface MockScenario {
    id: string;
    label: string;
    status?: number;
    file?: string;
    delay?: number;
}

export interface EndpointViewState {
    bypass: BypassSelection;
    scenarios: ReadonlyMap<string, string>;
}

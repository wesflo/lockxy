export interface BypassSelection {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

export interface MockManifest {
    delay?: number;
    endpoints?: MockEndpoint[];
}

export interface MockEndpoint {
    id?: string;
    label?: string;
    active?: boolean;
    method?: string;
    path: string;
    status?: number;
    file?: string;
    delay?: number;
    scenarios?: MockScenario[];
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

export type MockProxyTab = 'endpoints' | 'settings';

export interface Position {
    x: number;
    y: number;
}

export interface DragState {
    offsetX: number;
    offsetY: number;
}

export type DemoMethod = 'GET' | 'POST';

export type DemoResponseKind = 'json' | 'text' | 'blob';

export type DemoResultState = 'success' | 'error';

export interface DemoCase {
    id: string;
    group: string;
    endpointId?: string;
    title: string;
    description: string;
    method: DemoMethod;
    path: string;
    responseKind: DemoResponseKind;
    expectedStatus: number;
    body?: unknown;
    downloadName?: string;
}

export interface DemoResult {
    state: DemoResultState;
    duration: number;
    body: string;
    blob?: Blob;
    filename?: string | null;
    error?: string;
}

export interface MockManifest {
    endpoints: MockEndpoint[];
}

export interface MockEndpoint {
    id: string;
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

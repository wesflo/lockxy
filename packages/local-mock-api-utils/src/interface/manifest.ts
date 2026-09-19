export type MockDelay = number | readonly [number, number];
export type MockMethod = string | readonly string[];

export interface MockManifest {
    $schema?: string;
    id?: string;
    preventMock?: boolean;
    delay?: MockDelay;
    endpoints?: MockEndpoint[];
}

export interface MockResponseConfig {
    status?: number;
    file?: string;
    delay?: MockDelay;
}

export interface MockEndpoint extends MockResponseConfig {
    id?: string;
    label?: string;
    preventMock?: boolean;
    method?: MockMethod;
    path: string;
    scenarios?: MockScenario[];
}

export interface MockScenario extends MockResponseConfig {
    id?: string;
    label?: string;
    active?: boolean;
}

export interface NormalizedMockManifest extends Omit<MockManifest, 'endpoints'> {
    endpoints?: NormalizedMockEndpoint[];
}

export interface NormalizedMockEndpoint extends Omit<MockEndpoint, 'id' | 'scenarios'> {
    id: string;
    scenarios?: NormalizedMockScenario[];
}

export interface NormalizedMockScenario extends Omit<MockScenario, 'id' | 'label'> {
    id: string;
    label: string;
}

import type { Buffer } from 'node:buffer';

export interface MockApiPluginOptions {
    mockRoot?: URL;
    internalPrefix?: string;
    extensions?: readonly string[];
    contentTypes?: Readonly<Record<string, string>>;
    manifestFileName?: string;
}

export interface MockFile {
    content: Buffer;
    extension: string;
}

export type NextFunction = () => void;

export type ResponseBody = string | Buffer;

export type ResponseHeaders = Record<string, string | number | readonly string[]>;

export interface MockManifest {
    endpoints: MockEndpoint[];
}

export interface MockEndpoint {
    id: string;
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

export type ManifestReadResult =
    | { status: 'valid'; manifest: MockManifest }
    | { status: 'missing' }
    | { status: 'invalid'; error: Error };

export type ScenarioSelections = ReadonlyMap<string, string>;

export interface BypassSelections {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

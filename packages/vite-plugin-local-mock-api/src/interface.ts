import type { Buffer } from 'node:buffer';

export interface MockApiPluginOptions {
    mockRoot?: URL;
    requestPrefixes?: string | readonly string[];
    extensions?: readonly string[];
    contentTypes?: Readonly<Record<string, string>>;
    manifestFileName?: string;
    debug?: boolean;
    logging?: boolean;
}

export interface ResolvedMockApiPluginOptions extends Omit<Required<MockApiPluginOptions>, 'requestPrefixes'> {
    requestPrefixes: readonly string[];
}

export interface MockApiRuntimeOptions extends ResolvedMockApiPluginOptions {
    filePathCache: Map<string, string>;
}

export interface MockFile {
    content: Buffer;
    extension: string;
}

export interface MockFileLookupResult {
    file: MockFile;
    cacheHit: boolean;
}

export type NextFunction = () => void;

export type ResponseBody = string | Buffer;

export type ResponseHeaders = Record<string, string | number | readonly string[]>;

export type MockDelay = number | readonly [number, number];

export interface MockManifest {
    $schema?: string;
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
    active?: boolean;
    method?: string;
    path: string;
    scenarios?: MockScenario[];
}

export interface MockScenario extends MockResponseConfig {
    id?: string;
    label?: string;
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

export type ManifestReadResult =
    | { status: 'valid'; manifest: NormalizedMockManifest }
    | { status: 'missing' }
    | { status: 'invalid'; error: Error };

export type ScenarioSelections = ReadonlyMap<string, string>;

export interface BypassSelections {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

export type MockResponseSource = 'manifest' | 'cache' | 'convention' | 'passthrough' | 'error';

export interface RequestLogDetails {
    method: string;
    url: string;
    delay: number;
    status: number;
    source: MockResponseSource;
}

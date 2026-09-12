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
    fileIndex: ReadonlySet<string>;
    loadManifestModule?: ManifestModuleLoader;
    manifestResult: ManifestReadResult;
}

export interface MockFile {
    content: Buffer;
    extension: string;
}

export type NextFunction = () => void;

export type ResponseBody = string | Buffer;

export type ResponseHeaders = Record<string, string | number | readonly string[]>;

export type MockDelay = number | readonly [number, number];
export type MockMethod = string | readonly string[];

export interface MockManifest {
    $schema?: string;
    id?: string;
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
    method?: MockMethod;
    path: string;
    scenarios?: MockScenario[];
    dynamic?: boolean;
    handler?: DynamicEndpointHandler;
}

export interface MockScenario extends MockResponseConfig {
    id?: string;
    label?: string;
}

export interface DynamicEndpointContext {
    request: Request;
    params: Readonly<Record<string, string>>;
    searchParams: URLSearchParams;
    method: string;
    pathname: string;
}

export interface DynamicResponse {
    status?: number;
    delay?: MockDelay;
    headers?: Readonly<Record<string, string>>;
    body?: unknown;
}

export type DynamicEndpointHandler = (
    context: DynamicEndpointContext
) => DynamicResponse | Promise<DynamicResponse>;

export interface DynamicMockEndpoint extends Omit<MockEndpoint, 'delay' | 'file' | 'handler' | 'scenarios' | 'status'> {
    handler: DynamicEndpointHandler;
}

export interface DynamicMockManifest {
    id?: string;
    endpoints: DynamicMockEndpoint[];
}

export type ManifestModuleLoader = (fileName: string) => Promise<unknown>;

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

export type MockResponseSource = 'manifest' | 'convention' | 'passthrough' | 'error';

export interface RequestLogDetails {
    method: string;
    url: string;
    delay: number;
    status: number;
    source: MockResponseSource;
}

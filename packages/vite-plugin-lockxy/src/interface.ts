import type { Buffer } from 'node:buffer';
import type { MockDelay, MockEndpoint } from '@wesflo/local-mock-api-utils';

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

export interface MockFile {
    content: Buffer;
    extension: string;
}

export type NextFunction = () => void;

export type ResponseBody = string | Buffer;

export type ResponseHeaders = Record<string, string | number | readonly string[]>;

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

export type DynamicEndpointHandler = (context: DynamicEndpointContext) => DynamicResponse | Promise<DynamicResponse>;

export interface DynamicMockEndpoint extends Omit<MockEndpoint, 'delay' | 'file' | 'scenarios' | 'status'> {
    handler: DynamicEndpointHandler;
}

export interface DynamicMockManifest {
    id?: string;
    endpoints: DynamicMockEndpoint[];
}

export type ManifestModuleLoader = (fileName: string) => Promise<unknown>;
export type MockResponseSource = 'manifest' | 'convention' | 'passthrough' | 'error';

export interface RequestLogDetails {
    method: string;
    url: string;
    delay: number;
    status: number;
    source: MockResponseSource;
}

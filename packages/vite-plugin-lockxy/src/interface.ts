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

export interface MockFile {
    content: Buffer;
    extension: string;
}

export type NextFunction = () => void;

export type ResponseBody = string | Buffer;

export type ResponseHeaders = Record<string, string | number | readonly string[]>;

export type MockResponseSource = 'manifest' | 'convention' | 'passthrough' | 'error';

export interface RequestLogDetails {
    method: string;
    url: string;
    delay: number;
    status: number;
    source: MockResponseSource;
}

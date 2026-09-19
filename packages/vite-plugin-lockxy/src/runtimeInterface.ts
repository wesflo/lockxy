import type { NormalizedMockManifest } from '@wesflo/local-mock-api-utils';
import type { ResolvedMockApiPluginOptions } from './interface.js';

export type {
    MockDelay,
    MockEndpoint,
    MockManifest,
    MockMethod,
    MockResponseConfig,
    MockScenario,
    NormalizedMockEndpoint,
    NormalizedMockManifest,
    NormalizedMockScenario,
} from '@wesflo/local-mock-api-utils';

export interface MockApiRuntimeOptions extends ResolvedMockApiPluginOptions {
    fileIndex: ReadonlySet<string>;
    manifestResult: ManifestReadResult;
}

export type ManifestReadResult =
    | { status: 'valid'; manifest: NormalizedMockManifest; warnings?: readonly string[] }
    | { status: 'missing' }
    | { status: 'invalid'; error: Error };

export type ScenarioSelections = ReadonlyMap<string, string>;

export interface BypassSelections {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

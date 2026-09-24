import type {
    MockEndpoint as SharedMockEndpoint,
    MockManifest as SharedMockManifest,
    NormalizedMockEndpoint as SharedNormalizedMockEndpoint,
    NormalizedMockManifest as SharedNormalizedMockManifest,
} from '@wesflo/local-mock-api-utils';
import type { DynamicEndpointHandler, ManifestModuleLoader, ResolvedMockApiPluginOptions } from './interface.js';

export type {
    MockDelay,
    MockMethod,
    MockResponseConfig,
    MockScenario,
    NormalizedMockScenario,
} from '@wesflo/local-mock-api-utils';

export interface MockEndpoint extends SharedMockEndpoint {
    handler?: DynamicEndpointHandler;
}

export interface MockManifest extends Omit<SharedMockManifest, 'endpoints'> {
    endpoints?: MockEndpoint[];
}

export interface NormalizedMockEndpoint extends Omit<SharedNormalizedMockEndpoint, 'handler'> {
    handler?: DynamicEndpointHandler;
}

export interface NormalizedMockManifest extends Omit<SharedNormalizedMockManifest, 'endpoints'> {
    endpoints?: NormalizedMockEndpoint[];
}

export interface MockApiRuntimeOptions extends ResolvedMockApiPluginOptions {
    fileIndex: ReadonlySet<string>;
    loadManifestModule?: ManifestModuleLoader;
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

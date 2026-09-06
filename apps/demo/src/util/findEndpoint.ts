import type { DemoCase, MockEndpoint, MockManifest } from '../interface';

export const findEndpoint = (manifest: MockManifest | undefined, testCase: DemoCase): MockEndpoint | undefined =>
    manifest?.endpoints?.find(
        (endpoint) =>
            (testCase.endpointId ? endpoint.id === testCase.endpointId : endpoint.path === testCase.path) &&
            (!endpoint.method || endpoint.method === testCase.method)
    );

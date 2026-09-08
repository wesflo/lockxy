export { WfViteMockProxy } from './element.js';
export { MOCK_PROXY_TAG_NAME } from './constant.js';
export type { MockEndpoint, MockManifest, MockScenario } from './interface.js';

declare global {
    interface HTMLElementTagNameMap {
        'wf-vite-mock-proxy': import('./element.js').WfViteMockProxy;
    }
}

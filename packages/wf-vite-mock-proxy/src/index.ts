export { WfViteMockProxy } from './component/MockProxy/MockProxy.js';
export { MOCK_PROXY_TAG_NAME } from './constant.js';
export type { MockEndpoint, MockManifest, MockScenario } from './interface.js';

declare global {
    interface HTMLElementTagNameMap {
        'wf-vite-mock-proxy': import('./component/MockProxy/MockProxy.js').WfViteMockProxy;
    }
}

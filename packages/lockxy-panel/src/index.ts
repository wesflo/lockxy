export { WfLockxyPanel } from './element.js';
export { MOCK_PROXY_TAG_NAME } from './constant.js';

declare global {
    interface HTMLElementTagNameMap {
        'wf-lockxy-panel': import('./element.js').WfLockxyPanel;
    }
}

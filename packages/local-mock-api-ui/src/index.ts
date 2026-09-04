export { WfBadge } from './badge';
export { WfButton } from './button';
export { WfIcon, type WfIconName } from './icon';
export { WesfloMockProxy } from './mockProxy';
export { WfPanel } from './panel';
export { theme } from './theme';
export { wfElement } from './wfElement';

declare global {
    interface HTMLElementTagNameMap {
        'wf-badge': import('./badge').WfBadge;
        'wf-button': import('./button').WfButton;
        'wf-icon': import('./icon').WfIcon;
        'wf-panel': import('./panel').WfPanel;
        'wesflo-mock-proxy': import('./mockProxy').WesfloMockProxy;
    }
}

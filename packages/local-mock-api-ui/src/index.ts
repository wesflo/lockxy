export { WfBadge } from './Badge/Badge.js';
export type { WfBadgeTone } from './Badge/interface.js';
export { WfButton } from './Button/Button.js';
export type { WfButtonVariant } from './Button/interface.js';
export { WfIcon } from './Icon/Icon.js';
export type { WfIconName } from './Icon/interface.js';
export { WfPanel } from './Panel/Panel.js';
export { theme } from './style/theme.style.js';
export { wfElement } from './util/wfElement.js';

declare global {
    interface HTMLElementTagNameMap {
        'wf-badge': import('./Badge/Badge.js').WfBadge;
        'wf-button': import('./Button/Button.js').WfButton;
        'wf-icon': import('./Icon/Icon.js').WfIcon;
        'wf-panel': import('./Panel/Panel.js').WfPanel;
    }
}

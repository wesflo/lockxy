export { WfBadge } from './Badge/element.js';
export type { WfBadgeTone } from './Badge/interface.js';
export { WfButton } from './Button/element.js';
export type { WfButtonVariant } from './Button/interface.js';
export { WfIcon } from './Icon/element.js';
export type { WfIconName } from './Icon/interface.js';
export { WfPanel } from './Panel/element.js';
export { WfSwitch } from './Switch/element.js';
export type { SwitchChangeDetail } from './Switch/interface.js';
export { theme } from './style/theme.style.js';
export { wfElement } from './util/wfElement.js';

declare global {
    interface HTMLElementTagNameMap {
        'wf-badge': import('./Badge/element.js').WfBadge;
        'wf-button': import('./Button/element.js').WfButton;
        'wf-icon': import('./Icon/element.js').WfIcon;
        'wf-panel': import('./Panel/element.js').WfPanel;
        'wf-switch': import('./Switch/element.js').WfSwitch;
    }
}

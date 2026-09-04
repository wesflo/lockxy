export { LocalMockBadge } from './badge';
export { LocalMockButton } from './button';
export { LocalMockIcon, type LocalMockIconName } from './icon';
export { LocalMockPanel } from './panel';
export { theme } from './theme';

declare global {
    interface HTMLElementTagNameMap {
        'lm-badge': import('./badge').LocalMockBadge;
        'lm-button': import('./button').LocalMockButton;
        'lm-icon': import('./icon').LocalMockIcon;
        'lm-panel': import('./panel').LocalMockPanel;
    }
}

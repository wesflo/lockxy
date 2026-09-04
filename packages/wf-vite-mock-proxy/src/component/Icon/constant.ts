import { svg } from 'lit';

import type { IconName } from './interface.js';

export const ICON_PATHS: Record<IconName, ReturnType<typeof svg>> = {
    close: svg`<path d="m6 6 12 12M18 6 6 18"/>`,
    refresh: svg`<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8A7 7 0 0 1 18 6l2 6M18 16a7 7 0 0 1-11.9 2L4 12"/>`,
    rocket: svg`<path d="M14.5 5.5c2.3-2.3 5.3-2.5 5.3-2.5s-.2 3-2.5 5.3l-5.7 5.7-4.2-4.2 7.1-4.3Z"/><path d="m9.2 8-4.7.7-2 2 4.9 1.4m6.3-.5-.7 4.7-2 2-1.4-4.9M5 16l-2 5 5-2m7.2-12.2h.1"/>`,
    search: svg`<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>`,
    settings: svg`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>`,
    sliders: svg`<path d="M4 7h5m4 0h7M4 17h7m4 0h5"/><circle cx="11" cy="7" r="2"/><circle cx="13" cy="17" r="2"/>`,
};

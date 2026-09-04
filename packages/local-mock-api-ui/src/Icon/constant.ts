import { svg } from 'lit';

import type { WfIconName } from './interface.js';

export const WF_ICON_TAG_NAME = 'wf-icon';

export const ICON_PATHS: Record<WfIconName, ReturnType<typeof svg>> = {
    bolt: svg`<path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z"/>`,
    book: svg`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"/>`,
    check: svg`<path d="m5 12 4 4L19 6"/>`,
    clock: svg`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
    code: svg`<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>`,
    copy: svg`<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/>`,
    close: svg`<path d="m6 6 12 12M18 6 6 18"/>`,
    folder: svg`<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>`,
    play: svg`<path d="m8 5 11 7-11 7V5Z"/>`,
    refresh: svg`<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8A7 7 0 0 1 18 6l2 6M18 16a7 7 0 0 1-11.9 2L4 12"/>`,
    rocket: svg`<path d="M14.5 5.5c2.3-2.3 5.3-2.5 5.3-2.5s-.2 3-2.5 5.3l-5.7 5.7-4.2-4.2 7.1-4.3Z"/><path d="m9.2 8-4.7.7-2 2 4.9 1.4m6.3-.5-.7 4.7-2 2-1.4-4.9M5 16l-2 5 5-2m7.2-12.2h.1"/>`,
    search: svg`<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>`,
    settings: svg`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>`,
    sliders: svg`<path d="M4 7h5m4 0h7M4 17h7m4 0h5"/><circle cx="11" cy="7" r="2"/><circle cx="13" cy="17" r="2"/>`,
};

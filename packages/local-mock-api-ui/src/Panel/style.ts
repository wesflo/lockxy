import { css } from 'lit';

import { theme } from '../style/theme.style.js';

export const panelStyle = [
    theme,
    css`
        :host {
            display: block;
            overflow: hidden;
            border: 1px solid var(--wf-color-line);
            border-radius: var(--wf-radius);
            background: var(--wf-color-surface);
            box-shadow: 0 8px 26px rgb(16 24 40 / 6%);
        }

        header {
            display: flex;
            padding: 20px;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #edf0f3;
        }

        .body {
            padding: 20px;
        }

        ::slotted([slot='heading']) {
            margin: 0;
        }
    `,
];

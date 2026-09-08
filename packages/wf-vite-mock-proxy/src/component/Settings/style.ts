import { css } from 'lit';

import { theme } from '../theme.style.js';

export const settingsStyle = [
    theme,
    css`
        :host {
            display: block;
            padding: var(--wf-gap-l) var(--wf-gap-l);
        }

        h3 {
            margin: 0 0 var(--wf-gap-l);
            font-size: var(--wf-font-size-m);
        }

        .setting {
            display: grid;
            margin-bottom: var(--wf-gap-l);
            gap: var(--wf-gap-l);
            align-items: start;
            grid-template-columns: auto 1fr;
        }

        .setting strong {
            display: block;
            margin-bottom: var(--wf-gap-xs);
            font-weight: 650;
        }

        .setting p {
            margin: 0;
            color: var(--wf-muted);
            font-size: var(--wf-font-size-xs);
        }

        .divider {
            height: 1px;
            margin: var(--wf-gap-xl) 0;
            background: var(--wf-line-soft);
        }

        .reset {
            display: inline-flex;
            width: 100%;
            min-height: 48px;
            gap: var(--wf-gap-m);
            align-items: center;
            justify-content: center;
            color: inherit;
            border: 0;
            border-radius: 10px;
            background: var(--wf-surface-soft);
            font-weight: 650;
            cursor: pointer;
        }

        .reset:hover {
            background: var(--wf-line-soft);
        }
    `,
];

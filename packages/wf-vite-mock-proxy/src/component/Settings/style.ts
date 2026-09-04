import { css } from 'lit';

import { theme } from '../theme.style.js';

export const settingsStyle = [
    theme,
    css`
        :host {
            display: block;
            padding: 24px 22px;
        }

        h3 {
            margin: 0 0 20px;
            font-size: 16px;
        }

        .setting {
            display: grid;
            margin-bottom: 20px;
            gap: 13px;
            align-items: start;
            grid-template-columns: auto 1fr;
        }

        .setting strong {
            display: block;
            margin-bottom: 3px;
            font-weight: 650;
        }

        .setting p {
            margin: 0;
            color: #778398;
            font-size: 12px;
        }

        .divider {
            height: 1px;
            margin: 26px 0;
            background: #e7ecf1;
        }

        .reset {
            display: inline-flex;
            width: 100%;
            min-height: 48px;
            gap: 9px;
            align-items: center;
            justify-content: center;
            color: inherit;
            border: 0;
            border-radius: 9px;
            background: #f4f6f8;
            font-weight: 650;
            cursor: pointer;
        }

        .reset:hover {
            background: #e9edf2;
        }
    `,
];

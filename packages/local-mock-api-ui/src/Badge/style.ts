import { css } from 'lit';

import { theme } from '../style/theme.style.js';

export const badgeStyle = [
    theme,
    css`
        :host {
            display: inline-flex;
        }

        span {
            display: inline-flex;
            padding: 4px 10px;
            align-items: center;
            color: #475467;
            border-radius: 8px;
            background: #f2f4f7;
            font-size: 0.75rem;
            font-weight: 650;
            white-space: nowrap;
        }

        span.success {
            color: #157f3b;
            background: #eaf8ee;
        }

        span.danger {
            color: #e32828;
            background: #fff0f0;
        }

        span.warning {
            color: #e76500;
            background: #fff5e9;
        }

        span.info {
            color: #0786bc;
            background: var(--wf-color-primary-soft);
        }
    `,
];

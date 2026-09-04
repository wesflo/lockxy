import { css } from 'lit';

import { theme } from '../style/theme.style.js';

export const buttonStyle = [
    theme,
    css`
        :host {
            display: inline-block;
        }

        button {
            display: inline-flex;
            min-height: 38px;
            padding: 8px 15px;
            gap: 8px;
            align-items: center;
            justify-content: center;
            color: var(--wf-color-ink);
            border: 1px solid var(--wf-color-line);
            border-radius: 9px;
            background: var(--wf-color-surface);
            box-shadow: 0 1px 2px rgb(16 24 40 / 5%);
            font: inherit;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition:
                border-color 150ms ease,
                background 150ms ease,
                transform 150ms ease;
        }

        button:hover:not(:disabled) {
            border-color: #aeb8c5;
            transform: translateY(-1px);
        }

        button:focus-visible {
            outline: 3px solid rgb(6 155 215 / 22%);
            outline-offset: 2px;
        }

        button.primary {
            color: #fff;
            border-color: var(--wf-color-primary);
            background: linear-gradient(135deg, var(--wf-color-primary), #06addc);
            box-shadow: 0 7px 16px rgb(6 155 215 / 22%);
        }

        button.ghost {
            padding-inline: 8px;
            border-color: transparent;
            background: transparent;
            box-shadow: none;
        }

        button.compact {
            min-height: 32px;
            padding: 5px 10px;
            font-size: 0.8rem;
        }

        button:disabled {
            cursor: wait;
            opacity: 0.62;
        }

        .spinner {
            width: 14px;
            height: 14px;
            border: 2px solid currentcolor;
            border-right-color: transparent;
            border-radius: 50%;
            animation: spin 650ms linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `,
];

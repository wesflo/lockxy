import { css } from 'lit';

import { theme } from '../style/theme.style.js';

export const switchStyle = [
    theme,
    css`
        :host {
            display: inline-flex;
            flex: 0 0 auto;
        }

        label {
            position: relative;
            display: inline-flex;
            align-items: center;
        }

        input {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
        }

        span {
            position: relative;
            display: block;
            width: 38px;
            height: 22px;
            border: 1px solid #c9d2de;
            border-radius: 999px;
            background: #dce2ea;
            cursor: pointer;
            transition: background 150ms ease;
        }

        span::after {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 1px 3px rgb(16 24 40 / 25%);
            content: '';
            transition: transform 150ms ease;
        }

        input:checked + span {
            border-color: #16a5c9;
            background: #20afd0;
        }

        input:checked + span::after {
            transform: translateX(16px);
        }

        input:focus-visible + span {
            outline: 3px solid rgb(6 155 215 / 28%);
            outline-offset: 2px;
        }

        input:disabled + span {
            cursor: not-allowed;
            opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
            span,
            span::after {
                transition: none;
            }
        }
    `,
];

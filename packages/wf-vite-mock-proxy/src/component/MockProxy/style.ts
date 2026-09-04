import { css } from 'lit';

import { LAUNCHER_SIZE } from '../../constant.js';
import { theme } from '../../style.js';

export const mockProxyStyle = [
    theme,
    css`
        :host {
            position: fixed;
            z-index: 2147483000;
            inset: 0;
            display: block;
            width: 0;
            height: 0;
            font-size: 14px;
            line-height: 1.4;
        }

        button {
            color: inherit;
        }

        .backdrop {
            position: fixed;
            z-index: 0;
            inset: 0;
            border: 0;
            background: rgb(27 39 65 / 10%);
            cursor: default;
            opacity: 0;
            pointer-events: none;
            transition: opacity 220ms ease;
        }

        .backdrop.open {
            opacity: 1;
            pointer-events: auto;
        }

        .launcher {
            position: fixed;
            z-index: 2;
            display: grid;
            width: ${LAUNCHER_SIZE}px;
            height: ${LAUNCHER_SIZE}px;
            padding: 0;
            place-items: center;
            color: #fff;
            border: 0;
            border-radius: 13px;
            background: linear-gradient(145deg, #35bfda, #12a5c8);
            box-shadow: 0 9px 22px rgb(5 95 124 / 28%);
            cursor: pointer;
            touch-action: none;
            transition:
                box-shadow 150ms ease,
                transform 150ms ease;
        }

        .launcher:hover {
            box-shadow: 0 11px 28px rgb(5 95 124 / 35%);
            transform: translateY(-1px);
        }

        .launcher.dragging {
            cursor: grabbing;
            transform: scale(1.03);
        }

        .panel {
            position: fixed;
            z-index: 3;
            top: 0;
            right: 0;
            display: flex;
            width: min(430px, calc(100vw - 16px));
            height: 100dvh;
            flex-direction: column;
            overflow: hidden;
            border-left: 1px solid #e3e9f0;
            background: #fff;
            box-shadow: -12px 0 36px rgb(16 24 40 / 12%);
            transform: translateX(102%);
            visibility: hidden;
            transition:
                transform 240ms ease,
                visibility 0s linear 240ms;
        }

        .panel.open {
            transform: translateX(0);
            visibility: visible;
            transition: transform 240ms ease;
        }

        .panel-header {
            display: flex;
            min-height: 72px;
            padding: 0 20px;
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: inline-flex;
            gap: 10px;
            align-items: center;
            font-size: 18px;
            letter-spacing: -0.02em;
        }

        .brand-mark {
            display: grid;
            width: 32px;
            height: 32px;
            place-items: center;
            color: var(--wf-mock-color-primary);
        }

        .icon-button {
            display: grid;
            width: 38px;
            height: 38px;
            padding: 0;
            place-items: center;
            color: #475467;
            border: 0;
            border-radius: 9px;
            background: transparent;
            cursor: pointer;
        }

        .icon-button:hover {
            background: #f2f6f9;
        }

        .tabs {
            display: grid;
            padding: 0 20px;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #e5ebf1;
        }

        .tab {
            position: relative;
            display: inline-flex;
            min-height: 50px;
            gap: 8px;
            align-items: center;
            justify-content: center;
            color: #667085;
            border: 0;
            background: transparent;
            cursor: pointer;
        }

        .tab::after {
            position: absolute;
            right: 0;
            bottom: -1px;
            left: 0;
            height: 3px;
            border-radius: 3px 3px 0 0;
            background: var(--wf-mock-color-primary);
            content: '';
            opacity: 0;
        }

        .tab[aria-selected='true'] {
            color: var(--wf-mock-color-primary);
            font-weight: 650;
        }

        .tab[aria-selected='true']::after {
            opacity: 1;
        }

        .content {
            min-height: 0;
            flex: 1;
            overflow: auto;
        }

        @media (max-width: 480px) {
            .panel {
                width: 100vw;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .backdrop,
            .launcher,
            .panel {
                transition: none;
            }
        }
    `,
];

import { css } from 'lit';

import { LAUNCHER_SIZE } from './constant.js';
import { theme } from './component/theme.style.js';

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
            font-size: var(--wf-font-size-s);
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
            background: var(--wf-backdrop);
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
            color: var(--wf-white);
            border: 0;
            border-radius: 14px;
            background: linear-gradient(145deg, var(--wf-primary), var(--wf-primary));
            box-shadow: 0 10px 22px var(--wf-primary-shadow);
            cursor: pointer;
            touch-action: none;
            transition:
                box-shadow 150ms ease,
                transform 150ms ease;
        }

        .launcher:hover {
            box-shadow: 0 12px 28px var(--wf-primary-shadow-strong);
            transform: translateY(-2px);
        }

        .launcher.dragging {
            cursor: grabbing;
            transform: scale(1.03);
        }

        .launcher img {
            display: block;
            width: 32px;
            height: 32px;
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
            border-left: 1px solid var(--wf-line);
            background: var(--wf-white);
            box-shadow: -12px 0 36px var(--wf-shadow-l);
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
            padding: 0 var(--wf-gap-l);
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: inline-flex;
            align-items: center;
        }

        .brand img {
            display: block;
            width: 116px;
            height: auto;
        }

        .icon-button {
            display: grid;
            width: 38px;
            height: 38px;
            padding: 0;
            place-items: center;
            color: var(--wf-ink-soft);
            border: 0;
            border-radius: 10px;
            background: transparent;
            cursor: pointer;
        }

        .icon-button:hover {
            background: var(--wf-surface-soft);
        }

        .tabs {
            display: grid;
            padding: 0 var(--wf-gap-l);
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid var(--wf-line-soft);
        }

        .tab {
            position: relative;
            display: inline-flex;
            min-height: 50px;
            gap: var(--wf-gap-m);
            align-items: center;
            justify-content: center;
            color: var(--wf-muted);
            border: 0;
            background: transparent;
            cursor: pointer;
        }

        .tab::after {
            position: absolute;
            right: 0;
            bottom: -2px;
            left: 0;
            height: 4px;
            border-radius: 4px 4px 0 0;
            background: var(--wf-primary);
            content: '';
            opacity: 0;
        }

        .tab[aria-selected='true'] {
            color: var(--wf-primary);
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

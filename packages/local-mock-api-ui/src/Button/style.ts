import { css } from 'lit';

export const buttonStyle = css`
    :host {
        display: inline-block;
    }
    button {
        display: inline-flex;
        min-height: 40px;
        padding: var(--wf-gap-m) var(--wf-gap-l);
        gap: var(--wf-gap-m);
        align-items: center;
        justify-content: center;
        color: var(--wf-ink);
        border: 1px solid var(--wf-line);
        border-radius: var(--wf-radius-s);
        background: var(--wf-surface);
        box-shadow: 0 2px 2px var(--wf-shadow-s);
        font: inherit;
        font-size: var(--wf-font-size-s);
        font-weight: 600;
        cursor: pointer;
        transition:
            border-color 150ms ease,
            background 150ms ease,
            transform 150ms ease;
    }
    button:hover:not(:disabled) {
        border-color: var(--wf-line-strong);
        transform: translateY(-2px);
    }
    button:focus-visible {
        outline: 2px solid var(--wf-focus);
        outline-offset: 2px;
    }
    button.primary {
        color: var(--wf-white);
        border-color: var(--wf-primary);
        background: linear-gradient(135deg, var(--wf-primary), var(--wf-primary-bright));
        box-shadow: 0 8px 16px var(--wf-primary-shadow);
    }
    button.ghost {
        padding-inline: var(--wf-gap-m);
        border-color: transparent;
        background: transparent;
        box-shadow: none;
    }
    button.compact {
        min-height: 32px;
        padding: var(--wf-gap-s) var(--wf-gap-m);
        font-size: var(--wf-font-size-xs);
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
`;

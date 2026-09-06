import { css } from 'lit';

export const switchStyle = css`
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
        border: 1px solid var(--wf-line-strong);
        border-radius: var(--wf-radius-pill);
        background: var(--wf-line);
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
        background: var(--wf-white);
        box-shadow: 0 2px 4px var(--wf-shadow-l);
        content: '';
        transition: transform 150ms ease;
    }
    input:checked + span {
        border-color: var(--wf-primary-dark);
        background: var(--wf-primary);
    }
    input:checked + span::after {
        transform: translateX(16px);
    }
    input:focus-visible + span {
        outline: 2px solid var(--wf-focus);
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
`;

import { css } from 'lit';

export const panelStyle = css`
    :host {
        display: block;
        overflow: hidden;
        border: 1px solid var(--wf-line);
        border-radius: var(--wf-radius-m);
        background: var(--wf-surface);
        box-shadow: 0 8px 26px var(--wf-shadow-s);
    }
    header {
        display: flex;
        padding: var(--wf-gap-l);
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--wf-line-soft);
    }
    .body { padding: var(--wf-gap-l); }
    ::slotted([slot='heading']) { margin: 0; }
`;

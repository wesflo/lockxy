import { css } from 'lit';

export const badgeStyle = css`
    :host { display: inline-flex; }
    span {
        display: inline-flex;
        padding: var(--wf-gap-s) var(--wf-gap-m);
        align-items: center;
        color: var(--wf-muted);
        border-radius: var(--wf-radius-s);
        background: var(--wf-surface-soft);
        font-size: var(--wf-font-size-xs);
        font-weight: 650;
        white-space: nowrap;
    }
    span.success { color: var(--wf-success); background: var(--wf-success-soft); }
    span.danger { color: var(--wf-danger); background: var(--wf-danger-soft); }
    span.warning { color: var(--wf-warning); background: var(--wf-warning-soft); }
    span.info { color: var(--wf-primary-dark); background: var(--wf-primary-soft); }
`;

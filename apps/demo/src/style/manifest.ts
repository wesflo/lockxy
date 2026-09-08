import { css } from 'lit';

export const manifestStyle = css`
    .manifest {
        margin-bottom: var(--wf-gap-m);
    }

    .manifest .section-header {
        min-height: 68px;
    }

    .manifest pre {
        min-height: 122px;
        padding: var(--wf-gap-m) var(--wf-gap-l);
        overflow: auto;
        color: var(--wf-primary-dark);
        background: linear-gradient(90deg, var(--wf-surface-soft) 34px, transparent 34px);
        font-size: var(--wf-font-size-xs);
        line-height: 1.55;
    }

    .mode-note {
        padding: 0 var(--wf-gap-s);
        color: var(--wf-muted);
        font-size: var(--wf-font-size-xs);
        line-height: 1.5;
    }

    .notice {
        margin-bottom: var(--wf-gap-m);
        padding: var(--wf-gap-m) var(--wf-gap-l);
        color: var(--wf-danger);
        border: 1px solid var(--wf-line-strong);
        border-radius: 10px;
        background: var(--wf-danger-soft);
        font-size: var(--wf-font-size-s);
    }
`;

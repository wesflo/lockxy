import { css } from 'lit';

export const previewStyle = css`
    .preview__body {
        padding: var(--wf-gap-l);
    }

    .request-meta {
        min-height: 48px;
        gap: var(--wf-gap-m);
    }

    .request-meta code {
        min-width: 0;
        overflow: hidden;
        color: var(--wf-primary-dark);
        font-weight: 650;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .request-meta wf-button {
        margin-left: auto;
    }

    .description {
        margin-bottom: var(--wf-gap-l);
        color: var(--wf-muted);
        font-size: var(--wf-font-size-s);
        line-height: 1.55;
    }

    .result-meta {
        min-height: 44px;
        padding-inline: var(--wf-gap-m);
        gap: var(--wf-gap-l);
        border-bottom: 2px solid var(--wf-primary);
        font-size: var(--wf-font-size-s);
    }

    .result-meta span:last-child {
        margin-left: auto;
        color: var(--wf-muted);
    }

    .status-error {
        color: var(--wf-danger);
    }

    pre {
        min-height: 280px;
        max-height: 440px;
        padding: var(--wf-gap-l);
        overflow: auto;
        color: var(--wf-primary-dark);
        border: 1px solid var(--wf-line);
        border-radius: 0 0 10px 10px;
        background: linear-gradient(90deg, var(--wf-surface-soft) 34px, transparent 34px), var(--wf-surface);
        font-size: var(--wf-font-size-xs);
        line-height: 1.65;
        white-space: pre-wrap;
    }

    .environment {
        margin-top: var(--wf-gap-m);
        padding: var(--wf-gap-l);
        color: var(--wf-muted);
        border: 1px solid var(--wf-line);
        border-radius: 10px;
        background: var(--wf-white);
        font-size: var(--wf-font-size-xs);
        line-height: 1.55;
        overflow-wrap: anywhere;
    }

    .environment p + p {
        margin-top: var(--wf-gap-m);
    }

    .environment strong {
        color: var(--wf-ink-soft);
    }
`;

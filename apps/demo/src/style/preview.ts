import { css } from 'lit';

export const previewStyle = css`
    .preview {
        margin-bottom: var(--wf-gap-m);
    }

    .preview__body {
        padding: 0 var(--wf-gap-l) var(--wf-gap-l);
    }

    .request-bar {
        min-height: 60px;
        gap: var(--wf-gap-m);
    }

    .request-bar > code {
        font-size: var(--wf-font-size-m);
        font-weight: 650;
    }

    .request-bar wf-button {
        margin-left: auto;
    }

    .request-time {
        gap: var(--wf-gap-s);
        color: var(--wf-warning);
        font-size: var(--wf-font-size-s);
    }

    .case-description {
        margin-bottom: var(--wf-gap-m);
        color: var(--wf-muted);
        font-size: var(--wf-font-size-xs);
    }

    .code-toolbar {
        display: flex;
        min-height: 44px;
        padding-left: var(--wf-gap-m);
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid var(--wf-primary);
        font-size: var(--wf-font-size-s);
        font-weight: 650;
    }

    .response-code {
        min-height: 248px;
        max-height: 330px;
        margin-bottom: var(--wf-gap-m);
        padding: var(--wf-gap-l) var(--wf-gap-m)  var(--wf-gap-l) 50px;
        overflow: auto;
        color: var(--wf-primary-dark);
        border: 1px solid var(--wf-line);
        border-radius: 0 0 10px 10px;
        background: linear-gradient(90deg, var(--wf-surface-soft) 34px, transparent 34px), var(--wf-surface);
        font-size: var(--wf-font-size-xs);
        line-height: 1.65;
        white-space: pre-wrap;
    }

    .debug-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--wf-gap-m);
    }

    .debug-card {
        min-height: 126px;
        padding: var(--wf-gap-l);
        overflow: hidden;
        border: 1px solid var(--wf-line);
        border-radius: 10px;
        background: var(--wf-white);
    }

    .debug-card > strong {
        display: block;
        margin-bottom: var(--wf-gap-m);
        font-size: var(--wf-font-size-xs);
    }

    .debug-card > b {
        display: block;
        margin-bottom: var(--wf-gap-m);
        color: var(--wf-warning);
        font-size: var(--wf-font-size-xs);
    }

    .debug-card p {
        display: flex;
        margin-bottom: var(--wf-gap-m);
        gap: var(--wf-gap-m);
        justify-content: space-between;
        color: var(--wf-muted);
        font-size: var(--wf-font-size-xs);
    }

    .debug-card p:last-child {
        margin-bottom: 0;
    }

    .debug-card p code {
        max-width: 58%;
        overflow: hidden;
        color: var(--wf-ink-soft);
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .debug-card .empty {
        justify-content: flex-start;
    }

    .cookie-value {
        display: block;
        min-height: 76px;
        padding: var(--wf-gap-m);
        overflow-wrap: anywhere;
        color: var(--wf-ink-soft);
        border: 1px solid var(--wf-line-soft);
        border-radius: 8px;
        background: var(--wf-surface);
        font-size: var(--wf-font-size-xs);
        line-height: 1.5;
    }
`;

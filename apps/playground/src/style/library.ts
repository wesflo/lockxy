import { css } from 'lit';

export const libraryStyle = css`
    .workspace {
        display: grid;
        grid-template-columns: minmax(420px, 0.9fr) minmax(520px, 1.1fr);
        gap: var(--wf-gap-l);
        align-items: start;
    }

    .section-header {
        display: flex;
        min-height: 72px;
        padding: var(--wf-gap-l);
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--wf-line-soft);
    }

    .section-title {
        gap: var(--wf-gap-m);
    }

    .section-title h2 {
        font-size: var(--wf-font-size-m);
    }

    .section-icon {
        display: grid;
        width: 40px;
        height: 40px;
        place-items: center;
        color: var(--wf-primary);
        border-radius: 10px;
        background: var(--wf-primary-soft);
    }

    .request-list {
        max-height: 720px;
        padding: var(--wf-gap-l);
        overflow: auto;
    }

    .request-group {
        margin-bottom: var(--wf-gap-m);
        overflow: hidden;
        border: 1px solid var(--wf-line);
        border-radius: 10px;
    }

    .request-group:last-child {
        margin-bottom: 0;
    }

    .request-group__title {
        padding: var(--wf-gap-m) var(--wf-gap-l);
        border-bottom: 1px solid var(--wf-line-soft);
        background: var(--wf-surface);
        font-size: var(--wf-font-size-s);
    }

    .request {
        display: grid;
        width: 100%;
        min-height: 58px;
        padding: var(--wf-gap-m) var(--wf-gap-l);
        grid-template-columns: 8px minmax(0, 1fr) auto;
        gap: var(--wf-gap-m);
        align-items: center;
        color: var(--wf-ink);
        border: 0;
        border-bottom: 1px solid var(--wf-line-soft);
        background: var(--wf-white);
        text-align: left;
        cursor: pointer;
    }

    .request:last-child {
        border-bottom: 0;
    }

    .request:hover,
    .request--selected {
        background: var(--wf-surface-soft);
    }

    .request--selected {
        box-shadow: inset 4px 0 var(--wf-primary);
    }

    .request:focus-visible {
        position: relative;
        z-index: 1;
        outline: 4px solid var(--wf-primary-shadow);
        outline-offset: -4px;
    }

    .request__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--wf-primary);
    }

    .request__copy {
        min-width: 0;
    }

    .request__copy strong,
    .request__copy span {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .request__copy strong {
        margin-bottom: var(--wf-gap-s);
        font-size: var(--wf-font-size-s);
    }

    .request__copy span,
    .request > code {
        color: var(--wf-muted);
        font-size: var(--wf-font-size-xs);
    }
`;

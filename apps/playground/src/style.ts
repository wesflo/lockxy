import { css } from 'lit';

export const playgroundStyle = css`
    :host {
        display: block;
        min-height: 100dvh;
        box-sizing: border-box;
        padding: var(--wf-gap-xl) clamp(var(--wf-gap-l), 6vw, var(--wf-gap-xxl));
        color: var(--wf-code-background);
        background:
            radial-gradient(circle at 90% 5%, var(--wf-primary-shadow), transparent 28%),
            var(--wf-surface-soft);
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }

    main {
        width: 100%;
        max-width: 980px;
        margin: 0 auto;
    }

    header {
        margin-bottom: var(--wf-gap-xl);
    }

    .eyebrow {
        margin: 0 0 var(--wf-gap-m);
        color: var(--wf-primary);
        font-size: var(--wf-font-size-xs);
        font-weight: 750;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    h1 {
        margin: 0;
        font-size: var(--wf-font-size-xxl);
        letter-spacing: -0.04em;
    }

    .intro {
        max-width: 720px;
        margin: var(--wf-gap-l) 0 0;
        color: var(--wf-muted);
        font-size: var(--wf-font-size-l);
        line-height: 1.65;
    }

    .hint,
    .request,
    .result {
        border: 1px solid var(--wf-line);
        border-radius: 16px;
        background: var(--wf-surface-translucent);
        box-shadow: 0 8px 28px var(--wf-shadow-s);
    }

    .hint {
        margin-bottom: var(--wf-gap-l);
        padding: var(--wf-gap-l) var(--wf-gap-l);
        color: var(--wf-ink-soft);
        line-height: 1.55;
    }

    .hint strong {
        color: var(--wf-code-background);
    }

    .requests {
        display: grid;
        gap: var(--wf-gap-l);
    }

    .request {
        display: grid;
        padding: var(--wf-gap-l);
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--wf-gap-m) var(--wf-gap-l);
        align-items: center;
    }

    .request h2 {
        margin: 0 0 var(--wf-gap-s);
        font-size: var(--wf-font-size-l);
    }

    .request p {
        margin: 0;
        color: var(--wf-muted);
        line-height: 1.5;
    }

    .route {
        display: inline-flex;
        margin-top: var(--wf-gap-m);
        gap: var(--wf-gap-m);
        color: var(--wf-ink-soft);
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
        font-size: var(--wf-font-size-s);
    }

    .route strong {
        color: var(--wf-primary);
    }

    button {
        min-width: 116px;
        padding: var(--wf-gap-m) var(--wf-gap-l);
        color: var(--wf-white);
        border: 0;
        border-radius: 10px;
        background: var(--wf-primary);
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }

    button:hover {
        background: var(--wf-primary-dark);
    }

    button:focus-visible {
        outline: 4px solid var(--wf-primary-shadow);
        outline-offset: 2px;
    }

    button:disabled {
        cursor: wait;
        opacity: 0.65;
    }

    .result {
        margin-top: var(--wf-gap-l);
        overflow: hidden;
    }

    .result-header {
        display: flex;
        padding: var(--wf-gap-l) var(--wf-gap-l);
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--wf-line);
        background: var(--wf-surface);
    }

    .status-error {
        color: var(--wf-danger);
    }

    pre {
        min-height: 150px;
        margin: 0;
        padding: var(--wf-gap-l);
        overflow: auto;
        color: var(--wf-code-ink);
        background: var(--wf-code-background);
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
        font-size: var(--wf-font-size-s);
        line-height: 1.65;
    }

    .cookies {
        margin: var(--wf-gap-l) 0 0;
        color: var(--wf-muted);
        font-size: var(--wf-font-size-s);
        overflow-wrap: anywhere;
    }

    @media (max-width: 640px) {
        :host {
            padding-top: var(--wf-gap-xl);
        }

        .request {
            grid-template-columns: 1fr;
        }

        button {
            width: 100%;
        }
    }
`;

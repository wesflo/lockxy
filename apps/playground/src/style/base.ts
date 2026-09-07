import { css } from 'lit';

export const baseStyle = css`
    :host {
        display: block;
        min-height: 100dvh;
        box-sizing: border-box;
        color: var(--wf-ink);
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }

    h1,
    h2,
    p,
    pre {
        margin: 0;
    }

    button,
    a {
        font: inherit;
    }

    code,
    pre {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
    }

    .topbar,
    main {
        width: 100%;
        max-width: var(--wf-content-width);
        margin-inline: auto;
        padding-inline: var(--wf-gap-xl);
    }

    .topbar {
        display: flex;
        min-height: 70px;
        align-items: center;
        justify-content: space-between;
    }

    .brand,
    nav,
    nav a,
    .section-title,
    .request-meta,
    .result-meta {
        display: flex;
        align-items: center;
    }

    .brand {
        gap: var(--wf-gap-m);
        color: var(--wf-ink);
        text-decoration: none;
    }

    .brand__logo {
        display: block;
        width: 132px;
        height: auto;
    }

    nav {
        gap: var(--wf-gap-xl);
    }

    nav a {
        gap: var(--wf-gap-m);
        color: var(--wf-ink);
        font-size: var(--wf-font-size-s);
        font-weight: 550;
        text-decoration: none;
    }

    main {
        padding-bottom: var(--wf-gap-xxl);
    }

    .card {
        border: 1px solid var(--wf-line);
        border-radius: 16px;
        background: var(--wf-surface-translucent);
        box-shadow: 0 8px 26px var(--wf-shadow-m);
    }
`;

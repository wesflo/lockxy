import { css } from 'lit';

export const baseStyle = css`
    :host {
        display: block;
        min-height: 100vh;
        color: var(--wf-ink);
        font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
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

    .topbar {
        display: flex;
        width: 100%;
        max-width: var(--wf-content-width);
        min-height: 70px;
        margin-inline: auto;
        padding-inline: var(--wf-gap-xl);
        align-items: center;
        justify-content: space-between;
    }

    .brand,
    nav,
    nav a,
    .section-title,
    .benefits,
    .benefits span,
    .request-bar,
    .request-time {
        display: flex;
        align-items: center;
    }

    .brand {
        gap: var(--wf-gap-m);
        color: var(--wf-ink);
        text-decoration: none;
    }

    .brand strong {
        font-size: var(--wf-font-size-xl);
        letter-spacing: -0.04em;
    }

    .brand__mark {
        display: grid;
        width: 32px;
        height: 32px;
        place-items: center;
        color: var(--wf-white);
        border-radius: 10px 4px 10px 4px;
        background: linear-gradient(145deg, var(--wf-primary), var(--wf-primary-dark));
        transform: rotate(-9deg);
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
        width: 100%;
        max-width: var(--wf-content-width);
        margin-inline: auto;
        padding-inline: var(--wf-gap-xl);
        padding-bottom: var(--wf-gap-xxl);
    }

    .card {
        border: 1px solid var(--wf-line);
        border-radius: 16px;
        background: var(--wf-surface-translucent);
        box-shadow: 0 8px 26px var(--wf-shadow-m);
    }

`;


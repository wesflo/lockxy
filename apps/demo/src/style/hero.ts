import { css } from 'lit';

export const heroStyle = css`
    .hero {
        display: grid;
        min-height: 178px;
        margin-bottom: var(--wf-gap-l);
        padding: var(--wf-gap-l) var(--wf-gap-xl);
        grid-template-columns: 80px minmax(0, 1fr) 230px;
        gap: var(--wf-gap-xl);
        align-items: center;
        overflow: hidden;
        background:
            radial-gradient(circle at 82% 60%, var(--wf-primary-shadow), transparent 27%), var(--wf-surface-translucent);
    }

    .hero__icon {
        display: grid;
        width: 80px;
        height: 80px;
        place-items: center;
        color: var(--wf-primary);
        border-radius: 20px;
        background: var(--wf-primary-soft);
    }

    .hero__icon img {
        width: 58px;
        height: 58px;
    }

    .hero h1 {
        margin-bottom: var(--wf-gap-m);
        font-size: var(--wf-font-size-xl);
        line-height: 1.12;
        letter-spacing: -0.035em;
    }

    .hero__copy > p {
        margin-bottom: var(--wf-gap-xl);
        color: var(--wf-muted);
        font-size: var(--wf-font-size-m);
    }

    .benefits {
        gap: var(--wf-gap-xl);
    }

    .benefits span {
        gap: var(--wf-gap-m);
        color: var(--wf-ink-soft);
        font-size: var(--wf-font-size-s);
    }

    .benefits wf-icon {
        color: var(--wf-primary);
    }

    .hero__visual {
        position: relative;
        width: 220px;
        height: 142px;
        justify-self: end;
        border: 1px solid var(--wf-line);
        border-radius: 12px;
        background: var(--wf-white);
        box-shadow: 0 16px 32px var(--wf-primary-shadow);
    }

    .window-dots {
        display: flex;
        height: 26px;
        padding-left: var(--wf-gap-l);
        gap: var(--wf-gap-s);
        align-items: center;
        border-bottom: 1px solid var(--wf-line-soft);
    }

    .window-dots i {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--wf-primary);
    }

    .window-dots i:nth-child(2) {
        opacity: 0.75;
    }

    .window-dots i:nth-child(3) {
        opacity: 0.5;
    }

    .window-lines {
        display: grid;
        margin: var(--wf-gap-l);
        padding: var(--wf-gap-l);
        grid-template-columns: 20px 1fr;
        gap: var(--wf-gap-m);
        border: 1px solid var(--wf-line);
        border-radius: 10px;
    }

    .window-lines b {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        background: var(--wf-primary-soft);
    }

    .window-lines span {
        align-self: center;
        height: 8px;
        border-radius: 10px;
        background: var(--wf-line-soft);
    }

    .hero__bolt {
        position: absolute;
        right: -4px;
        bottom: -4px;
        display: grid;
        width: 64px;
        height: 64px;
        place-items: center;
        border-radius: 50%;
        background: var(--wf-white);
        box-shadow: 0 10px 18px var(--wf-primary-shadow);
    }

    .hero__bolt img {
        width: 48px;
        height: 48px;
    }
`;

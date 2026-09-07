import { css } from 'lit';

export const heroStyle = css`
    .hero {
        display: grid;
        min-height: 178px;
        margin-bottom: var(--wf-gap-l);
        padding: var(--wf-gap-l) var(--wf-gap-xl);
        grid-template-columns: 80px minmax(0, 1fr) 250px;
        gap: var(--wf-gap-xl);
        align-items: center;
        overflow: hidden;
        background:
            radial-gradient(circle at 82% 60%, var(--wf-primary-shadow), transparent 28%), var(--wf-surface-translucent);
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

    .hero__copy p {
        color: var(--wf-muted);
        font-size: var(--wf-font-size-m);
        line-height: 1.55;
    }

    .hero__hint {
        padding: var(--wf-gap-l);
        color: var(--wf-ink-soft);
        border: 1px solid var(--wf-line);
        border-radius: 12px;
        background: var(--wf-white);
        box-shadow: 0 16px 32px var(--wf-primary-shadow);
        font-size: var(--wf-font-size-xs);
        line-height: 1.55;
    }

    .hero__hint strong {
        display: flex;
        margin-bottom: var(--wf-gap-m);
        gap: var(--wf-gap-m);
        align-items: center;
        color: var(--wf-primary-dark);
        font-size: var(--wf-font-size-s);
    }
`;

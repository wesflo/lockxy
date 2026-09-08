import { css } from 'lit';

export const responsiveStyle = css`
    @media (max-width: 1040px) {
        .workspace {
            grid-template-columns: 1fr;
        }

        .request-list {
            max-height: 520px;
        }
    }

    @media (max-width: 720px) {
        .topbar,
        main {
            padding-inline: var(--wf-gap-m);
        }

        nav a:first-child,
        .hero__hint {
            display: none;
        }

        .hero {
            padding: var(--wf-gap-l);
            grid-template-columns: 58px minmax(0, 1fr);
            gap: var(--wf-gap-l);
        }

        .hero__icon {
            width: 58px;
            height: 58px;
        }
    }

    @media (max-width: 480px) {
        .brand wf-badge,
        nav {
            display: none;
        }

        .hero {
            grid-template-columns: 1fr;
        }

        .hero__icon {
            display: none;
        }

        .request-meta {
            flex-wrap: wrap;
        }

        .request-meta wf-button {
            width: 100%;
            margin-left: 0;
        }
    }
`;

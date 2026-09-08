import { css } from 'lit';

export const responsiveStyle = css`
    @media (max-width: 1120px) {
        .workspace {
            grid-template-columns: 1fr;
        }

        .library {
            max-height: 650px;
            overflow: auto;
        }
    }

    @media (max-width: 720px) {
        .topbar,
        main {
            padding-inline: var(--wf-gap-m);
        }

        nav a:last-child {
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

        .hero__visual {
            display: none;
        }

        .benefits {
            flex-direction: column;
            gap: var(--wf-gap-m);
            align-items: flex-start;
        }

        .scenario {
            grid-template-columns: 10px minmax(120px, 1fr) auto;
        }

        .scenario__delay,
        .scenario > code {
            display: none;
        }

        .debug-grid {
            grid-template-columns: 1fr;
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

        .request-bar {
            flex-wrap: wrap;
            padding: var(--wf-gap-m) 0;
        }

        .request-bar wf-button {
            width: 100%;
            margin-left: 0;
        }
    }
`;

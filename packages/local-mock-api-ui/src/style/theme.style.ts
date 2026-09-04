import { css } from 'lit';

export const theme = css`
    :host {
        --wf-color-ink: #101828;
        --wf-color-muted: #667085;
        --wf-color-line: #dfe5ec;
        --wf-color-surface: #ffffff;
        --wf-color-primary: #069bd7;
        --wf-color-primary-dark: #007dab;
        --wf-color-primary-soft: #e9f7fc;
        --wf-radius: 12px;
        box-sizing: border-box;
        color: var(--wf-color-ink);
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
        box-sizing: inherit;
    }
`;

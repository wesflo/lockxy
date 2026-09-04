import { css } from 'lit';

export const theme = css`
    :host {
        --lm-color-ink: #101828;
        --lm-color-muted: #667085;
        --lm-color-line: #dfe5ec;
        --lm-color-surface: #ffffff;
        --lm-color-primary: #069bd7;
        --lm-color-primary-dark: #007dab;
        --lm-color-primary-soft: #e9f7fc;
        --lm-radius: 12px;
        box-sizing: border-box;
        color: var(--lm-color-ink);
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

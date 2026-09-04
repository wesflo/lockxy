import { css } from 'lit';

export const theme = css`
    :host {
        --wf-mock-color-ink: #101828;
        --wf-mock-color-muted: #667085;
        --wf-mock-color-line: #dfe5ec;
        --wf-mock-color-primary: #069bd7;
        box-sizing: border-box;
        color: var(--wf-mock-color-ink);
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

    button,
    input,
    select {
        font: inherit;
    }

    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
        outline: 3px solid rgb(6 155 215 / 28%);
        outline-offset: 2px;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;

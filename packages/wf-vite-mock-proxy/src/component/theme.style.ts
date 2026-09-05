import sharedStyles from '@wesflo/local-mock-api-ui/style.css?inline';
import { css, unsafeCSS } from 'lit';

export const theme = [
    unsafeCSS(sharedStyles),
    css`
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
            outline: 2px solid var(--wf-focus);
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
    `
];

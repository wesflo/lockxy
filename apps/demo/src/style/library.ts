import { css } from 'lit';

export const libraryStyle = css`    .workspace {
        display: grid;
        grid-template-columns: minmax(500px, 0.98fr) minmax(560px, 1.02fr);
        gap: var(--wf-gap-l);
        align-items: start;
    }

    .workspace__detail {
        min-width: 0;
    }

    .section-header {
        display: flex;
        min-height: 72px;
        padding: var(--wf-gap-l) var(--wf-gap-l);
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--wf-line-soft);
    }

    .section-title {
        min-width: 0;
        gap: var(--wf-gap-m);
    }

    .section-title h2 {
        font-size: var(--wf-font-size-m);
        letter-spacing: -0.015em;
    }

    .section-title p {
        color: var(--wf-muted);
        font-size: var(--wf-font-size-xs);
    }

    .section-icon {
        display: grid;
        width: 38px;
        height: 38px;
        flex: 0 0 auto;
        place-items: center;
        color: var(--wf-primary);
        border-radius: 10px;
        background: var(--wf-primary-soft);
    }

    .section-icon--dark {
        color: var(--wf-primary-dark);
    }

    .library__body {
        padding: var(--wf-gap-l) var(--wf-gap-l) var(--wf-gap-l);
    }

    .scenario-group {
        margin-bottom: var(--wf-gap-m);
        overflow: hidden;
        border: 1px solid var(--wf-line);
        border-radius: 10px;
    }

    .scenario-group:last-child {
        margin-bottom: 0;
    }

    .scenario-group__header {
        display: flex;
        min-height: 40px;
        padding: var(--wf-gap-m) var(--wf-gap-l);
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--wf-line-soft);
        background: var(--wf-surface);
        font-size: var(--wf-font-size-s);
    }

    .scenario-group__header span {
        display: grid;
        min-width: 28px;
        height: 24px;
        place-items: center;
        color: var(--wf-primary);
        border-radius: 8px;
        background: var(--wf-primary-soft);
        font-size: var(--wf-font-size-xs);
        font-weight: 650;
    }

    .scenario {
        display: grid;
        width: 100%;
        min-height: 46px;
        padding: var(--wf-gap-m) var(--wf-gap-l);
        grid-template-columns: 10px minmax(126px, 1fr) auto 92px minmax(112px, auto);
        gap: var(--wf-gap-m);
        align-items: center;
        color: var(--wf-ink);
        border: 0;
        border-bottom: 1px solid var(--wf-line-soft);
        background: var(--wf-white);
        text-align: left;
        cursor: pointer;
    }

    .scenario:last-child {
        border-bottom: 0;
    }

    .scenario:hover,
    .scenario--selected {
        background: var(--wf-surface-soft);
    }

    .scenario--selected {
        box-shadow: inset 4px 0 var(--wf-primary);
    }

    .scenario:focus-visible {
        position: relative;
        z-index: 1;
        outline: 4px solid var(--wf-primary-shadow);
        outline-offset: -4px;
    }

    .scenario__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--wf-success);
    }

    .scenario__dot.status-400,
    .scenario__dot.status-500 {
        background: var(--wf-danger);
    }

    .scenario__name {
        overflow: hidden;
        font-size: var(--wf-font-size-s);
        font-weight: 550;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .scenario__delay {
        display: flex;
        gap: var(--wf-gap-s);
        align-items: center;
        color: var(--wf-muted);
        font-size: var(--wf-font-size-xs);
        white-space: nowrap;
    }

    .scenario__delay--active {
        color: var(--wf-warning);
    }

    .scenario > code {
        overflow: hidden;
        color: var(--wf-primary);
        font-size: var(--wf-font-size-xs);
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

`;

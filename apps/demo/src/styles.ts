import { css } from 'lit';

export default css`
    :host {
        --ink: #101828;
        --muted: #667085;
        --line: #dfe5ec;
        --primary: #079bd3;
        display: block;
        min-height: 100vh;
        color: var(--ink);
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
        width: min(1440px, calc(100% - 48px));
        min-height: 70px;
        margin-inline: auto;
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
        gap: 10px;
        color: var(--ink);
        text-decoration: none;
    }

    .brand strong {
        font-size: 1.65rem;
        letter-spacing: -0.04em;
    }

    .brand__mark {
        display: grid;
        width: 31px;
        height: 31px;
        place-items: center;
        color: #fff;
        border-radius: 9px 4px 9px 4px;
        background: linear-gradient(145deg, #0eb2dc, #078bc9);
        transform: rotate(-9deg);
    }

    nav {
        gap: 30px;
    }

    nav a {
        gap: 8px;
        color: var(--ink);
        font-size: 0.9rem;
        font-weight: 550;
        text-decoration: none;
    }

    main {
        width: min(1440px, calc(100% - 48px));
        margin-inline: auto;
        padding-bottom: 56px;
    }

    .card {
        border: 1px solid var(--line);
        border-radius: 15px;
        background: rgb(255 255 255 / 94%);
        box-shadow: 0 8px 26px rgb(16 24 40 / 7%);
    }

    .hero {
        display: grid;
        min-height: 178px;
        margin-bottom: 16px;
        padding: 24px 34px;
        grid-template-columns: 80px minmax(0, 1fr) 230px;
        gap: 30px;
        align-items: center;
        overflow: hidden;
        background: radial-gradient(circle at 82% 60%, rgb(7 155 211 / 8%), transparent 27%), rgb(255 255 255 / 94%);
    }

    .hero__icon {
        display: grid;
        width: 80px;
        height: 80px;
        place-items: center;
        color: var(--primary);
        border-radius: 19px;
        background: #e6f6fc;
    }

    .hero h1 {
        margin-bottom: 9px;
        font-size: clamp(1.65rem, 2.3vw, 2.2rem);
        line-height: 1.12;
        letter-spacing: -0.035em;
    }

    .hero__copy > p {
        margin-bottom: 25px;
        color: var(--muted);
        font-size: 0.96rem;
    }

    .benefits {
        gap: 42px;
    }

    .benefits span {
        gap: 8px;
        color: #344054;
        font-size: 0.8rem;
    }

    .benefits lm-icon {
        color: var(--primary);
    }

    .hero__visual {
        position: relative;
        width: 220px;
        height: 142px;
        justify-self: end;
        border: 1px solid #dce9ef;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 15px 32px rgb(2 132 179 / 14%);
    }

    .window-dots {
        display: flex;
        height: 26px;
        padding-left: 14px;
        gap: 5px;
        align-items: center;
        border-bottom: 1px solid #e8edf1;
    }

    .window-dots i {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary);
    }

    .window-dots i:nth-child(2) {
        opacity: 0.75;
    }

    .window-dots i:nth-child(3) {
        opacity: 0.5;
    }

    .window-lines {
        display: grid;
        margin: 17px;
        padding: 13px;
        grid-template-columns: 20px 1fr;
        gap: 10px;
        border: 1px solid #e5e9ee;
        border-radius: 9px;
    }

    .window-lines b {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        background: #dff4fb;
    }

    .window-lines span {
        align-self: center;
        height: 7px;
        border-radius: 9px;
        background: #e9edf2;
    }

    .hero__bolt {
        position: absolute;
        right: -4px;
        bottom: -4px;
        display: grid;
        width: 63px;
        height: 63px;
        place-items: center;
        color: #fff;
        border-radius: 50%;
        background: linear-gradient(145deg, #15b5df, #078fc8);
        box-shadow: 0 9px 18px rgb(7 143 200 / 25%);
    }

    .workspace {
        display: grid;
        grid-template-columns: minmax(500px, 0.98fr) minmax(560px, 1.02fr);
        gap: 18px;
        align-items: start;
    }

    .workspace__detail {
        min-width: 0;
    }

    .section-header {
        display: flex;
        min-height: 72px;
        padding: 15px 20px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #edf0f3;
    }

    .section-title {
        min-width: 0;
        gap: 12px;
    }

    .section-title h2 {
        font-size: 1rem;
        letter-spacing: -0.015em;
    }

    .section-title p {
        color: var(--muted);
        font-size: 0.72rem;
    }

    .section-icon {
        display: grid;
        width: 38px;
        height: 38px;
        flex: 0 0 auto;
        place-items: center;
        color: var(--primary);
        border-radius: 9px;
        background: #e7f6fb;
    }

    .section-icon--dark {
        color: #086c91;
    }

    .library__body {
        padding: 14px 18px 18px;
    }

    .scenario-group {
        margin-bottom: 12px;
        overflow: hidden;
        border: 1px solid #e2e7ec;
        border-radius: 10px;
    }

    .scenario-group:last-child {
        margin-bottom: 0;
    }

    .scenario-group__header {
        display: flex;
        min-height: 40px;
        padding: 8px 14px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e8ecf0;
        background: #fcfdfe;
        font-size: 0.84rem;
    }

    .scenario-group__header span {
        display: grid;
        min-width: 28px;
        height: 24px;
        place-items: center;
        color: #078bc3;
        border-radius: 8px;
        background: #eaf7fc;
        font-size: 0.72rem;
        font-weight: 650;
    }

    .scenario {
        display: grid;
        width: 100%;
        min-height: 45px;
        padding: 7px 14px;
        grid-template-columns: 10px minmax(125px, 1fr) auto 92px minmax(112px, auto);
        gap: 10px;
        align-items: center;
        color: var(--ink);
        border: 0;
        border-bottom: 1px solid #edf0f3;
        background: #fff;
        text-align: left;
        cursor: pointer;
    }

    .scenario:last-child {
        border-bottom: 0;
    }

    .scenario:hover,
    .scenario--selected {
        background: #f5fbfd;
    }

    .scenario--selected {
        box-shadow: inset 3px 0 var(--primary);
    }

    .scenario:focus-visible {
        position: relative;
        z-index: 1;
        outline: 3px solid rgb(6 155 215 / 23%);
        outline-offset: -3px;
    }

    .scenario__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #25a45a;
    }

    .scenario__dot.status-400,
    .scenario__dot.status-500 {
        background: #ef4444;
    }

    .scenario__name {
        overflow: hidden;
        font-size: 0.78rem;
        font-weight: 550;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .scenario__delay {
        display: flex;
        gap: 5px;
        align-items: center;
        color: #8a96a8;
        font-size: 0.7rem;
        white-space: nowrap;
    }

    .scenario__delay--active {
        color: #f0710b;
    }

    .scenario > code {
        overflow: hidden;
        color: #1684c1;
        font-size: 0.68rem;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .preview {
        margin-bottom: 12px;
    }

    .preview__body {
        padding: 0 20px 18px;
    }

    .request-bar {
        min-height: 60px;
        gap: 12px;
    }

    .request-bar > code {
        font-size: 0.92rem;
        font-weight: 650;
    }

    .request-bar lm-button {
        margin-left: auto;
    }

    .request-time {
        gap: 5px;
        color: #ef7109;
        font-size: 0.78rem;
    }

    .case-description {
        margin-bottom: 12px;
        color: var(--muted);
        font-size: 0.75rem;
    }

    .code-toolbar {
        display: flex;
        min-height: 43px;
        padding-left: 12px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #0ba2dc;
        font-size: 0.78rem;
        font-weight: 650;
    }

    .response-code {
        min-height: 248px;
        max-height: 330px;
        margin-bottom: 12px;
        padding: 14px 18px;
        overflow: auto;
        color: #1558b0;
        border: 1px solid #e1e5ea;
        border-radius: 0 0 10px 10px;
        background: linear-gradient(90deg, #f5f7f9 34px, transparent 34px), #fcfdff;
        font-size: 0.75rem;
        line-height: 1.65;
        white-space: pre-wrap;
    }

    .debug-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
    }

    .debug-card {
        min-height: 126px;
        padding: 14px;
        overflow: hidden;
        border: 1px solid #e2e6eb;
        border-radius: 9px;
        background: #fff;
    }

    .debug-card > strong {
        display: block;
        margin-bottom: 12px;
        font-size: 0.72rem;
    }

    .debug-card > b {
        display: block;
        margin-bottom: 10px;
        color: #ed6c09;
        font-size: 0.72rem;
    }

    .debug-card p {
        display: flex;
        margin-bottom: 7px;
        gap: 8px;
        justify-content: space-between;
        color: var(--muted);
        font-size: 0.62rem;
    }

    .debug-card p:last-child {
        margin-bottom: 0;
    }

    .debug-card p code {
        max-width: 58%;
        overflow: hidden;
        color: #46556a;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .debug-card .empty {
        justify-content: flex-start;
    }

    .cookie-value {
        display: block;
        min-height: 76px;
        padding: 10px;
        overflow-wrap: anywhere;
        color: #46556a;
        border: 1px solid #e7eaee;
        border-radius: 7px;
        background: #fcfdfe;
        font-size: 0.65rem;
        line-height: 1.5;
    }

    .manifest {
        margin-bottom: 10px;
    }

    .manifest .section-header {
        min-height: 68px;
    }

    .manifest pre {
        min-height: 122px;
        padding: 12px 20px;
        overflow: auto;
        color: #1558b0;
        background: linear-gradient(90deg, #f5f7f9 34px, transparent 34px);
        font-size: 0.7rem;
        line-height: 1.55;
    }

    .mode-note {
        padding: 0 4px;
        color: var(--muted);
        font-size: 0.68rem;
        line-height: 1.5;
    }

    .notice {
        margin-bottom: 12px;
        padding: 12px 16px;
        color: #b42318;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fef3f2;
        font-size: 0.82rem;
    }

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
            width: min(100% - 24px, 1440px);
        }

        nav a:last-child {
            display: none;
        }

        .hero {
            padding: 24px;
            grid-template-columns: 58px minmax(0, 1fr);
            gap: 18px;
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
            gap: 8px;
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
        .brand lm-badge,
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
            padding: 10px 0;
        }

        .request-bar lm-button {
            width: 100%;
            margin-left: 0;
        }
    }
`;

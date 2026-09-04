import { css } from 'lit';

export const playgroundStyle = css`
    :host {
        display: block;
        min-height: 100dvh;
        box-sizing: border-box;
        padding: 48px clamp(20px, 6vw, 88px);
        color: #172033;
        background:
            radial-gradient(circle at 90% 5%, rgb(22 172 210 / 14%), transparent 28%),
            #f5f7fb;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }

    main {
        width: min(980px, 100%);
        margin: 0 auto;
    }

    header {
        margin-bottom: 32px;
    }

    .eyebrow {
        margin: 0 0 8px;
        color: #078aaa;
        font-size: 12px;
        font-weight: 750;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    h1 {
        margin: 0;
        font-size: clamp(32px, 5vw, 52px);
        letter-spacing: -0.04em;
    }

    .intro {
        max-width: 720px;
        margin: 14px 0 0;
        color: #5f6b7e;
        font-size: 17px;
        line-height: 1.65;
    }

    .hint,
    .request,
    .result {
        border: 1px solid #dde4ed;
        border-radius: 16px;
        background: rgb(255 255 255 / 92%);
        box-shadow: 0 8px 28px rgb(25 39 66 / 6%);
    }

    .hint {
        margin-bottom: 20px;
        padding: 16px 18px;
        color: #475467;
        line-height: 1.55;
    }

    .hint strong {
        color: #172033;
    }

    .requests {
        display: grid;
        gap: 14px;
    }

    .request {
        display: grid;
        padding: 18px;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px 20px;
        align-items: center;
    }

    .request h2 {
        margin: 0 0 5px;
        font-size: 17px;
    }

    .request p {
        margin: 0;
        color: #667085;
        line-height: 1.5;
    }

    .route {
        display: inline-flex;
        margin-top: 10px;
        gap: 7px;
        color: #344054;
        font: 13px ui-monospace, SFMono-Regular, Consolas, monospace;
    }

    .route strong {
        color: #078aaa;
    }

    button {
        min-width: 116px;
        padding: 10px 15px;
        color: #fff;
        border: 0;
        border-radius: 10px;
        background: #0a96b8;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }

    button:hover {
        background: #087f9c;
    }

    button:focus-visible {
        outline: 3px solid rgb(10 150 184 / 30%);
        outline-offset: 3px;
    }

    button:disabled {
        cursor: wait;
        opacity: 0.65;
    }

    .result {
        margin-top: 20px;
        overflow: hidden;
    }

    .result-header {
        display: flex;
        padding: 13px 16px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e9f0;
        background: #fbfcfe;
    }

    .status-error {
        color: #b42318;
    }

    pre {
        min-height: 150px;
        margin: 0;
        padding: 18px;
        overflow: auto;
        color: #d7e2f2;
        background: #172033;
        font: 13px/1.65 ui-monospace, SFMono-Regular, Consolas, monospace;
    }

    .cookies {
        margin: 20px 0 0;
        color: #667085;
        font-size: 13px;
        overflow-wrap: anywhere;
    }

    @media (max-width: 640px) {
        :host {
            padding-top: 28px;
        }

        .request {
            grid-template-columns: 1fr;
        }

        button {
            width: 100%;
        }
    }
`;

import { css } from 'lit';

export default css`
    code,
    pre {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 32px;
        align-items: end;
        padding: clamp(28px, 5vw, 68px);
        color: #fff;
        border-radius: 28px;
        background: linear-gradient(135deg, #102a43 0%, #243b53 55%, #186faf 100%);
        box-shadow: 0 22px 60px rgb(16 42 67 / 18%);
    }

    .hero h1 {
        max-width: 820px;
        margin: 8px 0 18px;
        color: inherit;
    }

    .eyebrow {
        margin: 0;
        color: #9fb3c8;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .hero__copy {
        max-width: 760px;
        margin: 0;
        color: #d9e2ec;
    }

    .hero code {
        color: #fff;
    }

    .manifest-summary {
        min-width: 170px;
        padding: 18px 20px;
        border: 1px solid rgb(255 255 255 / 22%);
        border-radius: 16px;
        background: rgb(255 255 255 / 8%);
    }

    .manifest-summary span,
    .manifest-summary strong {
        display: block;
    }

    .manifest-summary span {
        margin-bottom: 5px;
        color: #bcccdc;
        font-size: 0.85rem;
    }

    .control-panel {
        display: grid;
        grid-template-columns: minmax(220px, 0.8fr) minmax(280px, 1.2fr) auto;
        gap: 24px;
        align-items: center;
        margin: 28px 0 36px;
        padding: 24px;
        border: 1px solid #d9e2ec;
        border-radius: 18px;
        background: #fff;
    }

    .control-panel h2,
    .control-panel p {
        margin: 0;
    }

    .control-panel p {
        margin-top: 4px;
        color: #627d98;
    }

    .cookie-display {
        min-width: 0;
        padding: 12px 14px;
        border-radius: 10px;
        background: #f0f4f8;
    }

    .cookie-display span,
    .cookie-display code {
        display: block;
    }

    .cookie-display span {
        margin-bottom: 5px;
        color: #627d98;
        font-size: 0.8rem;
    }

    .cookie-display code {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .control-panel__actions,
    .scenario-list,
    .badges,
    .case-card__action {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }

    uic-notification {
        display: block;
        margin-bottom: 32px;
    }

    .case-group + .case-group {
        margin-top: 52px;
    }

    .section-heading {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 18px;
        border-bottom: 1px solid #bcccdc;
    }

    .section-heading h2 {
        margin: 0 0 10px;
    }

    .section-heading span {
        color: #627d98;
    }

    .case-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
    }

    .case-card {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
        padding: 24px;
        border: 1px solid #d9e2ec;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 8px 24px rgb(16 42 67 / 6%);
    }

    .case-card h3,
    .case-card p {
        margin: 0;
    }

    .case-card p,
    .case-card small,
    .case-card__action span {
        color: #627d98;
    }

    .case-card__heading {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: flex-start;
    }

    .case-card__heading h3 {
        margin-top: 10px;
    }

    .case-card__heading > code {
        max-width: 48%;
        padding: 7px 9px;
        overflow-wrap: anywhere;
        color: #334e68;
        border-radius: 7px;
        background: #f0f4f8;
        font-size: 0.78rem;
        text-align: right;
    }

    .scenario-row {
        padding-top: 14px;
        border-top: 1px solid #e4e7eb;
    }

    .scenario-label {
        display: block;
        margin-bottom: 9px;
        color: #486581;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .case-card__action {
        justify-content: space-between;
        margin-top: auto;
    }

    .result {
        padding: 14px;
        border: 1px solid #d9e2ec;
        border-radius: 12px;
        background: #f8fafc;
    }

    .result--success {
        border-color: #9ae6b4;
        background: #f0fff4;
    }

    .result--error {
        border-color: #feb2b2;
        background: #fff5f5;
    }

    .result__meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
        font-size: 0.84rem;
    }

    .result pre {
        max-height: 240px;
        margin: 0;
        padding: 12px;
        overflow: auto;
        color: #d9e2ec;
        border-radius: 8px;
        background: #102a43;
        font-size: 0.78rem;
        line-height: 1.55;
        white-space: pre-wrap;
    }

    .result uic-button {
        margin-top: 12px;
    }

    @media (max-width: 980px) {
        .hero,
        .control-panel {
            grid-template-columns: 1fr;
        }

        .manifest-summary {
            width: fit-content;
        }

        .case-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        main {
            padding: 16px 12px 48px;
        }

        .hero {
            padding: 28px 22px;
            border-radius: 18px;
        }

        .control-panel,
        .case-card {
            padding: 18px;
        }

        .case-card__heading {
            display: block;
        }

        .case-card__heading > code {
            display: block;
            max-width: none;
            margin-top: 12px;
            text-align: left;
        }
    }
`;

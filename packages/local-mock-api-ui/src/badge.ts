import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { theme } from './theme';

export class LocalMockBadge extends LitElement {
    static styles = [
        theme,
        css`
            :host {
                display: inline-flex;
            }

            span {
                display: inline-flex;
                padding: 4px 10px;
                align-items: center;
                color: #475467;
                border-radius: 8px;
                background: #f2f4f7;
                font-size: 0.75rem;
                font-weight: 650;
                white-space: nowrap;
            }

            span.success {
                color: #157f3b;
                background: #eaf8ee;
            }

            span.danger {
                color: #e32828;
                background: #fff0f0;
            }

            span.warning {
                color: #e76500;
                background: #fff5e9;
            }

            span.info {
                color: #0786bc;
                background: var(--lm-color-primary-soft);
            }
        `,
    ];

    @property({ type: String, reflect: true }) tone: 'neutral' | 'success' | 'danger' | 'warning' | 'info' = 'neutral';

    render = () => html`
        <span class=${this.tone}><slot></slot></span>
    `;
}

customElements.define('lm-badge', LocalMockBadge);

import { css, html, LitElement } from 'lit';

import { theme } from './theme';

export class LocalMockPanel extends LitElement {
    static styles = [
        theme,
        css`
            :host {
                display: block;
                overflow: hidden;
                border: 1px solid var(--lm-color-line);
                border-radius: var(--lm-radius);
                background: var(--lm-color-surface);
                box-shadow: 0 8px 26px rgb(16 24 40 / 6%);
            }

            header {
                display: flex;
                padding: 20px;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #edf0f3;
            }

            .body {
                padding: 20px;
            }

            ::slotted([slot='heading']) {
                margin: 0;
            }
        `,
    ];

    render = () => html`
        <header>
            <slot name="heading"></slot>
            <slot name="actions"></slot>
        </header>
        <div class="body"><slot></slot></div>
    `;
}

customElements.define('lm-panel', LocalMockPanel);

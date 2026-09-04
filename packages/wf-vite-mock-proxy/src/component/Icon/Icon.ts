import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MOCK_PROXY_ICON_TAG_NAME } from '../../constant.js';
import { ICON_PATHS } from './constant.js';
import type { IconName } from './interface.js';
import { iconStyle } from './style.js';

export class MockProxyIcon extends LitElement {
    static styles = iconStyle;

    @property({ type: String }) name: IconName = 'rocket';
    @property({ type: Number }) size = 18;

    render = () => html`
        <svg
            aria-hidden="true"
            width=${this.size}
            height=${this.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            ${ICON_PATHS[this.name]}
        </svg>
    `;
}

if (typeof customElements !== 'undefined' && !customElements.get(MOCK_PROXY_ICON_TAG_NAME)) {
    customElements.define(MOCK_PROXY_ICON_TAG_NAME, MockProxyIcon);
}

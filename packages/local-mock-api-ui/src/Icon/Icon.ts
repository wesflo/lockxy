import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { ICON_PATHS, WF_ICON_TAG_NAME } from './constant.js';
import type { WfIconName } from './interface.js';
import { iconStyle } from './style.js';

@wfElement(WF_ICON_TAG_NAME)
export class WfIcon extends LitElement {
    static styles = iconStyle;

    @property({ type: String }) name: WfIconName = 'bolt';
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

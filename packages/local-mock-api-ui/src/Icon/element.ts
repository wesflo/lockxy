import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { resetStyles } from '../style/resetStyles.js';
import { ICON_PATHS, ICON_SIZES, ICON_TAG_NAME } from './constant.js';
import type { WfIconName, WfIconSize } from './interface.js';
import { iconStyle } from './style.js';

@wfElement(ICON_TAG_NAME)
export class WfIcon extends LitElement {
    static styles = [resetStyles, iconStyle];

    @property({ type: String }) name: WfIconName = 'bolt';
    @property({ type: String }) size: WfIconSize = 'm';

    render = () => html`
        <svg
            aria-hidden="true"
            width=${ICON_SIZES[this.size]}
            height=${ICON_SIZES[this.size]}
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

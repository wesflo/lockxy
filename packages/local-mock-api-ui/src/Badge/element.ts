import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { resetStyles } from '../style/resetStyles.js';
import { BADGE_TAG_NAME } from './constant.js';
import type { WfBadgeTone } from './interface.js';
import { badgeStyle } from './style.js';

@wfElement(BADGE_TAG_NAME)
export class WfBadge extends LitElement {
    static styles = [resetStyles, badgeStyle];

    @property({ type: String, reflect: true }) tone: WfBadgeTone = 'neutral';

    render = () => html`
        <span class=${this.tone}><slot></slot></span>
    `;
}

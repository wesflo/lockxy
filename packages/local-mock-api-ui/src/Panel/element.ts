import { html, LitElement } from 'lit';

import { wfElement } from '../util/wfElement.js';
import { resetStyles } from '../style/resetStyles.js';
import { PANEL_TAG_NAME } from './constant.js';
import { panelStyle } from './style.js';

@wfElement(PANEL_TAG_NAME)
export class WfPanel extends LitElement {
    static styles = [resetStyles, panelStyle];

    render = () => html`
        <header>
            <slot name="heading"></slot>
            <slot name="actions"></slot>
        </header>
        <div class="body"><slot></slot></div>
    `;
}

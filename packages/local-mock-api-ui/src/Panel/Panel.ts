import { html, LitElement } from 'lit';

import { wfElement } from '../util/wfElement.js';
import { WF_PANEL_TAG_NAME } from './constant.js';
import { panelStyle } from './style.js';

@wfElement(WF_PANEL_TAG_NAME)
export class WfPanel extends LitElement {
    static styles = panelStyle;

    render = () => html`
        <header>
            <slot name="heading"></slot>
            <slot name="actions"></slot>
        </header>
        <div class="body"><slot></slot></div>
    `;
}

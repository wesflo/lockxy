import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { SWITCH_CHANGE_EVENT, WF_SWITCH_TAG_NAME } from './constant.js';
import type { SwitchChangeDetail } from './interface.js';
import { switchStyle } from './style.js';

@wfElement(WF_SWITCH_TAG_NAME)
export class WfSwitch extends LitElement {
    static styles = switchStyle;

    @property({ type: Boolean }) checked = false;
    @property({ type: Boolean }) disabled = false;
    @property({ type: String }) label = '';

    private handleChange = (event: Event): void => {
        const checked = (event.currentTarget as HTMLInputElement).checked;
        this.checked = checked;
        this.dispatchEvent(
            new CustomEvent<SwitchChangeDetail>(SWITCH_CHANGE_EVENT, {
                bubbles: true,
                composed: true,
                detail: { checked },
            })
        );
    };

    render = () => html`
        <label>
            <input
                type="checkbox"
                .checked=${this.checked}
                ?disabled=${this.disabled}
                aria-label=${this.label}
                @change=${this.handleChange}
            />
            <span aria-hidden="true"></span>
        </label>
    `;
}

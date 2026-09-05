import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { resetStyles } from '../style/resetStyles.js';
import { ON_SWITCH_CHANGE_EVENT, SWITCH_TAG_NAME } from './constant.js';
import type { SwitchChangeDetail } from './interface.js';
import { switchStyle } from './style.js';

@wfElement(SWITCH_TAG_NAME)
export class WfSwitch extends LitElement {
    static styles = [resetStyles, switchStyle];

    @property({ type: Boolean }) checked = false;
    @property({ type: Boolean }) disabled = false;
    @property({ type: String }) label = '';

    private handleChange = (event: Event): void => {
        const checked = (event.currentTarget as HTMLInputElement).checked;
        this.checked = checked;
        this.dispatchEvent(
            new CustomEvent<SwitchChangeDetail>(ON_SWITCH_CHANGE_EVENT, {
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

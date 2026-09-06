import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { resetStyles } from '../style/resetStyles.js';
import { BUTTON_TAG_NAME, ON_CLICK_EVENT } from './constant.js';
import type { WfButtonVariant } from './interface.js';
import { buttonStyle } from './style.js';

@wfElement(BUTTON_TAG_NAME)
export class WfButton extends LitElement {
    static styles = [resetStyles, buttonStyle];

    @property({ type: String, reflect: true }) variant: WfButtonVariant = 'default';
    @property({ type: Boolean, reflect: true }) compact = false;
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) loading = false;

    private handleClick = (event: MouseEvent): void => {
        event.stopPropagation();

        if (this.disabled || this.loading) {
            event.preventDefault();
            return;
        }

        this.dispatchEvent(
            new CustomEvent(ON_CLICK_EVENT, {
                detail: { sourceEvent: event },
            })
        );
    };

    render = () => html`
        <button
            @click=${this.handleClick}
            class=${`${this.variant} ${this.compact ? 'compact' : ''}`}
            ?disabled=${this.disabled || this.loading}
            type="button"
        >
            ${this.loading
                ? html`
                      <span class="spinner" aria-hidden="true"></span>
                  `
                : null}
            <slot></slot>
        </button>
    `;
}

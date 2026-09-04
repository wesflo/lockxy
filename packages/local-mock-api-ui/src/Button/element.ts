import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { wfElement } from '../util/wfElement.js';
import { WF_BUTTON_TAG_NAME } from './constant.js';
import type { WfButtonVariant } from './interface.js';
import { buttonStyle } from './style.js';

@wfElement(WF_BUTTON_TAG_NAME)
export class WfButton extends LitElement {
    static styles = buttonStyle;

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
            new CustomEvent('onClick', {
                bubbles: true,
                composed: true,
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
            ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : null}
            <slot></slot>
        </button>
    `;
}

import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { theme } from './theme';
import { wfElement } from './wfElement';

@wfElement('wf-button')
export class WfButton extends LitElement {
    static styles = [
        theme,
        css`
            :host {
                display: inline-block;
            }

            button {
                display: inline-flex;
                min-height: 38px;
                padding: 8px 15px;
                gap: 8px;
                align-items: center;
                justify-content: center;
                color: var(--wf-color-ink);
                border: 1px solid var(--wf-color-line);
                border-radius: 9px;
                background: var(--wf-color-surface);
                box-shadow: 0 1px 2px rgb(16 24 40 / 5%);
                font: inherit;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition:
                    border-color 150ms ease,
                    background 150ms ease,
                    transform 150ms ease;
            }

            button:hover:not(:disabled) {
                border-color: #aeb8c5;
                transform: translateY(-1px);
            }

            button:focus-visible {
                outline: 3px solid rgb(6 155 215 / 22%);
                outline-offset: 2px;
            }

            button.primary {
                color: #fff;
                border-color: var(--wf-color-primary);
                background: linear-gradient(135deg, var(--wf-color-primary), #06addc);
                box-shadow: 0 7px 16px rgb(6 155 215 / 22%);
            }

            button.ghost {
                padding-inline: 8px;
                border-color: transparent;
                background: transparent;
                box-shadow: none;
            }

            button.compact {
                min-height: 32px;
                padding: 5px 10px;
                font-size: 0.8rem;
            }

            button:disabled {
                cursor: wait;
                opacity: 0.62;
            }

            .spinner {
                width: 14px;
                height: 14px;
                border: 2px solid currentcolor;
                border-right-color: transparent;
                border-radius: 50%;
                animation: spin 650ms linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `,
    ];

    @property({ type: String, reflect: true }) variant: 'default' | 'primary' | 'ghost' = 'default';
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
            ${this.loading
                ? html`
                      <span class="spinner" aria-hidden="true"></span>
                  `
                : null}
            <slot></slot>
        </button>
    `;
}

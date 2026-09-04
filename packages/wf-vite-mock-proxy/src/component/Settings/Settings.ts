import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MOCK_PROXY_SETTINGS_TAG_NAME } from '../../constant.js';
import '../Icon/Icon.js';
import type { SwitchChangeDetail } from '../Switch/interface.js';
import '../Switch/Switch.js';
import { RESET_SETTINGS_EVENT, SETTING_CHANGE_EVENT } from './constant.js';
import type { SettingChangeDetail, SettingName } from './interface.js';
import { settingsStyle } from './style.js';

export class MockProxySettings extends LitElement {
    static styles = settingsStyle;

    @property({ type: Boolean }) proxyOnLoad = true;
    @property({ type: Boolean }) saveSelections = false;

    private emitSettingChange = (name: SettingName, checked: boolean): void => {
        this.dispatchEvent(
            new CustomEvent<SettingChangeDetail>(SETTING_CHANGE_EVENT, {
                bubbles: true,
                composed: true,
                detail: { name, checked },
            })
        );
    };

    private reset = (): void => {
        this.dispatchEvent(new CustomEvent(RESET_SETTINGS_EVENT, { bubbles: true, composed: true }));
    };

    render = () => html`
        <h3>Allgemein</h3>
        <div class="setting">
            <wf-vite-mock-proxy-switch
                .checked=${this.proxyOnLoad}
                label="Proxy beim Laden aktivieren"
                @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('proxyOnLoad', event.detail.checked)}
            ></wf-vite-mock-proxy-switch>
            <div>
                <strong>Proxy beim Laden aktivieren</strong>
                <p>Der Proxy ist standardmäßig aktiviert.</p>
            </div>
        </div>
        <div class="setting">
            <wf-vite-mock-proxy-switch
                .checked=${this.saveSelections}
                label="Auswahl in lokalem Storage speichern"
                @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('saveSelections', event.detail.checked)}
            ></wf-vite-mock-proxy-switch>
            <div>
                <strong>Auswahl in lokalem Storage speichern</strong>
                <p>Deine Einstellungen bleiben erhalten.</p>
            </div>
        </div>
        <div class="divider"></div>
        <button class="reset" type="button" @click=${this.reset}>
            <wf-vite-mock-proxy-icon name="refresh" size="19"></wf-vite-mock-proxy-icon>
            Alle Einstellungen zurücksetzen
        </button>
    `;
}

if (typeof customElements !== 'undefined' && !customElements.get(MOCK_PROXY_SETTINGS_TAG_NAME)) {
    customElements.define(MOCK_PROXY_SETTINGS_TAG_NAME, MockProxySettings);
}

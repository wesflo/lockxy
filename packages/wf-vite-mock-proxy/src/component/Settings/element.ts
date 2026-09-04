import { wfElement } from '@wesflo/local-mock-api-ui';
import type { SwitchChangeDetail } from '@wesflo/local-mock-api-ui';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MOCK_PROXY_SETTINGS_TAG_NAME } from '../../constant.js';
import { RESET_SETTINGS_EVENT, SETTING_CHANGE_EVENT } from './constant.js';
import type { SettingChangeDetail, SettingName } from './interface.js';
import { settingsStyle } from './style.js';

@wfElement(MOCK_PROXY_SETTINGS_TAG_NAME)
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
            <wf-switch
                .checked=${this.proxyOnLoad}
                label="Proxy beim Laden aktivieren"
                @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('proxyOnLoad', event.detail.checked)}
            ></wf-switch>
            <div>
                <strong>Proxy beim Laden aktivieren</strong>
                <p>Der Proxy ist standardmäßig aktiviert.</p>
            </div>
        </div>
        <div class="setting">
            <wf-switch
                .checked=${this.saveSelections}
                label="Auswahl in lokalem Storage speichern"
                @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('saveSelections', event.detail.checked)}
            ></wf-switch>
            <div>
                <strong>Auswahl in lokalem Storage speichern</strong>
                <p>Deine Einstellungen bleiben erhalten.</p>
            </div>
        </div>
        <div class="divider"></div>
        <button class="reset" type="button" @click=${this.reset}>
            <wf-icon name="refresh" size="19"></wf-icon>
            Alle Einstellungen zurücksetzen
        </button>
    `;
}

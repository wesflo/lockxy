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
        <h3>General</h3>
        <div class="setting">
            <wf-switch
                .checked=${this.proxyOnLoad}
                label="Enable proxy on load"
                @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('proxyOnLoad', event.detail.checked)}
            ></wf-switch>
            <div>
                <strong>Enable proxy on load</strong>
                <p>The proxy is enabled by default.</p>
            </div>
        </div>
        <div class="setting">
            <wf-switch
                .checked=${this.saveSelections}
                label="Save selections in local storage"
                @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('saveSelections', event.detail.checked)}
            ></wf-switch>
            <div>
                <strong>Save selections in local storage</strong>
                <p>Your settings are preserved.</p>
            </div>
        </div>
        <div class="divider"></div>
        <button class="reset" type="button" @click=${this.reset}>
            <wf-icon name="refresh" size="19"></wf-icon>
            Reset all settings
        </button>
    `;
}

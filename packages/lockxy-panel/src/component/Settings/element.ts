import { resetStyles, wfElement } from '@wesflo/local-mock-api-ui';
import type { SwitchChangeDetail } from '@wesflo/local-mock-api-ui';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MOCK_PROXY_SETTINGS_TAG_NAME } from '../../constant.js';
import { ON_SETTING_CHANGE_EVENT } from './constant.js';
import type { SettingChangeDetail, SettingName } from './interface.js';
import { settingsStyle } from './style.js';

@wfElement(MOCK_PROXY_SETTINGS_TAG_NAME)
export class MockProxySettings extends LitElement {
    static styles = [resetStyles, settingsStyle];

    @property({ type: Boolean }) proxyOnLoad = true;
    @property({ type: Boolean }) canSaveSelections = false;
    @property({ type: Boolean }) saveSelections = false;

    private emitSettingChange = (name: SettingName, checked: boolean): void => {
        this.dispatchEvent(
            new CustomEvent<SettingChangeDetail>(ON_SETTING_CHANGE_EVENT, {
                detail: { name, checked },
            })
        );
    };

    private reset = (): void => {
        this.dispatchEvent(new CustomEvent('onResetSettings'));
    };

    render = () => html`
        <h3>General</h3>
        <div class="setting">
            <wf-switch
                .checked=${this.proxyOnLoad}
                label="Enable proxy on load"
                @onSwitchChange=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('proxyOnLoad', event.detail.checked)}
            ></wf-switch>
            <div>
                <strong>Enable proxy on load</strong>
                <p>The proxy is enabled by default.</p>
            </div>
        </div>
        ${this.canSaveSelections
            ? null
            : html`
                  <div class="storage-notice" role="note">
                      <strong>Project storage is unavailable</strong>
                      <p>
                          Add a root-level <code>id</code> to <code>mock.manifest.json</code> to save selections for
                          this project.
                      </p>
                  </div>
              `}
        <div class="setting">
            <wf-switch
                .checked=${this.saveSelections}
                .disabled=${!this.canSaveSelections}
                label="Save selections in local storage"
                @onSwitchChange=${(event: CustomEvent<SwitchChangeDetail>) =>
                    this.emitSettingChange('saveSelections', event.detail.checked)}
            ></wf-switch>
            <div>
                <strong>Save selections in local storage</strong>
                <p>
                    ${this.canSaveSelections
                        ? 'Endpoint and scenario choices are preserved for this manifest.'
                        : 'A manifest ID is required for project-specific storage.'}
                </p>
            </div>
        </div>
        <div class="divider"></div>
        <button class="reset" type="button" @click=${this.reset}>
            <wf-icon name="refresh" size="m"></wf-icon>
            Reset all settings
        </button>
    `;
}

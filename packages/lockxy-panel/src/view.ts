import { html } from 'lit';

import lockxyMarkInverse from '../../../assets/brand/lockxy-mark-inverse.svg?url';
import lockxyWordmark from '../../../assets/brand/lockxy-wordmark-on-light.svg?url';
import { ENDPOINTS_TAB, SETTINGS_TAB } from './constant.js';
import type { MockEndpoint, MockProxyViewActions, MockProxyViewModel } from './interface.js';
import type { SettingChangeDetail } from './component/Settings/interface.js';

const renderContent = (model: MockProxyViewModel, actions: MockProxyViewActions) =>
    model.activeTab === ENDPOINTS_TAB
        ? html`
              <wf-lockxy-panel-endpoints
                  id="panel-endpoints"
                  role="tabpanel"
                  aria-labelledby="tab-endpoints"
                  .bypass=${model.bypass}
                  .endpoints=${model.endpoints}
                  .error=${model.error}
                  .loading=${model.loading}
                  .query=${model.query}
                  .scenarios=${model.scenarios}
                  @onProxyChange=${(event: CustomEvent<{ active: boolean }>) =>
                      actions.handleProxyChange(event.detail.active)}
                  @onEndpointChange=${(event: CustomEvent<{ endpoint: MockEndpoint; active: boolean }>) =>
                      actions.handleEndpointChange(event.detail.endpoint, event.detail.active)}
                  @onScenarioChange=${(event: CustomEvent<{ endpoint: MockEndpoint; scenarioId: string }>) =>
                      actions.handleScenarioChange(event.detail.endpoint, event.detail.scenarioId)}
                  @onQueryChange=${(event: CustomEvent<{ query: string }>) =>
                      actions.handleQueryChange(event.detail.query)}
                  @onRetryManifest=${actions.retryManifest}
              ></wf-lockxy-panel-endpoints>
          `
        : html`
              <wf-lockxy-panel-settings
                  id="panel-settings"
                  role="tabpanel"
                  aria-labelledby="tab-settings"
                  .proxyOnLoad=${model.proxyOnLoad}
                  .saveSelections=${model.saveSelections}
                  @onSettingChange=${(event: CustomEvent<SettingChangeDetail>) =>
                      actions.handleSettingChange(event.detail)}
                  @onResetSettings=${actions.resetSettings}
              ></wf-lockxy-panel-settings>
          `;

export const renderMockProxy = (model: MockProxyViewModel, actions: MockProxyViewActions) => html`
    <button
        class=${`backdrop ${model.open ? 'open' : ''}`}
        type="button"
        tabindex="-1"
        aria-label="Close Lockxy"
        aria-hidden=${model.open ? 'false' : 'true'}
        @click=${actions.closePanel}
    ></button>

    <button
        class=${`launcher ${model.dragging ? 'dragging' : ''}`}
        style=${`left: ${model.position.x}px;top: ${model.position.y}px`}
        type="button"
        aria-label=${model.open ? 'Close Lockxy' : 'Open Lockxy'}
        aria-controls="mock-proxy-panel"
        aria-expanded=${model.open ? 'true' : 'false'}
        title="Click to open. Hold Ctrl or Cmd while dragging to move."
        @click=${actions.togglePanel}
        @pointerdown=${actions.handleLauncherPointerDown}
        @pointermove=${actions.handleLauncherPointerMove}
        @pointerup=${actions.handleLauncherPointerUp}
        @pointercancel=${actions.handleLauncherPointerUp}
    >
        <img src=${lockxyMarkInverse} alt="" />
    </button>

    <aside
        class=${`panel ${model.open ? 'open' : ''}`}
        id="mock-proxy-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Lockxy Local Mock Proxy"
        aria-hidden=${model.open ? 'false' : 'true'}
    >
        <header class="panel-header">
            <div class="brand">
                <img src=${lockxyWordmark} alt="Lockxy Local Mock Proxy" />
            </div>
            <button class="icon-button close" type="button" aria-label="Close Lockxy" @click=${actions.closePanel}>
                <wf-icon name="close" size="l"></wf-icon>
            </button>
        </header>

        <nav class="tabs" role="tablist" aria-label="Lockxy sections" @keydown=${actions.handleTabKeyDown}>
            ${(
                [
                    { id: ENDPOINTS_TAB, icon: 'sliders', label: 'Endpoints' },
                    { id: SETTINGS_TAB, icon: 'settings', label: 'Settings' },
                ] as const
            ).map(
                ({ id, icon, label }) => html`
                    <button
                        class="tab"
                        id=${`tab-${id}`}
                        type="button"
                        role="tab"
                        aria-controls=${`panel-${id}`}
                        aria-selected=${model.activeTab === id ? 'true' : 'false'}
                        tabindex=${model.activeTab === id ? '0' : '-1'}
                        @click=${() => actions.selectTab(id)}
                    >
                        <wf-icon name=${icon} size="m"></wf-icon>
                        ${label}
                    </button>
                `
            )}
        </nav>

        <div class="content">${renderContent(model, actions)}</div>
    </aside>
`;

import {
    BYPASS_ALL_VALUE,
    BYPASS_COOKIE_NAME,
    getCookieValue,
    MANIFEST_ROUTE,
    parseBypassCookie,
    parseScenarioCookie,
    SCENARIO_COOKIE_NAME,
    setCookieValue,
    updateBypassCookie,
    updateScenarioCookie,
} from '@wesflo/local-mock-api-utils';
import { wfElement } from '@wesflo/local-mock-api-ui';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import {
    LAUNCHER_SIZE,
    MOCK_PROXY_TAG_NAME,
    POSITION_STORAGE_KEY,
    VIEWPORT_GAP,
    ENDPOINTS_TAB,
    SETTINGS_TAB,
} from './constant.js';
import type { DragState, MockEndpoint, MockManifest, MockProxyTab, Position } from './interface.js';
import type {
    EndpointChangeDetail,
    ProxyChangeDetail,
    QueryChangeDetail,
    ScenarioChangeDetail,
} from './component/Endpoints/interface.js';
import './component/Endpoints/element.js';
import type { SettingChangeDetail } from './component/Settings/interface.js';
import './component/Settings/element.js';
import { mockProxyStyle } from './style.js';

@wfElement(MOCK_PROXY_TAG_NAME)
export class WfViteMockProxy extends LitElement {
    static styles = mockProxyStyle;

    @state() private activeTab: MockProxyTab = ENDPOINTS_TAB;
    @state() private bypass = parseBypassCookie();
    @state() private dragState?: DragState;
    @state() private error = '';
    @state() private loading = true;
    @state() private manifest?: MockManifest;
    @state() private open = false;
    @state() private position: Position = { x: 28, y: 200 };
    @state() private proxyOnLoad = true;
    @state() private query = '';
    @state() private saveSelections = false;
    @state() private scenarios = new Map<string, string>();

    private suppressLauncherClick = false;

    connectedCallback(): void {
        super.connectedCallback();
        this.restorePosition();
        this.syncCookieState();
        document.addEventListener('keydown', this.handleDocumentKeyDown);
        window.addEventListener('resize', this.handleResize);
        void this.loadManifest();
    }

    disconnectedCallback(): void {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
        window.removeEventListener('resize', this.handleResize);
        super.disconnectedCallback();
    }

    private loadManifest = async (): Promise<void> => {
        this.error = '';
        this.loading = true;

        try {
            const response = await fetch(MANIFEST_ROUTE, { headers: { accept: 'application/json' } });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            this.manifest = (await response.json()) as MockManifest;
        } catch (error) {
            this.manifest = undefined;
            this.error = `The manifest could not be loaded (${error instanceof Error ? error.message : String(error)}).`;
        } finally {
            this.loading = false;
        }
    };

    private syncCookieState = (): void => {
        this.bypass = parseBypassCookie(getCookieValue(BYPASS_COOKIE_NAME));
        this.scenarios = parseScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME));
    };

    private clampPosition = (position: Position): Position => ({
        x: Math.max(VIEWPORT_GAP, Math.min(position.x, window.innerWidth - LAUNCHER_SIZE - VIEWPORT_GAP)),
        y: Math.max(VIEWPORT_GAP, Math.min(position.y, window.innerHeight - LAUNCHER_SIZE - VIEWPORT_GAP)),
    });

    private defaultPosition = (): Position =>
        this.clampPosition({ x: 28, y: Math.round((window.innerHeight - LAUNCHER_SIZE) / 2) });

    private restorePosition = (): void => {
        try {
            const stored = localStorage.getItem(POSITION_STORAGE_KEY);

            if (!stored) {
                this.position = this.defaultPosition();
                return;
            }

            const position = JSON.parse(stored) as Partial<Position>;
            this.position =
                Number.isFinite(position.x) && Number.isFinite(position.y)
                    ? this.clampPosition({ x: position.x!, y: position.y! })
                    : this.defaultPosition();
        } catch {
            this.position = this.defaultPosition();
        }
    };

    private persistPosition = (): void => {
        try {
            localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(this.position));
        } catch {
            // Storage can be unavailable in privacy-restricted browsing contexts.
        }
    };

    private handleResize = (): void => {
        this.position = this.clampPosition(this.position);
    };

    private handleDocumentKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape' && this.open) {
            event.preventDefault();
            this.closePanel();
        }
    };

    private togglePanel = (): void => {
        if (this.suppressLauncherClick) {
            this.suppressLauncherClick = false;
            return;
        }

        this.open ? this.closePanel() : this.openPanel();
    };

    private openPanel = (): void => {
        this.open = true;
        void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>('.close')?.focus());
    };

    private closePanel = (): void => {
        this.open = false;
        void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>('.launcher')?.focus());
    };

    private handleLauncherPointerDown = (event: PointerEvent): void => {
        if (!event.ctrlKey && !event.metaKey) {
            return;
        }

        event.preventDefault();
        this.suppressLauncherClick = true;
        this.dragState = {
            offsetX: event.clientX - this.position.x,
            offsetY: event.clientY - this.position.y,
        };
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    };

    private handleLauncherPointerMove = (event: PointerEvent): void => {
        if (!this.dragState) {
            return;
        }

        this.position = this.clampPosition({
            x: event.clientX - this.dragState.offsetX,
            y: event.clientY - this.dragState.offsetY,
        });
    };

    private handleLauncherPointerUp = (): void => {
        if (!this.dragState) {
            return;
        }

        this.dragState = undefined;
        this.persistPosition();
    };

    private selectTab = (tab: MockProxyTab): void => {
        this.activeTab = tab;
    };

    private handleTabKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            return;
        }

        event.preventDefault();
        const nextTab = this.activeTab === ENDPOINTS_TAB ? SETTINGS_TAB : ENDPOINTS_TAB;
        this.activeTab = nextTab;
        void this.updateComplete.then(() =>
            this.renderRoot.querySelector<HTMLButtonElement>(`#tab-${nextTab}`)?.focus()
        );
    };

    private setProxyActive = (active: boolean): void => {
        setCookieValue(BYPASS_COOKIE_NAME, active ? '' : BYPASS_ALL_VALUE);
        this.syncCookieState();
    };

    private setEndpointActive = (endpoint: MockEndpoint, active: boolean): void => {
        setCookieValue(
            BYPASS_COOKIE_NAME,
            updateBypassCookie(getCookieValue(BYPASS_COOKIE_NAME), endpoint.id, !active)
        );
        this.syncCookieState();
    };

    private setScenario = (endpoint: MockEndpoint, scenarioId: string): void => {
        setCookieValue(
            SCENARIO_COOKIE_NAME,
            updateScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME), endpoint.id, scenarioId || undefined)
        );
        this.syncCookieState();
    };

    private setSetting = ({ name, checked }: SettingChangeDetail): void => {
        if (name === 'proxyOnLoad') {
            this.proxyOnLoad = checked;
        } else {
            this.saveSelections = checked;
        }
    };

    private resetSettings = (): void => {
        setCookieValue(BYPASS_COOKIE_NAME, '');
        setCookieValue(SCENARIO_COOKIE_NAME, '');
        this.proxyOnLoad = true;
        this.saveSelections = false;
        this.position = this.defaultPosition();

        try {
            localStorage.removeItem(POSITION_STORAGE_KEY);
        } catch {
            // Storage can be unavailable in privacy-restricted browsing contexts.
        }

        this.syncCookieState();
    };

    private renderContent = () =>
        this.activeTab === ENDPOINTS_TAB
            ? html`
                  <wf-vite-mock-proxy-endpoints
                      id="panel-endpoints"
                      role="tabpanel"
                      aria-labelledby="tab-endpoints"
                      .bypass=${this.bypass}
                      .endpoints=${this.manifest?.endpoints ?? []}
                      .error=${this.error}
                      .loading=${this.loading}
                      .query=${this.query}
                      .scenarios=${this.scenarios}
                      @proxy-change=${(event: CustomEvent<ProxyChangeDetail>) =>
                          this.setProxyActive(event.detail.active)}
                      @endpoint-change=${(event: CustomEvent<EndpointChangeDetail>) =>
                          this.setEndpointActive(event.detail.endpoint, event.detail.active)}
                      @scenario-change=${(event: CustomEvent<ScenarioChangeDetail>) =>
                          this.setScenario(event.detail.endpoint, event.detail.scenarioId)}
                      @query-change=${(event: CustomEvent<QueryChangeDetail>) => (this.query = event.detail.query)}
                      @retry-manifest=${() => void this.loadManifest()}
                  ></wf-vite-mock-proxy-endpoints>
              `
            : html`
                  <wf-vite-mock-proxy-settings
                      id="panel-settings"
                      role="tabpanel"
                      aria-labelledby="tab-settings"
                      .proxyOnLoad=${this.proxyOnLoad}
                      .saveSelections=${this.saveSelections}
                      @setting-change=${(event: CustomEvent<SettingChangeDetail>) => this.setSetting(event.detail)}
                      @reset-settings=${this.resetSettings}
                  ></wf-vite-mock-proxy-settings>
              `;

    render = () => html`
        <button
            class=${`backdrop ${this.open ? 'open' : ''}`}
            type="button"
            tabindex="-1"
            aria-label="Close Mock Proxy"
            aria-hidden=${this.open ? 'false' : 'true'}
            @click=${this.closePanel}
        ></button>

        <button
            class=${`launcher ${this.dragState ? 'dragging' : ''}`}
            style=${`left:${this.position.x}px;top:${this.position.y}px`}
            type="button"
            aria-label=${this.open ? 'Close Mock Proxy' : 'Open Mock Proxy'}
            aria-controls="mock-proxy-panel"
            aria-expanded=${this.open ? 'true' : 'false'}
            title="Click to open. Hold Ctrl or Cmd while dragging to move."
            @click=${this.togglePanel}
            @pointerdown=${this.handleLauncherPointerDown}
            @pointermove=${this.handleLauncherPointerMove}
            @pointerup=${this.handleLauncherPointerUp}
            @pointercancel=${this.handleLauncherPointerUp}
        >
            <wf-icon name="rocket" size="29"></wf-icon>
        </button>

        <aside
            class=${`panel ${this.open ? 'open' : ''}`}
            id="mock-proxy-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Mock Proxy"
            aria-hidden=${this.open ? 'false' : 'true'}
        >
            <header class="panel-header">
                <div class="brand">
                    <span class="brand-mark">
                        <wf-icon name="rocket" size="27"></wf-icon>
                    </span>
                    <strong>Mock Proxy</strong>
                </div>
                <button class="icon-button close" type="button" aria-label="Close Mock Proxy" @click=${this.closePanel}>
                    <wf-icon name="close" size="24"></wf-icon>
                </button>
            </header>

            <nav class="tabs" role="tablist" aria-label="Mock Proxy sections" @keydown=${this.handleTabKeyDown}>
                <button
                    class="tab"
                    id="tab-endpoints"
                    type="button"
                    role="tab"
                    aria-controls="panel-endpoints"
                    aria-selected=${this.activeTab === ENDPOINTS_TAB ? 'true' : 'false'}
                    tabindex=${this.activeTab === ENDPOINTS_TAB ? '0' : '-1'}
                    @click=${() => this.selectTab(ENDPOINTS_TAB)}
                >
                    <wf-icon name="sliders" size="19"></wf-icon>
                    Endpoints
                </button>
                <button
                    class="tab"
                    id="tab-settings"
                    type="button"
                    role="tab"
                    aria-controls="panel-settings"
                    aria-selected=${this.activeTab === SETTINGS_TAB ? 'true' : 'false'}
                    tabindex=${this.activeTab === SETTINGS_TAB ? '0' : '-1'}
                    @click=${() => this.selectTab(SETTINGS_TAB)}
                >
                    <wf-icon name="settings" size="19"></wf-icon>
                    Settings
                </button>
            </nav>

            <div class="content">${this.renderContent()}</div>
        </aside>
    `;
}

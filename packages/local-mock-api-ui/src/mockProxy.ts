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
import { css, html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import './icon';
import { theme } from './theme';
import { wfElement } from './wfElement';

interface MockManifest {
    endpoints: MockEndpoint[];
}

interface MockEndpoint {
    id: string;
    label?: string;
    active?: boolean;
    method: string;
    path: string;
    scenarios: MockScenario[];
}

interface MockScenario {
    id: string;
    label: string;
}

interface Position {
    x: number;
    y: number;
}

interface DragState {
    offsetX: number;
    offsetY: number;
}

type Tab = 'endpoints' | 'settings';

const POSITION_STORAGE_KEY = 'wesflo-mock-api-button-position';
const LAUNCHER_SIZE = 56;
const VIEWPORT_GAP = 12;

@wfElement('wesflo-mock-proxy')
export class WesfloMockProxy extends LitElement {
    static styles = [
        theme,
        css`
            :host {
                position: fixed;
                z-index: 2147483000;
                inset: 0;
                display: block;
                width: 0;
                height: 0;
                font-size: 14px;
                line-height: 1.4;
            }

            button,
            input,
            select {
                font: inherit;
            }

            button {
                color: inherit;
            }

            button:focus-visible,
            input:focus-visible,
            select:focus-visible {
                outline: 3px solid rgb(6 155 215 / 28%);
                outline-offset: 2px;
            }

            .backdrop {
                position: fixed;
                z-index: 0;
                inset: 0;
                border: 0;
                background: rgb(27 39 65 / 10%);
                cursor: default;
                opacity: 0;
                pointer-events: none;
                transition: opacity 220ms ease;
            }

            .backdrop.open {
                opacity: 1;
                pointer-events: auto;
            }

            .launcher {
                position: fixed;
                z-index: 2;
                display: grid;
                width: ${LAUNCHER_SIZE}px;
                height: ${LAUNCHER_SIZE}px;
                padding: 0;
                place-items: center;
                color: #fff;
                border: 0;
                border-radius: 13px;
                background: linear-gradient(145deg, #35bfda, #12a5c8);
                box-shadow: 0 9px 22px rgb(5 95 124 / 28%);
                cursor: pointer;
                touch-action: none;
                transition:
                    box-shadow 150ms ease,
                    transform 150ms ease;
            }

            .launcher:hover {
                box-shadow: 0 11px 28px rgb(5 95 124 / 35%);
                transform: translateY(-1px);
            }

            .launcher.dragging {
                cursor: grabbing;
                transform: scale(1.03);
            }

            .panel {
                position: fixed;
                z-index: 3;
                top: 0;
                right: 0;
                display: flex;
                width: min(430px, calc(100vw - 16px));
                height: 100dvh;
                flex-direction: column;
                overflow: hidden;
                border-left: 1px solid #e3e9f0;
                background: #fff;
                box-shadow: -12px 0 36px rgb(16 24 40 / 12%);
                transform: translateX(102%);
                visibility: hidden;
                transition:
                    transform 240ms ease,
                    visibility 0s linear 240ms;
            }

            .panel.open {
                transform: translateX(0);
                visibility: visible;
                transition: transform 240ms ease;
            }

            .panel-header {
                display: flex;
                min-height: 72px;
                padding: 0 20px;
                align-items: center;
                justify-content: space-between;
            }

            .brand {
                display: inline-flex;
                gap: 10px;
                align-items: center;
                font-size: 18px;
                letter-spacing: -0.02em;
            }

            .brand-mark {
                display: grid;
                width: 32px;
                height: 32px;
                place-items: center;
                color: var(--wf-color-primary);
            }

            .icon-button {
                display: grid;
                width: 38px;
                height: 38px;
                padding: 0;
                place-items: center;
                color: #475467;
                border: 0;
                border-radius: 9px;
                background: transparent;
                cursor: pointer;
            }

            .icon-button:hover {
                background: #f2f6f9;
            }

            .tabs {
                display: grid;
                padding: 0 20px;
                grid-template-columns: 1fr 1fr;
                border-bottom: 1px solid #e5ebf1;
            }

            .tab {
                position: relative;
                display: inline-flex;
                min-height: 50px;
                gap: 8px;
                align-items: center;
                justify-content: center;
                color: #667085;
                border: 0;
                background: transparent;
                cursor: pointer;
            }

            .tab::after {
                position: absolute;
                right: 0;
                bottom: -1px;
                left: 0;
                height: 3px;
                border-radius: 3px 3px 0 0;
                background: var(--wf-color-primary);
                content: '';
                opacity: 0;
            }

            .tab[aria-selected='true'] {
                color: var(--wf-color-primary);
                font-weight: 650;
            }

            .tab[aria-selected='true']::after {
                opacity: 1;
            }

            .content {
                min-height: 0;
                flex: 1;
                overflow: auto;
            }

            .endpoints-content {
                padding: 14px 16px 24px;
            }

            .master-toggle {
                display: flex;
                min-height: 62px;
                padding: 12px 14px;
                gap: 12px;
                align-items: center;
                border: 1px solid #cce6f2;
                border-radius: 10px;
                background: #f5fbfe;
            }

            .search {
                position: relative;
                margin: 12px 0;
            }

            .search wf-icon {
                position: absolute;
                top: 50%;
                left: 13px;
                color: #667085;
                transform: translateY(-50%);
                pointer-events: none;
            }

            .search input {
                width: 100%;
                height: 42px;
                padding: 0 12px 0 40px;
                color: var(--wf-color-ink);
                border: 1px solid #d9e1e9;
                border-radius: 9px;
                background: #fff;
            }

            .search input::placeholder {
                color: #7d899b;
            }

            .endpoint-list {
                overflow: hidden;
                border: 1px solid #e0e6ed;
                border-radius: 10px;
                background: #fff;
            }

            .endpoint {
                padding: 12px 13px;
                border-bottom: 1px solid #e9edf2;
            }

            .endpoint:last-child {
                border-bottom: 0;
            }

            .endpoint.inactive {
                color: #98a2b3;
                background: #fafbfc;
            }

            .endpoint-heading {
                display: flex;
                min-width: 0;
                margin-bottom: 8px;
                gap: 10px;
                align-items: center;
            }

            .method {
                width: 48px;
                flex: 0 0 auto;
                font-size: 12px;
                font-weight: 750;
            }

            .method.get {
                color: #087dee;
            }

            .method.post {
                color: #16a05d;
            }

            .method.put,
            .method.patch {
                color: #e77b12;
            }

            .method.delete {
                color: #e5484d;
            }

            .path {
                min-width: 0;
                overflow: hidden;
                font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                font-size: 12px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .endpoint-control {
                display: grid;
                gap: 10px;
                align-items: center;
                grid-template-columns: minmax(0, 1fr) auto;
            }

            select {
                width: 100%;
                height: 36px;
                padding: 0 31px 0 10px;
                color: #344054;
                border: 1px solid #d8e0e8;
                border-radius: 7px;
                background: #fff;
            }

            select:disabled {
                color: #98a2b3;
                background: #f7f8fa;
            }

            .switch {
                position: relative;
                display: inline-flex;
                flex: 0 0 auto;
                align-items: center;
            }

            .switch input {
                position: absolute;
                width: 1px;
                height: 1px;
                overflow: hidden;
                opacity: 0;
            }

            .switch-track {
                position: relative;
                display: block;
                width: 38px;
                height: 22px;
                border: 1px solid #c9d2de;
                border-radius: 999px;
                background: #dce2ea;
                cursor: pointer;
                transition: background 150ms ease;
            }

            .switch-track::after {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0 1px 3px rgb(16 24 40 / 25%);
                content: '';
                transition: transform 150ms ease;
            }

            .switch input:checked + .switch-track {
                border-color: #16a5c9;
                background: #20afd0;
            }

            .switch input:checked + .switch-track::after {
                transform: translateX(16px);
            }

            .switch input:focus-visible + .switch-track {
                outline: 3px solid rgb(6 155 215 / 28%);
                outline-offset: 2px;
            }

            .switch input:disabled + .switch-track {
                cursor: not-allowed;
                opacity: 0.5;
            }

            .status,
            .empty {
                padding: 28px 16px;
                color: var(--wf-color-muted);
                text-align: center;
            }

            .status.error {
                color: #b42318;
            }

            .retry {
                margin-top: 10px;
                padding: 7px 12px;
                border: 1px solid #d6dee7;
                border-radius: 7px;
                background: #fff;
                cursor: pointer;
            }

            .settings-content {
                padding: 24px 22px;
            }

            .settings-content h3 {
                margin: 0 0 20px;
                font-size: 16px;
            }

            .setting {
                display: grid;
                margin-bottom: 20px;
                gap: 13px;
                align-items: start;
                grid-template-columns: auto 1fr;
            }

            .setting strong {
                display: block;
                margin-bottom: 3px;
                font-weight: 650;
            }

            .setting p {
                margin: 0;
                color: #778398;
                font-size: 12px;
            }

            .settings-divider {
                height: 1px;
                margin: 26px 0;
                background: #e7ecf1;
            }

            .reset {
                display: inline-flex;
                width: 100%;
                min-height: 48px;
                gap: 9px;
                align-items: center;
                justify-content: center;
                border: 0;
                border-radius: 9px;
                background: #f4f6f8;
                font-weight: 650;
                cursor: pointer;
            }

            .reset:hover {
                background: #e9edf2;
            }

            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }

            @media (max-width: 480px) {
                .panel {
                    width: 100vw;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .backdrop,
                .launcher,
                .panel,
                .switch-track,
                .switch-track::after {
                    transition: none;
                }
            }
        `,
    ];

    @state() private activeTab: Tab = 'endpoints';
    @state() private bypass = parseBypassCookie();
    @state() private dragState?: DragState;
    @state() private error?: string;
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
        this.error = undefined;

        try {
            const response = await fetch(MANIFEST_ROUTE, { headers: { accept: 'application/json' } });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            this.manifest = (await response.json()) as MockManifest;
        } catch (error) {
            this.manifest = undefined;
            this.error = `Manifest konnte nicht geladen werden (${error instanceof Error ? error.message : String(error)}).`;
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

        if (this.open) {
            this.closePanel();
        } else {
            this.openPanel();
        }
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

    private selectTab = (tab: Tab): void => {
        this.activeTab = tab;
    };

    private handleTabKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            return;
        }

        event.preventDefault();
        const nextTab: Tab = this.activeTab === 'endpoints' ? 'settings' : 'endpoints';
        this.activeTab = nextTab;
        void this.updateComplete.then(() =>
            this.renderRoot.querySelector<HTMLButtonElement>(`#tab-${nextTab}`)?.focus()
        );
    };

    private setProxyActive = (active: boolean): void => {
        setCookieValue(BYPASS_COOKIE_NAME, active ? '' : BYPASS_ALL_VALUE);
        this.syncCookieState();
    };

    private isEndpointActive = (endpoint: MockEndpoint): boolean =>
        endpoint.active !== false && !this.bypass.all && !this.bypass.endpointIds.has(endpoint.id);

    private setEndpointActive = (endpoint: MockEndpoint, active: boolean): void => {
        const value = updateBypassCookie(getCookieValue(BYPASS_COOKIE_NAME), endpoint.id, !active);
        setCookieValue(BYPASS_COOKIE_NAME, value);
        this.syncCookieState();
    };

    private setScenario = (endpoint: MockEndpoint, scenarioId: string): void => {
        const value = updateScenarioCookie(
            getCookieValue(SCENARIO_COOKIE_NAME),
            endpoint.id,
            scenarioId || undefined
        );
        setCookieValue(SCENARIO_COOKIE_NAME, value);
        this.syncCookieState();
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

    private visibleEndpoints = (): MockEndpoint[] => {
        const query = this.query.trim().toLocaleLowerCase();

        if (!query) {
            return this.manifest?.endpoints ?? [];
        }

        return (this.manifest?.endpoints ?? []).filter((endpoint) =>
            [endpoint.id, endpoint.label, endpoint.method, endpoint.path, ...endpoint.scenarios.map(({ label }) => label)]
                .filter(Boolean)
                .some((value) => value!.toLocaleLowerCase().includes(query))
        );
    };

    private displayPath = (path: string): string => path.replace(/^\/api(?=\/|$)/, '') || '/';

    private renderSwitch = (
        checked: boolean,
        label: string,
        onChange: (checked: boolean) => void,
        disabled = false
    ) => html`
        <label class="switch">
            <span class="sr-only">${label}</span>
            <input
                type="checkbox"
                .checked=${checked}
                ?disabled=${disabled}
                aria-label=${label}
                @change=${(event: Event) => onChange((event.currentTarget as HTMLInputElement).checked)}
            />
            <span class="switch-track" aria-hidden="true"></span>
        </label>
    `;

    private renderEndpoint = (endpoint: MockEndpoint) => {
        const active = this.isEndpointActive(endpoint);
        const unavailable = endpoint.active === false;
        const disabled = unavailable || this.bypass.all;
        const selectedScenario = this.scenarios.get(endpoint.id) ?? '';

        return html`
            <article class=${`endpoint ${unavailable ? 'inactive' : ''}`}>
                <div class="endpoint-heading">
                    <span class=${`method ${endpoint.method.toLocaleLowerCase()}`}>${endpoint.method.toUpperCase()}</span>
                    <span class="path" title=${endpoint.path}>${this.displayPath(endpoint.path)}</span>
                </div>
                <div class="endpoint-control">
                    <label>
                        <span class="sr-only">Szenario für ${endpoint.method} ${endpoint.path}</span>
                        <select
                            .value=${selectedScenario}
                            ?disabled=${disabled || !active}
                            @change=${(event: Event) =>
                                this.setScenario(endpoint, (event.currentTarget as HTMLSelectElement).value)}
                        >
                            <option value="">Standard-Dateiauflösung</option>
                            ${endpoint.scenarios.map(
                                (scenario) => html`<option value=${scenario.id}>${scenario.label}</option>`
                            )}
                        </select>
                    </label>
                    ${this.renderSwitch(
                        active,
                        `Mock für ${endpoint.method} ${endpoint.path} aktiv`,
                        (checked) => this.setEndpointActive(endpoint, checked),
                        disabled
                    )}
                </div>
            </article>
        `;
    };

    private renderEndpoints = () => {
        const endpoints = this.visibleEndpoints();

        return html`
            <div class="endpoints-content" id="panel-endpoints" role="tabpanel" aria-labelledby="tab-endpoints">
                <div class="master-toggle">
                    ${this.renderSwitch(!this.bypass.all, 'Proxy aktiv', (checked) => this.setProxyActive(checked))}
                    <strong>Proxy aktiv</strong>
                </div>
                <label class="search">
                    <span class="sr-only">Endpoints durchsuchen</span>
                    <wf-icon name="search" size="18"></wf-icon>
                    <input
                        type="search"
                        placeholder="Endpoints suchen…"
                        .value=${this.query}
                        @input=${(event: InputEvent) => (this.query = (event.currentTarget as HTMLInputElement).value)}
                    />
                </label>
                ${this.error
                    ? html`
                          <div class="status error" role="alert">
                              ${this.error}<br />
                              <button class="retry" type="button" @click=${() => void this.loadManifest()}>
                                  Erneut versuchen
                              </button>
                          </div>
                      `
                    : !this.manifest
                      ? html`<div class="status" role="status">Manifest wird geladen…</div>`
                      : endpoints.length
                        ? html`<div class="endpoint-list">${endpoints.map(this.renderEndpoint)}</div>`
                        : html`<div class="empty">Keine passenden Endpoints gefunden.</div>`}
            </div>
        `;
    };

    private renderSettings = () => html`
        <div class="settings-content" id="panel-settings" role="tabpanel" aria-labelledby="tab-settings">
            <h3>Allgemein</h3>
            <div class="setting">
                ${this.renderSwitch(this.proxyOnLoad, 'Proxy beim Laden aktivieren', (checked) => {
                    this.proxyOnLoad = checked;
                })}
                <div>
                    <strong>Proxy beim Laden aktivieren</strong>
                    <p>Der Proxy ist standardmäßig aktiviert.</p>
                </div>
            </div>
            <div class="setting">
                ${this.renderSwitch(this.saveSelections, 'Auswahl in lokalem Storage speichern', (checked) => {
                    this.saveSelections = checked;
                })}
                <div>
                    <strong>Auswahl in lokalem Storage speichern</strong>
                    <p>Deine Einstellungen bleiben erhalten.</p>
                </div>
            </div>
            <div class="settings-divider"></div>
            <button class="reset" type="button" @click=${this.resetSettings}>
                <wf-icon name="refresh" size="19"></wf-icon>
                Alle Einstellungen zurücksetzen
            </button>
        </div>
    `;

    render = () => html`
        <button
            class=${`backdrop ${this.open ? 'open' : ''}`}
            type="button"
            tabindex="-1"
            aria-label="Mock Proxy schließen"
            aria-hidden=${this.open ? 'false' : 'true'}
            @click=${this.closePanel}
        ></button>

        <button
            class=${`launcher ${this.dragState ? 'dragging' : ''}`}
            style=${`left:${this.position.x}px;top:${this.position.y}px`}
            type="button"
            aria-label=${this.open ? 'Mock Proxy schließen' : 'Mock Proxy öffnen'}
            aria-controls="mock-proxy-panel"
            aria-expanded=${this.open ? 'true' : 'false'}
            title="Klicken zum Öffnen. Mit Strg oder Cmd gedrückt verschieben."
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
                    <span class="brand-mark"><wf-icon name="rocket" size="27"></wf-icon></span>
                    <strong>Mock Proxy</strong>
                </div>
                <button class="icon-button close" type="button" aria-label="Mock Proxy schließen" @click=${this.closePanel}>
                    <wf-icon name="close" size="24"></wf-icon>
                </button>
            </header>

            <nav class="tabs" role="tablist" aria-label="Mock Proxy Bereiche" @keydown=${this.handleTabKeyDown}>
                <button
                    class="tab"
                    id="tab-endpoints"
                    type="button"
                    role="tab"
                    aria-controls="panel-endpoints"
                    aria-selected=${this.activeTab === 'endpoints' ? 'true' : 'false'}
                    tabindex=${this.activeTab === 'endpoints' ? '0' : '-1'}
                    @click=${() => this.selectTab('endpoints')}
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
                    aria-selected=${this.activeTab === 'settings' ? 'true' : 'false'}
                    tabindex=${this.activeTab === 'settings' ? '0' : '-1'}
                    @click=${() => this.selectTab('settings')}
                >
                    <wf-icon name="settings" size="19"></wf-icon>
                    Einstellungen
                </button>
            </nav>

            <div class="content">${this.activeTab === 'endpoints' ? this.renderEndpoints() : this.renderSettings()}</div>
        </aside>
    `;
}

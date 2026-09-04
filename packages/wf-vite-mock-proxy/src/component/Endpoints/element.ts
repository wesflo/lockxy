import { wfElement } from '@wesflo/local-mock-api-ui';
import type { SwitchChangeDetail } from '@wesflo/local-mock-api-ui';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MOCK_PROXY_ENDPOINTS_TAG_NAME } from '../../constant.js';
import type { BypassSelection, MockEndpoint } from '../../interface.js';
import {
    ENDPOINT_CHANGE_EVENT,
    PROXY_CHANGE_EVENT,
    QUERY_CHANGE_EVENT,
    RETRY_MANIFEST_EVENT,
    SCENARIO_CHANGE_EVENT,
} from './constant.js';
import type {
    EndpointChangeDetail,
    ProxyChangeDetail,
    QueryChangeDetail,
    ScenarioChangeDetail,
} from './interface.js';
import { endpointsStyle } from './style.js';

@wfElement(MOCK_PROXY_ENDPOINTS_TAG_NAME)
export class MockProxyEndpoints extends LitElement {
    static styles = endpointsStyle;

    @property({ attribute: false }) bypass: BypassSelection = { all: false, endpointIds: new Set() };
    @property({ attribute: false }) endpoints: readonly MockEndpoint[] = [];
    @property({ type: String }) error = '';
    @property({ type: Boolean }) loading = true;
    @property({ type: String }) query = '';
    @property({ attribute: false }) scenarios: ReadonlyMap<string, string> = new Map();

    private emit<T>(name: string, detail?: T): void {
        this.dispatchEvent(new CustomEvent<T>(name, { bubbles: true, composed: true, detail }));
    }

    private visibleEndpoints = (): readonly MockEndpoint[] => {
        const query = this.query.trim().toLocaleLowerCase();

        if (!query) {
            return this.endpoints;
        }

        return this.endpoints.filter((endpoint) =>
            [endpoint.id, endpoint.label, endpoint.method, endpoint.path, ...endpoint.scenarios.map(({ label }) => label)]
                .filter(Boolean)
                .some((value) => value!.toLocaleLowerCase().includes(query))
        );
    };

    private isEndpointActive = (endpoint: MockEndpoint): boolean =>
        endpoint.active !== false && !this.bypass.all && !this.bypass.endpointIds.has(endpoint.id);

    private displayPath = (path: string): string => path.replace(/^\/api(?=\/|$)/, '') || '/';

    private renderEndpoint = (endpoint: MockEndpoint) => {
        const active = this.isEndpointActive(endpoint);
        const unavailable = endpoint.active === false;
        const disabled = unavailable || this.bypass.all;

        return html`
            <article class=${`endpoint ${unavailable ? 'inactive' : ''}`}>
                <div class="endpoint-heading">
                    <span class=${`method ${endpoint.method.toLocaleLowerCase()}`}>${endpoint.method.toUpperCase()}</span>
                    <span class="path" title=${endpoint.path}>${this.displayPath(endpoint.path)}</span>
                </div>
                <div class="endpoint-control">
                    <label>
                        <span class="sr-only">Scenario for ${endpoint.method} ${endpoint.path}</span>
                        <select
                            .value=${this.scenarios.get(endpoint.id) ?? ''}
                            ?disabled=${disabled || !active}
                            @change=${(event: Event) =>
                                this.emit<ScenarioChangeDetail>(SCENARIO_CHANGE_EVENT, {
                                    endpoint,
                                    scenarioId: (event.currentTarget as HTMLSelectElement).value,
                                })}
                        >
                            <option value="">Default file resolution</option>
                            ${endpoint.scenarios.map(
                                (scenario) => html`<option value=${scenario.id}>${scenario.label}</option>`
                            )}
                        </select>
                    </label>
                    <wf-switch
                        .checked=${active}
                        .disabled=${disabled}
                        .label=${`Mock for ${endpoint.method} ${endpoint.path} active`}
                        @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                            this.emit<EndpointChangeDetail>(ENDPOINT_CHANGE_EVENT, {
                                endpoint,
                                active: event.detail.checked,
                            })}
                    ></wf-switch>
                </div>
            </article>
        `;
    };

    render = () => {
        const endpoints = this.visibleEndpoints();

        return html`
            <div class="master-toggle">
                <wf-switch
                    .checked=${!this.bypass.all}
                    label="Proxy active"
                    @switch-change=${(event: CustomEvent<SwitchChangeDetail>) =>
                        this.emit<ProxyChangeDetail>(PROXY_CHANGE_EVENT, { active: event.detail.checked })}
                ></wf-switch>
                <strong>Proxy active</strong>
            </div>
            <label class="search">
                <span class="sr-only">Search endpoints</span>
                <wf-icon name="search" size="18"></wf-icon>
                <input
                    type="search"
                    placeholder="Search endpoints…"
                    .value=${this.query}
                    @input=${(event: InputEvent) =>
                        this.emit<QueryChangeDetail>(QUERY_CHANGE_EVENT, {
                            query: (event.currentTarget as HTMLInputElement).value,
                        })}
                />
            </label>
            ${this.error
                ? html`
                      <div class="status error" role="alert">
                          ${this.error}<br />
                          <button class="retry" type="button" @click=${() => this.emit(RETRY_MANIFEST_EVENT)}>
                              Try again
                          </button>
                      </div>
                  `
                : this.loading
                  ? html`<div class="status" role="status">Loading manifest…</div>`
                  : endpoints.length
                    ? html`<div class="endpoint-list">${endpoints.map(this.renderEndpoint)}</div>`
                    : html`<div class="empty">No matching endpoints found.</div>`}
        `;
    };
}

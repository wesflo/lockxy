import { toMethodArray } from '@wesflo/local-mock-api-utils';
import { resetStyles, wfElement } from '@wesflo/local-mock-api-ui';
import type { SwitchChangeDetail } from '@wesflo/local-mock-api-ui';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { DOCUMENTATION_URL, MOCK_PROXY_ENDPOINTS_TAG_NAME } from '../../constant.js';
import type { BypassSelection, MockEndpoint, MockScenario } from '../../interface.js';
import {
    ON_ENDPOINT_CHANGE_EVENT,
    ON_PROXY_CHANGE_EVENT,
    ON_QUERY_CHANGE_EVENT,
    ON_RETRY_MANIFEST_EVENT,
    ON_SCENARIO_CHANGE_EVENT,
} from './constant.js';
import type { EndpointChangeDetail, ProxyChangeDetail, QueryChangeDetail, ScenarioChangeDetail } from './interface.js';
import { endpointsStyle } from './style.js';

@wfElement(MOCK_PROXY_ENDPOINTS_TAG_NAME)
export class MockProxyEndpoints extends LitElement {
    static styles = [resetStyles, endpointsStyle];

    @property({ attribute: false }) bypass: BypassSelection = { all: false, endpointIds: new Set() };
    @property({ attribute: false }) endpoints: readonly MockEndpoint[] = [];
    @property({ type: String }) error = '';
    @property({ type: Boolean }) loading = true;
    @property({ type: String }) query = '';
    @property({ attribute: false }) scenarios: ReadonlyMap<string, string> = new Map();

    private emit<T>(name: string, detail?: T): void {
        this.dispatchEvent(new CustomEvent<T>(name, { detail }));
    }

    private visibleEndpoints = (): readonly MockEndpoint[] => {
        const query = this.query.trim().toLocaleLowerCase();
        const configurableEndpoints = this.endpoints.filter((endpoint) => endpoint.id);

        if (!query) {
            return configurableEndpoints;
        }

        return configurableEndpoints.filter((endpoint) =>
            [
                endpoint.id,
                endpoint.label,
                ...toMethodArray(endpoint.method),
                endpoint.path,
                ...(endpoint.scenarios ?? []).map(({ label }) => label),
            ]
                .filter(Boolean)
                .some((value) => value!.toLocaleLowerCase().includes(query))
        );
    };

    private isEndpointActive = (endpoint: MockEndpoint): boolean =>
        endpoint.active !== false && !this.bypass.all && (!endpoint.id || !this.bypass.endpointIds.has(endpoint.id));

    private displayPath = (path: string): string => path.replace(/^\/api(?=\/|$)/, '') || '/';

    private formatId = (id: string): string =>
        id
            .replace(/[-_]+/g, ' ')
            .trim()
            .replace(/\b\p{L}/gu, (character) => character.toLocaleUpperCase());

    private scenarioLabel = (endpoint: MockEndpoint, scenario?: MockScenario): string =>
        scenario?.label?.trim() ||
        (scenario?.id ? this.formatId(scenario.id) : '') ||
        scenario?.file?.trim() ||
        endpoint.label?.trim() ||
        (endpoint.id ? this.formatId(endpoint.id) : '') ||
        endpoint.file?.trim() ||
        'Default file resolution';

    private setScenarioValue = (element: Element | undefined, value: string): void => {
        if (!(element instanceof HTMLSelectElement)) {
            return;
        }

        queueMicrotask(() => {
            element.value = value;
        });
    };

    private renderEndpoint = (endpoint: MockEndpoint) => {
        const active = this.isEndpointActive(endpoint);
        const unavailable = endpoint.active === false;
        const disabled = unavailable || this.bypass.all;
        const methods = toMethodArray(endpoint.method);
        const displayMethods = methods.length > 0 ? methods : ['ANY'];
        const methodLabel = displayMethods.join(', ');
        const scenarios = endpoint.scenarios ?? [];
        const selectedScenarioId = this.scenarios.get(endpoint.id ?? '') ?? '';

        return html`
            <article class=${`endpoint ${unavailable ? 'inactive' : ''}`}>
                <div class="endpoint-heading">
                    <span class="methods">
                        ${displayMethods.map(
                            (method) => html`
                                <span class=${`method ${method.toLocaleLowerCase()}`}>${method.toUpperCase()}</span>
                            `
                        )}
                    </span>
                    <span class="path" title=${endpoint.path}>${this.displayPath(endpoint.path)}</span>
                </div>
                <div class="endpoint-control">
                    ${scenarios.length <= 1
                        ? html`
                              <span class="scenario-value">${this.scenarioLabel(endpoint, scenarios[0])}</span>
                          `
                        : html`
                              <label>
                                  <span class="sr-only">Scenario for ${methodLabel} ${endpoint.path}</span>
                                  <select
                                      ${ref((element) => this.setScenarioValue(element, selectedScenarioId))}
                                      ?disabled=${disabled || !active}
                                      @change=${(event: Event) =>
                                          this.emit<ScenarioChangeDetail>(ON_SCENARIO_CHANGE_EVENT, {
                                              endpoint,
                                              scenarioId: (event.currentTarget as HTMLSelectElement).value,
                                          })}
                                  >
                                      <option value="">
                                          ${scenarios.length ? 'Default file resolution' : 'Endpoint configuration'}
                                      </option>
                                      ${scenarios.map(
                                          (scenario) => html`
                                              <option value=${scenario.id ?? ''}>
                                                  ${scenario.label ?? scenario.id ?? 'Unnamed scenario'}
                                              </option>
                                          `
                                      )}
                                  </select>
                              </label>
                          `}
                    <wf-switch
                        .checked=${active}
                        .disabled=${disabled}
                        .label=${`Mock for ${methodLabel} ${endpoint.path} active`}
                        @onSwitchChange=${(event: CustomEvent<SwitchChangeDetail>) =>
                            this.emit<EndpointChangeDetail>(ON_ENDPOINT_CHANGE_EVENT, {
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
                    @onSwitchChange=${(event: CustomEvent<SwitchChangeDetail>) =>
                        this.emit<ProxyChangeDetail>(ON_PROXY_CHANGE_EVENT, { active: event.detail.checked })}
                ></wf-switch>
                <strong>Proxy active</strong>
            </div>
            <label class="search">
                <span class="sr-only">Search endpoints</span>
                <wf-icon name="search" size="m"></wf-icon>
                <input
                    type="search"
                    placeholder="Search endpoints…"
                    .value=${this.query}
                    @input=${(event: InputEvent) =>
                        this.emit<QueryChangeDetail>(ON_QUERY_CHANGE_EVENT, {
                            query: (event.currentTarget as HTMLInputElement).value,
                        })}
                />
            </label>
            ${this.error
                ? html`
                      <div class="status error" role="alert">
                          ${this.error}
                          <br />
                          <button class="retry" type="button" @click=${() => this.emit(ON_RETRY_MANIFEST_EVENT)}>
                              Try again
                          </button>
                      </div>
                  `
                : this.loading
                  ? html`
                        <div class="status" role="status">Loading manifest…</div>
                    `
                  : endpoints.length
                    ? html`
                          <div class="endpoint-list">${endpoints.map(this.renderEndpoint)}</div>
                      `
                    : html`
                          <div class="empty">No matching endpoints found.</div>
                      `}
            <footer class="footer">
                <wf-button @onClick=${() => this.emit('onResetSettings')}>
                    <wf-icon name="refresh" size="m"></wf-icon>
                    Reset Lockxy to defaults
                </wf-button>
                <a href=${DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">Lockxy documentation</a>
            </footer>
        `;
    };
}

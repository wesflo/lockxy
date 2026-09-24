import { toMethodArray } from '@wesflo/local-mock-api-utils';
import type { BypassSelection, MockEndpoint, MockScenario } from '@wesflo/local-mock-api-utils';
import { resetStyles, wfElement } from '@wesflo/local-mock-api-ui';
import type { SwitchChangeDetail } from '@wesflo/local-mock-api-ui';
import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import {
    DOCUMENTATION_URL,
    MANIFEST_CONTROL_DOCUMENTATION_URL,
    MOCK_PROXY_ENDPOINTS_TAG_NAME,
} from '../../constant.js';
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
    @property({ type: Boolean }) manifestControlled = false;
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
        !this.bypass.all && (!endpoint.id || !this.bypass.endpointIds.has(endpoint.id));

    private isEndpointManifestControlled = (endpoint: MockEndpoint): boolean =>
        endpoint.preventMock === true || Boolean(endpoint.scenarios?.some((scenario) => scenario.active !== undefined));

    private displayPath = (path: string): string => path.replace(/^\/api(?=\/|$)/, '') || '/';

    private formatId = (id: string): string =>
        id
            .replace(/[-_]+/g, ' ')
            .trim()
            .replace(/\b\p{L}/gu, (character) => character.toLocaleUpperCase());

    private endpointLabel = (endpoint: MockEndpoint): string =>
        endpoint.label?.trim() || (endpoint.id ? this.formatId(endpoint.id) : '') || this.displayPath(endpoint.path);

    private scenarioLabel = (scenario: MockScenario): string =>
        scenario.label?.trim() ||
        (scenario.id ? this.formatId(scenario.id) : '') ||
        scenario.file?.trim() ||
        'File by convention';

    private responseLabel = (endpoint: MockEndpoint, scenario?: MockScenario): string =>
        endpoint.dynamic
            ? 'Dynamic response'
            : scenario
              ? this.scenarioLabel(scenario)
              : endpoint.file?.trim() || 'File by convention';

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
        const controlled = this.isEndpointManifestControlled(endpoint);
        const disabled = controlled || this.bypass.all;
        const methods = toMethodArray(endpoint.method);
        const displayMethods = methods.length > 0 ? methods : ['ANY'];
        const methodLabel = displayMethods.join(', ');
        const scenarios = endpoint.scenarios ?? [];
        const selectedScenarioId = this.scenarios.get(endpoint.id ?? '') ?? scenarios[0]?.id ?? '';
        const hasEndpointName = Boolean(endpoint.label?.trim() || endpoint.id);

        return html`
            <article class=${`endpoint ${controlled ? 'controlled' : ''}`}>
                <div class="endpoint-heading">
                    <span class="methods">
                        ${displayMethods.map(
                            (method) => html`
                                <span class=${`method ${method.toLocaleLowerCase()}`}>${method.toUpperCase()}</span>
                            `
                        )}
                    </span>
                    <span class=${hasEndpointName ? 'endpoint-name' : 'endpoint-name path'} title=${endpoint.path}>
                        ${this.endpointLabel(endpoint)}
                    </span>
                </div>
                <div class="endpoint-control">
                    ${controlled
                        ? html`
                              <a
                                  class="manifest-control"
                                  href=${MANIFEST_CONTROL_DOCUMENTATION_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  Controlled by manifest
                              </a>
                          `
                        : scenarios.length <= 1
                          ? html`
                                <span class="scenario-value">${this.responseLabel(endpoint, scenarios[0])}</span>
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
                                        ${scenarios.map(
                                            (scenario) => html`
                                                <option value=${scenario.id ?? ''}>
                                                    ${this.scenarioLabel(scenario)}
                                                </option>
                                            `
                                        )}
                                        <option value="">Default file resolution</option>
                                    </select>
                                </label>
                            `}
                    ${controlled
                        ? nothing
                        : html`
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
                          `}
                </div>
            </article>
        `;
    };

    render = () => {
        if (this.manifestControlled) {
            return html`
                <div class="root-manifest-control">
                    <a
                        class="manifest-control"
                        href=${MANIFEST_CONTROL_DOCUMENTATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Controlled by manifest
                    </a>
                </div>
            `;
        }

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

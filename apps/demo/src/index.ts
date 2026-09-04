import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { EpBaseElement, epElement, epFetch, getCookieValue, saveBlob } from '@electronicpartnerio/ui-utils';
import {
    Badge,
    Button,
    h1Tag,
    h2Tag,
    h3Tag,
    Notification,
    pTag,
    resetStyles,
    smallTag
} from '@electronicpartnerio/uic';

import { DEMO_CASES, MANIFEST_ROUTE, SCENARIO_COOKIE_NAME } from './constant';
import type { DemoCase, DemoResult, MockEndpoint, MockManifest, MockScenario } from './interface';
import styles from './styles';
import { executeDemoCase } from './util/executeDemoCase';
import { parseScenarioCookie } from './util/parseScenarioCookie';
import { updateScenarioCookie } from './util/updateScenarioCookie';

void Badge;
void Button;
void Notification;

@epElement('wesflo-local-mock-api-demo')
export class MockApiDemo extends EpBaseElement {
    static styles = [resetStyles, h1Tag, h2Tag, h3Tag, pTag, smallTag, styles];

    @state() private manifest?: MockManifest;
    @state() private manifestError?: string;
    @state() private manifestLoading = true;
    @state() private results = new Map<string, DemoResult>();
    @state() private runningCases = new Set<string>();
    @state() private selections = new Map<string, string>();

    connectedCallback(): void {
        super.connectedCallback();
        this.syncSelections();
        void this.loadManifest();
    }

    private findEndpoint(endpointId?: string): MockEndpoint | undefined {
        return endpointId ? this.manifest?.endpoints.find((endpoint) => endpoint.id === endpointId) : undefined;
    }

    private getExpectedStatus(testCase: DemoCase): number {
        const selectedScenario = this.findEndpoint(testCase.endpointId)?.scenarios.find(
            (scenario) => scenario.id === this.selections.get(testCase.endpointId ?? '')
        );

        return selectedScenario?.status ?? testCase.expectedStatus;
    }

    private getGroups(): string[] {
        return [...new Set(DEMO_CASES.map((testCase) => testCase.group))];
    }

    private async loadManifest(): Promise<void> {
        this.manifestLoading = true;
        this.manifestError = undefined;

        try {
            const manifest = await epFetch<MockManifest>('')(MANIFEST_ROUTE);
            this.manifest = manifest ?? { endpoints: [] };
        } catch (error) {
            this.manifest = undefined;
            this.manifestError = error instanceof Error ? error.message : String(error);
        } finally {
            this.manifestLoading = false;
        }
    }

    private async runCase(testCase: DemoCase): Promise<void> {
        this.runningCases = new Set(this.runningCases).add(testCase.id);
        const result = await executeDemoCase(testCase);
        const results = new Map(this.results);
        results.set(testCase.id, result);
        this.results = results;

        const runningCases = new Set(this.runningCases);
        runningCases.delete(testCase.id);
        this.runningCases = runningCases;
    }

    private selectScenario(endpointId: string, scenarioId?: string): void {
        const currentValue = getCookieValue(SCENARIO_COOKIE_NAME) ?? undefined;
        const value = updateScenarioCookie(currentValue, endpointId, scenarioId);

        document.cookie = `${SCENARIO_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`;
        this.syncSelections();
    }

    private selectStaleScenario(): void {
        this.selectScenario('json-response', 'removed-scenario');
    }

    private syncSelections(): void {
        this.selections = parseScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME) ?? undefined);
    }

    private downloadResult(testCase: DemoCase): void {
        const result = this.results.get(testCase.id);

        if (result?.blob) {
            saveBlob(result.blob, result.filename ?? testCase.downloadName ?? 'mock-response.pdf');
        }
    }

    private renderScenarioButton(endpointId: string, scenario?: MockScenario) {
        const scenarioId = scenario?.id;
        const selected =
            this.selections.get(endpointId) === scenarioId || (!scenario && !this.selections.has(endpointId));

        return html`
            <uic-button
                size="xs"
                color=${selected ? 'primary' : 'tertiary'}
                variant=${selected ? 'filled' : 'outlined'}
                @click=${() => this.selectScenario(endpointId, scenarioId)}
            >
                ${scenario?.label ?? 'Default'}
            </uic-button>
        `;
    }

    private renderScenarios(testCase: DemoCase) {
        const endpoint = this.findEndpoint(testCase.endpointId);

        if (!testCase.endpointId) {
            return html`
                <small>Legacy-Auflösung ohne Manifest-Szenario</small>
            `;
        }

        if (!endpoint) {
            return html`
                <small>Endpoint im aktuellen Manifest nicht verfügbar</small>
            `;
        }

        return html`
            <div class="scenario-list" aria-label="Szenario für ${endpoint.id}">
                ${this.renderScenarioButton(endpoint.id)}
                ${endpoint.scenarios.map((scenario) => this.renderScenarioButton(endpoint.id, scenario))}
            </div>
        `;
    }

    private renderResult(testCase: DemoCase) {
        const result = this.results.get(testCase.id);

        if (!result) {
            return html`
                <div class="result result--idle">Noch nicht ausgeführt</div>
            `;
        }

        const expectedStatus = this.getExpectedStatus(testCase);
        const isExpectedError = expectedStatus >= 400 && result.state === 'error';
        const successful = result.state === 'success' || isExpectedError;

        return html`
            <div class="result ${successful ? 'result--success' : 'result--error'}">
                <div class="result__meta">
                    <strong>${successful ? 'Erwartetes Ergebnis' : 'Unerwartetes Ergebnis'}</strong>
                    <span>${Math.round(result.duration)} ms gemessen</span>
                </div>
                <pre>${result.body || '(leer – kein Response-Body)'}</pre>
                ${result.blob
                    ? html`
                          <uic-button
                              size="s"
                              color="secondary"
                              variant="outlined"
                              @click=${() => this.downloadResult(testCase)}
                          >
                              PDF herunterladen
                          </uic-button>
                      `
                    : nothing}
            </div>
        `;
    }

    private renderCase(testCase: DemoCase) {
        const running = this.runningCases.has(testCase.id);
        const status = this.getExpectedStatus(testCase);
        const selectedScenario = testCase.endpointId ? this.selections.get(testCase.endpointId) : undefined;

        return html`
            <article class="case-card">
                <div class="case-card__heading">
                    <div>
                        <div class="badges">
                            <uic-badge size="s" color="info">${testCase.method}</uic-badge>
                            <uic-badge size="s" color=${status >= 400 ? 'danger' : 'success'}>HTTP ${status}</uic-badge>
                        </div>
                        <h3>${testCase.title}</h3>
                    </div>
                    <code>${testCase.path}</code>
                </div>
                <p>${testCase.description}</p>
                <div class="scenario-row">
                    <span class="scenario-label">Auswahl</span>
                    ${this.renderScenarios(testCase)}
                </div>
                ${selectedScenario
                    ? html`
                          <small>Cookie-Auswahl: ${testCase.endpointId}:${selectedScenario}</small>
                      `
                    : nothing}
                <div class="case-card__action">
                    <uic-button
                        size="s"
                        .loading=${running}
                        .disabled=${running}
                        @click=${() => void this.runCase(testCase)}
                    >
                        Request ausführen
                    </uic-button>
                    <span>Erwartet: HTTP ${status}</span>
                </div>
                ${this.renderResult(testCase)}
            </article>
        `;
    }

    render() {
        const cookieValue = getCookieValue(SCENARIO_COOKIE_NAME);

        return html`
            <header class="hero">
                <div class="hero__content">
                    <p class="eyebrow">@electronicpartnerio/vite-plugin-local-mock-api</p>
                    <h1>Browser-Demo für lokale API-Szenarien</h1>
                    <p class="hero__copy">
                        Alle Requests laufen über die Fetch-Helper aus
                        <code>ui-utils</code>
                        . Szenarien werden live im Cookie umgeschaltet und direkt vom Vite-Plugin ausgeliefert.
                    </p>
                </div>
                <div class="manifest-summary">
                    <span>Manifest</span>
                    <strong>
                        ${this.manifestLoading
                            ? 'wird geladen …'
                            : this.manifestError
                              ? 'fehlerhaft'
                              : `${this.manifest?.endpoints.length ?? 0} Endpoints`}
                    </strong>
                </div>
            </header>

            <section class="control-panel" aria-labelledby="session-heading">
                <div>
                    <h2 id="session-heading">Aktuelle Demo-Session</h2>
                    <p>Mehrere Endpoint-Auswahlen bleiben gemeinsam im Szenario-Cookie erhalten.</p>
                </div>
                <div class="cookie-display">
                    <span>${SCENARIO_COOKIE_NAME}</span>
                    <code>${cookieValue || '(leer)'}</code>
                </div>
                <div class="control-panel__actions">
                    <uic-button size="s" variant="outlined" @click=${() => void this.loadManifest()}>
                        Manifest aktualisieren
                    </uic-button>
                    <uic-button
                        size="s"
                        color="tertiary"
                        variant="outlined"
                        @click=${() => this.selectStaleScenario()}
                    >
                        Veraltete Auswahl setzen
                    </uic-button>
                </div>
            </section>

            ${this.manifestError
                ? html`
                      <uic-notification type="danger" heading="Manifest konnte nicht geladen werden" .noClose=${true}>
                          ${this.manifestError}
                      </uic-notification>
                  `
                : nothing}
            ${this.getGroups().map(
                (group) => html`
                    <section class="case-group" aria-labelledby=${`group-${group}`}>
                        <div class="section-heading">
                            <h2 id=${`group-${group}`}>${group}</h2>
                            <span>${DEMO_CASES.filter((testCase) => testCase.group === group).length} Fälle</span>
                        </div>
                        <div class="case-grid">
                            ${DEMO_CASES.filter((testCase) => testCase.group === group).map((testCase) =>
                                this.renderCase(testCase)
                            )}
                        </div>
                    </section>
                `
            )}
        `;
    }
}

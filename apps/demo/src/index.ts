import { wfElement } from '@wesflo/local-mock-api-ui';
import '@wesflo/wf-vite-mock-proxy';

import {
    downloadBlob,
    getCookieValue,
    MANIFEST_ROUTE,
    parseScenarioCookie,
    SCENARIO_COOKIE_NAME,
    setCookieValue,
    updateScenarioCookie,
} from '@wesflo/local-mock-api-utils';
import { html, LitElement, nothing } from 'lit';
import { state } from 'lit/decorators.js';

import { DEMO_CASES } from './constant';
import type { DemoCase, DemoResult, MockEndpoint, MockManifest, MockScenario } from './interface';
import styles from './styles';
import { executeDemoCase } from './util/executeDemoCase';

@wfElement('wesflo-local-mock-api-demo')
export class MockApiDemo extends LitElement {
    static styles = styles;

    @state() private manifest?: MockManifest;
    @state() private manifestError?: string;
    @state() private manifestLoading = true;
    @state() private results = new Map<string, DemoResult>();
    @state() private running = false;
    @state() private selectedCase = DEMO_CASES.find(({ id }) => id === 'delay') ?? DEMO_CASES[0];
    @state() private selections = new Map<string, string>();

    connectedCallback(): void {
        super.connectedCallback();
        this.syncSelections();
        this.applyCaseSelection(this.selectedCase);
        void this.loadManifest();
    }

    private findEndpoint = (endpointId?: string): MockEndpoint | undefined =>
        endpointId ? this.manifest?.endpoints.find(({ id }) => id === endpointId) : undefined;

    private findScenario = (testCase: DemoCase): MockScenario | undefined =>
        this.findEndpoint(testCase.endpointId)?.scenarios.find(({ id }) => id === testCase.scenarioId);

    private getGroups = (): string[] => [...new Set(DEMO_CASES.map(({ group }) => group))];

    private loadManifest = async (): Promise<void> => {
        this.manifestLoading = true;
        this.manifestError = undefined;

        try {
            const response = await fetch(MANIFEST_ROUTE);
            if (!response.ok) {
                throw new Error(`Manifest request failed with HTTP ${response.status}`);
            }
            this.manifest = (await response.json()) as MockManifest;
        } catch (error) {
            this.manifest = undefined;
            this.manifestError = error instanceof Error ? error.message : String(error);
        } finally {
            this.manifestLoading = false;
        }
    };

    private applyCaseSelection = (testCase?: DemoCase): void => {
        if (!testCase?.endpointId) {
            return;
        }

        const nextValue = updateScenarioCookie(
            getCookieValue(SCENARIO_COOKIE_NAME),
            testCase.endpointId,
            testCase.scenarioId
        );
        setCookieValue(SCENARIO_COOKIE_NAME, nextValue);
        this.syncSelections();
    };

    private selectCase = (testCase: DemoCase): void => {
        this.selectedCase = testCase;
        this.applyCaseSelection(testCase);
    };

    private runSelectedCase = async (): Promise<void> => {
        const testCase = this.selectedCase;
        if (!testCase) {
            return;
        }

        this.applyCaseSelection(testCase);
        this.running = true;
        const result = await executeDemoCase(testCase);
        this.results = new Map(this.results).set(testCase.id, result);
        this.running = false;
    };

    private reset = (): void => {
        setCookieValue(SCENARIO_COOKIE_NAME, '');
        this.results = new Map();
        this.syncSelections();
    };

    private syncSelections = (): void => {
        this.selections = parseScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME));
    };

    private copyText = async (value: string): Promise<void> => {
        await navigator.clipboard?.writeText(value);
    };

    private downloadSelected = (): void => {
        const result = this.selectedCase ? this.results.get(this.selectedCase.id) : undefined;
        if (result?.blob && this.selectedCase) {
            downloadBlob(result.blob, result.filename ?? this.selectedCase.downloadName ?? 'mock-response.bin');
        }
    };

    private renderCase = (testCase: DemoCase) => {
        const selected = this.selectedCase?.id === testCase.id;
        const scenario = this.findScenario(testCase);
        const delay = scenario?.delay;

        return html`
            <button
                class="scenario ${selected ? 'scenario--selected' : ''}"
                type="button"
                aria-current=${selected ? 'true' : 'false'}
                @click=${() => this.selectCase(testCase)}
            >
                <span class="scenario__dot status-${testCase.expectedStatus}"></span>
                <span class="scenario__name">${testCase.title}</span>
                <wf-badge tone=${testCase.expectedStatus >= 400 ? 'danger' : 'success'}>
                    ${testCase.expectedStatus} ${testCase.expectedStatus === 204 ? 'No Content' : 'HTTP'}
                </wf-badge>
                <span class=${`scenario__delay ${delay ? 'scenario__delay--active' : ''}`}>
                    ${delay
                        ? html`
                              <wf-icon name="clock" size="14"></wf-icon>
                              ${(delay / 1000).toFixed(1)}s
                          `
                        : 'No delay'}
                </span>
                <code>${testCase.method} ${testCase.path.replace('/api/demo', '') || '/'}</code>
            </button>
        `;
    };

    private renderLibrary = () => html`
        <section class="library card" aria-labelledby="library-heading">
            <div class="section-header">
                <div class="section-title">
                    <span class="section-icon"><wf-icon name="folder"></wf-icon></span>
                    <h2 id="library-heading">Scenario Library</h2>
                </div>
                <wf-badge tone="info">${DEMO_CASES.length} cases</wf-badge>
            </div>
            <div class="library__body">
                ${this.getGroups().map(
                    (group) => html`
                        <div class="scenario-group">
                            <div class="scenario-group__header">
                                <strong>${group}</strong>
                                <span>${DEMO_CASES.filter((item) => item.group === group).length}</span>
                            </div>
                            ${DEMO_CASES.filter((item) => item.group === group).map(this.renderCase)}
                        </div>
                    `
                )}
            </div>
        </section>
    `;

    private renderResponse = (result?: DemoResult) => html`
        <div class="code-toolbar">
            <span>Response</span>
            <wf-button compact @onClick=${() => void this.copyText(result?.body ?? '')} aria-label="Response kopieren">
                <wf-icon name="copy" size="15"></wf-icon>
                Copy
            </wf-button>
        </div>
        <pre class="response-code"><code>${result?.body || '// Run this scenario to inspect its response.'}</code></pre>
        ${result?.blob
            ? html`
                  <wf-button compact @onClick=${this.downloadSelected}>Download response</wf-button>
              `
            : nothing}
    `;

    private renderDebugCards = (result?: DemoResult) => {
        const testCase = this.selectedCase;
        const selectedScenario = testCase?.endpointId ? this.selections.get(testCase.endpointId) : undefined;
        const scenario = testCase ? this.findScenario(testCase) : undefined;

        return html`
            <div class="debug-grid">
                <article class="debug-card">
                    <strong>Headers (${result?.headers.length ?? 0})</strong>
                    ${result?.headers.slice(0, 4).map(
                        ([name, value]) => html`
                            <p>
                                <span>${name}</span>
                                <code>${value}</code>
                            </p>
                        `
                    ) ??
                    html`
                        <p class="empty">Available after running</p>
                    `}
                </article>
                <article class="debug-card">
                    <strong>Cookie</strong>
                    <code class="cookie-value">${getCookieValue(SCENARIO_COOKIE_NAME) || '(empty)'}</code>
                </article>
                <article class="debug-card">
                    <strong>Applied override</strong>
                    <b>${selectedScenario ?? 'Default file resolution'}</b>
                    <p>
                        <span>Delay</span>
                        <code>${scenario?.delay ?? 0}ms</code>
                    </p>
                    <p>
                        <span>Source</span>
                        <code>${testCase?.endpointId ? 'Manifest' : 'Legacy resolver'}</code>
                    </p>
                </article>
            </div>
        `;
    };

    private renderPreview = () => {
        const testCase = this.selectedCase;
        if (!testCase) {
            return nothing;
        }

        const result = this.results.get(testCase.id);
        const status = result?.status || testCase.expectedStatus;
        const scenario = this.findScenario(testCase);

        return html`
            <section class="preview card" aria-labelledby="preview-heading">
                <div class="section-header">
                    <div class="section-title">
                        <span class="section-icon section-icon--dark"><wf-icon name="code"></wf-icon></span>
                        <h2 id="preview-heading">Preview &amp; Debug</h2>
                    </div>
                    <wf-button compact @onClick=${this.reset}>
                        <wf-icon name="refresh" size="15"></wf-icon>
                        Reset
                    </wf-button>
                </div>
                <div class="preview__body">
                    <div class="request-bar">
                        <strong>${testCase.method}</strong>
                        <code>${testCase.path}</code>
                        <wf-badge tone=${status >= 400 ? 'danger' : 'success'}>${status} HTTP</wf-badge>
                        <span class="request-time">
                            <wf-icon name="clock" size="15"></wf-icon>
                            ${result ? `${Math.round(result.duration)}ms` : `${scenario?.delay ?? 0}ms`}
                        </span>
                        <wf-button
                            variant="primary"
                            ?loading=${this.running}
                            @onClick=${() => void this.runSelectedCase()}
                        >
                            <wf-icon name="play" size="16"></wf-icon>
                            Run
                        </wf-button>
                    </div>
                    <p class="case-description">${testCase.description}</p>
                    ${this.renderResponse(result)} ${this.renderDebugCards(result)}
                </div>
            </section>
        `;
    };

    private renderManifest = () => {
        const testCase = this.selectedCase;
        const scenario = testCase ? this.findScenario(testCase) : undefined;
        const manifestText = testCase?.endpointId
            ? [
                  `- id: ${testCase.endpointId}`,
                  `  method: ${testCase.method}`,
                  `  path: ${testCase.path}`,
                  ...(scenario
                      ? [
                            `  scenario: ${scenario.id}`,
                            `  status: ${scenario.status ?? testCase.expectedStatus}`,
                            ...(scenario.delay === undefined ? [] : [`  delay: ${scenario.delay}`]),
                            ...(scenario.file ? [`  file: ${scenario.file}`] : []),
                        ]
                      : ['  scenario: default']),
              ].join('\n')
            : '# No manifest entry – this case exercises legacy file resolution.';

        return html`
            <section class="manifest card" aria-labelledby="manifest-heading">
                <div class="section-header">
                    <div class="section-title">
                        <span class="section-icon"><wf-icon name="code"></wf-icon></span>
                        <div>
                            <h2 id="manifest-heading">Example manifest</h2>
                            <p>This is how the selected scenario is represented in the mock manifest.</p>
                        </div>
                    </div>
                    <wf-button compact @onClick=${() => void this.copyText(manifestText)}>
                        <wf-icon name="copy" size="15"></wf-icon>
                        Copy
                    </wf-button>
                </div>
                <pre><code>${manifestText}</code></pre>
            </section>
        `;
    };

    render = () => html`
        <header class="topbar">
            <a class="brand" href="#top" aria-label="wesflo Local Mock API">
                <span class="brand__mark"><wf-icon name="bolt" size="23"></wf-icon></span>
                <strong>wesflo</strong>
                <wf-badge tone="info">Local Mock API</wf-badge>
            </a>
            <nav aria-label="Demo navigation">
                <a href="https://github.com/wesflo/vite-plugin-local-mock-api" target="_blank">
                    <wf-icon name="book"></wf-icon>
                    Docs
                </a>
                <a href="#session">
                    <wf-icon name="settings"></wf-icon>
                    Settings
                </a>
            </nav>
        </header>

        <main id="top">
            <section class="hero card">
                <div class="hero__icon"><wf-icon name="bolt" size="42"></wf-icon></div>
                <div class="hero__copy">
                    <h1>Build and test mock scenarios</h1>
                    <p>Simulate real-world API behaviors, preview responses, and iterate quickly.</p>
                    <div class="benefits">
                        <span>
                            <wf-icon name="check"></wf-icon>
                            Realistic test data
                        </span>
                        <span>
                            <wf-icon name="clock"></wf-icon>
                            Custom delays &amp; errors
                        </span>
                    </div>
                </div>
                <div class="hero__visual" aria-hidden="true">
                    <div class="window-dots">
                        <i></i>
                        <i></i>
                        <i></i>
                    </div>
                    <div class="window-lines">
                        <b></b>
                        <span></span>
                        <b></b>
                        <span></span>
                    </div>
                    <div class="hero__bolt">
                        <wf-icon name="bolt" size="30"></wf-icon>
                    </div>
                </div>
            </section>

            <div class="workspace" id="session">
                ${this.renderLibrary()}
                <div class="workspace__detail">
                    ${this.manifestError
                        ? html`
                              <div class="notice" role="alert">${this.manifestError}</div>
                          `
                        : nothing}
                    ${this.renderPreview()} ${this.renderManifest()}
                    <p class="mode-note">
                        Manifest:
                        ${this.manifestLoading ? 'loading…' : `${this.manifest?.endpoints.length ?? 0} endpoints`}.
                        Missing and invalid manifest fallbacks are available through the dedicated demo scripts.
                    </p>
                </div>
            </div>
        </main>
    `;
}

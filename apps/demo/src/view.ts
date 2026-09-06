import { copyText, getCookieValue, SCENARIO_COOKIE_NAME } from '@wesflo/local-mock-api-utils';
import { html, nothing } from 'lit';

import { DEMO_CASES } from './constant';
import type { DemoCase, DemoResult, DemoViewActions, DemoViewModel } from './interface';
import { findEndpoint, findScenario, getGroups } from './util/manifest';

export const renderDemo = (model: DemoViewModel, actions: DemoViewActions) => {
    const renderCase = (testCase: DemoCase) => {
        const selected = model.selectedCase?.id === testCase.id;
        const scenario = findScenario(model.manifest, testCase);
        const endpoint = findEndpoint(model.manifest, testCase);
        const delay = scenario?.delay ?? endpoint?.delay ?? model.manifest?.delay;

        return html`
            <button
                class="scenario ${selected ? 'scenario--selected' : ''}"
                type="button"
                aria-current=${selected ? 'true' : 'false'}
                @click=${() => actions.selectCase(testCase)}
            >
                <span class="scenario__dot status-${testCase.expectedStatus}"></span>
                <span class="scenario__name">${testCase.title}</span>
                <wf-badge tone=${testCase.expectedStatus >= 400 ? 'danger' : 'success'}>
                    ${testCase.expectedStatus} ${testCase.expectedStatus === 204 ? 'No Content' : 'HTTP'}
                </wf-badge>
                <span class=${`scenario__delay ${delay ? 'scenario__delay--active' : ''}`}>
                    ${delay
                        ? html`
                              <wf-icon name="clock" size="s"></wf-icon>
                              ${(delay / 1000).toFixed(1)}s
                          `
                        : 'No delay'}
                </span>
                <code>${testCase.method} ${testCase.path.replace('/api/demo', '') || '/'}</code>
            </button>
        `;
    };

    const renderLibrary = () => html`
        <section class="library card" aria-labelledby="library-heading">
            <div class="section-header">
                <div class="section-title">
                    <span class="section-icon"><wf-icon name="folder"></wf-icon></span>
                    <h2 id="library-heading">Scenario Library</h2>
                </div>
                <wf-badge tone="info">${DEMO_CASES.length} cases</wf-badge>
            </div>
            <div class="library__body">
                ${getGroups(DEMO_CASES).map(
                    (group) => html`
                        <div class="scenario-group">
                            <div class="scenario-group__header">
                                <strong>${group}</strong>
                                <span>${DEMO_CASES.filter((item) => item.group === group).length}</span>
                            </div>
                            ${DEMO_CASES.filter((item) => item.group === group).map(renderCase)}
                        </div>
                    `
                )}
            </div>
        </section>
    `;

    const renderResponse = (result?: DemoResult) => html`
        <div class="code-toolbar">
            <span>Response</span>
            <wf-button compact @onClick=${() => void copyText(result?.body ?? '')} aria-label="Copy response">
                <wf-icon name="copy" size="s"></wf-icon>
                Copy
            </wf-button>
        </div>
        <pre class="response-code"><code>${result?.body || '// Run this scenario to inspect its response.'}</code></pre>
        ${result?.blob
            ? html`
                  <wf-button compact @onClick=${actions.downloadSelected}>Download response</wf-button>
              `
            : nothing}
    `;

    const renderDebugCards = (result?: DemoResult) => {
        const testCase = model.selectedCase;
        const selectedScenario = testCase?.endpointId ? model.selections.get(testCase.endpointId) : undefined;
        const scenario = testCase ? findScenario(model.manifest, testCase) : undefined;
        const endpoint = testCase ? findEndpoint(model.manifest, testCase) : undefined;
        const delay = scenario?.delay ?? endpoint?.delay ?? model.manifest?.delay ?? 0;

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
                        <code>${delay}ms</code>
                    </p>
                    <p>
                        <span>Source</span>
                        <code>${endpoint ? 'Manifest' : 'Naming convention'}</code>
                    </p>
                </article>
            </div>
        `;
    };

    const renderPreview = () => {
        const testCase = model.selectedCase;
        if (!testCase) {
            return nothing;
        }

        const result = model.results.get(testCase.id);
        const status = result?.status || testCase.expectedStatus;
        const scenario = findScenario(model.manifest, testCase);
        const endpoint = findEndpoint(model.manifest, testCase);
        const delay = scenario?.delay ?? endpoint?.delay ?? model.manifest?.delay ?? 0;

        return html`
            <section class="preview card" aria-labelledby="preview-heading">
                <div class="section-header">
                    <div class="section-title">
                        <span class="section-icon section-icon--dark"><wf-icon name="code"></wf-icon></span>
                        <h2 id="preview-heading">Preview &amp; Debug</h2>
                    </div>
                    <wf-button compact @onClick=${actions.reset}>
                        <wf-icon name="refresh" size="s"></wf-icon>
                        Reset
                    </wf-button>
                </div>
                <div class="preview__body">
                    <div class="request-bar">
                        <strong>${testCase.method}</strong>
                        <code>${testCase.path}</code>
                        <wf-badge tone=${status >= 400 ? 'danger' : 'success'}>${status} HTTP</wf-badge>
                        <span class="request-time">
                            <wf-icon name="clock" size="s"></wf-icon>
                            ${result ? `${Math.round(result.duration)}ms` : `${delay}ms`}
                        </span>
                        <wf-button
                            variant="primary"
                            ?loading=${model.running}
                            @onClick=${() => void actions.runSelectedCase()}
                        >
                            <wf-icon name="play" size="s"></wf-icon>
                            Run
                        </wf-button>
                    </div>
                    <p class="case-description">${testCase.description}</p>
                    ${renderResponse(result)} ${renderDebugCards(result)}
                </div>
            </section>
        `;
    };

    const renderManifest = () => {
        const testCase = model.selectedCase;
        const scenario = testCase ? findScenario(model.manifest, testCase) : undefined;
        const endpoint = testCase ? findEndpoint(model.manifest, testCase) : undefined;
        const manifestText = endpoint
            ? [
                  `delay: ${model.manifest?.delay ?? '(not set)'}`,
                  'endpoints:',
                  ...(endpoint.id ? [`  - id: ${endpoint.id}`] : ['  - # id is optional']),
                  ...(endpoint.label ? [`    label: ${endpoint.label}`] : []),
                  ...(endpoint.method ? [`    method: ${endpoint.method}`] : []),
                  `    path: ${endpoint.path}`,
                  ...(endpoint.status === undefined ? [] : [`    status: ${endpoint.status}`]),
                  ...(endpoint.delay === undefined ? [] : [`    delay: ${endpoint.delay}`]),
                  ...(endpoint.file ? [`    file: ${endpoint.file}`] : []),
                  ...(scenario
                      ? [
                            '    scenarios:',
                            `      - id: ${scenario.id}`,
                            `        label: ${scenario.label}`,
                            ...(scenario.status === undefined ? [] : [`        status: ${scenario.status}`]),
                            ...(scenario.delay === undefined ? [] : [`        delay: ${scenario.delay}`]),
                            ...(scenario.file ? [`        file: ${scenario.file}`] : []),
                        ]
                      : []),
              ].join('\n')
            : `delay: ${model.manifest?.delay ?? '(not set)'}\n# Response file resolved through naming conventions.`;

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
                    <wf-button compact @onClick=${() => void copyText(manifestText)}>
                        <wf-icon name="copy" size="s"></wf-icon>
                        Copy
                    </wf-button>
                </div>
                <pre><code>${manifestText}</code></pre>
            </section>
        `;
    };

    return html`
        <header class="topbar">
            <a class="brand" href="#top" aria-label="wesflo Local Mock API">
                <span class="brand__mark"><wf-icon name="bolt" size="l"></wf-icon></span>
                <strong>wesflo</strong>
                <wf-badge tone="info">Local Mock API</wf-badge>
            </a>
            <nav aria-label="Demo navigation">
                <a href="https://wesflo.github.io/vite-plugin-local-mock-api/" target="_blank">
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
                <div class="hero__icon"><wf-icon name="bolt" size="xxl"></wf-icon></div>
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
                        <wf-icon name="bolt" size="xl"></wf-icon>
                    </div>
                </div>
            </section>

            <div class="workspace" id="session">
                ${renderLibrary()}
                <div class="workspace__detail">
                    ${model.manifestError
                        ? html`
                              <div class="notice" role="alert">${model.manifestError}</div>
                          `
                        : nothing}
                    ${renderPreview()} ${renderManifest()}
                    <p class="mode-note">
                        Manifest:
                        ${model.manifestLoading ? 'loading…' : `${model.manifest?.endpoints?.length ?? 0} endpoints`}.
                        Missing and invalid manifest fallbacks are available through the dedicated demo scripts.
                    </p>
                </div>
            </div>
        </main>
    `;
};

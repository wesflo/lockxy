import { html } from 'lit';

import lockxyLockup from '../../../assets/brand/lockxy-lockup-on-light.svg?url';
import lockxyMark from '../../../assets/brand/lockxy-mark-on-light.svg?url';
import { PLAYGROUND_REQUESTS } from './constant.js';
import type { PlaygroundRequest, PlaygroundViewActions, PlaygroundViewModel } from './interface.js';

export const renderPlayground = (model: PlaygroundViewModel, actions: PlaygroundViewActions) => {
    const groups = [...new Set(PLAYGROUND_REQUESTS.map(({ group }) => group))];
    const statusError = model.result && (model.result.status >= 400 || model.result.status === 0);

    const renderRequest = (request: PlaygroundRequest) => {
        const selected = request.id === model.selectedRequest?.id;

        return html`
            <button
                class="request ${selected ? 'request--selected' : ''}"
                type="button"
                aria-current=${selected ? 'true' : 'false'}
                @click=${() => actions.selectRequest(request)}
            >
                <span class="request__dot"></span>
                <span class="request__copy">
                    <strong>${request.label}</strong>
                    <span>${request.description}</span>
                </span>
                <code>${request.method}</code>
            </button>
        `;
    };

    return html`
        <header class="topbar">
            <a class="brand" href="#top" aria-label="Lockxy Proxy Playground">
                <img class="brand__logo" src=${lockxyLockup} alt="Lockxy Local Mock Proxy" />
                <wf-badge tone="info">Proxy Playground</wf-badge>
            </a>
            <nav aria-label="Playground navigation">
                <a href="http://localhost:5173">
                    <wf-icon name="play"></wf-icon>
                    Demo
                </a>
                <a href="https://wesflo.github.io/vite-plugin-local-mock-api/" target="_blank">
                    <wf-icon name="book"></wf-icon>
                    Docs
                </a>
            </nav>
        </header>

        <main id="top">
            <section class="hero card">
                <div class="hero__icon"><img src=${lockxyMark} alt="" /></div>
                <div class="hero__copy">
                    <h1>Test the plugin and panel together</h1>
                    <p>Select a request, change its behavior in the floating proxy panel, and run it again.</p>
                </div>
                <aside class="hero__hint">
                    <strong>
                        <wf-icon name="settings"></wf-icon>
                        Try the proxy panel
                    </strong>
                    Disable all mocks, bypass one endpoint, or select a manifest scenario before sending a request.
                </aside>
            </section>

            <div class="workspace">
                <section class="library card" aria-labelledby="requests-heading">
                    <div class="section-header">
                        <div class="section-title">
                            <span class="section-icon"><wf-icon name="folder"></wf-icon></span>
                            <h2 id="requests-heading">Demo requests</h2>
                        </div>
                        <wf-badge tone="info">${PLAYGROUND_REQUESTS.length} calls</wf-badge>
                    </div>
                    <div class="request-list">
                        ${groups.map(
                            (group) => html`
                                <div class="request-group">
                                    <div class="request-group__title"><strong>${group}</strong></div>
                                    ${PLAYGROUND_REQUESTS.filter((item) => item.group === group).map(renderRequest)}
                                </div>
                            `
                        )}
                    </div>
                </section>

                <section class="preview card" aria-labelledby="preview-heading">
                    <div class="section-header">
                        <div class="section-title">
                            <span class="section-icon"><wf-icon name="code"></wf-icon></span>
                            <h2 id="preview-heading">Request and response</h2>
                        </div>
                    </div>
                    <div class="preview__body">
                        <div class="request-meta">
                            <wf-badge tone="info">${model.selectedRequest?.method}</wf-badge>
                            <code>${model.selectedRequest?.path}</code>
                            <wf-button
                                variant="primary"
                                ?loading=${model.activeRequestId !== undefined}
                                @onClick=${() => void actions.execute()}
                            >
                                <wf-icon name="play" size="s"></wf-icon>
                                Run
                            </wf-button>
                        </div>
                        <p class="description">${model.selectedRequest?.description}</p>
                        <div class="result-meta">
                            <strong class=${statusError ? 'status-error' : ''}>
                                ${model.result
                                    ? `${model.result.status || '–'} ${model.result.statusText}`
                                    : 'Response'}
                            </strong>
                            <span>${model.result?.contentType ?? 'Not requested yet'}</span>
                            <span>${model.result ? `${Math.round(model.result.duration)} ms` : ''}</span>
                        </div>
                        <pre aria-live="polite"><code>${model.result?.body ??
                        '// Run the selected request to inspect its response.'}</code></pre>
                        <div class="environment">
                            <p>
                                <strong>Development API:</strong>
                                Set
                                <code>PLAYGROUND_API_TARGET=https://your-dev-api</code>
                                before starting pnpm dev.
                            </p>
                            <p>
                                <strong>Current cookies:</strong>
                                ${document.cookie || '(none)'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    `;
};

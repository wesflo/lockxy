import { wfElement } from '@wesflo/local-mock-api-ui';
import { html, LitElement, nothing } from 'lit';
import { state } from 'lit/decorators.js';

import { PLAYGROUND_REQUESTS, PLAYGROUND_TAG_NAME } from './constant.js';
import type { PlaygroundRequest, PlaygroundResult } from './interface.js';
import { playgroundStyle } from './style.js';

@wfElement(PLAYGROUND_TAG_NAME)
export class WfMockProxyPlayground extends LitElement {
    static styles = playgroundStyle;

    @state() private activeRequestId?: string;
    @state() private result?: PlaygroundResult;

    private execute = async (request: PlaygroundRequest): Promise<void> => {
        this.activeRequestId = request.id;
        const startedAt = performance.now();

        try {
            const response = await fetch(request.path, {
                method: request.method,
                headers: request.body ? { 'content-type': 'application/json' } : undefined,
                body: request.body ? JSON.stringify(request.body) : undefined,
            });
            const body = await response.text();

            this.result = {
                body: this.formatBody(body),
                duration: performance.now() - startedAt,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            this.result = {
                body: error instanceof Error ? error.message : String(error),
                duration: performance.now() - startedAt,
                status: 0,
                statusText: 'Network Error',
            };
        } finally {
            this.activeRequestId = undefined;
        }
    };

    private formatBody = (body: string): string => {
        try {
            return JSON.stringify(JSON.parse(body), null, 2);
        } catch {
            return body || '(leerer Response-Body)';
        }
    };

    private renderRequest = (request: PlaygroundRequest) => html`
        <article class="request">
            <div>
                <h2>${request.label}</h2>
                <p>${request.description}</p>
                <span class="route"><strong>${request.method}</strong> ${request.path}</span>
            </div>
            <button
                type="button"
                ?disabled=${this.activeRequestId !== undefined}
                @click=${() => void this.execute(request)}
            >
                ${this.activeRequestId === request.id ? 'Läuft …' : 'Request senden'}
            </button>
        </article>
    `;

    render = () => html`
        <main>
            <header>
                <p class="eyebrow">Micro Frontend</p>
                <h1>Mock Proxy Playground</h1>
                <p class="intro">
                    Öffne den schwebenden Mock-Proxy, ändere Szenarien oder deaktiviere einzelne Endpoints und sende
                    anschließend denselben Request erneut.
                </p>
            </header>

            <aside class="hint">
                <strong>Dev-API testen:</strong> Starte mit
                <code>PLAYGROUND_API_TARGET=https://deine-dev-api pnpm dev</code>. Deaktivierte Mocks werden dann vom
                Vite-Proxy an dieses Ziel weitergereicht.
            </aside>

            <section class="requests" aria-label="Test-Requests">
                ${PLAYGROUND_REQUESTS.map(this.renderRequest)}
            </section>

            ${this.result
                ? html`
                      <section class="result" aria-live="polite">
                          <div class="result-header">
                              <strong class=${this.result.status >= 400 || this.result.status === 0 ? 'status-error' : ''}>
                                  ${this.result.status || '–'} ${this.result.statusText}
                              </strong>
                              <span>${Math.round(this.result.duration)} ms</span>
                          </div>
                          <pre><code>${this.result.body}</code></pre>
                      </section>
                  `
                : nothing}

            <p class="cookies"><strong>Aktuelle Cookies:</strong> ${document.cookie || '(keine)'}</p>
        </main>
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'wf-mock-proxy-playground': WfMockProxyPlayground;
    }
}

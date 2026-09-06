import { resetStyles, wfElement } from '@wesflo/local-mock-api-ui';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { PLAYGROUND_REQUESTS, PLAYGROUND_TAG_NAME } from './constant.js';
import type { PlaygroundRequest, PlaygroundResult } from './interface.js';
import { playgroundStyle } from './style.js';
import { renderPlayground } from './view.js';

@wfElement(PLAYGROUND_TAG_NAME)
export class WfMockProxyPlayground extends LitElement {
    static styles = [resetStyles, playgroundStyle];

    @state() private activeRequestId?: string;
    @state() private result?: PlaygroundResult;
    @state() private selectedRequestId = PLAYGROUND_REQUESTS[0]?.id;

    private get selectedRequest(): PlaygroundRequest | undefined {
        return PLAYGROUND_REQUESTS.find(({ id }) => id === this.selectedRequestId);
    }

    private execute = async (): Promise<void> => {
        const request = this.selectedRequest;
        if (!request) {
            return;
        }

        this.activeRequestId = request.id;
        const startedAt = performance.now();

        try {
            const response = await fetch(request.path, {
                method: request.method,
                headers: request.body ? { 'content-type': 'application/json' } : undefined,
                body: request.body ? JSON.stringify(request.body) : undefined,
            });
            const contentType = response.headers.get('content-type') ?? 'unknown';
            const body = contentType.includes('application/pdf')
                ? `[Binary response: ${contentType}, ${(await response.arrayBuffer()).byteLength} bytes]`
                : this.formatBody(await response.text());

            this.result = {
                body,
                contentType,
                duration: performance.now() - startedAt,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            this.result = {
                body: error instanceof Error ? error.message : String(error),
                contentType: 'unknown',
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
            return body || '(empty response body)';
        }
    };

    private selectRequest = (request: PlaygroundRequest): void => {
        this.selectedRequestId = request.id;
        this.result = undefined;
    };

    render = () =>
        renderPlayground(
            {
                activeRequestId: this.activeRequestId,
                result: this.result,
                selectedRequest: this.selectedRequest,
            },
            {
                execute: this.execute,
                selectRequest: this.selectRequest,
            }
        );
}

declare global {
    interface HTMLElementTagNameMap {
        'wf-mock-proxy-playground': WfMockProxyPlayground;
    }
}
